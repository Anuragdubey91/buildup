import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { BudgetPlanModel } from "@/models/BudgetPlan";
import { mockDb } from "@/lib/mockDb";
import { calculateFinancialProjections } from "@/lib/finance";
import { BudgetPlanType } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { access } = await requireWorkspaceRole(id, "viewer");
    const workspaceId = access.workspace._id || id;

    const conn = await connectDB();
    let plan: any = null;

    if (conn) {
      plan = await BudgetPlanModel.findOne({ workspaceId }).lean();
    } else {
      plan = mockDb.budgetPlans.find((bp) => bp.workspaceId === workspaceId);
    }

    if (!plan) {
      // Return default starter plan
      plan = {
        workspaceId,
        currency: "INR",
        initialCash: 100000,
        oneTimeCosts: [
          { id: "ot_1", name: "Company Incorporation & Legal Docs", amount: 15000, category: "Legal" },
          { id: "ot_2", name: "Domain & Initial Hosting Setup", amount: 5000, category: "Technology" },
        ],
        monthlyExpenses: [
          { id: "me_1", name: "Cloud Server & Database", amount: 2500, category: "Infrastructure" },
          { id: "me_2", name: "Marketing & Student Outreaches", amount: 5000, category: "Marketing" },
        ],
        monthlyRevenues: [],
        fundingReceived: [{ id: "fnd_1", source: "Founder Personal Savings", amount: 100000, date: new Date().toISOString().split("T")[0] }],
        targetAveragePricePerCustomer: 499,
        variableCostPerCustomer: 50,
      };
    }

    const projections = calculateFinancialProjections(plan);

    return NextResponse.json({ plan, projections });
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

    const planData: Partial<BudgetPlanType> = {
      workspaceId,
      currency: body.currency || "INR",
      initialCash: Number(body.initialCash) || 0,
      oneTimeCosts: body.oneTimeCosts || [],
      monthlyExpenses: body.monthlyExpenses || [],
      monthlyRevenues: body.monthlyRevenues || [],
      fundingReceived: body.fundingReceived || [],
      targetAveragePricePerCustomer: Number(body.targetAveragePricePerCustomer) || 0,
      variableCostPerCustomer: Number(body.variableCostPerCustomer) || 0,
      updatedAt: new Date().toISOString(),
    };

    const conn = await connectDB();
    if (conn) {
      const saved = await BudgetPlanModel.findOneAndUpdate(
        { workspaceId },
        { $set: planData },
        { new: true, upsert: true }
      );
      const projections = calculateFinancialProjections(saved);
      return NextResponse.json({ success: true, plan: saved, projections });
    }

    const existingIndex = mockDb.budgetPlans.findIndex((bp) => bp.workspaceId === workspaceId);
    const mockPlan: BudgetPlanType = {
      _id: "bp_" + Math.random().toString(36).substring(2, 9),
      ...planData,
    } as BudgetPlanType;

    if (existingIndex >= 0) {
      mockDb.budgetPlans[existingIndex] = mockPlan;
    } else {
      mockDb.budgetPlans.push(mockPlan);
    }

    const projections = calculateFinancialProjections(mockPlan);
    return NextResponse.json({ success: true, plan: mockPlan, projections });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
