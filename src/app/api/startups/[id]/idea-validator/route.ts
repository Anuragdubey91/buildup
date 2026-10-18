import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { IdeaValidationReportModel } from "@/models/IdeaValidationReport";
import { mockDb } from "@/lib/mockDb";
import { AIProviderAdapter } from "@/lib/ai/adapter";
import { IdeaValidationReportType } from "@/types";

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
      const report = await IdeaValidationReportModel.findOne({ workspaceId })
        .sort({ createdAt: -1 })
        .lean();
      return NextResponse.json({ report });
    }

    const report = mockDb.ideaReports.find((r) => r.workspaceId === workspaceId);
    return NextResponse.json({ report });
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
    const { user, access } = await requireWorkspaceRole(id, "member");
    const workspaceId = access.workspace._id || id;
    const body = await req.json();

    const { idea, targetAudience, problem, solution, competitors, revenueModel, assumptions, validationEvidence } = body;

    if (!idea || !targetAudience || !problem || !solution) {
      return NextResponse.json(
        { error: "Idea, target audience, problem, and solution are required fields" },
        { status: 400 }
      );
    }

    // Call server-side AI provider
    const aiResponse = await AIProviderAdapter.validateStartupIdea(user.userId, {
      idea,
      targetAudience,
      problem,
      solution,
      competitors,
      revenueModel,
      assumptions,
      validationEvidence,
    });

    if (!aiResponse.success || !aiResponse.data) {
      return NextResponse.json({ error: aiResponse.error || "Failed to generate report" }, { status: 500 });
    }

    const reportPayload: Partial<IdeaValidationReportType> = {
      workspaceId,
      createdById: user.userId,
      ...aiResponse.data,
      createdAt: new Date().toISOString(),
    } as IdeaValidationReportType;

    const conn = await connectDB();
    if (conn) {
      const savedReport = await IdeaValidationReportModel.findOneAndUpdate(
        { workspaceId },
        { $set: reportPayload },
        { new: true, upsert: true }
      );
      return NextResponse.json({
        success: true,
        report: savedReport,
        isMock: aiResponse.isMock,
        providerNotice: aiResponse.providerNotice,
      });
    }

    // Mock store
    const existingIndex = mockDb.ideaReports.findIndex((r) => r.workspaceId === workspaceId);
    const mockReport: IdeaValidationReportType = {
      _id: "report_" + Math.random().toString(36).substring(2, 9),
      ...reportPayload,
    } as IdeaValidationReportType;

    if (existingIndex >= 0) {
      mockDb.ideaReports[existingIndex] = mockReport;
    } else {
      mockDb.ideaReports.push(mockReport);
    }

    return NextResponse.json({
      success: true,
      report: mockReport,
      isMock: aiResponse.isMock,
      providerNotice: aiResponse.providerNotice,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
