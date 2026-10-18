const test = require("node:test");
const assert = require("node:assert/strict");

// Pure unit test logic verifying IdeaShield core security rules
function evaluateIdeaShieldAccess(workspace, userId, memberships) {
  if (!workspace) {
    return { hasAccess: false, reason: "Workspace not found" };
  }

  // Rule 1: Owner always has full access
  if (workspace.ownerId === userId) {
    return { hasAccess: true, role: "owner" };
  }

  // Rule 2: Active membership check
  const member = memberships.find(
    (m) => m.workspaceId === workspace.id && m.userId === userId
  );

  if (member) {
    if (member.status === "active") {
      return { hasAccess: true, role: member.role };
    }
    if (member.status === "revoked") {
      return {
        hasAccess: false,
        reason: "Access revoked by owner",
      };
    }
  }

  // Rule 3: Private by default - non-members cannot read
  if (workspace.visibility === "private") {
    return {
      hasAccess: false,
      reason: "IdeaShield: Private workspace. Unauthorized user denied.",
    };
  }

  return { hasAccess: false, reason: "Access denied" };
}

function evaluateInvitationStatus(invitation, now = Date.now()) {
  if (invitation.status !== "pending") {
    return { valid: false, reason: `Invitation is already ${invitation.status}` };
  }
  const expiryTime = new Date(invitation.expiresAt).getTime();
  if (now > expiryTime) {
    return { valid: false, reason: "Invitation has expired" };
  }
  return { valid: true };
}

test("IdeaShield: Owner has unconditional full workspace access", () => {
  const ws = { id: "ws_1", ownerId: "founder_alice", visibility: "private" };
  const res = evaluateIdeaShieldAccess(ws, "founder_alice", []);
  assert.equal(res.hasAccess, true);
  assert.equal(res.role, "owner");
});

test("IdeaShield: Non-member is strictly denied access to private workspace (No IDOR)", () => {
  const ws = { id: "ws_secret_123", ownerId: "founder_alice", visibility: "private" };
  // Attacker or unrelated user Bob tries to access by knowing URL/ID
  const res = evaluateIdeaShieldAccess(ws, "attacker_bob", []);
  assert.equal(res.hasAccess, false);
  assert.match(res.reason, /IdeaShield: Private workspace/);
});

test("IdeaShield: Authorized team member with active status is granted access", () => {
  const ws = { id: "ws_1", ownerId: "founder_alice", visibility: "private" };
  const memberships = [
    { workspaceId: "ws_1", userId: "team_carol", role: "member", status: "active" },
  ];
  const res = evaluateIdeaShieldAccess(ws, "team_carol", memberships);
  assert.equal(res.hasAccess, true);
  assert.equal(res.role, "member");
});

test("IdeaShield: Revoked team member is denied access even with past membership record", () => {
  const ws = { id: "ws_1", ownerId: "founder_alice", visibility: "private" };
  const memberships = [
    { workspaceId: "ws_1", userId: "ex_partner_dan", role: "member", status: "revoked" },
  ];
  const res = evaluateIdeaShieldAccess(ws, "ex_partner_dan", memberships);
  assert.equal(res.hasAccess, false);
  assert.match(res.reason, /revoked/);
});

test("IdeaShield: Expired workspace invitations cannot be accepted", () => {
  const expiredInvite = {
    token: "token_abc",
    status: "pending",
    expiresAt: new Date(Date.now() - 3600 * 1000).toISOString(), // 1 hour ago
  };
  const res = evaluateInvitationStatus(expiredInvite);
  assert.equal(res.valid, false);
  assert.equal(res.reason, "Invitation has expired");
});

test("IdeaShield: Valid pending invitation is accepted", () => {
  const validInvite = {
    token: "token_xyz",
    status: "pending",
    expiresAt: new Date(Date.now() + 86400 * 1000).toISOString(), // Tomorrow
  };
  const res = evaluateInvitationStatus(validInvite);
  assert.equal(res.valid, true);
});
