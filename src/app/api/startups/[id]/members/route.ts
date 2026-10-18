import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { WorkspaceMembershipModel } from "@/models/WorkspaceMembership";
import { WorkspaceInvitationModel } from "@/models/WorkspaceInvitation";
import { SecurityAuditEventModel } from "@/models/SecurityAuditEvent";
import { mockDb } from "@/lib/mockDb";

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
      const members = await WorkspaceMembershipModel.find({ workspaceId }).lean();
      const invitations = await WorkspaceInvitationModel.find({
        workspaceId,
        status: "pending",
      }).lean();
      return NextResponse.json({ members, invitations });
    }

    const members = mockDb.memberships.filter((m) => m.workspaceId === workspaceId);
    const invitations = mockDb.invitations.filter(
      (inv) => inv.workspaceId === workspaceId && inv.status === "pending"
    );

    return NextResponse.json({ members, invitations });
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
    const { user, access } = await requireWorkspaceRole(id, "admin");
    const { email, role } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email address is required" }, { status: 400 });
    }

    const workspaceId = access.workspace._id || id;
    const token = "inv_" + Math.random().toString(36).substring(2, 12);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const conn = await connectDB();
    if (conn) {
      const invite = await WorkspaceInvitationModel.create({
        workspaceId,
        email: email.toLowerCase().trim(),
        role: role || "member",
        inviterId: user.userId,
        token,
        expiresAt,
        status: "pending",
      });

      await SecurityAuditEventModel.create({
        workspaceId,
        actorId: user.userId,
        actorName: user.displayName,
        action: "invite_sent",
        details: `Invitation sent to ${email} with role: ${role || "member"}.`,
      });

      return NextResponse.json({ success: true, invitation: invite });
    }

    const mockInvite = {
      _id: "inv_" + Math.random().toString(36).substring(2, 9),
      workspaceId,
      email: email.toLowerCase().trim(),
      role: role || "member",
      inviterId: user.userId,
      token,
      expiresAt: expiresAt.toISOString(),
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    };
    mockDb.invitations.push(mockInvite);

    mockDb.auditEvents.push({
      _id: "sec_" + Math.random().toString(36).substring(2, 9),
      workspaceId,
      actorId: user.userId,
      actorName: user.displayName,
      action: "invite_sent",
      details: `Invitation sent to ${email} with role: ${role || "member"}.`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, invitation: mockInvite });
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
    const { user, access } = await requireWorkspaceRole(id, "admin");
    const { membershipId, action, newRole } = await req.json();

    const workspaceId = access.workspace._id || id;
    const conn = await connectDB();

    if (action === "revoke") {
      if (conn) {
        await WorkspaceMembershipModel.findByIdAndUpdate(membershipId, {
          status: "revoked",
        });
        await SecurityAuditEventModel.create({
          workspaceId,
          actorId: user.userId,
          actorName: user.displayName,
          action: "member_removed",
          details: `Membership ${membershipId} access revoked.`,
        });
        return NextResponse.json({ success: true, message: "Member access revoked" });
      }

      const mIdx = mockDb.memberships.findIndex((m) => m._id === membershipId);
      if (mIdx >= 0) {
        mockDb.memberships[mIdx].status = "revoked";
        mockDb.auditEvents.push({
          _id: "sec_" + Math.random().toString(36).substring(2, 9),
          workspaceId,
          actorId: user.userId,
          actorName: user.displayName,
          action: "member_removed",
          details: `Member access revoked for ${mockDb.memberships[mIdx].userId}.`,
          timestamp: new Date().toISOString(),
        });
        return NextResponse.json({ success: true, message: "Member access revoked" });
      }
    }

    if (action === "change_role" && newRole) {
      if (conn) {
        const updated = await WorkspaceMembershipModel.findByIdAndUpdate(
          membershipId,
          { role: newRole },
          { new: true }
        );
        return NextResponse.json({ success: true, membership: updated });
      }

      const mIdx = mockDb.memberships.findIndex((m) => m._id === membershipId);
      if (mIdx >= 0) {
        mockDb.memberships[mIdx].role = newRole;
        return NextResponse.json({ success: true, membership: mockDb.memberships[mIdx] });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
