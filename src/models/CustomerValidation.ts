import mongoose, { Schema, Document } from "mongoose";

export interface ICustomerValidationDoc extends Document {
  workspaceId: string;
  customerPersonas: {
    id: string;
    name: string;
    role: string;
    demographics: string;
    coreFrustrations: string[];
    goals: string[];
  }[];
  interviewQuestions: string[];
  surveyQuestions: string[];
  feedbackRecords: {
    id: string;
    intervieweeName: string;
    intervieweeRole?: string;
    date: string;
    category: string;
    notes: string;
    painPoints: string[];
    validationStatus: string;
    consentObtained: boolean;
    source: string;
  }[];
  painPointSummary?: string;
  overallDemandConfidence: "high" | "moderate" | "low" | "untested";
}

const CustomerValidationSchema = new Schema<ICustomerValidationDoc>(
  {
    workspaceId: { type: String, required: true, unique: true, index: true },
    customerPersonas: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        role: { type: String, default: "" },
        demographics: { type: String, default: "" },
        coreFrustrations: [{ type: String }],
        goals: [{ type: String }],
      },
    ],
    interviewQuestions: [{ type: String }],
    surveyQuestions: [{ type: String }],
    feedbackRecords: [
      {
        id: { type: String, required: true },
        intervieweeName: { type: String, required: true },
        intervieweeRole: { type: String, default: "" },
        date: { type: String, required: true },
        category: {
          type: String,
          enum: ["problem_validation", "pricing", "ux_feature", "competitor_switch", "general"],
          default: "problem_validation",
        },
        notes: { type: String, default: "" },
        painPoints: [{ type: String }],
        validationStatus: {
          type: String,
          enum: ["validated", "inconclusive", "invalidated"],
          default: "inconclusive",
        },
        consentObtained: { type: Boolean, default: true },
        source: {
          type: String,
          enum: ["in_person", "video_call", "survey", "email"],
          default: "video_call",
        },
      },
    ],
    painPointSummary: { type: String, default: "" },
    overallDemandConfidence: {
      type: String,
      enum: ["high", "moderate", "low", "untested"],
      default: "untested",
    },
  },
  { timestamps: true }
);

export const CustomerValidationModel =
  mongoose.models.CustomerValidation ||
  mongoose.model<ICustomerValidationDoc>("CustomerValidation", CustomerValidationSchema);
