import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { StartupWorkspaceModel } from "@/models/StartupWorkspace";
import { WorkspaceMembershipModel } from "@/models/WorkspaceMembership";
import { SecurityAuditEventModel } from "@/models/SecurityAuditEvent";
import { mockDb } from "@/lib/mockDb";
import { StartupWorkspaceType, WorkspaceMembershipType } from "@/types";
import { AIProviderAdapter } from "@/lib/ai/adapter";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const conn = await connectDB();

    if (conn) {
      // Find workspaces where user is owner or active member
      const memberships = await WorkspaceMembershipModel.find({
        userId: user.userId,
        status: "active",
      }).lean();

      const memberWorkspaceIds = memberships.map((m) => m.workspaceId);
      const workspaces = await StartupWorkspaceModel.find({
        $or: [{ ownerId: user.userId }, { _id: { $in: memberWorkspaceIds } }],
      })
        .sort({ updatedAt: -1 })
        .lean();

      return NextResponse.json({ workspaces });
    }

    // Mock store
    const memberWorkspaceIds = mockDb.memberships
      .filter((m) => m.userId === user.userId && m.status === "active")
      .map((m) => m.workspaceId);

    const workspaces = mockDb.workspaces.filter(
      (w) => w.ownerId === user.userId || memberWorkspaceIds.includes(w._id!)
    );

    return NextResponse.json({ workspaces });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const { name, domain, tagline, description, stage, confidentialityAgreementRequired } = body;

    if (!name || !domain) {
      return NextResponse.json({ error: "Startup name and domain are required" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Math.random().toString(36).substring(2, 6);

    const workspaceData: Partial<StartupWorkspaceType> = {
      name,
      slug,
      tagline: tagline || "",
      description: description || "",
      domain,
      stage: stage || "idea_discovery",
      ownerId: user.userId,
      // IdeaShield Rule: Default rule: every new startup workspace and idea must be private.
      visibility: "private",
      previewFields: {
        showTagline: true,
        showDomain: true,
        showStage: true,
        showProblems: false,
        showMilestones: false,
        showPitchSummary: false,
      },
      confidentialityAgreementRequired: Boolean(confidentialityAgreementRequired),
      confidentialityTemplate:
        "CONFIDENTIALITY AND NON-DISCLOSURE DISCUSSION AID\n\nThe parties agree that discussions, roadmaps, and customer research inside this workspace represent proprietary ideas. Disclosing parties expect confidentiality before sharing unreleased features. Note: This template is an educational discussion aid and founders should consult legal counsel for legally binding contracts.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const conn = await connectDB();
    if (conn) {
      const createdWorkspace = await StartupWorkspaceModel.create(workspaceData);

      // Create owner membership
      await WorkspaceMembershipModel.create({
        workspaceId: createdWorkspace._id.toString(),
        userId: user.userId,
        role: "owner",
        status: "active",
        joinedAt: new Date(),
        title: "Founder & Owner",
      });

      // Audit log
      await SecurityAuditEventModel.create({
        workspaceId: createdWorkspace._id.toString(),
        actorId: user.userId,
        actorName: user.displayName,
        action: "workspace_created",
        details: `Workspace '${name}' created with IdeaShield Private-by-Default security status.`,
      });

      return NextResponse.json({ success: true, workspace: createdWorkspace });
    }

    // Mock store
    const mockId = "ws_" + Math.random().toString(36).substring(2, 9);
    const newWs: StartupWorkspaceType = {
      ...workspaceData,
      _id: mockId,
    } as StartupWorkspaceType;

    mockDb.workspaces.push(newWs);

    mockDb.memberships.push({
      _id: "mem_" + Math.random().toString(36).substring(2, 9),
      workspaceId: mockId,
      userId: user.userId,
      role: "owner",
      status: "active",
      joinedAt: new Date().toISOString(),
      title: "Founder & Owner",
    });

    mockDb.auditEvents.push({
      _id: "sec_" + Math.random().toString(36).substring(2, 9),
      workspaceId: mockId,
      actorId: user.userId,
      actorName: user.displayName,
      action: "workspace_created",
      details: `Workspace '${name}' created with IdeaShield Private-by-Default security status.`,
      timestamp: new Date().toISOString(),
    });

    // Initialize default roadmap
    const defaultMilestones = AIProviderAdapter.generateDefaultMilestones(
      newWs.stage,
      newWs.domain
    );
    mockDb.roadmaps.push({
      _id: "rm_" + mockId,
      workspaceId: mockId,
      currentStage: newWs.stage,
      milestones: defaultMilestones,
      tasks: [],
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, workspace: newWs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
