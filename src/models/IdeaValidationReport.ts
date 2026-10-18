import mongoose, { Schema, Document } from "mongoose";

export interface IIdeaValidationReportDoc extends Document {
  workspaceId: string;
  createdById: string;
  idea: string;
  targetAudience: string;
  problem: string;
  solution: string;
  competitors: string;
  revenueModel: string;
  assumptions: string;
  validationEvidence: string;
  problemClarityScore: number;
  viabilityScore: number;
  targetCustomerAnalysis: string;
  mainAssumptions: string[];
  potentialRisks: { risk: string; severity: string; mitigation: string }[];
  competitorConsiderations: string;
  possibleDifferentiation: string[];
  suggestedExperiments: { name: string; hypothesis: string; metric: string; timelineDays: number }[];
  customerQuestions: string[];
  suggestedMvp: { coreFeature: string; description: string; effort: string }[];
  nextSteps: string[];
  isAIGenerated: boolean;
  createdAt: Date;
}

const IdeaValidationReportSchema = new Schema<IIdeaValidationReportDoc>(
  {
    workspaceId: { type: String, required: true, index: true },
    createdById: { type: String, required: true },
    idea: { type: String, required: true },
    targetAudience: { type: String, required: true },
    problem: { type: String, required: true },
    solution: { type: String, required: true },
    competitors: { type: String, default: "" },
    revenueModel: { type: String, default: "" },
    assumptions: { type: String, default: "" },
    validationEvidence: { type: String, default: "" },
    problemClarityScore: { type: Number, default: 75 },
    viabilityScore: { type: Number, default: 70 },
    targetCustomerAnalysis: { type: String, default: "" },
    mainAssumptions: [{ type: String }],
    potentialRisks: [
      {
        risk: { type: String },
        severity: { type: String, enum: ["high", "medium", "low"] },
        mitigation: { type: String },
      },
    ],
    competitorConsiderations: { type: String, default: "" },
    possibleDifferentiation: [{ type: String }],
    suggestedExperiments: [
      {
        name: { type: String },
        hypothesis: { type: String },
        metric: { type: String },
        timelineDays: { type: Number },
      },
    ],
    customerQuestions: [{ type: String }],
    suggestedMvp: [
      {
        coreFeature: { type: String },
        description: { type: String },
        effort: { type: String, enum: ["low", "medium", "high"] },
      },
    ],
    nextSteps: [{ type: String }],
    isAIGenerated: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const IdeaValidationReportModel =
  mongoose.models.IdeaValidationReport ||
  mongoose.model<IIdeaValidationReportDoc>("IdeaValidationReport", IdeaValidationReportSchema);
