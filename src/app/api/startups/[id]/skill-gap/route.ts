import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { WorkspaceMembershipModel } from "@/models/WorkspaceMembership";
import { UserProfileModel } from "@/models/UserProfile";
import { mockDb } from "@/lib/mockDb";
import { AIProviderAdapter } from "@/lib/ai/adapter";
import { SkillGapAnalysisReport } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { access } = await requireWorkspaceRole(id, "viewer");
    const workspace = access.workspace;
    const workspaceId = workspace._id || id;

    // Collect team members
    const conn = await connectDB();
    let memberUserIds: string[] = [];

    if (conn) {
      const memberships = await WorkspaceMembershipModel.find({
        workspaceId,
        status: "active",
      }).lean();
      memberUserIds = memberships.map((m) => m.userId);
      if (!memberUserIds.includes(workspace.ownerId)) {
        memberUserIds.push(workspace.ownerId);
      }
    } else {
      const memberships = mockDb.memberships.filter(
        (m) => (m.workspaceId === workspaceId || m.workspaceId === workspace._id) && m.status === "active"
      );
      memberUserIds = memberships.map((m) => m.userId);
      if (!memberUserIds.includes(workspace.ownerId)) {
        memberUserIds.push(workspace.ownerId);
      }
    }

    // Collect skills from profiles
    const teamSkills: string[] = [];
    const teamMembersInfo: { name: string; role: string; skills: string[] }[] = [];

    if (conn) {
      const profiles = await UserProfileModel.find({ userId: { $in: memberUserIds } }).lean();
      profiles.forEach((p: any) => {
        const userSkills = (p.skills || []).map((s: any) => s.name);
        teamSkills.push(...userSkills);
        teamMembersInfo.push({
          name: p.displayName,
          role: p.preferredRoles?.[0] || "Team Member",
          skills: userSkills,
        });
      });
    } else {
      const profiles = mockDb.users.filter((u) => memberUserIds.includes(u.userId));
      profiles.forEach((p) => {
        const userSkills = (p.skills || []).map((s: any) => s.name);
        teamSkills.push(...userSkills);
        teamMembersInfo.push({
          name: p.displayName,
          role: p.preferredRoles?.[0] || "Team Member",
          skills: userSkills,
        });
      });
    }

    const report: SkillGapAnalysisReport = AIProviderAdapter.analyzeSkillGaps(
      workspace.domain || "B2B SaaS",
      teamSkills
    );
    report.workspaceId = workspaceId;
    report.startupName = workspace.name;
    report.stage = workspace.stage;

    return NextResponse.json({
      report,
      teamMembers: teamMembersInfo,
      totalTeamMembers: teamMembersInfo.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
