import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  const isRealClerk = Boolean(
    clerkPubKey &&
      !clerkPubKey.includes("sample") &&
      clerkPubKey.startsWith("pk_") &&
      clerkSecretKey &&
      !clerkSecretKey.includes("sample")
  );

  const geminiKey = process.env.GEMINI_API_KEY;
  const isRealGemini = Boolean(geminiKey && !geminiKey.includes("sample") && geminiKey.length > 5);

  const conn = await connectDB();
  const isMongoConnected = Boolean(conn);

  return NextResponse.json({
    database: {
      status: isMongoConnected ? "connected" : "fallback_memory",
      provider: "MongoDB (Local Port 27017)",
      target: isMongoConnected ? "buildup" : "In-Memory Store",
      missingNotice: isMongoConnected
        ? undefined
        : "Set MONGODB_URI in .env.local to persist data in MongoDB.",
    },
    auth: {
      mode: isRealClerk ? "clerk" : "buildup_local_session",
      clerkConfigured: isRealClerk,
      clerkNotice: isRealClerk
        ? "Clerk Live Authentication active."
        : "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is sample or missing. BuildUp Local Session Authentication is active with MongoDB persistence.",
      activeSessionCookie: "buildup_dev_user_id",
    },
    ai: {
      provider: isRealGemini ? "gemini" : "heuristic",
      model: process.env.AI_MODEL_NAME || "gemini-1.5-flash",
      hasLiveKey: isRealGemini,
      notice: isRealGemini
        ? "Live Google Gemini API active."
        : "GEMINI_API_KEY is empty in .env.local. BuildUp Smart Heuristic Engine is active for instant validation.",
    },
  });
}
