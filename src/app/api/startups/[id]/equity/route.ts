import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { EquityScenarioModel } from "@/models/EquityScenario";
import { mockDb } from "@/lib/mockDb";
import { calculateEquitySplit } from "@/lib/equity";
import { EquityScenarioType } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { access } = await requireWorkspaceRole(id, "viewer");
    const workspaceId = access.workspace._id || id;

    const conn = await connectDB();
    let scenario: any = null;

    if (conn) {
      scenario = await EquityScenarioModel.findOne({ workspaceId }).lean();
    } else {
      scenario = mockDb.equityScenarios.find((eq) => eq.workspaceId === workspaceId);
    }

    if (!scenario) {
      // Create initial scenario
      const initialFounders = [
        {
          id: "fnd_1",
          name: "Founder 1 (Technical)",
          role: "CTO",
          timeCommitmentHoursPerWeek: 40,
          cashInvested: 50000,
          ipContributionScore: 4,
          executionRiskScore: 4,
          responsibilitiesScore: 5,
        },
        {
          id: "fnd_2",
          name: "Founder 2 (Business & Product)",
          role: "CEO",
          timeCommitmentHoursPerWeek: 35,
          cashInvested: 25000,
          ipContributionScore: 3,
          executionRiskScore: 4,
          responsibilitiesScore: 4,
        },
      ];

      const calculation = calculateEquitySplit(initialFounders, 10);
      scenario = {
        workspaceId,
        scenarioName: "Balanced Founder Allocation",
        founders: calculation.foundersWithShares,
        optionPoolPct: 10,
        notes: "Initial discussion model",
      };
    }

    const calcResult = calculateEquitySplit(scenario.founders, scenario.optionPoolPct);

    return NextResponse.json({
      scenario,
      calculation: calcResult,
    });
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

    const { founders, optionPoolPct, scenarioName, notes } = body;

    const calculation = calculateEquitySplit(founders || [], optionPoolPct || 10);

    const payload: Partial<EquityScenarioType> = {
      workspaceId,
      scenarioName: scenarioName || "Custom Equity Scenario",
      founders: calculation.foundersWithShares,
      optionPoolPct: calculation.optionPoolPct,
      notes: notes || "",
      updatedAt: new Date().toISOString(),
    };

    const conn = await connectDB();
    if (conn) {
      const saved = await EquityScenarioModel.findOneAndUpdate(
        { workspaceId },
        { $set: payload },
        { new: true, upsert: true }
      );
      return NextResponse.json({ success: true, scenario: saved, calculation });
    }

    const index = mockDb.equityScenarios.findIndex((eq) => eq.workspaceId === workspaceId);
    const mockEq: EquityScenarioType = {
      _id: "eq_" + Math.random().toString(36).substring(2, 9),
      ...payload,
    } as EquityScenarioType;

    if (index >= 0) {
      mockDb.equityScenarios[index] = mockEq;
    } else {
      mockDb.equityScenarios.push(mockEq);
    }

    return NextResponse.json({ success: true, scenario: mockEq, calculation });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
