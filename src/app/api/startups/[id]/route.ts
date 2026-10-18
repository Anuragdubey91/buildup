import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, checkWorkspaceAccess, requireWorkspaceRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { StartupWorkspaceModel } from "@/models/StartupWorkspace";
import { WorkspaceMembershipModel } from "@/models/WorkspaceMembership";
import { SecurityAuditEventModel } from "@/models/SecurityAuditEvent";
import { mockDb } from "@/lib/mockDb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();
    const userId = currentUser?.userId || "unauthenticated";

    const access = await checkWorkspaceAccess(id, userId);

    if (!access.hasAccess) {
      // If preview is allowed, return preview only
      if (access.workspace?.visibility === "preview") {
        return NextResponse.json({
          isLimitedPreview: true,
          workspace: {
            _id: access.workspace._id,
            name: access.workspace.name,
            slug: access.workspace.slug,
            tagline: access.workspace.previewFields?.showTagline ? access.workspace.tagline : undefined,
            domain: access.workspace.previewFields?.showDomain ? access.workspace.domain : undefined,
            stage: access.workspace.previewFields?.showStage ? access.workspace.stage : undefined,
            visibility: "preview",
            confidentialityAgreementRequired: access.workspace.confidentialityAgreementRequired,
          },
          notice: "IdeaShield: You are viewing a limited public preview. Full business plan, roadmaps, and validation notes are private to authorized team members.",
        });
      }

      return NextResponse.json(
        {
          error: "Access Denied by IdeaShield",
          denialReason:
            access.denialReason ||
            "This startup workspace is private. Only authorized team members can access its contents.",
        },
        { status: 403 }
      );
    }

    // Load team members
    const conn = await connectDB();
    let members: any[] = [];
    if (conn) {
      members = await WorkspaceMembershipModel.find({
        workspaceId: access.workspace._id?.toString() || id,
        status: "active",
      }).lean();
    } else {
      members = mockDb.memberships.filter(
        (m) =>
          (m.workspaceId === access.workspace._id || m.workspaceId === id) &&
          m.status === "active"
      );
    }

    return NextResponse.json({
      workspace: access.workspace,
      userRole: access.role,
      isOwner: access.isOwner,
      membership: access.membership,
      members,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, access } = await requireWorkspaceRole(id, "admin");
    const updates = await req.json();

    const conn = await connectDB();
    if (conn) {
      const updated = await StartupWorkspaceModel.findByIdAndUpdate(
        access.workspace._id || id,
        { $set: updates },
        { new: true }
      ).lean();

      // Audit if privacy or visibility changed
      if (updates.visibility || updates.confidentialityAgreementRequired !== undefined) {
        await SecurityAuditEventModel.create({
          workspaceId: access.workspace._id?.toString() || id,
          actorId: user.userId,
          actorName: user.displayName,
          action: "privacy_setting_changed",
          details: `Workspace visibility changed to '${updates.visibility || access.workspace.visibility}'.`,
        });
      }

      return NextResponse.json({ success: true, workspace: updated });
    }

    // Mock store
    const index = mockDb.workspaces.findIndex(
      (w) => w._id === id || w.slug === id || w._id === access.workspace._id
    );
    if (index >= 0) {
      const oldVisibility = mockDb.workspaces[index].visibility;
      mockDb.workspaces[index] = { ...mockDb.workspaces[index], ...updates };

      if (updates.visibility && updates.visibility !== oldVisibility) {
        mockDb.auditEvents.push({
          _id: "sec_" + Math.random().toString(36).substring(2, 9),
          workspaceId: mockDb.workspaces[index]._id!,
          actorId: user.userId,
          actorName: user.displayName,
          action: "privacy_setting_changed",
          details: `Workspace visibility changed from '${oldVisibility}' to '${updates.visibility}'.`,
          timestamp: new Date().toISOString(),
        });
      }

      return NextResponse.json({ success: true, workspace: mockDb.workspaces[index] });
    }

    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
