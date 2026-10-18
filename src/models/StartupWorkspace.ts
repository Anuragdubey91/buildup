import mongoose, { Schema, Document } from "mongoose";

export interface IStartupWorkspaceDoc extends Document {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  domain: string;
  stage: string;
  ownerId: string;
  visibility: "private" | "preview" | "public";
  previewFields: {
    showTagline: boolean;
    showDomain: boolean;
    showStage: boolean;
    showProblems: boolean;
    showMilestones: boolean;
    showPitchSummary: boolean;
  };
  confidentialityAgreementRequired: boolean;
  confidentialityTemplate: string;
  targetLaunchDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StartupWorkspaceSchema = new Schema<IStartupWorkspaceDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    domain: { type: String, required: true, index: true },
    stage: {
      type: String,
      enum: [
        "idea_discovery",
        "problem_validation",
        "customer_research",
        "mvp_planning",
        "mvp_development",
        "testing",
        "launch",
        "growth",
      ],
      default: "idea_discovery",
    },
    ownerId: { type: String, required: true, index: true },
    // IdeaShield Core: Default rule: every new startup workspace and idea must be private.
    visibility: {
      type: String,
      enum: ["private", "preview", "public"],
      default: "private",
      index: true,
    },
    previewFields: {
      showTagline: { type: Boolean, default: true },
      showDomain: { type: Boolean, default: true },
      showStage: { type: Boolean, default: true },
      showProblems: { type: Boolean, default: false },
      showMilestones: { type: Boolean, default: false },
      showPitchSummary: { type: Boolean, default: false },
    },
    confidentialityAgreementRequired: { type: Boolean, default: false },
    confidentialityTemplate: {
      type: String,
      default:
        "CONFIDENTIALITY AND NON-DISCLOSURE DISCUSSION AID\n\nThe parties agree that discussions, roadmaps, customer insights, and strategy documents shared within this workspace represent proprietary ideas. Receiving parties agree not to disclose or commercially misappropriate confidential information without written agreement. Note: This template is a discussion aid and founders should consult legal counsel for legally binding contracts.",
    },
    targetLaunchDate: { type: String },
  },
  { timestamps: true }
);

StartupWorkspaceSchema.index({ ownerId: 1, visibility: 1 });

export const StartupWorkspaceModel =
  mongoose.models.StartupWorkspace ||
  mongoose.model<IStartupWorkspaceDoc>("StartupWorkspace", StartupWorkspaceSchema);
