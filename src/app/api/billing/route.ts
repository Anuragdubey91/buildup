import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { SubscriptionModel } from "@/models/Subscription";
import { mockDb } from "@/lib/mockDb";

export async function GET() {
  try {
    const user = await requireAuth();
    const conn = await connectDB();

    let sub: any = null;
    if (conn) {
      sub = await SubscriptionModel.findOne({ userId: user.userId }).lean();
    } else {
      sub = mockDb.subscriptions.find((s) => s.userId === user.userId);
    }

    if (!sub) {
      sub = {
        userId: user.userId,
        plan: "free",
        status: "active",
        aiMonthlyQuota: 25,
        aiUsedThisMonth: 4,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }

    const availablePlans = [
      {
        id: "free",
        name: "Student & Explorer",
        priceINR: 0,
        priceDisplay: "Free Forever",
        features: [
          "Up to 2 Startup Workspaces",
          "AI Co-Founder Discovery & Matching",
          "25 AI Idea & Assistant queries / month",
          "Full IdeaShield Private-by-Default security",
          "Customer Validation Hub & Feedback logging",
        ],
        isCurrent: sub.plan === "free",
      },
      {
        id: "premium",
        name: "Founder Pro",
        priceINR: 499,
        priceDisplay: "₹499 / month",
        features: [
          "Unlimited Startup Workspaces",
          "250 Advanced AI queries / month",
          "Priority Gemini 1.5 Pro inference",
          "Printable Pitch Deck PDF Export",
          "Advanced Financial Runway & Unit Economics Models",
          "Audit Log exports & priority investor badge",
        ],
        isCurrent: sub.plan === "premium",
      },
      {
        id: "campus",
        name: "Campus E-Cell Partner",
        priceINR: 2499,
        priceDisplay: "₹2,499 / semester",
        features: [
          "Bulk access for university cohorts & incubators",
          "Dedicated mentor review dashboard",
          "Unlimited AI queries for student founders",
          "Campus-wide verified badge",
        ],
        isCurrent: sub.plan === "campus",
      },
    ];

    return NextResponse.json({
      subscription: sub,
      availablePlans,
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_sample_key_id",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
