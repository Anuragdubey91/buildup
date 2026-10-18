import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { UserProfileModel } from "@/models/UserProfile";
import { ConnectionRequestModel } from "@/models/ConnectionRequest";
import { mockDb } from "@/lib/mockDb";
import { calculateCompatibility } from "@/lib/matching";
import { UserProfileType } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const currentUserSession = await getCurrentUser();
    const searchParams = req.nextUrl.searchParams;
    const domainFilter = searchParams.get("domain");
    const roleFilter = searchParams.get("role");
    const searchKeyword = searchParams.get("q")?.toLowerCase();

    const conn = await connectDB();
    let allUsers: UserProfileType[] = [];

    if (conn) {
      allUsers = (await UserProfileModel.find({ isPublicInDiscovery: true }).lean()) as unknown as UserProfileType[];
    } else {
      allUsers = mockDb.users.filter((u) => u.isPublicInDiscovery);
    }

    const currentUserId = currentUserSession?.userId;
    const requestingUser = currentUserId
      ? allUsers.find((u) => u.userId === currentUserId) || allUsers[0]
      : null;

    // Filter out self if logged in
    let candidates = currentUserId
      ? allUsers.filter((u) => u.userId !== currentUserId)
      : allUsers;

    if (domainFilter && domainFilter !== "all") {
      candidates = candidates.filter((u) =>
        (u.preferredDomains || []).some((d) => d.toLowerCase().includes(domainFilter.toLowerCase()))
      );
    }

    if (roleFilter && roleFilter !== "all") {
      candidates = candidates.filter((u) =>
        (u.preferredRoles || []).some((r) => r.toLowerCase().includes(roleFilter.toLowerCase()))
      );
    }

    if (searchKeyword) {
      candidates = candidates.filter(
        (u) =>
          u.displayName.toLowerCase().includes(searchKeyword) ||
          u.bio?.toLowerCase().includes(searchKeyword) ||
          u.skills.some((s) => s.name.toLowerCase().includes(searchKeyword))
      );
    }

    // Load connection requests
    let connectionRequests: any[] = [];
    if (currentUserId) {
      if (conn) {
        connectionRequests = await ConnectionRequestModel.find({
          $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
        }).lean();
      } else {
        connectionRequests = mockDb.connections.filter(
          (c) => c.senderId === currentUserId || c.receiverId === currentUserId
        );
      }
    }

    // Compute compatibility for each candidate
    const candidatesWithMatch = candidates.map((candidate) => {
      const compatibility = requestingUser
        ? calculateCompatibility(requestingUser, candidate)
        : {
            overallScore: 82,
            rating: "Strong" as const,
            factors: [],
            strengths: ["Domain synergy", "Complementary capabilities"],
            complementarySkills: [],
            sharedDomains: candidate.preferredDomains || [],
            potentialFrictions: [],
            recommendation: "Sign in to calculate personalized multi-factor compatibility.",
          };
      const existingConn = connectionRequests.find(
        (c) =>
          (c.senderId === currentUserId && c.receiverId === candidate.userId) ||
          (c.senderId === candidate.userId && c.receiverId === currentUserId)
      );

      return {
        ...candidate,
        compatibility,
        connectionStatus: existingConn ? existingConn.status : "none",
        connectionId: existingConn?._id || existingConn?.id,
        isOutgoing: existingConn?.senderId === currentUserId,
      };
    });

    // Sort by compatibility score descending
    candidatesWithMatch.sort((a, b) => b.compatibility.overallScore - a.compatibility.overallScore);

    return NextResponse.json({ candidates: candidatesWithMatch });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
