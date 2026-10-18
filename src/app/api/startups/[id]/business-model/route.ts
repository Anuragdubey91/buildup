import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { BusinessModelModel } from "@/models/BusinessModel";
import { mockDb } from "@/lib/mockDb";
import { BusinessModelType } from "@/types";

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
      const bm = await BusinessModelModel.findOne({ workspaceId }).lean();
      return NextResponse.json({ businessModel: bm || null });
    }

    const bm = mockDb.businessModels.find((b) => b.workspaceId === workspaceId);
    return NextResponse.json({ businessModel: bm || null });
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

    const data: Partial<BusinessModelType> = {
      workspaceId,
      customerSegments: body.customerSegments || [],
      customerProblems: body.customerProblems || [],
      valueProposition: body.valueProposition || [],
      solution: body.solution || [],
      revenueStreams: body.revenueStreams || [],
      costStructure: body.costStructure || [],
      distributionChannels: body.distributionChannels || [],
      customerRelationships: body.customerRelationships || [],
      keyMetrics: body.keyMetrics || [],
      mvpFeatures: body.mvpFeatures || [],
      updatedAt: new Date().toISOString(),
    };

    const conn = await connectDB();
    if (conn) {
      const saved = await BusinessModelModel.findOneAndUpdate(
        { workspaceId },
        { $set: data },
        { new: true, upsert: true }
      );
      return NextResponse.json({ success: true, businessModel: saved });
    }

    const index = mockDb.businessModels.findIndex((b) => b.workspaceId === workspaceId);
    const mockBm: BusinessModelType = {
      _id: "bm_" + Math.random().toString(36).substring(2, 9),
      ...data,
    } as BusinessModelType;

    if (index >= 0) {
      mockDb.businessModels[index] = mockBm;
    } else {
      mockDb.businessModels.push(mockBm);
    }

    return NextResponse.json({ success: true, businessModel: mockBm });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
