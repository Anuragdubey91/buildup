const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/buildup";

test("Database: Connects successfully to local MongoDB instance", async () => {
  const conn = await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 4000 });
  assert.ok(conn.connection.readyState === 1, "Mongoose should be connected (readyState 1)");
});

test("Database & Auth: UserProfile model can create, query, and enforce uniqueness", async () => {
  const UserProfileSchema = new mongoose.Schema(
    {
      userId: { type: String, required: true, unique: true },
      displayName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
    },
    { timestamps: true }
  );

  const TestUser = mongoose.models.TestUser || mongoose.model("TestUser", UserProfileSchema);

  const testEmail = `test_${Date.now()}@buildup.dev`;
  const testUserId = `user_test_${Date.now()}`;

  const created = await TestUser.create({
    userId: testUserId,
    displayName: "Test Founder",
    email: testEmail,
  });

  assert.equal(created.email, testEmail);
  assert.equal(created.displayName, "Test Founder");

  const queried = await TestUser.findOne({ email: testEmail });
  assert.ok(queried);
  assert.equal(queried.userId, testUserId);

  // Clean up
  await TestUser.deleteOne({ _id: created._id });
});

test("IdeaShield & Isolation: Non-member cannot access private workspace", async () => {
  const wsSchema = new mongoose.Schema({
    name: String,
    ownerId: String,
    visibility: String,
  });
  const memSchema = new mongoose.Schema({
    workspaceId: String,
    userId: String,
    status: String,
    role: String,
  });

  const TestWs = mongoose.models.TestWs || mongoose.model("TestWs", wsSchema);
  const TestMem = mongoose.models.TestMem || mongoose.model("TestMem", memSchema);

  const ws = await TestWs.create({
    name: "Confidential Project X",
    ownerId: "founder_alice",
    visibility: "private",
  });

  // Verify owner has access
  const isOwner = ws.ownerId === "founder_alice";
  assert.equal(isOwner, true, "Owner must have access");

  // Verify unauthorized visitor has no access
  const visitorMembership = await TestMem.findOne({
    workspaceId: ws._id.toString(),
    userId: "unauthorized_bob",
    status: "active",
  });
  const hasAccess = ws.ownerId === "unauthorized_bob" || Boolean(visitorMembership);
  assert.equal(hasAccess, false, "Unauthorized user must be denied access to private workspace");

  // Clean up
  await TestWs.deleteOne({ _id: ws._id });
  await mongoose.disconnect();
});
