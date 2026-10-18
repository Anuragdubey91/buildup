import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { RoadmapModel } from "@/models/Roadmap";
import { mockDb } from "@/lib/mockDb";
import { RoadmapMilestoneType, RoadmapTaskType } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { access } = await requireWorkspaceRole(id, "viewer");
    const workspaceId = access.workspace._id || id;

    const conn = await connectDB();
    if (conn) {
      const roadmap = await RoadmapModel.findOne({ workspaceId }).lean();
      return NextResponse.json({ roadmap: roadmap || null });
    }

    const roadmap = mockDb.roadmaps.find((r) => r.workspaceId === workspaceId);
    return NextResponse.json({ roadmap: roadmap || null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { access } = await requireWorkspaceRole(id, "member");
    const workspaceId = access.workspace._id || id;
    const body = await req.json();

    const { type, milestone, task } = body;

    const conn = await connectDB();
    let roadmap: any = null;

    if (conn) {
      roadmap = await RoadmapModel.findOne({ workspaceId });
      if (!roadmap) {
        roadmap = await RoadmapModel.create({
          workspaceId,
          currentStage: access.workspace.stage || "idea_discovery",
          milestones: [],
          tasks: [],
        });
      }
    } else {
      roadmap = mockDb.roadmaps.find((r) => r.workspaceId === workspaceId);
      if (!roadmap) {
        roadmap = {
          _id: "rm_" + Math.random().toString(36).substring(2, 9),
          workspaceId,
          currentStage: access.workspace.stage || "idea_discovery",
          milestones: [],
          tasks: [],
        };
        mockDb.roadmaps.push(roadmap);
      }
    }

    if (type === "add_milestone" && milestone) {
      const newMilestone: RoadmapMilestoneType = {
        id: "ms_" + Math.random().toString(36).substring(2, 8),
        title: milestone.title,
        stage: milestone.stage || access.workspace.stage,
        description: milestone.description || "",
        priority: milestone.priority || "medium",
        suggestedTimelineWeeks: milestone.suggestedTimelineWeeks || 2,
        deadline: milestone.deadline,
        status: "todo",
        dependencies: milestone.dependencies || [],
      };

      roadmap.milestones.push(newMilestone);
      if (conn) await roadmap.save();
      return NextResponse.json({ success: true, roadmap });
    }

    if (type === "add_task" && task) {
      const newTask: RoadmapTaskType = {
        id: "tsk_" + Math.random().toString(36).substring(2, 8),
        milestoneId: task.milestoneId || roadmap.milestones[0]?.id || "general",
        title: task.title,
        description: task.description || "",
        assignedToUserId: task.assignedToUserId,
        priority: task.priority || "medium",
        deadline: task.deadline,
        status: "todo",
        createdAt: new Date().toISOString(),
      };

      roadmap.tasks.push(newTask);
      if (conn) await roadmap.save();
      return NextResponse.json({ success: true, roadmap });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { access } = await requireWorkspaceRole(id, "member");
    const workspaceId = access.workspace._id || id;
    const { taskId, milestoneId, status, deadline, assignedToUserId } = await req.json();

    const conn = await connectDB();
    let roadmap: any = null;

    if (conn) {
      roadmap = await RoadmapModel.findOne({ workspaceId });
    } else {
      roadmap = mockDb.roadmaps.find((r) => r.workspaceId === workspaceId);
    }

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    if (taskId) {
      const task = roadmap.tasks.find((t: any) => t.id === taskId);
      if (task) {
        if (status) task.status = status;
        if (deadline !== undefined) task.deadline = deadline;
        if (assignedToUserId !== undefined) task.assignedToUserId = assignedToUserId;
        if (conn) await roadmap.save();
        return NextResponse.json({ success: true, roadmap });
      }
    }

    if (milestoneId) {
      const milestone = roadmap.milestones.find((m: any) => m.id === milestoneId);
      if (milestone) {
        if (status) milestone.status = status;
        if (deadline !== undefined) milestone.deadline = deadline;
        if (conn) await roadmap.save();
        return NextResponse.json({ success: true, roadmap });
      }
    }

    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
