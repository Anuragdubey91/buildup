import mongoose, { Schema, Document } from "mongoose";

export interface IUserProfileDoc extends Document {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  skills: { name: string; proficiency: string; verified?: boolean }[];
  interests: string[];
  preferredDomains: string[];
  goals: string[];
  experienceLevel: string;
  preferredRoles: string[];
  workingStyle: string;
  weeklyHours: number;
  collaborationMode: string;
  isPublicInDiscovery: boolean;
  contactPreference: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema = new Schema<IUserProfileDoc>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    avatarUrl: { type: String, default: "" },
    bio: { type: String, default: "", maxLength: 1000 },
    skills: [
      {
        name: { type: String, required: true },
        proficiency: { type: String, enum: ["beginner", "intermediate", "expert"], default: "intermediate" },
        verified: { type: Boolean, default: false },
      },
    ],
    interests: [{ type: String }],
    preferredDomains: [{ type: String }],
    goals: [{ type: String }],
    experienceLevel: {
      type: String,
      enum: ["student", "early_career", "mid_level", "senior", "seasoned_founder"],
      default: "early_career",
    },
    preferredRoles: [{ type: String }],
    workingStyle: {
      type: String,
      enum: ["async", "agile", "structured", "flexible"],
      default: "agile",
    },
    weeklyHours: { type: Number, default: 20, min: 1, max: 100 },
    collaborationMode: {
      type: String,
      enum: ["remote", "hybrid", "in_person"],
      default: "remote",
    },
    isPublicInDiscovery: { type: Boolean, default: true, index: true },
    contactPreference: {
      type: String,
      enum: ["platform_message", "email", "linkedin"],
      default: "platform_message",
    },
    linkedinUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    portfolioUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

UserProfileSchema.index({ isPublicInDiscovery: 1, preferredDomains: 1 });
UserProfileSchema.index({ "skills.name": 1 });

export const UserProfileModel =
  mongoose.models.UserProfile || mongoose.model<IUserProfileDoc>("UserProfile", UserProfileSchema);
