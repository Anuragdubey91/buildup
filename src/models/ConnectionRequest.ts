import mongoose, { Schema, Document } from "mongoose";

export interface IConnectionRequestDoc extends Document {
  senderId: string;
  receiverId: string;
  message: string;
  status: "pending" | "accepted" | "declined" | "cancelled";
  createdAt: Date;
  respondedAt?: Date;
}

const ConnectionRequestSchema = new Schema<IConnectionRequestDoc>(
  {
    senderId: { type: String, required: true, index: true },
    receiverId: { type: String, required: true, index: true },
    message: { type: String, default: "", maxLength: 500 },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "cancelled"],
      default: "pending",
      index: true,
    },
    respondedAt: { type: Date },
  },
  { timestamps: true }
);

ConnectionRequestSchema.index({ senderId: 1, receiverId: 1 });

export const ConnectionRequestModel =
  mongoose.models.ConnectionRequest ||
  mongoose.model<IConnectionRequestDoc>("ConnectionRequest", ConnectionRequestSchema);
