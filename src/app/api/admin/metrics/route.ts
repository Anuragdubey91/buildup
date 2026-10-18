import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { UserProfileModel } from "@/models/UserProfile";
import { StartupWorkspaceModel } from "@/models/StartupWorkspace";
import { AbuseReportModel } from "@/models/AbuseReport";
import { SubscriptionModel } from "@/models/Subscription";
import { mockDb } from "@/lib/mockDb";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.isPlatformAdmin) {
      return NextResponse.json(
        { error: "Access Denied: You must be a platform administrator to view this area." },
        { status: 403 }
      );
    }

    const conn = await connectDB();
    if (conn) {
      const userCount = await UserProfileModel.countDocuments();
      const workspaceCount = await StartupWorkspaceModel.countDocuments();
      const reports = await AbuseReportModel.find().sort({ createdAt: -1 }).limit(20).lean();
      const subscriptions = await SubscriptionModel.find().lean();

      return NextResponse.json({
        stats: {
          totalUsers: userCount,
          totalWorkspaces: workspaceCount,
          totalReports: reports.length,
          activeSubscriptions: subscriptions.filter((s) => s.status === "active").length,
          premiumUsers: subscriptions.filter((s) => s.plan === "premium" || s.plan === "campus").length,
        },
        abuseReports: reports,
        systemHealth: {
          database: "MongoDB Connected",
          authProvider: "Clerk / Active Session",
          aiProvider: process.env.AI_PROVIDER || "Gemini / Heuristic Adapter",
          nodeVersion: process.version,
          uptimeHours: Math.round(process.uptime() / 3600 * 10) / 10,
        },
      });
    }

    // Mock store metrics
    return NextResponse.json({
      stats: {
        totalUsers: mockDb.users.length,
        totalWorkspaces: mockDb.workspaces.length,
        totalReports: mockDb.abuseReports.length,
        activeSubscriptions: mockDb.subscriptions.filter((s) => s.status === "active").length,
        premiumUsers: mockDb.subscriptions.filter((s) => s.plan === "premium" || s.plan === "campus").length,
      },
      abuseReports: mockDb.abuseReports,
      systemHealth: {
        database: "Resilient In-Memory Engine (Set MONGODB_URI to connect Atlas)",
        authProvider: "Multi-Role Session Manager",
        aiProvider: process.env.GEMINI_API_KEY ? "Gemini 1.5 Live" : "Adaptive Startup Heuristic Engine",
        nodeVersion: process.version,
        uptimeHours: Math.round(process.uptime() / 3600 * 10) / 10,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
