import mongoose, { Schema, Document } from "mongoose";

export interface IBusinessModelDoc extends Document {
  workspaceId: string;
  customerSegments: string[];
  customerProblems: string[];
  valueProposition: string[];
  solution: string[];
  revenueStreams: string[];
  costStructure: string[];
  distributionChannels: string[];
  customerRelationships: string[];
  keyMetrics: string[];
  mvpFeatures: {
    id: string;
    name: string;
    description: string;
    category: "must_have" | "should_have" | "could_have" | "wont_have";
    status: "backlog" | "in_dev" | "shipped";
  }[];
}

const BusinessModelSchema = new Schema<IBusinessModelDoc>(
  {
    workspaceId: { type: String, required: true, unique: true, index: true },
    customerSegments: [{ type: String }],
    customerProblems: [{ type: String }],
    valueProposition: [{ type: String }],
    solution: [{ type: String }],
    revenueStreams: [{ type: String }],
    costStructure: [{ type: String }],
    distributionChannels: [{ type: String }],
    customerRelationships: [{ type: String }],
    keyMetrics: [{ type: String }],
    mvpFeatures: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, default: "" },
        category: {
          type: String,
          enum: ["must_have", "should_have", "could_have", "wont_have"],
          default: "must_have",
        },
        status: {
          type: String,
          enum: ["backlog", "in_dev", "shipped"],
          default: "backlog",
        },
      },
    ],
  },
  { timestamps: true }
);

export const BusinessModelModel =
  mongoose.models.BusinessModel ||
  mongoose.model<IBusinessModelDoc>("BusinessModel", BusinessModelSchema);
