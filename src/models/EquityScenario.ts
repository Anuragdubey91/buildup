import mongoose, { Schema, Document } from "mongoose";

export interface IEquityScenarioDoc extends Document {
  workspaceId: string;
  scenarioName: string;
  founders: {
    id: string;
    name: string;
    role: string;
    timeCommitmentHoursPerWeek: number;
    cashInvested: number;
    ipContributionScore: number;
    executionRiskScore: number;
    responsibilitiesScore: number;
    calculatedSharePct: number;
  }[];
  optionPoolPct: number;
  notes?: string;
}

const EquityScenarioSchema = new Schema<IEquityScenarioDoc>(
  {
    workspaceId: { type: String, required: true, index: true },
    scenarioName: { type: String, default: "Initial Founder Split" },
    founders: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        role: { type: String, required: true },
        timeCommitmentHoursPerWeek: { type: Number, default: 40 },
        cashInvested: { type: Number, default: 0 },
        ipContributionScore: { type: Number, default: 3 },
        executionRiskScore: { type: Number, default: 3 },
        responsibilitiesScore: { type: Number, default: 3 },
        calculatedSharePct: { type: Number, default: 50 },
      },
    ],
    optionPoolPct: { type: Number, default: 10 },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const EquityScenarioModel =
  mongoose.models.EquityScenario ||
  mongoose.model<IEquityScenarioDoc>("EquityScenario", EquityScenarioSchema);
