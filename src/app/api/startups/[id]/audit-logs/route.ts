import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { SecurityAuditEventModel } from "@/models/SecurityAuditEvent";
import { mockDb } from "@/lib/mockDb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { access } = await requireWorkspaceRole(id, "admin");
    const workspaceId = access.workspace._id || id;

    const conn = await connectDB();
    if (conn) {
      const logs = await SecurityAuditEventModel.find({ workspaceId })
        .sort({ timestamp: -1 })
        .limit(50)
        .lean();
      return NextResponse.json({ logs });
    }

    const logs = mockDb.auditEvents
      .filter((ev) => ev.workspaceId === workspaceId || ev.workspaceId === access.workspace._id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ logs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
