import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { UserProfileModel } from "@/models/UserProfile";
import { SubscriptionModel } from "@/models/Subscription";
import { mockDb } from "@/lib/mockDb";

export async function POST(req: NextRequest) {
  try {
    const { displayName, email, role } = await req.json();

    if (!displayName || typeof displayName !== "string" || !displayName.trim()) {
      return NextResponse.json(
        { error: "Full Name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const conn = await connectDB();

    // Check for duplicate account
    if (conn) {
      const existing = await UserProfileModel.findOne({ email: normalizedEmail }).lean();
      if (existing) {
        return NextResponse.json(
          {
            error: `An account with email "${normalizedEmail}" already exists. Please sign in instead.`,
          },
          { status: 400 }
        );
      }
    } else {
      const existing = mockDb.users.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (existing) {
        return NextResponse.json(
          {
            error: `An account with email "${normalizedEmail}" already exists. Please sign in instead.`,
          },
          { status: 400 }
        );
      }
    }

    const newUserId =
      "user_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 7);

    const userProfileData = {
      userId: newUserId,
      displayName: displayName.trim(),
      email: normalizedEmail,
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      bio: `Founder & builder interested in startups. Role: ${role || "Technical Co-Founder"}.`,
      skills: [
        {
          name: role || "Product & Growth",
          proficiency: "intermediate" as const,
          verified: false,
        },
      ],
      interests: ["Startups", "Innovation", "Tech"],
      preferredDomains: ["General Tech", "SaaS"],
      goals: ["Validate idea", "Build MVP", "Find co-founders"],
      experienceLevel: "early_career" as const,
      preferredRoles: role ? [role] : ["Technical Co-Founder"],
      workingStyle: "agile" as const,
      weeklyHours: 25,
      collaborationMode: "remote" as const,
      isPublicInDiscovery: true,
      contactPreference: "platform_message" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (conn) {
      await UserProfileModel.create(userProfileData);
      await SubscriptionModel.create({
        userId: newUserId,
        plan: "free",
        status: "active",
        aiMonthlyQuota: 25,
        aiUsedThisMonth: 0,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    } else {
      mockDb.users.push(userProfileData as any);
      mockDb.subscriptions.push({
        _id: "sub_" + Math.random().toString(36).substring(2, 9),
        userId: newUserId,
        plan: "free",
        status: "active",
        aiMonthlyQuota: 25,
        aiUsedThisMonth: 0,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        userId: newUserId,
        email: normalizedEmail,
        displayName: displayName.trim(),
      },
    });

    response.cookies.set("buildup_dev_user_id", newUserId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Registration failed" }, { status: 500 });
  }
}
