import mongoose, { Schema, Document } from "mongoose";

export interface ISecurityAuditEventDoc extends Document {
  workspaceId: string;
  actorId: string;
  actorName: string;
  action: string;
  details: string;
  ipAddress?: string;
  timestamp: Date;
}

const SecurityAuditEventSchema = new Schema<ISecurityAuditEventDoc>(
  {
    workspaceId: { type: String, required: true, index: true },
    actorId: { type: String, required: true, index: true },
    actorName: { type: String, required: true },
    action: {
      type: String,
      required: true,
      index: true,
    },
    details: { type: String, required: true },
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const SecurityAuditEventModel =
  mongoose.models.SecurityAuditEvent ||
  mongoose.model<ISecurityAuditEventDoc>("SecurityAuditEvent", SecurityAuditEventSchema);
