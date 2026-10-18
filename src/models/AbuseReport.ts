import mongoose, { Schema, Document } from "mongoose";

export interface IAbuseReportDoc extends Document {
  reporterUserId: string;
  reportedWorkspaceId?: string;
  reportedUserId?: string;
  category: "ip_theft" | "harassment" | "spam" | "fake_traction" | "privacy_violation" | "other";
  description: string;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  adminNotes?: string;
  createdAt: Date;
}

const AbuseReportSchema = new Schema<IAbuseReportDoc>(
  {
    reporterUserId: { type: String, required: true, index: true },
    reportedWorkspaceId: { type: String, index: true },
    reportedUserId: { type: String, index: true },
    category: {
      type: String,
      enum: ["ip_theft", "harassment", "spam", "fake_traction", "privacy_violation", "other"],
      required: true,
      index: true,
    },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "investigating", "resolved", "dismissed"],
      default: "pending",
      index: true,
    },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const AbuseReportModel =
  mongoose.models.AbuseReport ||
  mongoose.model<IAbuseReportDoc>("AbuseReport", AbuseReportSchema);
