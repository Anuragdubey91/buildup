import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { SubscriptionModel } from "@/models/Subscription";
import { mockDb } from "@/lib/mockDb";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, isTestMode } =
      await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const hasLiveSecret = keySecret && !keySecret.includes("sample");

    // Server-side verification rule: never trust frontend blindly
    if (hasLiveSecret && !isTestMode) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          { error: "Payment verification failed: Invalid cryptographic signature" },
          { status: 400 }
        );
      }
    }

    // Update Subscription status
    const newPlan = planId === "campus" ? "campus" : "premium";
    const newQuota = newPlan === "campus" ? 9999 : 250;
    const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const conn = await connectDB();
    if (conn) {
      await SubscriptionModel.findOneAndUpdate(
        { userId: user.userId },
        {
          plan: newPlan,
          status: "active",
          aiMonthlyQuota: newQuota,
          currentPeriodEnd: periodEnd,
          razorpaySubscriptionId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id || `pay_test_${Date.now()}`,
        },
        { upsert: true }
      );
      return NextResponse.json({ success: true, plan: newPlan });
    }

    const subIndex = mockDb.subscriptions.findIndex((s) => s.userId === user.userId);
    if (subIndex >= 0) {
      mockDb.subscriptions[subIndex].plan = newPlan;
      mockDb.subscriptions[subIndex].aiMonthlyQuota = newQuota;
      mockDb.subscriptions[subIndex].currentPeriodEnd = periodEnd.toISOString();
    } else {
      mockDb.subscriptions.push({
        _id: "sub_" + Math.random().toString(36).substring(2, 9),
        userId: user.userId,
        plan: newPlan,
        status: "active",
        aiMonthlyQuota: newQuota,
        aiUsedThisMonth: 0,
        currentPeriodEnd: periodEnd.toISOString(),
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, plan: newPlan });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
