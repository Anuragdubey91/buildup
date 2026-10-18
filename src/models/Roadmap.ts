import mongoose, { Schema, Document } from "mongoose";

export interface IRoadmapDoc extends Document {
  workspaceId: string;
  currentStage: string;
  milestones: {
    id: string;
    title: string;
    stage: string;
    description: string;
    priority: "critical" | "high" | "medium" | "low";
    suggestedTimelineWeeks: number;
    deadline?: string;
    status: "todo" | "in_progress" | "completed";
    dependencies: string[];
  }[];
  tasks: {
    id: string;
    milestoneId: string;
    title: string;
    description?: string;
    assignedToUserId?: string;
    priority: "high" | "medium" | "low";
    deadline?: string;
    status: "todo" | "in_progress" | "done";
    createdAt: string;
  }[];
}

const RoadmapSchema = new Schema<IRoadmapDoc>(
  {
    workspaceId: { type: String, required: true, unique: true, index: true },
    currentStage: {
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
    milestones: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        stage: { type: String, required: true },
        description: { type: String, default: "" },
        priority: {
          type: String,
          enum: ["critical", "high", "medium", "low"],
          default: "medium",
        },
        suggestedTimelineWeeks: { type: Number, default: 2 },
        deadline: { type: String },
        status: {
          type: String,
          enum: ["todo", "in_progress", "completed"],
          default: "todo",
        },
        dependencies: [{ type: String }],
      },
    ],
    tasks: [
      {
        id: { type: String, required: true },
        milestoneId: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: "" },
        assignedToUserId: { type: String },
        priority: {
          type: String,
          enum: ["high", "medium", "low"],
          default: "medium",
        },
        deadline: { type: String },
        status: {
          type: String,
          enum: ["todo", "in_progress", "done"],
          default: "todo",
        },
        createdAt: { type: String, default: () => new Date().toISOString() },
      },
    ],
  },
  { timestamps: true }
);

export const RoadmapModel =
  mongoose.models.Roadmap || mongoose.model<IRoadmapDoc>("Roadmap", RoadmapSchema);
