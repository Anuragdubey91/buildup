import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ConnectionRequestModel } from "@/models/ConnectionRequest";
import { mockDb } from "@/lib/mockDb";

export async function GET() {
  try {
    const user = await requireAuth();
    const conn = await connectDB();

    if (conn) {
      const connections = await ConnectionRequestModel.find({
        $or: [{ senderId: user.userId }, { receiverId: user.userId }],
      })
        .sort({ createdAt: -1 })
        .lean();
      return NextResponse.json({ connections });
    }

    const mockConnections = mockDb.connections.filter(
      (c) => c.senderId === user.userId || c.receiverId === user.userId
    );
    return NextResponse.json({ connections: mockConnections });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { receiverId, message } = await req.json();

    if (!receiverId) {
      return NextResponse.json({ error: "receiverId is required" }, { status: 400 });
    }
    if (receiverId === user.userId) {
      return NextResponse.json({ error: "Cannot send connection request to yourself" }, { status: 400 });
    }

    const conn = await connectDB();
    if (conn) {
      // Check for existing
      const existing = await ConnectionRequestModel.findOne({
        senderId: user.userId,
        receiverId,
        status: "pending",
      });
      if (existing) {
        return NextResponse.json({ error: "Connection request already pending" }, { status: 400 });
      }

      const created = await ConnectionRequestModel.create({
        senderId: user.userId,
        receiverId,
        message: message || "Hi! I saw your profile on BuildUp and would love to connect.",
        status: "pending",
      });

      return NextResponse.json({ success: true, connection: created });
    }

    // Mock store
    const newConn = {
      _id: "conn_" + Math.random().toString(36).substring(2, 9),
      senderId: user.userId,
      receiverId,
      message: message || "Hi! I saw your profile on BuildUp and would love to connect.",
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    };
    mockDb.connections.push(newConn);

    return NextResponse.json({ success: true, connection: newConn });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { connectionId, action } = await req.json();

    if (!connectionId || !["accept", "decline", "cancel"].includes(action)) {
      return NextResponse.json({ error: "Valid connectionId and action required" }, { status: 400 });
    }

    const newStatus = action === "accept" ? "accepted" : action === "decline" ? "declined" : "cancelled";

    const conn = await connectDB();
    if (conn) {
      const updated = await ConnectionRequestModel.findByIdAndUpdate(
        connectionId,
        { status: newStatus, respondedAt: new Date() },
        { new: true }
      );
      return NextResponse.json({ success: true, connection: updated });
    }

    const index = mockDb.connections.findIndex((c) => c._id === connectionId);
    if (index >= 0) {
      mockDb.connections[index].status = newStatus;
      mockDb.connections[index].respondedAt = new Date().toISOString();
      return NextResponse.json({ success: true, connection: mockDb.connections[index] });
    }

    return NextResponse.json({ error: "Connection request not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
