import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { AbuseReportModel } from "@/models/AbuseReport";
import { mockDb } from "@/lib/mockDb";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireAuth();
    const { category, description } = await req.json();

    if (!description) {
      return NextResponse.json({ error: "Detailed description is required" }, { status: 400 });
    }

    const reportData = {
      reporterUserId: user.userId,
      reportedWorkspaceId: id,
      category: category || "other",
      description,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    };

    const conn = await connectDB();
    if (conn) {
      const created = await AbuseReportModel.create(reportData);
      return NextResponse.json({ success: true, report: created });
    }

    const mockReport = {
      _id: "ab_" + Math.random().toString(36).substring(2, 9),
      ...reportData,
    };
    mockDb.abuseReports.unshift(mockReport);

    return NextResponse.json({ success: true, report: mockReport });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
