import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { WorkspaceMembershipModel } from "@/models/WorkspaceMembership";
import { SecurityAuditEventModel } from "@/models/SecurityAuditEvent";
import { mockDb } from "@/lib/mockDb";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, access } = await requireWorkspaceRole(id, "viewer");
    const workspaceId = access.workspace._id || id;

    const conn = await connectDB();
    if (conn) {
      await WorkspaceMembershipModel.findOneAndUpdate(
        { workspaceId, userId: user.userId },
        { ndaSignedAt: new Date() }
      );

      await SecurityAuditEventModel.create({
        workspaceId,
        actorId: user.userId,
        actorName: user.displayName,
        action: "nda_signed",
        details: `${user.displayName} recorded signed acknowledgment of workspace confidentiality terms.`,
      });

      return NextResponse.json({ success: true, message: "Confidentiality terms acknowledged" });
    }

    const member = mockDb.memberships.find(
      (m) => m.workspaceId === workspaceId && m.userId === user.userId
    );
    if (member) {
      member.ndaSignedAt = new Date().toISOString();
    }

    mockDb.auditEvents.push({
      _id: "sec_" + Math.random().toString(36).substring(2, 9),
      workspaceId,
      actorId: user.userId,
      actorName: user.displayName,
      action: "nda_signed",
      details: `${user.displayName} recorded signed acknowledgment of workspace confidentiality terms.`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Confidentiality terms acknowledged" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
