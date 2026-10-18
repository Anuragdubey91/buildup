import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriptionDoc extends Document {
  userId: string;
  plan: "free" | "premium" | "campus";
  status: "active" | "canceled" | "past_due" | "trialing";
  aiMonthlyQuota: number;
  aiUsedThisMonth: number;
  currentPeriodEnd: Date;
  razorpaySubscriptionId?: string;
  razorpayPaymentId?: string;
}

const SubscriptionSchema = new Schema<ISubscriptionDoc>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    plan: {
      type: String,
      enum: ["free", "premium", "campus"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["active", "canceled", "past_due", "trialing"],
      default: "active",
    },
    aiMonthlyQuota: { type: Number, default: 25 },
    aiUsedThisMonth: { type: Number, default: 0 },
    currentPeriodEnd: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    razorpaySubscriptionId: { type: String },
    razorpayPaymentId: { type: String },
  },
  { timestamps: true }
);

export const SubscriptionModel =
  mongoose.models.Subscription ||
  mongoose.model<ISubscriptionDoc>("Subscription", SubscriptionSchema);
