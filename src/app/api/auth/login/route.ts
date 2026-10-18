import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { UserProfileModel } from "@/models/UserProfile";
import { mockDb } from "@/lib/mockDb";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const conn = await connectDB();
    let user: any = null;

    if (conn) {
      user = await UserProfileModel.findOne({ email: normalizedEmail }).lean();
    }

    if (!user) {
      user = mockDb.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    }

    if (!user) {
      return NextResponse.json(
        {
          error: `No registered account found with email "${normalizedEmail}". Please create an account to get started.`,
        },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        userId: user.userId,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
    });

    response.cookies.set("buildup_dev_user_id", user.userId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Login failed" }, { status: 500 });
  }
}
