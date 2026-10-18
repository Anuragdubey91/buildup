const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/buildup";

// Schema definitions
const UserProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    avatarUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    skills: [
      {
        name: { type: String, required: true },
        proficiency: { type: String, enum: ["beginner", "intermediate", "expert"], default: "intermediate" },
        verified: { type: Boolean, default: false },
      },
    ],
    interests: [{ type: String }],
    preferredDomains: [{ type: String }],
    goals: [{ type: String }],
    experienceLevel: { type: String, default: "early_career" },
    preferredRoles: [{ type: String }],
    workingStyle: { type: String, default: "agile" },
    weeklyHours: { type: Number, default: 20 },
    collaborationMode: { type: String, default: "remote" },
    isPublicInDiscovery: { type: Boolean, default: true, index: true },
    contactPreference: { type: String, default: "platform_message" },
    linkedinUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    portfolioUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const StartupWorkspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    domain: { type: String, required: true, index: true },
    stage: { type: String, default: "idea_discovery" },
    ownerId: { type: String, required: true, index: true },
    visibility: { type: String, enum: ["private", "preview", "public"], default: "private", index: true },
    previewFields: {
      showTagline: { type: Boolean, default: true },
      showDomain: { type: Boolean, default: true },
      showStage: { type: Boolean, default: true },
      showProblems: { type: Boolean, default: false },
      showMilestones: { type: Boolean, default: false },
      showPitchSummary: { type: Boolean, default: false },
    },
    confidentialityAgreementRequired: { type: Boolean, default: false },
    confidentialityTemplate: { type: String, default: "" },
    targetLaunchDate: { type: String },
  },
  { timestamps: true }
);

const WorkspaceMembershipSchema = new mongoose.Schema(
  {
    workspaceId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    role: { type: String, enum: ["owner", "admin", "member", "viewer"], default: "member" },
    status: { type: String, enum: ["active", "suspended", "revoked"], default: "active", index: true },
    joinedAt: { type: Date, default: Date.now },
    ndaSignedAt: { type: Date },
    invitedBy: { type: String },
    title: { type: String, default: "Team Member" },
  },
  { timestamps: true }
);

const RoadmapSchema = new mongoose.Schema(
  {
    workspaceId: { type: String, required: true, unique: true, index: true },
    currentStage: { type: String, default: "idea_discovery" },
    milestones: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        stage: { type: String, required: true },
        description: { type: String, default: "" },
        priority: { type: String, default: "medium" },
        suggestedTimelineWeeks: { type: Number, default: 2 },
        deadline: { type: String },
        status: { type: String, default: "todo" },
        dependencies: [{ type: String }],
      },
    ],
    tasks: [
      {
        id: { type: String, required: true },
        milestoneId: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: "" },
        assignedToUserId: { type: String },
        priority: { type: String, default: "medium" },
        deadline: { type: String },
        status: { type: String, default: "todo" },
        createdAt: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const IdeaValidationReportSchema = new mongoose.Schema(
  {
    workspaceId: { type: String, required: true, index: true },
    createdById: { type: String, required: true },
    idea: { type: String, required: true },
    targetAudience: { type: String, required: true },
    problem: { type: String, required: true },
    solution: { type: String, required: true },
    competitors: { type: String, default: "" },
    revenueModel: { type: String, default: "" },
    assumptions: { type: String, default: "" },
    validationEvidence: { type: String, default: "" },
    problemClarityScore: { type: Number, default: 75 },
    viabilityScore: { type: Number, default: 70 },
    targetCustomerAnalysis: { type: String, default: "" },
    mainAssumptions: [{ type: String }],
    potentialRisks: [{ risk: String, severity: String, mitigation: String }],
    competitorConsiderations: { type: String, default: "" },
    possibleDifferentiation: [{ type: String }],
    suggestedExperiments: [{ name: String, hypothesis: String, metric: String, timelineDays: Number }],
    customerQuestions: [{ type: String }],
    suggestedMvp: [{ coreFeature: String, description: String, effort: String }],
    nextSteps: [{ type: String }],
    isAIGenerated: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CustomerValidationSchema = new mongoose.Schema(
  {
    workspaceId: { type: String, required: true, unique: true, index: true },
    customerPersonas: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        role: { type: String, default: "" },
        demographics: { type: String, default: "" },
        coreFrustrations: [{ type: String }],
        goals: [{ type: String }],
      },
    ],
    interviewQuestions: [{ type: String }],
    surveyQuestions: [{ type: String }],
    feedbackRecords: [
      {
        id: { type: String, required: true },
        intervieweeName: { type: String, required: true },
        intervieweeRole: { type: String, default: "" },
        date: { type: String, required: true },
        category: { type: String, default: "problem_validation" },
        notes: { type: String, default: "" },
        painPoints: [{ type: String }],
        validationStatus: { type: String, default: "validated" },
        consentObtained: { type: Boolean, default: true },
        source: { type: String, default: "in_person" },
      },
    ],
    painPointSummary: { type: String },
    overallDemandConfidence: { type: String, default: "moderate" },
  },
  { timestamps: true }
);

const BusinessModelSchema = new mongoose.Schema(
  {
    workspaceId: { type: String, required: true, unique: true, index: true },
    customerSegments: [{ type: String }],
    customerProblems: [{ type: String }],
    valueProposition: [{ type: String }],
    solution: [{ type: String }],
    revenueStreams: [{ type: String }],
    costStructure: [{ type: String }],
    distributionChannels: [{ type: String }],
    customerRelationships: [{ type: String }],
    keyMetrics: [{ type: String }],
    mvpFeatures: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, default: "" },
        category: { type: String, default: "must_have" },
        status: { type: String, default: "backlog" },
      },
    ],
  },
  { timestamps: true }
);

const BudgetPlanSchema = new mongoose.Schema(
  {
    workspaceId: { type: String, required: true, unique: true, index: true },
    currency: { type: String, default: "INR" },
    initialCash: { type: Number, default: 100000 },
    oneTimeCosts: [{ id: String, name: String, amount: Number, category: String }],
    monthlyExpenses: [{ id: String, name: String, amount: Number, category: String }],
    monthlyRevenues: [{ id: String, name: String, amount: Number, notes: String }],
    fundingReceived: [{ id: String, source: String, amount: Number, date: String }],
    targetAveragePricePerCustomer: { type: Number, default: 500 },
    variableCostPerCustomer: { type: Number, default: 100 },
  },
  { timestamps: true }
);

const PitchDeckSchema = new mongoose.Schema(
  {
    workspaceId: { type: String, required: true, unique: true, index: true },
    slides: [
      {
        slideNumber: { type: Number, required: true },
        title: { type: String, required: true },
        subtitle: { type: String, default: "" },
        bulletPoints: [{ type: String }],
        speakerNotes: { type: String, default: "" },
      },
    ],
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const EquityScenarioSchema = new mongoose.Schema(
  {
    workspaceId: { type: String, required: true, index: true },
    scenarioName: { type: String, default: "Initial Founder Split" },
    founders: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        role: { type: String, required: true },
        timeCommitmentHoursPerWeek: { type: Number, default: 40 },
        cashInvested: { type: Number, default: 0 },
        ipContributionScore: { type: Number, default: 3 },
        executionRiskScore: { type: Number, default: 3 },
        responsibilitiesScore: { type: Number, default: 3 },
        calculatedSharePct: { type: Number, default: 50 },
      },
    ],
    optionPoolPct: { type: Number, default: 10 },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    plan: { type: String, default: "free" },
    status: { type: String, default: "active" },
    aiMonthlyQuota: { type: Number, default: 25 },
    aiUsedThisMonth: { type: Number, default: 0 },
    currentPeriodEnd: { type: Date },
  },
  { timestamps: true }
);

const SecurityAuditEventSchema = new mongoose.Schema(
  {
    workspaceId: { type: String, required: true, index: true },
    actorId: { type: String, required: true, index: true },
    actorName: { type: String, required: true },
    action: { type: String, required: true, index: true },
    details: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

async function runSeed() {
  console.log(`Connecting to MongoDB at: ${MONGODB_URI}...`);
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully to MongoDB.");

  // Clean temp collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  const tempNames = ["testws", "testusers", "testmems", "tempws"];
  for (const c of collections) {
    if (tempNames.includes(c.name)) {
      await mongoose.connection.db.dropCollection(c.name);
    }
  }

  const UserProfile = mongoose.models.UserProfile || mongoose.model("UserProfile", UserProfileSchema);
  const StartupWorkspace = mongoose.models.StartupWorkspace || mongoose.model("StartupWorkspace", StartupWorkspaceSchema);
  const WorkspaceMembership = mongoose.models.WorkspaceMembership || mongoose.model("WorkspaceMembership", WorkspaceMembershipSchema);
  const Roadmap = mongoose.models.Roadmap || mongoose.model("Roadmap", RoadmapSchema);
  const IdeaValidationReport = mongoose.models.IdeaValidationReport || mongoose.model("IdeaValidationReport", IdeaValidationReportSchema);
  const CustomerValidation = mongoose.models.CustomerValidation || mongoose.model("CustomerValidation", CustomerValidationSchema);
  const BusinessModel = mongoose.models.BusinessModel || mongoose.model("BusinessModel", BusinessModelSchema);
  const BudgetPlan = mongoose.models.BudgetPlan || mongoose.model("BudgetPlan", BudgetPlanSchema);
  const PitchDeck = mongoose.models.PitchDeck || mongoose.model("PitchDeck", PitchDeckSchema);
  const EquityScenario = mongoose.models.EquityScenario || mongoose.model("EquityScenario", EquityScenarioSchema);
  const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);
  const SecurityAuditEvent = mongoose.models.SecurityAuditEvent || mongoose.model("SecurityAuditEvent", SecurityAuditEventSchema);

  // Check if users already seeded
  const existingUsers = await UserProfile.countDocuments();
  if (existingUsers > 0) {
    console.log(`Database already contains ${existingUsers} user profiles. Skipping seed.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  console.log("Seeding initial BuildUp database...");

  // 1. Seed Users
  await UserProfile.create([
    {
      userId: "user_aarav_sharma",
      displayName: "Aarav Sharma",
      email: "aarav@buildup.dev",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      bio: "Full-stack engineer passionate about decentralized education tools and developer infrastructure. Looking for a product/growth co-founder.",
      skills: [
        { name: "Full-Stack Development", proficiency: "expert", verified: true },
        { name: "Next.js & React", proficiency: "expert", verified: true },
        { name: "System Architecture", proficiency: "expert", verified: true },
        { name: "Python & AI Models", proficiency: "intermediate", verified: false },
      ],
      interests: ["EdTech", "Developer Tools", "AI & Automation", "FinTech"],
      preferredDomains: ["EdTech", "B2B SaaS", "Developer Infrastructure"],
      goals: ["Build a sustainable bootstrapped MVP", "Raise pre-seed within 9 months"],
      experienceLevel: "senior",
      preferredRoles: ["CTO", "Technical Co-Founder"],
      workingStyle: "agile",
      weeklyHours: 35,
      collaborationMode: "remote",
      isPublicInDiscovery: true,
      contactPreference: "platform_message",
      linkedinUrl: "https://linkedin.com/in/aarav-sharma-demo",
      githubUrl: "https://github.com/aarav-demo",
    },
    {
      userId: "user_priya_patel",
      displayName: "Priya Patel",
      email: "priya@buildup.dev",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
      bio: "Growth marketer turned product strategist. Scaled consumer apps from 0 to 50k MAU. Skilled in user interviews, CAC/LTV economics, and funnel design.",
      skills: [
        { name: "Growth Marketing", proficiency: "expert", verified: true },
        { name: "Customer Research", proficiency: "expert", verified: true },
        { name: "UI/UX & Wireframing", proficiency: "intermediate", verified: false },
        { name: "Data Analytics", proficiency: "intermediate", verified: true },
      ],
      interests: ["Marketplaces", "Creator Economy", "EdTech", "B2B SaaS"],
      preferredDomains: ["EdTech", "Marketplaces", "Social Platforms"],
      goals: ["Launch MVP in 60 days", "Run 50 rigorous user interviews"],
      experienceLevel: "seasoned_founder",
      preferredRoles: ["CEO", "Head of Product", "Co-Founder"],
      workingStyle: "agile",
      weeklyHours: 40,
      collaborationMode: "hybrid",
      isPublicInDiscovery: true,
      contactPreference: "platform_message",
      linkedinUrl: "https://linkedin.com/in/priya-patel-demo",
    },
    {
      userId: "user_rohan_mehta",
      displayName: "Rohan Mehta",
      email: "rohan@buildup.dev",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
      bio: "Chartered accountant & ex-investment banking analyst. Passionate about financial inclusion and startup unit economics.",
      skills: [
        { name: "Financial Modeling", proficiency: "expert", verified: true },
        { name: "Unit Economics", proficiency: "expert", verified: true },
        { name: "Investor Relations", proficiency: "expert", verified: false },
      ],
      interests: ["FinTech", "SME Lending", "WealthTech"],
      preferredDomains: ["FinTech", "B2B SaaS"],
      goals: ["Build compliance-ready fintech engine"],
      experienceLevel: "senior",
      preferredRoles: ["CFO", "Co-Founder & COO"],
      workingStyle: "structured",
      weeklyHours: 25,
      collaborationMode: "remote",
      isPublicInDiscovery: true,
      contactPreference: "email",
      linkedinUrl: "https://linkedin.com/in/rohan-mehta-demo",
    },
    {
      userId: "user_admin",
      displayName: "System Administrator",
      email: "admin@buildup.dev",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80",
      bio: "Platform operations & compliance overseer for BuildUp.",
      skills: [
        { name: "Platform Security", proficiency: "expert", verified: true },
        { name: "Audit & Compliance", proficiency: "expert", verified: true },
      ],
      interests: ["Platform Security", "Infrastructure"],
      preferredDomains: ["Platform Governance"],
      goals: ["Maintain zero IP leakage across IdeaShield workspaces"],
      experienceLevel: "senior",
      preferredRoles: ["Platform Administrator"],
      workingStyle: "structured",
      weeklyHours: 40,
      collaborationMode: "remote",
      isPublicInDiscovery: false,
      contactPreference: "platform_message",
    },
  ]);

  // 2. Seed Workspaces
  const cb = await StartupWorkspace.create({
    name: "CampusBazaar",
    slug: "campus-bazaar-demo",
    tagline: "Peer-to-peer verified campus marketplace for textbooks, electronics & dorm essentials",
    description: "CampusBazaar solves hyper-local campus commerce with .edu verified student profiles, UPI instant settlements, and designated campus safe pickup zones.",
    domain: "EdTech & Marketplaces",
    stage: "mvp_planning",
    ownerId: "user_aarav_sharma",
    visibility: "private",
    previewFields: {
      showTagline: true,
      showDomain: true,
      showStage: true,
      showProblems: false,
      showMilestones: false,
      showPitchSummary: false,
    },
    confidentialityAgreementRequired: true,
    confidentialityTemplate: "CONFIDENTIALITY AND NON-DISCLOSURE DISCUSSION AID\n\nThe parties agree that discussions, roadmaps, customer insights, and strategy documents shared within this workspace represent proprietary ideas. Receiving parties agree not to disclose or commercially misappropriate confidential information without written agreement.",
    targetLaunchDate: "2026-11-15",
  });

  const hp = await StartupWorkspace.create({
    name: "HealthPulse Analytics",
    slug: "healthpulse-analytics",
    tagline: "AI telemetry for rural clinics and diagnostic lab workflows",
    description: "Lightweight offline-first diagnostic sync system for tier-2/3 tier healthcare centers.",
    domain: "HealthTech & Diagnostics",
    stage: "problem_validation",
    ownerId: "user_aarav_sharma",
    visibility: "private",
    previewFields: {
      showTagline: true,
      showDomain: true,
      showStage: true,
      showProblems: false,
      showMilestones: false,
      showPitchSummary: false,
    },
    confidentialityAgreementRequired: true,
    confidentialityTemplate: "CONFIDENTIALITY AND NON-DISCLOSURE DISCUSSION AID",
    targetLaunchDate: "2027-01-20",
  });

  const cbId = cb._id.toString();
  const hpId = hp._id.toString();

  // 3. Seed Memberships
  await WorkspaceMembership.create([
    {
      workspaceId: cbId,
      userId: "user_aarav_sharma",
      role: "owner",
      status: "active",
      title: "Founder & CTO",
      ndaSignedAt: new Date(),
    },
    {
      workspaceId: cbId,
      userId: "user_priya_patel",
      role: "admin",
      status: "active",
      title: "Product & Growth Lead",
      ndaSignedAt: new Date(),
    },
    {
      workspaceId: hpId,
      userId: "user_aarav_sharma",
      role: "owner",
      status: "active",
      title: "Solo Founder",
      ndaSignedAt: new Date(),
    },
  ]);

  // 4. Seed Roadmap
  await Roadmap.create({
    workspaceId: cbId,
    currentStage: "mvp_planning",
    milestones: [
      {
        id: "ms_1",
        title: "Conduct 40 On-Campus User Discovery Interviews",
        stage: "customer_research",
        description: "Validate willingness to buy/sell secondhand tech and coursebooks within 2 km radius.",
        priority: "critical",
        suggestedTimelineWeeks: 2,
        deadline: "2026-10-25",
        status: "completed",
        dependencies: [],
      },
      {
        id: "ms_2",
        title: "Build Core Listing & Real-time Chat Engine",
        stage: "mvp_development",
        description: "Student auth with .edu verification, photo uploads, and internal buyer-seller chat.",
        priority: "high",
        suggestedTimelineWeeks: 4,
        deadline: "2026-11-10",
        status: "in_progress",
        dependencies: ["ms_1"],
      },
      {
        id: "ms_3",
        title: "Pilot Launch in Delhi University North Campus",
        stage: "launch",
        description: "Onboard 200 student sellers and hit ₹50,000 GMV in first 14 days.",
        priority: "high",
        suggestedTimelineWeeks: 2,
        deadline: "2026-11-30",
        status: "todo",
        dependencies: ["ms_2"],
      },
    ],
    tasks: [
      {
        id: "tsk_1",
        milestoneId: "ms_2",
        title: "Integrate College Email Verification Gate",
        description: "Verify institutional domain with OTP token before enabling seller listings.",
        assignedToUserId: "user_aarav_sharma",
        priority: "high",
        deadline: "2026-10-30",
        status: "done",
        createdAt: new Date().toISOString(),
      },
      {
        id: "tsk_2",
        milestoneId: "ms_2",
        title: "Design Physical Safe-Zone Pickup Banners",
        description: "Coordinate with library and canteen admin for designated trade desks.",
        assignedToUserId: "user_priya_patel",
        priority: "medium",
        deadline: "2026-11-05",
        status: "in_progress",
        createdAt: new Date().toISOString(),
      },
    ],
  });

  // 5. Seed Idea Validation Report
  await IdeaValidationReport.create({
    workspaceId: cbId,
    createdById: "user_aarav_sharma",
    idea: "A verified, hyper-local student marketplace for college campuses (CampusBazaar)",
    targetAudience: "College undergraduates & postgraduates residing on or near campus",
    problem: "Students lose thousands of rupees buying retail textbooks, furniture, and appliances, then struggle to sell them on OLX/FB Marketplace due to scam risks, shipping friction, and safety concerns.",
    solution: "A closed-loop, .edu verified platform where transactions occur within walking distance at secure campus meetup points.",
    competitors: "OLX, Facebook Marketplace, WhatsApp Hostel groups, Quikr",
    revenueModel: "5% transaction fee on electronics above ₹1000 + ₹29 listing boost fee for urgent sales",
    assumptions: "Students trust peers with institutional emails more than generic classifieds; physical proximity eliminates shipping overhead.",
    validationEvidence: "34 out of 40 students surveyed across 3 hostels confirmed buying at least 2 used items this semester.",
    problemClarityScore: 92,
    viabilityScore: 88,
    targetCustomerAnalysis: "Primary audience is 1st to 4th year college students with high turnover of study material and dorm amenities.",
    mainAssumptions: [
      "Institutional verification creates sufficient trust to remove cash-on-delivery defaults.",
      "Campus density allows 100% organic peer referral without paid ad spend.",
      "Sellers will accept a 5% escrow safety charge for guaranteed pickup.",
    ],
    potentialRisks: [
      { risk: "Semester seasonality (high demand in Aug/Jan, dead in June)", severity: "high", mitigation: "Expand to semester rental models and storage lockers during vacations." },
      { risk: "Bypass platform after first chat", severity: "medium", mitigation: "Provide escrow payment protection and warranty badges only for on-platform deals." },
    ],
    competitorConsiderations: "OLX has significant spam/fraud; WhatsApp groups lack search, category filters, and structured listings.",
    possibleDifferentiation: [
      "Campus email badge verification",
      "Designated safe-zone meetup map on campus",
      "Department-specific coursebook search tags",
    ],
    suggestedExperiments: [
      { name: "WhatsApp Concierge MVP", hypothesis: "15 listings posted in 48 hours manually", metric: "Listing conversion rate", timelineDays: 4 },
      { name: "Printed QR code posters at hostel mess", hypothesis: "100 scans with 30% waitlist signups", metric: "Campus waitlist CAC", timelineDays: 7 },
    ],
    customerQuestions: [
      "What was the last item you tried to sell or buy on campus, and what went wrong?",
      "Would you prefer paying ₹30 extra for verified student identity guarantee?",
    ],
    suggestedMvp: [
      { coreFeature: "Student Auth Gate (.edu / college ID)", description: "Restricts access to verified university peers", effort: "medium" },
      { coreFeature: "Photo listing with course tag", description: "Search by subject code e.g. CS101, ECON204", effort: "low" },
      { coreFeature: "Safe-zone meetup pin selector", description: "Select Campus Gate 2 or Library Plaza for trade", effort: "low" },
    ],
    nextSteps: [
      "Finalize frontend UI for listing creation",
      "Recruit 10 campus ambassadors across North Campus",
      "Deploy UPI test payment checkout",
    ],
    isAIGenerated: true,
  });

  // 6. Seed Customer Validation Hub
  await CustomerValidation.create({
    workspaceId: cbId,
    customerPersonas: [
      {
        id: "cp_1",
        name: "Budget-Conscious Fresher (Aditi, 18)",
        role: "1st Year Engineering Student",
        demographics: "Hostel resident, ₹8,000 monthly allowance",
        coreFrustrations: ["Standard textbooks cost ₹4,500/semester", "Unsure which seniors have genuine notes"],
        goals: ["Acquire essential second-year reference books under ₹1,500"],
      },
      {
        id: "cp_2",
        name: "Graduating Final-Year Senior (Karan, 22)",
        role: "4th Year Final Sem",
        demographics: "Moving out of city for job placement",
        coreFrustrations: ["Cannot carry cooler, monitor, and bicycle on train", "Hostel admin won't allow hoarding"],
        goals: ["Liquidate room assets in 5 days before vacating room"],
      },
    ],
    interviewQuestions: [
      "How did you buy your engineering textbooks this semester?",
      "Have you ever experienced flaky buyers or scams on open classifieds?",
      "Would you prefer campus meetup over courier delivery?",
    ],
    surveyQuestions: ["How much would you pay for verified student-only classifieds?"],
    feedbackRecords: [
      {
        id: "fb_1",
        intervieweeName: "Rahul Verma (Hostel Block C)",
        intervieweeRole: "2nd Year B.Tech",
        date: "2026-10-12",
        category: "problem_validation",
        notes: "Bought a used scientific calculator from a 4th year senior. Had to ask around 6 rooms. Said an app with search would be a lifesaver.",
        painPoints: ["No centralized campus inventory", "Awkward bargaining with seniors"],
        validationStatus: "validated",
        consentObtained: true,
        source: "in_person",
      },
    ],
    painPointSummary: "Students unanimously cite high textbook friction and awkward price haggling as top daily hassles.",
    overallDemandConfidence: "high",
  });

  // 7. Seed Business Model
  await BusinessModel.create({
    workspaceId: cbId,
    customerSegments: ["University students living on campus", "Hostelers moving in/out", "Campus student club organizers"],
    customerProblems: ["High retail prices for temporary assets", "Fear of fraud on unmoderated platforms", "Zero local logistics"],
    valueProposition: ["Instant campus pickup with zero delivery delay", "100% peer accountability through university email validation"],
    solution: ["Verified web platform with safe campus meetup desks", "Built-in student escrow chat"],
    revenueStreams: ["5% marketplace take rate on high-value hardware", "Sponsored campus club banners", "Express listing boost fee (₹29)"],
    costStructure: ["Server & Database hosting (MongoDB + Vercel)", "Campus ambassador stipend", "Marketing print collateral"],
    distributionChannels: ["Campus WhatsApp hostel groups", "Student club partnerships", "Posters at college canteen & library"],
    customerRelationships: ["Student community trust", "Transparent peer review ratings"],
    keyMetrics: ["Monthly Active Students (MAS)", "GMV traded / month", "Median time from listing to sale (<48 hrs)"],
    mvpFeatures: [
      { id: "feat_1", name: "University Auth Barrier", description: "Only users with active student domain sign in", category: "must_have", status: "shipped" },
      { id: "feat_2", name: "Campus Meetup Zones", description: "Select designated public safety points for exchange", category: "must_have", status: "in_dev" },
      { id: "feat_3", name: "Seller Escrow via UPI", description: "Buyer confirms item inspection before payment release", category: "should_have", status: "backlog" },
    ],
  });

  // 8. Seed Budget Plan
  await BudgetPlan.create({
    workspaceId: cbId,
    currency: "INR",
    initialCash: 75000,
    oneTimeCosts: [
      { id: "ot_1", name: "Company Incorporation & Legal Docs", amount: 12000, category: "Legal" },
      { id: "ot_2", name: "Domain Registration & SSL", amount: 2500, category: "Technology" },
      { id: "ot_3", name: "Campus Standees & QR Stickers", amount: 8000, category: "Marketing" },
    ],
    monthlyExpenses: [
      { id: "me_1", name: "Cloud Server & MongoDB Database", amount: 2000, category: "Infrastructure" },
      { id: "me_2", name: "Campus Ambassador Incentives", amount: 6000, category: "Marketing" },
      { id: "me_3", name: "Customer Support & Misc Tools", amount: 1500, category: "Software" },
    ],
    monthlyRevenues: [
      { id: "rev_1", name: "Listing Boosts & Marketplace Fees", amount: 4500, notes: "Pilot campus early traction" },
    ],
    fundingReceived: [
      { id: "fnd_1", source: "Founder Personal Bootstrapping", amount: 75000, date: "2026-09-01" },
    ],
    targetAveragePricePerCustomer: 499,
    variableCostPerCustomer: 45,
  });

  // 9. Seed Pitch Deck
  await PitchDeck.create({
    workspaceId: cbId,
    slides: [
      { slideNumber: 1, title: "CampusBazaar", subtitle: "Hyper-local verified student commerce for university campuses", bulletPoints: ["Find Your Team. Build Your Dream.", "Connecting 50k+ students across 12 universities"], speakerNotes: "Open with our core vision: campus commerce should be trusted, immediate, and zero-waste." },
      { slideNumber: 2, title: "The Problem", subtitle: "Open classifieds fail university students", bulletPoints: ["OLX & FB Marketplace are rife with scams and external strangers", "High delivery courier fees make second-hand items non-viable", "Textbooks and appliances are abandoned at semester end"], speakerNotes: "Highlight the ₹12,000 waste per student room every single semester." },
      { slideNumber: 3, title: "The Solution", subtitle: "A closed-loop, verified student exchange", bulletPoints: [".edu / College ID gated onboarding", "Walk-to-meet designated campus trade points", "Zero shipping delay and zero packaging waste"], speakerNotes: "Safety is our defensible moat. Students deal only with confirmed peers." },
      { slideNumber: 4, title: "Traction & Early Data", subtitle: "Strong organic pull in initial survey", bulletPoints: ["34/40 students pre-registered in 48 hours", "₹45,000 GMV projected in Month 1 pilot", "Zero paid customer acquisition spend to date"], speakerNotes: "Word-of-mouth in campus hostels is immediate." },
      { slideNumber: 5, title: "Business Model & Unit Economics", subtitle: "Simple, transparent monetization", bulletPoints: ["5% take rate on hardware & electronics above ₹1000", "₹29 priority listing spotlight fee", "Target CAC: ₹15 / student; Target LTV: ₹420"], speakerNotes: "Scales to over 1000 college campuses across India." },
    ],
    version: 1,
  });

  // 10. Seed Equity Scenario
  await EquityScenario.create({
    workspaceId: cbId,
    scenarioName: "Balanced Founder Allocation",
    founders: [
      {
        id: "fnd_1",
        name: "Aarav Sharma",
        role: "Technical Co-Founder (CTO)",
        timeCommitmentHoursPerWeek: 40,
        cashInvested: 40000,
        ipContributionScore: 5,
        executionRiskScore: 5,
        responsibilitiesScore: 5,
        calculatedSharePct: 52.5,
      },
      {
        id: "fnd_2",
        name: "Priya Patel",
        role: "Product & Growth Lead (CEO)",
        timeCommitmentHoursPerWeek: 35,
        cashInvested: 35000,
        ipContributionScore: 4,
        executionRiskScore: 4,
        responsibilitiesScore: 4,
        calculatedSharePct: 37.5,
      },
    ],
    optionPoolPct: 10,
    notes: "Allocated using multi-factor contribution weighting (time 35%, capital 25%, IP 20%, execution risk 20%).",
  });

  // 11. Seed Subscriptions
  await Subscription.create([
    {
      userId: "user_aarav_sharma",
      plan: "free",
      status: "active",
      aiMonthlyQuota: 25,
      aiUsedThisMonth: 6,
      currentPeriodEnd: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    },
    {
      userId: "user_priya_patel",
      plan: "free",
      status: "active",
      aiMonthlyQuota: 25,
      aiUsedThisMonth: 2,
      currentPeriodEnd: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    },
    {
      userId: "user_rohan_mehta",
      plan: "free",
      status: "active",
      aiMonthlyQuota: 25,
      aiUsedThisMonth: 0,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  ]);

  // 12. Seed Security Audit Events
  await SecurityAuditEvent.create([
    {
      workspaceId: cbId,
      actorId: "user_aarav_sharma",
      actorName: "Aarav Sharma",
      action: "workspace_created",
      details: "Workspace 'CampusBazaar' created with IdeaShield Private-by-Default status.",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      workspaceId: cbId,
      actorId: "user_aarav_sharma",
      actorName: "Aarav Sharma",
      action: "member_invited",
      details: "Invited 'priya@buildup.dev' as Admin Member.",
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      workspaceId: cbId,
      actorId: "user_priya_patel",
      actorName: "Priya Patel",
      action: "nda_signed",
      details: "Digitally accepted the Confidentiality & Non-Disclosure Discussion Aid.",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ]);

  console.log("=========================================");
  console.log("MongoDB Database successfully populated!");
  console.log(`- User Profiles: ${await UserProfile.countDocuments()}`);
  console.log(`- Startup Workspaces: ${await StartupWorkspace.countDocuments()}`);
  console.log(`- Workspace Memberships: ${await WorkspaceMembership.countDocuments()}`);
  console.log(`- Roadmaps: ${await Roadmap.countDocuments()}`);
  console.log(`- Validation Reports: ${await IdeaValidationReport.countDocuments()}`);
  console.log(`- Customer Hubs: ${await CustomerValidation.countDocuments()}`);
  console.log(`- Business Models: ${await BusinessModel.countDocuments()}`);
  console.log(`- Budget Plans: ${await BudgetPlan.countDocuments()}`);
  console.log(`- Pitch Decks: ${await PitchDeck.countDocuments()}`);
  console.log(`- Equity Scenarios: ${await EquityScenario.countDocuments()}`);
  console.log(`- Subscriptions: ${await Subscription.countDocuments()}`);
  console.log(`- Audit Events: ${await SecurityAuditEvent.countDocuments()}`);
  console.log("=========================================");

  await mongoose.disconnect();
  process.exit(0);
}

runSeed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
