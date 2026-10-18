import mongoose, { Schema, Document } from "mongoose";

export interface IWorkspaceMembershipDoc extends Document {
  workspaceId: string;
  userId: string;
  role: "owner" | "admin" | "member" | "viewer";
  status: "active" | "suspended" | "revoked";
  joinedAt: Date;
  ndaSignedAt?: Date;
  invitedBy?: string;
  title?: string;
}

const WorkspaceMembershipSchema = new Schema<IWorkspaceMembershipDoc>(
  {
    workspaceId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    role: {
      type: String,
      enum: ["owner", "admin", "member", "viewer"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "revoked"],
      default: "active",
      index: true,
    },
    joinedAt: { type: Date, default: Date.now },
    ndaSignedAt: { type: Date },
    invitedBy: { type: String },
    title: { type: String, default: "Team Member" },
  },
  { timestamps: true }
);

WorkspaceMembershipSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });

export const WorkspaceMembershipModel =
  mongoose.models.WorkspaceMembership ||
  mongoose.model<IWorkspaceMembershipDoc>("WorkspaceMembership", WorkspaceMembershipSchema);
