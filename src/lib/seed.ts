import { mockDb } from "@/lib/mockDb";
import { UserProfileModel } from "@/models/UserProfile";
import { StartupWorkspaceModel } from "@/models/StartupWorkspace";
import { WorkspaceMembershipModel } from "@/models/WorkspaceMembership";
import { RoadmapModel } from "@/models/Roadmap";
import { IdeaValidationReportModel } from "@/models/IdeaValidationReport";
import { CustomerValidationModel } from "@/models/CustomerValidation";
import { BusinessModelModel } from "@/models/BusinessModel";
import { BudgetPlanModel } from "@/models/BudgetPlan";
import { PitchDeckModel } from "@/models/PitchDeck";
import { EquityScenarioModel } from "@/models/EquityScenario";
import { SubscriptionModel } from "@/models/Subscription";
import { SecurityAuditEventModel } from "@/models/SecurityAuditEvent";
import { AbuseReportModel } from "@/models/AbuseReport";
import { ConnectionRequestModel } from "@/models/ConnectionRequest";

let isSeeding = false;

export async function seedInitialDataIfEmpty(): Promise<void> {
  if (isSeeding) return;
  isSeeding = true;

  try {
    const userCount = await UserProfileModel.countDocuments();
    if (userCount > 0) {
      isSeeding = false;
      return;
    }

    console.log("[MongoDB] Database empty. Seeding initial BuildUp startup workspaces and profiles...");

    // 1. Seed User Profiles
    for (const u of mockDb.users) {
      await UserProfileModel.create({
        userId: u.userId,
        displayName: u.displayName,
        email: u.email,
        avatarUrl: u.avatarUrl,
        bio: u.bio,
        skills: u.skills,
        interests: u.interests,
        preferredDomains: u.preferredDomains,
        goals: u.goals,
        experienceLevel: u.experienceLevel,
        preferredRoles: u.preferredRoles,
        workingStyle: u.workingStyle,
        weeklyHours: u.weeklyHours,
        collaborationMode: u.collaborationMode,
        isPublicInDiscovery: u.isPublicInDiscovery,
        contactPreference: u.contactPreference,
        linkedinUrl: u.linkedinUrl,
        githubUrl: u.githubUrl,
      });
    }

    // 2. Seed Workspaces and their mapped records
    for (const w of mockDb.workspaces) {
      const createdWs = await StartupWorkspaceModel.create({
        name: w.name,
        slug: w.slug,
        tagline: w.tagline,
        description: w.description,
        domain: w.domain,
        stage: w.stage,
        ownerId: w.ownerId,
        visibility: w.visibility,
        previewFields: w.previewFields,
        confidentialityAgreementRequired: w.confidentialityAgreementRequired,
        confidentialityTemplate: w.confidentialityTemplate,
        targetLaunchDate: w.targetLaunchDate,
      });

      const realWsId = createdWs._id.toString();
      const mockWsId = w._id;

      // Seed memberships for this workspace
      const memberships = mockDb.memberships.filter(
        (m) => m.workspaceId === mockWsId || m.workspaceId === w.slug
      );
      for (const m of memberships) {
        await WorkspaceMembershipModel.create({
          workspaceId: realWsId,
          userId: m.userId,
          role: m.role,
          status: m.status,
          joinedAt: m.joinedAt ? new Date(m.joinedAt) : new Date(),
          ndaSignedAt: m.ndaSignedAt ? new Date(m.ndaSignedAt) : undefined,
          invitedBy: m.invitedBy,
          title: m.title,
        });
      }

      // Seed roadmap
      const roadmap = mockDb.roadmaps.find(
        (r) => r.workspaceId === mockWsId || r.workspaceId === w.slug
      );
      if (roadmap) {
        await RoadmapModel.create({
          workspaceId: realWsId,
          currentStage: roadmap.currentStage,
          milestones: roadmap.milestones,
          tasks: roadmap.tasks,
        });
      }

      // Seed idea validation report
      const ideaReport = mockDb.ideaReports.find(
        (ir) => ir.workspaceId === mockWsId || ir.workspaceId === w.slug
      );
      if (ideaReport) {
        await IdeaValidationReportModel.create({
          workspaceId: realWsId,
          createdById: ideaReport.createdById,
          idea: ideaReport.idea,
          targetAudience: ideaReport.targetAudience,
          problem: ideaReport.problem,
          solution: ideaReport.solution,
          competitors: ideaReport.competitors,
          revenueModel: ideaReport.revenueModel,
          assumptions: ideaReport.assumptions,
          validationEvidence: ideaReport.validationEvidence,
          problemClarityScore: ideaReport.problemClarityScore,
          viabilityScore: ideaReport.viabilityScore,
          targetCustomerAnalysis: ideaReport.targetCustomerAnalysis,
          mainAssumptions: ideaReport.mainAssumptions,
          potentialRisks: ideaReport.potentialRisks,
          competitorConsiderations: ideaReport.competitorConsiderations,
          possibleDifferentiation: ideaReport.possibleDifferentiation,
          suggestedExperiments: ideaReport.suggestedExperiments,
          customerQuestions: ideaReport.customerQuestions,
          suggestedMvp: ideaReport.suggestedMvp,
          nextSteps: ideaReport.nextSteps,
          isAIGenerated: ideaReport.isAIGenerated,
        });
      }

      // Seed customer validation hub
      const cvHub = mockDb.customerValidation.find(
        (cv) => cv.workspaceId === mockWsId || cv.workspaceId === w.slug
      );
      if (cvHub) {
        await CustomerValidationModel.create({
          workspaceId: realWsId,
          customerPersonas: cvHub.customerPersonas,
          interviewQuestions: cvHub.interviewQuestions,
          surveyQuestions: cvHub.surveyQuestions,
          feedbackRecords: cvHub.feedbackRecords,
          painPointSummary: cvHub.painPointSummary,
          overallDemandConfidence: cvHub.overallDemandConfidence,
        });
      }

      // Seed business model
      const bm = mockDb.businessModels.find(
        (b) => b.workspaceId === mockWsId || b.workspaceId === w.slug
      );
      if (bm) {
        await BusinessModelModel.create({
          workspaceId: realWsId,
          customerSegments: bm.customerSegments,
          customerProblems: bm.customerProblems,
          valueProposition: bm.valueProposition,
          solution: bm.solution,
          revenueStreams: bm.revenueStreams,
          costStructure: bm.costStructure,
          distributionChannels: bm.distributionChannels,
          customerRelationships: bm.customerRelationships,
          keyMetrics: bm.keyMetrics,
          mvpFeatures: bm.mvpFeatures,
        });
      }

      // Seed budget plan
      const bp = mockDb.budgetPlans.find(
        (b) => b.workspaceId === mockWsId || b.workspaceId === w.slug
      );
      if (bp) {
        await BudgetPlanModel.create({
          workspaceId: realWsId,
          currency: bp.currency,
          initialCash: bp.initialCash,
          oneTimeCosts: bp.oneTimeCosts,
          monthlyExpenses: bp.monthlyExpenses,
          monthlyRevenues: bp.monthlyRevenues,
          fundingReceived: bp.fundingReceived,
          targetAveragePricePerCustomer: bp.targetAveragePricePerCustomer,
          variableCostPerCustomer: bp.variableCostPerCustomer,
        });
      }

      // Seed pitch deck
      const pd = mockDb.pitchDecks.find(
        (p) => p.workspaceId === mockWsId || p.workspaceId === w.slug
      );
      if (pd) {
        await PitchDeckModel.create({
          workspaceId: realWsId,
          slides: pd.slides,
          version: pd.version,
        });
      }

      // Seed equity scenario
      const eq = mockDb.equityScenarios.find(
        (e) => e.workspaceId === mockWsId || e.workspaceId === w.slug
      );
      if (eq) {
        await EquityScenarioModel.create({
          workspaceId: realWsId,
          scenarioName: eq.scenarioName,
          founders: eq.founders,
          optionPoolPct: eq.optionPoolPct,
          notes: eq.notes,
        });
      }

      // Seed audit events
      const auditEvents = mockDb.auditEvents.filter(
        (ae) => ae.workspaceId === mockWsId || ae.workspaceId === w.slug
      );
      for (const ae of auditEvents) {
        await SecurityAuditEventModel.create({
          workspaceId: realWsId,
          actorId: ae.actorId,
          actorName: ae.actorName,
          action: ae.action,
          details: ae.details,
          timestamp: ae.timestamp ? new Date(ae.timestamp) : new Date(),
        });
      }
    }

    // 3. Seed Subscriptions
    for (const sub of mockDb.subscriptions) {
      await SubscriptionModel.create({
        userId: sub.userId,
        plan: sub.plan,
        status: sub.status,
        aiMonthlyQuota: sub.aiMonthlyQuota,
        aiUsedThisMonth: sub.aiUsedThisMonth,
        currentPeriodEnd: sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd) : new Date(),
      });
    }

    // 4. Seed Connections
    for (const conn of mockDb.connections) {
      await ConnectionRequestModel.create({
        senderId: conn.senderId,
        receiverId: conn.receiverId,
        message: conn.message,
        status: conn.status,
      });
    }

    // 5. Seed Abuse Reports
    for (const rep of mockDb.abuseReports) {
      await AbuseReportModel.create({
        reporterUserId: rep.reporterUserId,
        reportedWorkspaceId: rep.reportedWorkspaceId,
        reportedUserId: rep.reportedUserId,
        category: rep.category,
        description: rep.description,
        status: rep.status,
      });
    }

    console.log("[MongoDB] Initial BuildUp seed complete.");
  } catch (err: any) {
    console.error("[MongoDB] Seeding failed:", err.message);
  } finally {
    isSeeding = false;
  }
}
