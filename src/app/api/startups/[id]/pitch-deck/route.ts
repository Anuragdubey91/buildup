import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PitchDeckModel } from "@/models/PitchDeck";
import { mockDb } from "@/lib/mockDb";
import { AIProviderAdapter } from "@/lib/ai/adapter";
import { PitchDeckType } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { access } = await requireWorkspaceRole(id, "viewer");
    const workspaceId = access.workspace._id || id;

    const conn = await connectDB();
    if (conn) {
      const deck = await PitchDeckModel.findOne({ workspaceId }).lean();
      return NextResponse.json({ deck: deck || null });
    }

    const deck = mockDb.pitchDecks.find((p) => p.workspaceId === workspaceId);
    return NextResponse.json({ deck: deck || null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { access } = await requireWorkspaceRole(id, "member");
    const workspace = access.workspace;
    const workspaceId = workspace._id || id;
    const body = await req.json();

    const { action, slides } = body;

    let targetSlides = slides;
    if (action === "generate" || !targetSlides || targetSlides.length === 0) {
      targetSlides = AIProviderAdapter.generatePitchDeckSlides(
        workspace.name,
        workspace.domain,
        workspace.tagline
      );
    }

    const deckPayload: Partial<PitchDeckType> = {
      workspaceId,
      slides: targetSlides,
      version: 1,
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const conn = await connectDB();
    if (conn) {
      const saved = await PitchDeckModel.findOneAndUpdate(
        { workspaceId },
        { $set: deckPayload },
        { new: true, upsert: true }
      );
      return NextResponse.json({ success: true, deck: saved });
    }

    const index = mockDb.pitchDecks.findIndex((p) => p.workspaceId === workspaceId);
    const mockDeck: PitchDeckType = {
      _id: "pd_" + Math.random().toString(36).substring(2, 9),
      ...deckPayload,
    } as PitchDeckType;

    if (index >= 0) {
      mockDb.pitchDecks[index] = mockDeck;
    } else {
      mockDb.pitchDecks.push(mockDeck);
    }

    return NextResponse.json({ success: true, deck: mockDeck });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
