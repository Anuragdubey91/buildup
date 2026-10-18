import mongoose, { Schema, Document } from "mongoose";

export interface IPitchDeckDoc extends Document {
  workspaceId: string;
  slides: {
    slideNumber: number;
    title: string;
    subtitle?: string;
    bulletPoints: string[];
    speakerNotes?: string;
  }[];
  version: number;
}

const PitchDeckSchema = new Schema<IPitchDeckDoc>(
  {
    workspaceId: { type: String, required: true, unique: true, index: true },
    slides: [
      {
        slideNumber: { type: Number, required: true },
        title: { type: String, required: true },
        subtitle: { type: String, default: "" },
        bulletPoints: [{ type: String }],
        speakerNotes: { type: String, default: "" },
      },
    ],
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const PitchDeckModel =
  mongoose.models.PitchDeck ||
  mongoose.model<IPitchDeckDoc>("PitchDeck", PitchDeckSchema);
