import mongoose, { Schema, Document } from "mongoose";

export interface IWorkspaceInvitationDoc extends Document {
  workspaceId: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  inviterId: string;
  token: string;
  expiresAt: Date;
  status: "pending" | "accepted" | "declined" | "revoked";
  createdAt: Date;
}

const WorkspaceInvitationSchema = new Schema<IWorkspaceInvitationDoc>(
  {
    workspaceId: { type: String, required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: {
      type: String,
      enum: ["owner", "admin", "member", "viewer"],
      default: "member",
    },
    inviterId: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "revoked"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

WorkspaceInvitationSchema.index({ workspaceId: 1, email: 1 });

export const WorkspaceInvitationModel =
  mongoose.models.WorkspaceInvitation ||
  mongoose.model<IWorkspaceInvitationDoc>("WorkspaceInvitation", WorkspaceInvitationSchema);
