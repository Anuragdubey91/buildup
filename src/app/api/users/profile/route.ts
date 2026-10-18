import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { UserProfileModel } from "@/models/UserProfile";
import { mockDb } from "@/lib/mockDb";
import { UserProfileType } from "@/types";

export async function GET() {
  try {
    const user = await requireAuth();
    const conn = await connectDB();

    if (conn) {
      const profile = await UserProfileModel.findOne({ userId: user.userId }).lean();
      if (profile) return NextResponse.json({ profile });
    }

    const mockProfile = mockDb.users.find((u) => u.userId === user.userId) || {
      userId: user.userId,
      displayName: user.displayName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      skills: [],
      interests: [],
      preferredDomains: [],
      goals: [],
      experienceLevel: "early_career",
      preferredRoles: ["Technical Co-Founder"],
      workingStyle: "agile",
      weeklyHours: 20,
      collaborationMode: "remote",
      isPublicInDiscovery: true,
      contactPreference: "platform_message",
    };

    return NextResponse.json({ profile: mockProfile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    const updates = await req.json();

    const conn = await connectDB();
    if (conn) {
      const updated = await UserProfileModel.findOneAndUpdate(
        { userId: user.userId },
        { $set: updates },
        { new: true, upsert: true }
      ).lean();
      return NextResponse.json({ success: true, profile: updated });
    }

    // Mock update
    const index = mockDb.users.findIndex((u) => u.userId === user.userId);
    if (index >= 0) {
      mockDb.users[index] = { ...mockDb.users[index], ...updates };
      return NextResponse.json({ success: true, profile: mockDb.users[index] });
    } else {
      const newProfile: UserProfileType = {
        userId: user.userId,
        displayName: user.displayName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        skills: [],
        interests: [],
        preferredDomains: [],
        goals: [],
        experienceLevel: "early_career",
        preferredRoles: [],
        workingStyle: "agile",
        weeklyHours: 20,
        collaborationMode: "remote",
        isPublicInDiscovery: true,
        contactPreference: "platform_message",
        ...updates,
      };
      mockDb.users.push(newProfile);
      return NextResponse.json({ success: true, profile: newProfile });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
