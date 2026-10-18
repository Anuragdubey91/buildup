import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceRole } from "@/lib/auth";
import { AIProviderAdapter } from "@/lib/ai/adapter";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, access } = await requireWorkspaceRole(id, "viewer");
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const workspace = access.workspace;
    const workspaceContext = {
      name: workspace.name,
      domain: workspace.domain,
      stage: workspace.stage,
      tagline: workspace.tagline,
    };

    const aiResponse = await AIProviderAdapter.chatAssistant(
      user.userId,
      workspaceContext,
      messages
    );

    if (!aiResponse.success) {
      return NextResponse.json({ error: aiResponse.error || "Assistant unavailable" }, { status: 429 });
    }

    return NextResponse.json({
      reply: aiResponse.data,
      isMock: aiResponse.isMock,
      providerNotice: aiResponse.providerNotice,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
