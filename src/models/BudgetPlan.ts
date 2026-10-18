import mongoose, { Schema, Document } from "mongoose";

export interface IBudgetPlanDoc extends Document {
  workspaceId: string;
  currency: string;
  initialCash: number;
  oneTimeCosts: { id: string; name: string; amount: number; category: string }[];
  monthlyExpenses: { id: string; name: string; amount: number; category: string }[];
  monthlyRevenues: { id: string; name: string; amount: number; notes?: string }[];
  fundingReceived: { id: string; source: string; amount: number; date: string }[];
  targetAveragePricePerCustomer?: number;
  variableCostPerCustomer?: number;
}

const BudgetPlanSchema = new Schema<IBudgetPlanDoc>(
  {
    workspaceId: { type: String, required: true, unique: true, index: true },
    currency: { type: String, default: "INR" },
    initialCash: { type: Number, default: 100000 },
    oneTimeCosts: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        category: { type: String, default: "General" },
      },
    ],
    monthlyExpenses: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        category: { type: String, default: "Operations" },
      },
    ],
    monthlyRevenues: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        notes: { type: String, default: "" },
      },
    ],
    fundingReceived: [
      {
        id: { type: String, required: true },
        source: { type: String, required: true },
        amount: { type: Number, required: true },
        date: { type: String, required: true },
      },
    ],
    targetAveragePricePerCustomer: { type: Number, default: 500 },
    variableCostPerCustomer: { type: Number, default: 100 },
  },
  { timestamps: true }
);

export const BudgetPlanModel =
  mongoose.models.BudgetPlan ||
  mongoose.model<IBudgetPlanDoc>("BudgetPlan", BudgetPlanSchema);
