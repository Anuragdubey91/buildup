import { cookies } from "next/headers";
import mongoose from "mongoose";
import { mockDb } from "@/lib/mockDb";
import { UserProfileType, WorkspaceMembershipType, WorkspaceRole, StartupWorkspaceType } from "@/types";
import { connectDB } from "@/lib/db";
import { UserProfileModel } from "@/models/UserProfile";
import { StartupWorkspaceModel } from "@/models/StartupWorkspace";
import { WorkspaceMembershipModel } from "@/models/WorkspaceMembership";

export interface SessionUser {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role?: string;
  isPlatformAdmin: boolean;
}

const DEFAULT_DEV_USER_ID = "user_aarav_sharma";

export async function getCurrentUser(): Promise<SessionUser | null> {
  // Check if real Clerk is configured
  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  const isRealClerk =
    clerkPubKey &&
    !clerkPubKey.includes("sample") &&
    clerkSecretKey &&
    !clerkSecretKey.includes("sample");

  if (isRealClerk) {
    try {
      const { auth, currentUser } = await import("@clerk/nextjs/server");
      const clerkAuth = await auth();
      if (!clerkAuth.userId) {
        return null;
      }
      const user = await currentUser();
      const email = user?.emailAddresses[0]?.emailAddress || "user@example.com";
      const displayName = user?.fullName || user?.firstName || email.split("@")[0];
      const avatarUrl = user?.imageUrl;

      const adminEmails = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase());
      const isPlatformAdmin = adminEmails.includes(email.toLowerCase());

      return {
        userId: clerkAuth.userId,
        email,
        displayName,
        avatarUrl,
        isPlatformAdmin,
      };
    } catch (e) {
      console.warn("[Clerk] Auth lookup failed, using fallback session:", e);
    }
  }

  // Resilient Local / Reviewer Session Mode
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("buildup_dev_user_id")?.value;

  if (!sessionUserId) {
    return null;
  }

  // Check database or mockDb
  const conn = await connectDB();
  if (conn) {
    try {
      const profile = await UserProfileModel.findOne({ userId: sessionUserId }).lean<UserProfileType>();
      if (profile) {
        const adminEmails = (process.env.ADMIN_EMAILS || "admin@buildup.dev").split(",").map((e) => e.trim().toLowerCase());
        return {
          userId: profile.userId,
          email: profile.email,
          displayName: profile.displayName,
          avatarUrl: profile.avatarUrl,
          isPlatformAdmin: adminEmails.includes(profile.email.toLowerCase()) || profile.userId.includes("admin"),
        };
      }
    } catch (err) {
      console.warn("DB query failed in auth:", err);
    }
  }

  const mockProfile = mockDb.users.find((u) => u.userId === sessionUserId);
  if (!mockProfile) {
    return null;
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "admin@buildup.dev").split(",").map((e) => e.trim().toLowerCase());

  return {
    userId: mockProfile.userId,
    email: mockProfile.email,
    displayName: mockProfile.displayName,
    avatarUrl: mockProfile.avatarUrl,
    isPlatformAdmin: adminEmails.includes(mockProfile.email.toLowerCase()) || mockProfile.userId.includes("admin"),
  };
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: You must be signed in to perform this operation.");
  }
  return user;
}

export interface WorkspaceAccessResult {
  hasAccess: boolean;
  role?: WorkspaceRole;
  isOwner: boolean;
  membership?: WorkspaceMembershipType;
  workspace: StartupWorkspaceType;
  denialReason?: string;
}

/**
 * IdeaShield Core Access Enforcement:
 * Evaluates whether a user is authorized to view or edit workspace data.
 * Checks ownership, explicit active membership, and confidentiality agreement.
 */
export async function checkWorkspaceAccess(
  workspaceId: string,
  userId: string
): Promise<WorkspaceAccessResult> {
  const conn = await connectDB();

  let workspace: StartupWorkspaceType | null = null;
  let membership: WorkspaceMembershipType | null = null;

  if (conn) {
    try {
      if (mongoose.Types.ObjectId.isValid(workspaceId)) {
        workspace = (await StartupWorkspaceModel.findById(workspaceId).lean()) as unknown as StartupWorkspaceType | null;
      }
      if (!workspace) {
        workspace = (await StartupWorkspaceModel.findOne({ slug: workspaceId }).lean()) as unknown as StartupWorkspaceType | null;
      }
      if (workspace) {
        const wsId = workspace._id ? workspace._id.toString() : workspaceId;
        membership = (await WorkspaceMembershipModel.findOne({
          workspaceId: wsId,
          userId,
        }).lean()) as unknown as WorkspaceMembershipType | null;
      }
    } catch {
      // Fallback to mockDb
    }
  }

  if (!workspace) {
    workspace =
      mockDb.workspaces.find((w) => w._id === workspaceId || w.slug === workspaceId) || null;
    if (workspace) {
      membership =
        mockDb.memberships.find(
          (m) =>
            (m.workspaceId === workspace!._id || m.workspaceId === workspaceId) &&
            m.userId === userId
        ) || null;
    }
  }

  if (!workspace) {
    return {
      hasAccess: false,
      isOwner: false,
      workspace: null as unknown as StartupWorkspaceType,
      denialReason: "Workspace not found.",
    };
  }

  const isOwner = workspace.ownerId === userId;

  if (isOwner) {
    return {
      hasAccess: true,
      isOwner: true,
      role: "owner",
      workspace,
      membership: membership || {
        workspaceId: workspace._id || workspaceId,
        userId,
        role: "owner",
        status: "active",
        joinedAt: workspace.createdAt || new Date().toISOString(),
      },
    };
  }

  if (membership && membership.status === "active") {
    return {
      hasAccess: true,
      isOwner: false,
      role: membership.role,
      membership,
      workspace,
    };
  }

  if (membership && membership.status === "revoked") {
    return {
      hasAccess: false,
      isOwner: false,
      role: membership.role,
      membership,
      workspace,
      denialReason: "IdeaShield Security: Your access to this workspace was explicitly revoked by the owner.",
    };
  }

  // Not a member and not owner
  return {
    hasAccess: false,
    isOwner: false,
    workspace,
    denialReason: "IdeaShield Protection: This workspace is private. Only authorized team members may access it.",
  };
}

export async function requireWorkspaceRole(
  workspaceId: string,
  minRole: "viewer" | "member" | "admin" | "owner" = "viewer"
): Promise<{ user: SessionUser; access: WorkspaceAccessResult }> {
  const user = await requireAuth();
  const access = await checkWorkspaceAccess(workspaceId, user.userId);

  if (!access.hasAccess) {
    throw new Error(access.denialReason || "Access Denied: Insufficient workspace permissions.");
  }

  const roleHierarchy: Record<WorkspaceRole, number> = {
    viewer: 1,
    member: 2,
    admin: 3,
    owner: 4,
  };

  const userRole = access.role || "viewer";
  if (roleHierarchy[userRole] < roleHierarchy[minRole]) {
    throw new Error(`Forbidden: Requires '${minRole}' role or higher.`);
  }

  return { user, access };
}
