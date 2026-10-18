import {
  UserProfileType,
  StartupWorkspaceType,
  WorkspaceMembershipType,
  WorkspaceInvitationType,
  ConnectionRequestType,
  IdeaValidationReportType,
  CustomerValidationHubType,
  RoadmapType,
  BusinessModelType,
  BudgetPlanType,
  PitchDeckType,
  EquityScenarioType,
  SubscriptionType,
  SecurityAuditEventType,
  AbuseReportType,
} from "@/types";

// Seed User Profiles
const initialUsers: UserProfileType[] = [
  {
    userId: "user_aarav_sharma",
    displayName: "Aarav Sharma",
    email: "aarav@buildup.dev",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    bio: "Full-stack engineer passionate about decentralized education tools and developer infrastructure. Built 2 open-source tools with 1k+ GitHub stars. Looking for a product/growth co-founder.",
    skills: [
      { name: "Full-Stack Development", proficiency: "expert" },
      { name: "Next.js & React", proficiency: "expert" },
      { name: "System Architecture", proficiency: "expert" },
      { name: "Python & AI Models", proficiency: "intermediate" },
      { name: "DevOps & Cloud", proficiency: "intermediate" },
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
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    userId: "user_priya_patel",
    displayName: "Priya Patel",
    email: "priya@buildup.dev",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
    bio: "Ex-Tier 1 startup growth marketer turned product strategist. Scaled consumer apps from 0 to 50k MAU. Skilled in user interviews, CAC/LTV economics, and funnel design.",
    skills: [
      { name: "Growth Marketing", proficiency: "expert" },
      { name: "Customer Research", proficiency: "expert" },
      { name: "UI/UX & Wireframing", proficiency: "intermediate" },
      { name: "Content & SEO", proficiency: "intermediate" },
      { name: "Data Analytics", proficiency: "intermediate" },
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
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    userId: "user_rohan_mehta",
    displayName: "Rohan Mehta",
    email: "rohan@buildup.dev",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    bio: "Chartered accountant & ex-investment banking analyst. Passionate about financial inclusion and startup unit economics. Looking for tech partner for SME credit intelligence.",
    skills: [
      { name: "Financial Modeling", proficiency: "expert" },
      { name: "Unit Economics", proficiency: "expert" },
      { name: "Regulatory Compliance", proficiency: "intermediate" },
      { name: "Investor Relations", proficiency: "expert" },
      { name: "Sales & Partnerships", proficiency: "intermediate" },
    ],
    interests: ["FinTech", "SME Lending", "WealthTech", "Compliance"],
    preferredDomains: ["FinTech", "B2B SaaS"],
    goals: ["Build compliance-ready fintech engine", "Partner with accredited banks"],
    experienceLevel: "senior",
    preferredRoles: ["CFO", "Co-Founder & COO"],
    workingStyle: "structured",
    weeklyHours: 25,
    collaborationMode: "remote",
    isPublicInDiscovery: true,
    contactPreference: "email",
    linkedinUrl: "https://linkedin.com/in/rohan-mehta-demo",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    userId: "user_sneha_rao",
    displayName: "Dr. Sneha Rao",
    email: "sneha@buildup.dev",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80",
    bio: "Biomedical researcher with clinical validation experience. Building predictive wellness telemetry for campus clinics. Need a full-stack / mobile partner.",
    skills: [
      { name: "Clinical Validation", proficiency: "expert" },
      { name: "Healthcare Regulations", proficiency: "expert" },
      { name: "Grant Writing", proficiency: "intermediate" },
      { name: "Bioinformatics", proficiency: "intermediate" },
    ],
    interests: ["HealthTech", "MedTech", "Biotech"],
    preferredDomains: ["HealthTech", "BioTech"],
    goals: ["IRB approval", "Pilot deployment in 3 university infirmaries"],
    experienceLevel: "seasoned_founder",
    preferredRoles: ["Chief Scientific Officer", "Co-Founder"],
    workingStyle: "structured",
    weeklyHours: 20,
    collaborationMode: "in_person",
    isPublicInDiscovery: true,
    contactPreference: "platform_message",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Seed Workspaces
const initialWorkspaces: StartupWorkspaceType[] = [
  {
    _id: "ws_campusbazaar_101",
    name: "CampusBazaar",
    slug: "campusbazaar",
    tagline: "Hyperlocal verified marketplace for university dorms & colleges",
    description: "A secure, student-verified peer exchange platform for textbooks, dorm gear, electronics, and micro-freelance gigs inside college campuses.",
    domain: "EdTech & Marketplaces",
    stage: "problem_validation",
    ownerId: "user_aarav_sharma",
    visibility: "private", // IdeaShield: Default Private
    previewFields: {
      showTagline: true,
      showDomain: true,
      showStage: true,
      showProblems: false,
      showMilestones: false,
      showPitchSummary: false,
    },
    confidentialityAgreementRequired: true,
    confidentialityTemplate: "CONFIDENTIALITY AGREEMENT (DISCUSSION AID)\n\nAll members agree to safeguard proprietary discovery notes, customer interviews, and financial assumptions regarding CampusBazaar.",
    targetLaunchDate: "2026-12-01",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "ws_healthpulse_102",
    name: "HealthPulse Diagnostics",
    slug: "healthpulse-diagnostics",
    tagline: "Preventative vital signs telemetry & triage assistant for student clinics",
    description: "Low-cost connected IoT triage monitor providing automated anomaly detection for collegiate healthcare centers.",
    domain: "HealthTech",
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
    targetLaunchDate: "2027-02-15",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const initialMemberships: WorkspaceMembershipType[] = [
  {
    _id: "mem_1",
    workspaceId: "ws_campusbazaar_101",
    userId: "user_aarav_sharma",
    role: "owner",
    status: "active",
    joinedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    ndaSignedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    title: "Lead Architect & Founder",
  },
  {
    _id: "mem_2",
    workspaceId: "ws_campusbazaar_101",
    userId: "user_priya_patel",
    role: "admin",
    status: "active",
    joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    ndaSignedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    title: "Growth & Product Co-Founder",
  },
  {
    _id: "mem_3",
    workspaceId: "ws_healthpulse_102",
    userId: "user_aarav_sharma",
    role: "owner",
    status: "active",
    joinedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    ndaSignedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    title: "Technical Founder",
  },
];

const initialAuditEvents: SecurityAuditEventType[] = [
  {
    _id: "sec_1",
    workspaceId: "ws_campusbazaar_101",
    actorId: "user_aarav_sharma",
    actorName: "Aarav Sharma",
    action: "workspace_created",
    details: "Workspace created with IdeaShield Private-by-Default security status.",
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "sec_2",
    workspaceId: "ws_campusbazaar_101",
    actorId: "user_aarav_sharma",
    actorName: "Aarav Sharma",
    action: "invite_sent",
    details: "Invitation sent to priya@buildup.dev with role: admin.",
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "sec_3",
    workspaceId: "ws_campusbazaar_101",
    actorId: "user_priya_patel",
    actorName: "Priya Patel",
    action: "nda_signed",
    details: "Priya Patel accepted and recorded acknowledgment of workspace confidentiality terms.",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Memory store
class MockDatabase {
  users: UserProfileType[] = [...initialUsers];
  workspaces: StartupWorkspaceType[] = [...initialWorkspaces];
  memberships: WorkspaceMembershipType[] = [...initialMemberships];
  invitations: WorkspaceInvitationType[] = [];
  connections: ConnectionRequestType[] = [];
  ideaReports: IdeaValidationReportType[] = [
    {
      _id: "report_cb_1",
      workspaceId: "ws_campusbazaar_101",
      createdById: "user_aarav_sharma",
      idea: "Hyperlocal verified student marketplace for colleges",
      targetAudience: "Undergraduate & Graduate college students living on/near campus",
      problem: "Students lose up to ₹15,000 every semester buying items at retail and dumping usable dorm furniture / books upon graduation due to scam risks on generic classified platforms.",
      solution: "Campus-email-verified marketplace with dorm-drop meeting points, escrow micro-payments, and end-of-semester buyback guarantees.",
      competitors: "OLX, Facebook Marketplace, WhatsApp hostel groups",
      revenueModel: "5% transaction fee on transactions above ₹500, sponsored local campus merchant listings",
      assumptions: "Students prioritize safety and zero-shipping instant pickup over catalog breadth.",
      validationEvidence: "Surveyed 42 students across 3 university hostels; 88% reported getting ghosted on OLX.",
      problemClarityScore: 88,
      viabilityScore: 82,
      targetCustomerAnalysis: "Primary segment: 1st-4th year undergrads with ₹3,000-₹8,000 discretionary monthly budget seeking affordable course materials and room appliances.",
      mainAssumptions: [
        "Campus identity verification gives sufficient trust for face-to-face exchanges.",
        "Sellers are willing to pay 5% convenience fee for scam-free transactions.",
        "Word-of-mouth inside student societies can drive zero-CAC adoption.",
      ],
      potentialRisks: [
        { risk: "Extreme seasonality at semester start & finals week", severity: "high", mitigation: "Introduce year-round services like peer tutoring and laundry gear sharing." },
        { risk: "Campus administration restrictions on commercial activity", severity: "medium", mitigation: "Partner with official student entrepreneurship cells as an approved campus utility." },
      ],
      competitorConsiderations: "OLX has no identity verification leading to frequent scams. WhatsApp groups lack search, structured listings, and payment escrow.",
      possibleDifferentiation: [
        ".edu / campus email barrier keeping non-students out",
        "Geofenced designated campus pickup zones (e.g. Student Union lobby)",
        "Dorm room swap matching for graduation week",
      ],
      suggestedExperiments: [
        { name: "Flyer QR waitlist test", hypothesis: "100 student signups in 48 hours from 50 flyers in student cafeteria", metric: "Signup conversion > 12%", timelineDays: 3 },
        { name: "Manual WhatsApp Concierge MVP", hypothesis: "Facilitate 20 book trades manually to test transaction fee willingness", metric: "Completed transactions with fee paid", timelineDays: 7 },
      ],
      customerQuestions: [
        "What was the most frustrating item you tried to sell or buy on campus last semester?",
        "Have you ever experienced fraud or ghosting on public marketplaces?",
        "Would you use a service that requires showing your student ID to trade?",
      ],
      suggestedMvp: [
        { coreFeature: "Student ID Auth (.edu or photo)", description: "Restricts viewing and posting exclusively to verified peers", effort: "low" },
        { coreFeature: "Listing Feed with Campus Filter", description: "Search by college and dorm hall", effort: "medium" },
        { coreFeature: "In-App Chat with Meeting Scheduler", description: "Designates safe on-campus meeting locations", effort: "medium" },
      ],
      nextSteps: [
        "Recruit 5 campus ambassadors in engineering college",
        "Conduct 10 in-depth user interviews with hostel wardens and seniors",
        "Deploy MVP pilot at single campus before expanding",
      ],
      isAIGenerated: true,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  customerValidation: CustomerValidationHubType[] = [
    {
      _id: "cv_cb_1",
      workspaceId: "ws_campusbazaar_101",
      customerPersonas: [
        {
          id: "cp_1",
          name: "Hostel Fresher Varun",
          role: "1st Year Engineering Student",
          demographics: "Age 18, moved from home city, lives in campus hostel",
          coreFrustrations: [
            "Cannot afford new engineering drawing equipment and reference textbooks",
            "Doesn't know seniors to buy second-hand gear from",
            "Afraid of getting scammed online",
          ],
          goals: ["Set up dorm room cheaply under ₹5,000", "Acquire 1st year syllabus books in week 1"],
        },
        {
          id: "cp_2",
          name: "Graduating Senior Meera",
          role: "Final Year Student",
          demographics: "Age 22, moving out for corporate job in 3 weeks",
          coreFrustrations: [
            "Has table fan, mattress, cycle, and kettle she cannot take on the flight",
            "Local scrap buyers offer 5% of value",
            "Strangers from public websites asking to visit her hostel room",
          ],
          goals: ["Liquidate dorm items safely within 10 days", "Recover at least ₹4,000"],
        },
      ],
      interviewQuestions: [
        "Can you walk me through the last time you bought or sold something to another student?",
        "How did you find the buyer/seller?",
        "What safety concerns crossed your mind during the transaction?",
        "What happened to items you couldn't sell when leaving campus?",
      ],
      surveyQuestions: [
        "How many textbooks or dorm items do you purchase per academic year?",
        "Which payment method would you prefer for student-to-student transactions?",
      ],
      feedbackRecords: [
        {
          id: "fb_1",
          intervieweeName: "Karan Verma (Hostel Block B)",
          intervieweeRole: "2nd Year CS Student",
          date: "2026-10-10",
          category: "problem_validation",
          notes: "Spent ₹3,200 on new electrical engineering books that seniors throw away. Tried posting on Instagram stories but only 3 friends saw it. Would love a central college marketplace.",
          painPoints: ["Zero discoverability on Instagram stories", "Expensive retail book prices"],
          validationStatus: "validated",
          consentObtained: true,
          source: "in_person",
        },
        {
          id: "fb_2",
          intervieweeName: "Ananya Iyer (Girls Hostel 2)",
          intervieweeRole: "Final Year Biotech",
          date: "2026-10-12",
          category: "ux_feature",
          notes: "Emphasized that meeting off-campus with strangers from OLX is completely out of the question for female students. Having verified college email is mandatory.",
          painPoints: ["Safety and harassment concerns on open public platforms"],
          validationStatus: "validated",
          consentObtained: true,
          source: "video_call",
        },
      ],
      painPointSummary: "Real user research indicates safety and trusted student identity verification are the #1 adoption drivers, superseding catalog size. High demand exists around academic turnover periods.",
      overallDemandConfidence: "high",
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  roadmaps: RoadmapType[] = [
    {
      _id: "rm_cb_1",
      workspaceId: "ws_campusbazaar_101",
      currentStage: "problem_validation",
      milestones: [
        {
          id: "ms_1",
          title: "Problem & Student Safety Validation",
          stage: "problem_validation",
          description: "Complete 25 verified student interviews across 3 distinct hostels to validate willingness to trade.",
          priority: "critical",
          suggestedTimelineWeeks: 2,
          deadline: "2026-10-25",
          status: "in_progress",
          dependencies: [],
        },
        {
          id: "ms_2",
          title: "Prototype & Campus Auth Loop",
          stage: "mvp_planning",
          description: "Build Next.js web application with student email domain verification and responsive item catalog.",
          priority: "high",
          suggestedTimelineWeeks: 3,
          deadline: "2026-11-15",
          status: "todo",
          dependencies: ["ms_1"],
        },
        {
          id: "ms_3",
          title: "Pilot Launch at Alpha Campus",
          stage: "launch",
          description: "Onboard 200 registered students and complete 50 verified item exchanges.",
          priority: "critical",
          suggestedTimelineWeeks: 2,
          deadline: "2026-12-05",
          status: "todo",
          dependencies: ["ms_2"],
        },
      ],
      tasks: [
        {
          id: "tsk_1",
          milestoneId: "ms_1",
          title: "Conduct 15 hostel interviews on dorm items",
          description: "Focus on graduating seniors who have goods to liquidate.",
          assignedToUserId: "user_priya_patel",
          priority: "high",
          deadline: "2026-10-22",
          status: "in_progress",
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "tsk_2",
          milestoneId: "ms_1",
          title: "Analyze competitor complaints on Play Store",
          description: "Catalogue top 10 fraud patterns on Craigslist/OLX student transactions.",
          assignedToUserId: "user_aarav_sharma",
          priority: "medium",
          deadline: "2026-10-23",
          status: "done",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "tsk_3",
          milestoneId: "ms_2",
          title: "Implement student email domain validation parser",
          description: "Support .edu, .ac.in, and university institutional domains.",
          assignedToUserId: "user_aarav_sharma",
          priority: "high",
          deadline: "2026-11-05",
          status: "todo",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
  ];

  businessModels: BusinessModelType[] = [
    {
      _id: "bm_cb_1",
      workspaceId: "ws_campusbazaar_101",
      customerSegments: [
        "Incoming 1st & 2nd year students needing budget books & furniture",
        "Graduating 4th year seniors needing fast liquidation",
        "Campus student clubs & event organizers needing equipment rental",
      ],
      customerProblems: [
        "Generic platforms (OLX) have scam risks and off-campus danger",
        "High retail prices for single-semester textbooks",
        "No easy way to sell dorm essentials before hostel checkout",
      ],
      valueProposition: [
        "100% Student Verified Peer-to-Peer Campus Marketplace",
        "Designated Safe Zone campus pickup locations",
        "Zero shipping fees with same-day exchange",
      ],
      solution: [
        "University institutional email verification",
        "Geofenced campus feeds and category tags",
        "Integrated escrow payment protection",
      ],
      revenueStreams: [
        "5% transaction commission on verified peer transactions > ₹500",
        "Premium listing boost (₹49 for 3-day top placement)",
        "Local student merchant advertisements (cafeterias, stationery)",
      ],
      costStructure: [
        "Cloud hosting & image storage (Vercel, AWS S3)",
        "SMS/Email verification costs",
        "Campus ambassador stipends (₹2,000/month per campus)",
        "Payment gateway processing fees (2%)",
      ],
      distributionChannels: [
        "Hostel WhatsApp groups & college Reddit communities",
        "Orientation week flyers & campus freshers fair booths",
        "Student Council & Entrepreneurship Cell partnerships",
      ],
      customerRelationships: [
        "Automated self-service platform with student ambassador mediation",
        "Community rating system and peer reviews",
      ],
      keyMetrics: [
        "Active student monthly listings",
        "Gross Merchandise Value (GMV) per campus",
        "Listing-to-Transaction completion rate (target > 45%)",
        "Organic referral coefficient",
      ],
      mvpFeatures: [
        { id: "feat_1", name: "Campus Email Verification", description: "Validate student enrollment", category: "must_have", status: "in_dev" },
        { id: "feat_2", name: "Structured Photo Listing with Price & Hostel", description: "Easy 3-step item creation", category: "must_have", status: "in_dev" },
        { id: "feat_3", name: "Direct Secure Buyer-Seller Messaging", description: "Coordinate campus meetup", category: "must_have", status: "backlog" },
        { id: "feat_4", name: "In-App Razorpay Escrow", description: "Hold funds until item handed over", category: "should_have", status: "backlog" },
        { id: "feat_5", name: "Dorm Delivery Concierge", description: "Peer delivery for tip", category: "could_have", status: "backlog" },
      ],
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  budgetPlans: BudgetPlanType[] = [
    {
      _id: "bp_cb_1",
      workspaceId: "ws_campusbazaar_101",
      currency: "INR",
      initialCash: 150000,
      oneTimeCosts: [
        { id: "ot_1", name: "Company Incorporation & Legal Docs", amount: 18000, category: "Legal" },
        { id: "ot_2", name: "Trademark Registration", amount: 9000, category: "Legal" },
        { id: "ot_3", name: "Domain & Initial Tech Setup", amount: 5000, category: "Technology" },
        { id: "ot_4", name: "Pilot Marketing & Printing", amount: 12000, category: "Marketing" },
      ],
      monthlyExpenses: [
        { id: "me_1", name: "Cloud Server & Database (Vercel/Atlas)", amount: 3500, category: "Infrastructure" },
        { id: "me_2", name: "Ambassador Stipends (3 Campuses)", amount: 9000, category: "Marketing" },
        { id: "me_3", name: "Software Tools & Auth (Clerk/APIs)", amount: 2500, category: "Software" },
        { id: "me_4", name: "Payment Gateway & Compliance", amount: 1500, category: "Operations" },
      ],
      monthlyRevenues: [
        { id: "mr_1", name: "Commission Fees (5% on ₹80k pilot GMV)", amount: 4000, notes: "Expected month 2" },
        { id: "mr_2", name: "Featured Listings (40 listings @ ₹49)", amount: 1960, notes: "Expected month 2" },
      ],
      fundingReceived: [
        { id: "fnd_1", source: "Founder Bootstrapping (Personal Savings)", amount: 150000, date: "2026-09-15" },
      ],
      targetAveragePricePerCustomer: 650,
      variableCostPerCustomer: 45,
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  pitchDecks: PitchDeckType[] = [
    {
      _id: "pd_cb_1",
      workspaceId: "ws_campusbazaar_101",
      version: 1,
      generatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      slides: [
        {
          slideNumber: 1,
          title: "CampusBazaar",
          subtitle: "Find Your Campus Team. Trade Safely in Your Dorms.",
          bulletPoints: [
            "Hyperlocal peer-to-peer student marketplace",
            "Eliminating fraud with institutional email verification",
            "Presenting to Early-Stage Investors & Accelerators",
          ],
          speakerNotes: "Introduce the founding team and state the core vision: empowering university students with safe, zero-shipping campus commerce.",
        },
        {
          slideNumber: 2,
          title: "The Problem",
          subtitle: "College Students Lose ₹15,000+ Every Academic Year",
          bulletPoints: [
            "Heavy textbooks and dorm appliances are sold at 90% loss or discarded upon checkout",
            "Public marketplaces (OLX, Craigslist) are rife with scammers and strangers",
            "Hostel WhatsApp groups are cluttered, unsearchable, and provide zero safety guarantees",
          ],
          speakerNotes: "Highlight the acute student pain during semester transition periods and the pervasive fear of safety issues with open classifieds.",
        },
        {
          slideNumber: 3,
          title: "The Solution",
          subtitle: "A Gated, Verified Hyperlocal Ecosystem",
          bulletPoints: [
            "Campus-email-verified community — only verified students can view or trade",
            "Designated Safe Pickup Zones inside student union buildings and cafeterias",
            "Instant in-app escrow payments eliminating cash scams",
          ],
          speakerNotes: "Explain why the gated network creates instant trust and makes transaction friction virtually zero.",
        },
        {
          slideNumber: 4,
          title: "Market Opportunity",
          subtitle: "40 Million Higher Education Students in India Alone",
          bulletPoints: [
            "Over 1,000 universities and 40,000 colleges in target geographies",
            "Estimated ₹1,200 Cr ($150M) annual peer-to-peer dorm turnover market",
            "Expansion potential into micro-freelancing, notes sharing, and student housing",
          ],
          speakerNotes: "Ground the TAM in realistic enrollment data without inflating claims.",
        },
        {
          slideNumber: 5,
          title: "Product & MVP Architecture",
          subtitle: "Built for Mobile-First Student Speed",
          bulletPoints: [
            "Next.js App Router with sub-second page loads and PWA responsiveness",
            "Instant photo-to-listing in under 45 seconds",
            "Built-in chat with automated meetup safety checklists",
          ],
          speakerNotes: "Demonstrate product simplicity and zero barrier to listing creation.",
        },
        {
          slideNumber: 6,
          title: "Business Model",
          subtitle: "Diversified, Scalable Monetization",
          bulletPoints: [
            "5% marketplace commission on high-value items (> ₹500)",
            "₹49 Featured placement boosts for urgent movers",
            "Local student business sponsored placements (food, stationery, coaching)",
          ],
          speakerNotes: "Highlight low unit cost structure and positive contribution margin from day one.",
        },
        {
          slideNumber: 7,
          title: "Competition & Defensive Moat",
          subtitle: "Why Generic Marketplaces Cannot Compete",
          bulletPoints: [
            "OLX / Quikr: Broad but plagued by scams and lack of campus trust",
            "WhatsApp Groups: High trust but chaotic, unindexed, and zero analytics",
            "CampusBazaar Moat: Institutional email gating, localized campus network effects",
          ],
          speakerNotes: "Contrast our focused network density against fragmented chat groups.",
        },
        {
          slideNumber: 8,
          title: "Go-To-Market Strategy",
          subtitle: "Hyper-Dense Campus Playbook",
          bulletPoints: [
            "Campus Ambassador Program: 2 key student leaders per college",
            "Hostel Orientation Partnerships & E-Cell integration",
            "End-of-Semester 'Dorm Dump' Buyback drives",
          ],
          speakerNotes: "Explain the low CAC flywheel driven by campus word-of-mouth.",
        },
        {
          slideNumber: 9,
          title: "Validation & Early Traction",
          subtitle: "Proof of Demand (Pre-Launch)",
          bulletPoints: [
            "42 formal student interviews conducted across 3 major institutes",
            "88% expressed dissatisfaction with current student exchange channels",
            "Waitlist of 310 students registered for upcoming semester pilot",
          ],
          speakerNotes: "Present actual feedback data without claiming inflated revenue.",
        },
        {
          slideNumber: 10,
          title: "Financial Projections",
          subtitle: "18-Month Conservative Runway Model",
          bulletPoints: [
            "Initial Bootstrapped Capital: ₹1,50,000",
            "Low Monthly Fixed Burn: ~₹16,500 during pilot phase",
            "Targeting Unit Break-Even at 3,500 active campus trades",
          ],
          speakerNotes: "Walk through the disciplined financial assumptions and runway.",
        },
        {
          slideNumber: 11,
          title: "Founding Team",
          subtitle: "Complementary Technical & Product Operators",
          bulletPoints: [
            "Aarav Sharma — Technical Lead: Full-Stack Architect, open-source contributor",
            "Priya Patel — Growth & Product: Ex-Tier 1 growth marketer, 50k MAU experience",
            "Supported by active collegiate advisory network",
          ],
          speakerNotes: "Highlight complementary skill sets and deep familiarity with university ecosystems.",
        },
        {
          slideNumber: 12,
          title: "The Ask & Milestones",
          subtitle: "Accelerating from Pilot to 10 Key Campuses",
          bulletPoints: [
            "Seeking ₹15,00,000 Seed / Pre-Seed or Grant funding",
            "Milestone 1: 5,000 active verified student users in 4 months",
            "Milestone 2: ₹12 Lakhs GMV processed through platform escrow",
            "Contact: founders@campusbazaar.dev | buildup.dev/startup/campusbazaar",
          ],
          speakerNotes: "Conclude with specific, measurable 6-month operational milestones.",
        },
      ],
    },
  ];

  equityScenarios: EquityScenarioType[] = [
    {
      _id: "eq_cb_1",
      workspaceId: "ws_campusbazaar_101",
      scenarioName: "Dynamic Co-Founder Contribution Model",
      founders: [
        {
          id: "fnd_1",
          name: "Aarav Sharma",
          role: "Technical Lead (CTO)",
          timeCommitmentHoursPerWeek: 40,
          cashInvested: 100000,
          ipContributionScore: 5,
          executionRiskScore: 4,
          responsibilitiesScore: 5,
          calculatedSharePct: 53.5,
        },
        {
          id: "fnd_2",
          name: "Priya Patel",
          role: "Product & Growth Lead (CEO)",
          timeCommitmentHoursPerWeek: 35,
          cashInvested: 50000,
          ipContributionScore: 4,
          executionRiskScore: 4,
          responsibilitiesScore: 4,
          calculatedSharePct: 36.5,
        },
      ],
      optionPoolPct: 10,
      notes: "Calculated using multi-factor contribution weighting (time 35%, cash 25%, IP 20%, execution risk 20%). Note: Discussion aid only; formal vesting schedules and contracts require legal consultation.",
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  subscriptions: SubscriptionType[] = [
    {
      _id: "sub_1",
      userId: "user_aarav_sharma",
      plan: "free",
      status: "active",
      aiMonthlyQuota: 25,
      aiUsedThisMonth: 6,
      currentPeriodEnd: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  auditEvents: SecurityAuditEventType[] = [...initialAuditEvents];
  abuseReports: AbuseReportType[] = [
    {
      _id: "ab_1",
      reporterUserId: "user_rohan_mehta",
      category: "spam",
      description: "Received generic promotional messages on external WhatsApp mentioning my public profile.",
      status: "pending",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

// Global singleton for mock database
declare global {
  // eslint-disable-next-line no-var
  var mockDbInstance: MockDatabase | undefined;
}

if (!global.mockDbInstance) {
  global.mockDbInstance = new MockDatabase();
}

export const mockDb = global.mockDbInstance;
