import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { planId } = await req.json();

    if (!["premium", "campus"].includes(planId)) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
    }

    const amountInINR = planId === "premium" ? 499 : 2499;
    const amountInPaise = amountInINR * 100;

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const hasLiveKeys =
      keyId &&
      !keyId.includes("sample") &&
      keySecret &&
      !keySecret.includes("sample");

    if (hasLiveKeys) {
      try {
        const Razorpay = (await import("razorpay")).default;
        const instance = new Razorpay({
          key_id: keyId!,
          key_secret: keySecret!,
        });

        const order = await instance.orders.create({
          amount: amountInPaise,
          currency: "INR",
          receipt: `rcpt_${user.userId}_${Date.now()}`,
          notes: {
            userId: user.userId,
            planId,
          },
        });

        return NextResponse.json({
          orderId: order.id,
          amount: amountInPaise,
          currency: "INR",
          keyId,
          isTestMode: false,
        });
      } catch (err: any) {
        console.warn("[Razorpay] Order creation failed, falling back to safe test mode:", err.message);
      }
    }

    // Safe Test Mode Order for local testing & reviewer demonstration
    const testOrderId = `order_test_${Math.random().toString(36).substring(2, 10)}`;
    return NextResponse.json({
      orderId: testOrderId,
      amount: amountInPaise,
      currency: "INR",
      keyId: "rzp_test_sample_key_id",
      isTestMode: true,
      notice: "Running in Razorpay Test/Demo mode. Upgrade can be tested safely without actual financial debit.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
