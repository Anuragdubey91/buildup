export type StartupStage =
  | "idea_discovery"
  | "problem_validation"
  | "customer_research"
  | "mvp_planning"
  | "mvp_development"
  | "testing"
  | "launch"
  | "growth";

export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";

export type WorkspaceVisibility = "private" | "preview" | "public";

export type SkillProficiency = "beginner" | "intermediate" | "expert";

export type WorkingStyle = "async" | "agile" | "structured" | "flexible";

export type CollaborationMode = "remote" | "hybrid" | "in_person";

export interface UserSkill {
  name: string;
  proficiency: SkillProficiency;
  verified?: boolean;
}

export interface UserProfileType {
  _id?: string;
  userId: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  skills: UserSkill[];
  interests: string[];
  preferredDomains: string[];
  goals: string[];
  experienceLevel: "student" | "early_career" | "mid_level" | "senior" | "seasoned_founder";
  preferredRoles: string[];
  workingStyle: WorkingStyle;
  weeklyHours: number;
  collaborationMode: CollaborationMode;
  isPublicInDiscovery: boolean;
  contactPreference: "platform_message" | "email" | "linkedin";
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompatibilityFactor {
  name: string;
  score: number; // 0 - 100
  weight: number;
  description: string;
  matchedItems: string[];
}

export interface CompatibilityResult {
  overallScore: number; // 0 - 100
  rating: "Exceptional" | "Strong" | "Moderate" | "Exploratory";
  factors: CompatibilityFactor[];
  strengths: string[];
  complementarySkills: string[];
  sharedDomains: string[];
  potentialFrictions: string[];
  recommendation: string;
}

export interface StartupWorkspaceType {
  _id?: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  domain: string;
  stage: StartupStage;
  ownerId: string;
  visibility: WorkspaceVisibility;
  previewFields?: {
    showTagline: boolean;
    showDomain: boolean;
    showStage: boolean;
    showProblems: boolean;
    showMilestones: boolean;
    showPitchSummary: boolean;
  };
  confidentialityAgreementRequired: boolean;
  confidentialityTemplate?: string;
  targetLaunchDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkspaceMembershipType {
  _id?: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  status: "active" | "suspended" | "revoked";
  joinedAt: string;
  ndaSignedAt?: string;
  invitedBy?: string;
  title?: string;
}

export interface WorkspaceInvitationType {
  _id?: string;
  workspaceId: string;
  email: string;
  role: WorkspaceRole;
  inviterId: string;
  token: string;
  expiresAt: string;
  status: "pending" | "accepted" | "declined" | "revoked";
  createdAt?: string;
}

export interface ConnectionRequestType {
  _id?: string;
  senderId: string;
  receiverId: string;
  message: string;
  status: "pending" | "accepted" | "declined" | "cancelled";
  createdAt: string;
  respondedAt?: string;
}

export interface SkillGapItem {
  skill: string;
  category: "technical" | "business" | "product" | "marketing" | "design" | "operations" | "legal";
  status: "covered" | "partial" | "missing";
  priority: "critical" | "high" | "medium" | "low";
  reason: string;
  recommendedRole: string;
  coveredBy?: string[];
  isResolved?: boolean;
}

export interface SkillGapAnalysisReport {
  workspaceId: string;
  startupName: string;
  domain: string;
  stage: StartupStage;
  analyzedAt: string;
  overallReadinessScore: number;
  coveredSkills: string[];
  missingSkills: SkillGapItem[];
  recruitmentRecommendations: {
    roleTitle: string;
    priority: "critical" | "high" | "medium" | "low";
    keyResponsibilities: string[];
    justification: string;
  }[];
}

export interface IdeaValidationReportType {
  _id?: string;
  workspaceId: string;
  createdById: string;
  idea: string;
  targetAudience: string;
  problem: string;
  solution: string;
  competitors: string;
  revenueModel: string;
  assumptions: string;
  validationEvidence: string;
  problemClarityScore: number; // 0 - 100
  viabilityScore: number; // 0 - 100
  targetCustomerAnalysis: string;
  mainAssumptions: string[];
  potentialRisks: { risk: string; severity: "high" | "medium" | "low"; mitigation: string }[];
  competitorConsiderations: string;
  possibleDifferentiation: string[];
  suggestedExperiments: { name: string; hypothesis: string; metric: string; timelineDays: number }[];
  customerQuestions: string[];
  suggestedMvp: {
    coreFeature: string;
    description: string;
    effort: "low" | "medium" | "high";
  }[];
  nextSteps: string[];
  isAIGenerated: boolean;
  createdAt?: string;
}

export interface CustomerFeedbackItem {
  id: string;
  intervieweeName: string;
  intervieweeRole?: string;
  date: string;
  category: "problem_validation" | "pricing" | "ux_feature" | "competitor_switch" | "general";
  notes: string;
  painPoints: string[];
  validationStatus: "validated" | "inconclusive" | "invalidated";
  consentObtained: boolean;
  source: "in_person" | "video_call" | "survey" | "email";
}

export interface CustomerValidationHubType {
  _id?: string;
  workspaceId: string;
  customerPersonas: {
    id: string;
    name: string;
    role: string;
    demographics: string;
    coreFrustrations: string[];
    goals: string[];
  }[];
  interviewQuestions: string[];
  surveyQuestions: string[];
  feedbackRecords: CustomerFeedbackItem[];
  painPointSummary?: string;
  overallDemandConfidence: "high" | "moderate" | "low" | "untested";
  updatedAt?: string;
}

export interface RoadmapMilestoneType {
  id: string;
  title: string;
  stage: StartupStage;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  suggestedTimelineWeeks: number;
  deadline?: string;
  status: "todo" | "in_progress" | "completed";
  dependencies?: string[];
}

export interface RoadmapTaskType {
  id: string;
  milestoneId: string;
  title: string;
  description?: string;
  assignedToUserId?: string;
  priority: "high" | "medium" | "low";
  deadline?: string;
  status: "todo" | "in_progress" | "done";
  createdAt: string;
}

export interface RoadmapType {
  _id?: string;
  workspaceId: string;
  currentStage: StartupStage;
  milestones: RoadmapMilestoneType[];
  tasks: RoadmapTaskType[];
  updatedAt?: string;
}

export interface BusinessModelType {
  _id?: string;
  workspaceId: string;
  customerSegments: string[];
  customerProblems: string[];
  valueProposition: string[];
  solution: string[];
  revenueStreams: string[];
  costStructure: string[];
  distributionChannels: string[];
  customerRelationships: string[];
  keyMetrics: string[];
  mvpFeatures: {
    id: string;
    name: string;
    description: string;
    category: "must_have" | "should_have" | "could_have" | "wont_have";
    status: "backlog" | "in_dev" | "shipped";
  }[];
  updatedAt?: string;
}

export interface BudgetPlanType {
  _id?: string;
  workspaceId: string;
  currency: string; // "INR" | "USD"
  initialCash: number;
  oneTimeCosts: { id: string; name: string; amount: number; category: string }[];
  monthlyExpenses: { id: string; name: string; amount: number; category: string }[];
  monthlyRevenues: { id: string; name: string; amount: number; notes?: string }[];
  fundingReceived: { id: string; source: string; amount: number; date: string }[];
  targetAveragePricePerCustomer?: number;
  variableCostPerCustomer?: number;
  updatedAt?: string;
}

export interface PitchDeckSlideType {
  slideNumber: number;
  title: string;
  subtitle?: string;
  bulletPoints: string[];
  speakerNotes?: string;
}

export interface PitchDeckType {
  _id?: string;
  workspaceId: string;
  slides: PitchDeckSlideType[];
  version: number;
  generatedAt: string;
  updatedAt?: string;
}

export interface EquityFounderContribution {
  id: string;
  name: string;
  role: string;
  timeCommitmentHoursPerWeek: number;
  cashInvested: number;
  ipContributionScore: number; // 1 - 5
  executionRiskScore: number; // 1 - 5
  responsibilitiesScore: number; // 1 - 5
  calculatedSharePct: number;
}

export interface EquityScenarioType {
  _id?: string;
  workspaceId: string;
  scenarioName: string;
  founders: EquityFounderContribution[];
  optionPoolPct: number;
  notes?: string;
  updatedAt?: string;
}

export interface SecurityAuditEventType {
  _id?: string;
  workspaceId: string;
  actorId: string;
  actorName: string;
  action:
    | "workspace_created"
    | "privacy_setting_changed"
    | "invite_sent"
    | "invite_accepted"
    | "invite_revoked"
    | "member_role_changed"
    | "member_removed"
    | "nda_signed"
    | "workspace_exported"
    | "misuse_reported";
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface AbuseReportType {
  _id?: string;
  reporterUserId: string;
  reportedWorkspaceId?: string;
  reportedUserId?: string;
  category: "ip_theft" | "harassment" | "spam" | "fake_traction" | "privacy_violation" | "other";
  description: string;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  adminNotes?: string;
  createdAt: string;
}

export interface SubscriptionType {
  _id?: string;
  userId: string;
  plan: "free" | "premium" | "campus";
  status: "active" | "canceled" | "past_due" | "trialing";
  aiMonthlyQuota: number;
  aiUsedThisMonth: number;
  currentPeriodEnd: string;
  razorpaySubscriptionId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
}
