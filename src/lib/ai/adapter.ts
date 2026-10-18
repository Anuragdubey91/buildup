import {
  IdeaValidationReportType,
  SkillGapAnalysisReport,
  RoadmapMilestoneType,
  PitchDeckSlideType,
} from "@/types";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIServiceResponse<T> {
  success: boolean;
  data?: T;
  isMock: boolean;
  providerNotice?: string;
  error?: string;
}

const AI_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_MINUTE = 15;
const requestLog = new Map<string, number[]>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(userId) || [];
  const validTimestamps = timestamps.filter((t) => now - t < AI_RATE_LIMIT_WINDOW_MS);
  if (validTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  validTimestamps.push(now);
  requestLog.set(userId, validTimestamps);
  return true;
}

export class AIProviderAdapter {
  private static getProviderInfo() {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const provider = process.env.AI_PROVIDER || (geminiKey ? "gemini" : openaiKey ? "openai" : "heuristic");
    const model = process.env.AI_MODEL_NAME || (provider === "gemini" ? "gemini-1.5-flash" : "gpt-4o-mini");

    const hasLiveKey = Boolean(
      (provider === "gemini" && geminiKey && !geminiKey.includes("sample")) ||
      (provider === "openai" && openaiKey && !openaiKey.includes("sample"))
    );

    return { provider, model, hasLiveKey, geminiKey, openaiKey };
  }

  /**
   * Feature 3: AI Idea Validator
   */
  static async validateStartupIdea(
    userId: string,
    input: {
      idea: string;
      targetAudience: string;
      problem: string;
      solution: string;
      competitors?: string;
      revenueModel?: string;
      assumptions?: string;
      validationEvidence?: string;
    }
  ): Promise<AIServiceResponse<Partial<IdeaValidationReportType>>> {
    if (!checkRateLimit(userId)) {
      return {
        success: false,
        isMock: false,
        error: "Rate limit reached. Please wait a moment before sending more AI requests.",
      };
    }

    const { hasLiveKey, provider, model, geminiKey } = this.getProviderInfo();

    if (hasLiveKey && provider === "gemini" && geminiKey) {
      try {
        const systemPrompt = `You are a rigorous startup validator and venture capitalist. Evaluate the following startup idea. You must output raw JSON with this exact structure:
{
  "problemClarityScore": 0-100,
  "viabilityScore": 0-100,
  "targetCustomerAnalysis": "detailed analysis",
  "mainAssumptions": ["assumption 1", "assumption 2", "assumption 3"],
  "potentialRisks": [{"risk": "...", "severity": "high"|"medium"|"low", "mitigation": "..."}],
  "competitorConsiderations": "analysis of direct and indirect competitors",
  "possibleDifferentiation": ["diff 1", "diff 2", "diff 3"],
  "suggestedExperiments": [{"name": "...", "hypothesis": "...", "metric": "...", "timelineDays": 7}],
  "customerQuestions": ["question 1", "question 2", "question 3"],
  "suggestedMvp": [{"coreFeature": "...", "description": "...", "effort": "low"|"medium"|"high"}],
  "nextSteps": ["step 1", "step 2", "step 3"]
}`;

        const userPrompt = JSON.stringify(input);
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Input:\n${userPrompt}` }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return {
              success: true,
              data: {
                ...input,
                ...parsed,
                isAIGenerated: true,
              },
              isMock: false,
            };
          }
        }
      } catch (e) {
        console.warn("[AI Adapter] Gemini call failed, falling back to heuristic engine:", e);
      }
    }

    // Heuristic Engine fallback when live AI keys are not provided
    const clarityScore = Math.min(
      95,
      Math.max(60, Math.floor(input.problem.length / 5) + Math.floor(input.solution.length / 5))
    );

    return {
      success: true,
      isMock: true,
      providerNotice:
        "AI Provider Notice: Live API key is not configured in .env.local. Running heuristic evaluation engine. Add GEMINI_API_KEY to activate live generative models.",
      data: {
        ...input,
        problemClarityScore: clarityScore,
        viabilityScore: Math.floor(clarityScore * 0.92),
        targetCustomerAnalysis: `Primary target audience is ${input.targetAudience}. Early adopters will experience highest pain frequency around ${input.problem.slice(0, 80)}.`,
        mainAssumptions: [
          `Target users currently experience enough friction with ${input.competitors || "existing alternatives"} to switch.`,
          `Unit economics can support customer acquisition via organic or community channels.`,
          `Users are willing to pay under the proposed ${input.revenueModel || "monetization model"}.`,
        ],
        potentialRisks: [
          {
            risk: "Customer Inertia & Alternative Friction",
            severity: "high",
            mitigation: "Create a 10x lower onboarding threshold than existing solutions.",
          },
          {
            risk: "Distribution & Discovery Bottleneck",
            severity: "medium",
            mitigation: "Focus on a single tight niche audience before horizontal expansion.",
          },
        ],
        competitorConsiderations: `While competitors like ${input.competitors || "generic market options"} exist, they often suffer from broad focus and lack deep specialization for ${input.targetAudience}.`,
        possibleDifferentiation: [
          "Hyper-focused user onboarding tailored specifically to core pain point",
          "Significantly faster time-to-value compared to legacy alternatives",
          "Community-driven network effects and peer trust",
        ],
        suggestedExperiments: [
          {
            name: "High-Intent Landing Page Waitlist",
            hypothesis: "At least 15% of visitors from targeted niche communities will join waitlist",
            metric: "Waitlist conversions with verified intent",
            timelineDays: 5,
          },
          {
            name: "Customer Discovery Interviews",
            hypothesis: "7 out of 10 interviewees express that this problem ranks in their top 3 weekly frustrations",
            metric: "Problem resonance score",
            timelineDays: 7,
          },
        ],
        customerQuestions: [
          "How do you currently resolve this problem today, and what is most frustrating about that process?",
          "How much time or money did you spend trying to solve this over the past 30 days?",
          "If this solution existed right now, what would prevent you from using it immediately?",
        ],
        suggestedMvp: [
          {
            coreFeature: "Core Problem Solving Workflow",
            description: "Minimal self-contained workflow directly addressing the primary complaint",
            effort: "medium",
          },
          {
            coreFeature: "Fast User Feedback & Rating Loop",
            description: "Direct in-app channel to capture user quotes and satisfaction",
            effort: "low",
          },
        ],
        nextSteps: [
          "Complete at least 15 customer discovery interviews using the generated question script",
          "Document competitor pricing models and feature gaps in the Customer Validation Hub",
          "Map initial MVP scope into MoSCoW prioritization list",
        ],
        isAIGenerated: true,
      },
    };
  }

  /**
   * Feature 2: Team Skill-Gap Analyzer
   */
  static analyzeSkillGaps(
    startupDomain: string,
    currentSkills: string[]
  ): SkillGapAnalysisReport {
    const domainLower = startupDomain.toLowerCase();

    // Baseline required competencies by domain
    const standardRequirements: Array<{
      skill: string;
      category: "technical" | "business" | "product" | "marketing" | "design" | "operations" | "legal";
      priority: "critical" | "high" | "medium" | "low";
      role: string;
    }> = [
      { skill: "Product Strategy & Roadmap", category: "product", priority: "critical", role: "Chief Product Officer / Founder" },
      { skill: "Frontend & UI Engineering", category: "technical", priority: "critical", role: "Frontend Lead" },
      { skill: "Backend Architecture & APIs", category: "technical", priority: "critical", role: "Backend / Full-Stack Engineer" },
      { skill: "Customer Discovery & Research", category: "product", priority: "high", role: "Product Researcher" },
      { skill: "Growth & Content Marketing", category: "marketing", priority: "high", role: "Growth Marketer" },
      { skill: "Financial Modeling & Unit Economics", category: "business", priority: "medium", role: "Finance Lead" },
    ];

    if (domainLower.includes("fintech") || domainLower.includes("health")) {
      standardRequirements.push({
        skill: "Regulatory Compliance & Security",
        category: "legal" as const,
        priority: "critical" as const,
        role: "Compliance & Security Advisor",
      });
    }

    if (domainLower.includes("ai") || domainLower.includes("ml")) {
      standardRequirements.push({
        skill: "Prompt Engineering & Model Fine-Tuning",
        category: "technical" as const,
        priority: "critical" as const,
        role: "AI Engineer",
      });
    }

    const currentSkillsNormalized = currentSkills.map((s) => s.toLowerCase());

    const missingSkills = standardRequirements.map((req) => {
      const isCovered = currentSkillsNormalized.some(
        (cs) => cs.includes(req.skill.toLowerCase()) || req.skill.toLowerCase().includes(cs)
      );

      return {
        skill: req.skill,
        category: req.category,
        status: (isCovered ? "covered" : "missing") as "covered" | "missing",
        priority: req.priority,
        reason: isCovered
          ? "Present in existing team capabilities."
          : `Essential for ${startupDomain} startup execution. Without it, development speed and product quality will be severely bottlenecked.`,
        recommendedRole: req.role,
        isResolved: isCovered,
      };
    });

    const covered = missingSkills.filter((s) => s.status === "covered").map((s) => s.skill);
    const missing = missingSkills.filter((s) => s.status === "missing");

    const readinessScore = Math.round((covered.length / standardRequirements.length) * 100);

    const recruitmentRecommendations = missing
      .filter((m) => m.priority === "critical" || m.priority === "high")
      .map((m) => ({
        roleTitle: m.recommendedRole,
        priority: m.priority,
        keyResponsibilities: [
          `Own and execute ${m.skill}`,
          `Collaborate with current team on ${startupDomain} implementation`,
          `Establish standards and documentation for ${m.category} domain`,
        ],
        justification: m.reason,
      }));

    return {
      workspaceId: "",
      startupName: "",
      domain: startupDomain,
      stage: "idea_discovery",
      analyzedAt: new Date().toISOString(),
      overallReadinessScore: readinessScore,
      coveredSkills: covered,
      missingSkills: missing,
      recruitmentRecommendations,
    };
  }

  /**
   * Feature 6: AI Startup Assistant
   */
  static async chatAssistant(
    userId: string,
    workspaceContext: {
      name: string;
      domain: string;
      stage: string;
      tagline?: string;
    },
    messages: ChatMessage[]
  ): Promise<AIServiceResponse<string>> {
    if (!checkRateLimit(userId)) {
      return {
        success: false,
        isMock: false,
        error: "Rate limit reached. Please wait a moment before sending more messages.",
      };
    }

    const { hasLiveKey, provider, model, geminiKey } = this.getProviderInfo();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    if (hasLiveKey && provider === "gemini" && geminiKey) {
      try {
        const systemPrompt = `You are BuildUp Assistant, an experienced, pragmatic startup mentor.
You have access only to the current authorized workspace:
- Startup Name: ${workspaceContext.name}
- Domain: ${workspaceContext.domain}
- Stage: ${workspaceContext.stage}
- Tagline: ${workspaceContext.tagline || "None"}

Provide actionable, concise, startup advice. Be realistic, never guarantee success, and highlight validation and customer interviews.`;

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemPrompt}\n\nUser Question:\n${lastUserMessage}` },
                ],
              },
            ],
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const reply = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return {
              success: true,
              data: reply,
              isMock: false,
            };
          }
        }
      } catch (err) {
        console.warn("[AI Assistant] Gemini call error:", err);
      }
    }

    // Heuristic Assistant response
    let reply = `Here are strategic recommendations for **${workspaceContext.name}** (${workspaceContext.domain}, Stage: ${workspaceContext.stage}):\n\n`;

    if (lastUserMessage.toLowerCase().includes("interview") || lastUserMessage.toLowerCase().includes("question")) {
      reply += `1. **Focus on past behavior, not hypothetical intent**: Ask *"Can you describe the last time you faced this problem?"* instead of *"Would you pay for an app that solves this?"*\n2. **Look for non-obvious workarounds**: Inquire what spreadsheets, manual processes, or hacks they currently use.\n3. **Assess problem urgency**: Ask where solving this ranks relative to their other weekly priorities.`;
    } else if (lastUserMessage.toLowerCase().includes("mvp") || lastUserMessage.toLowerCase().includes("feature")) {
      reply += `1. **The 'One Core Action' Rule**: Strip away all secondary features (e.g. social logins, complex dashboards, automated exports). Build only the single core loop that delivers immediate value.\n2. **MoSCoW Prioritization**: Keep only 'Must Have' items in your sprint. Everything else belongs in 'Later'.\n3. **Set a hard deadline**: Ship your MVP to 10 pilot users within 30 days.`;
    } else if (lastUserMessage.toLowerCase().includes("pricing") || lastUserMessage.toLowerCase().includes("monetiz")) {
      reply += `1. **Anchor against alternative cost**: If the problem currently costs the user ₹5,000/month in lost time or manual labor, pricing at ₹499 - ₹999 represents high perceived ROI.\n2. **Start with simple flat pricing**: Avoid complex tiers until you have at least 20 paying customers.\n3. **Test willingness early**: Offer a discounted annual pre-order during customer validation.`;
    } else {
      reply += `1. **Current Stage Focus (${workspaceContext.stage})**: Prioritize validating high-risk assumptions with real customer feedback before writing extensive code.\n2. **Next Key Step**: Check your Customer Validation Hub to review recent feedback notes and confirm that demand is genuine.\n3. **Resource Management**: Keep your monthly burn low using the Budget Planner so you have at least 9 months of runway.`;
    }

    reply += `\n\n*Note: AI responses are advisory suggestions and should be verified through direct customer experiments.*`;

    return {
      success: true,
      data: reply,
      isMock: true,
      providerNotice: "Advisory response generated by offline startup intelligence engine. Configure GEMINI_API_KEY for real-time generative chat.",
    };
  }

  /**
   * Feature 5: AI Startup Roadmap Generator
   */
  static generateDefaultMilestones(stage: string, domain: string): RoadmapMilestoneType[] {
    return [
      {
        id: "ms_gen_1",
        title: "Target Customer Persona & Problem Validation",
        stage: "problem_validation",
        description: `Define 2 core customer personas in ${domain} and execute 15 structured problem validation interviews.`,
        priority: "critical",
        suggestedTimelineWeeks: 2,
        status: "in_progress",
        dependencies: [],
      },
      {
        id: "ms_gen_2",
        title: "Lean MVP Scope & Architecture Plan",
        stage: "mvp_planning",
        description: "Specify the single core user loop, database schema, and security controls.",
        priority: "high",
        suggestedTimelineWeeks: 2,
        status: "todo",
        dependencies: ["ms_gen_1"],
      },
      {
        id: "ms_gen_3",
        title: "Core Feature Prototype Development",
        stage: "mvp_development",
        description: "Build working functional prototype with end-to-end data persistence and validation.",
        priority: "critical",
        suggestedTimelineWeeks: 4,
        status: "todo",
        dependencies: ["ms_gen_2"],
      },
      {
        id: "ms_gen_4",
        title: "Pilot Alpha Testing with 20 Target Users",
        stage: "testing",
        description: "Deploy to closed group of test users; track retention, drop-offs, and critical bugs.",
        priority: "high",
        suggestedTimelineWeeks: 2,
        status: "todo",
        dependencies: ["ms_gen_3"],
      },
      {
        id: "ms_gen_5",
        title: "Public Soft Launch & Feedback Loop",
        stage: "launch",
        description: "Launch public waitlist onboarding, initiate payment gateway, and run initial marketing sprint.",
        priority: "critical",
        suggestedTimelineWeeks: 3,
        status: "todo",
        dependencies: ["ms_gen_4"],
      },
    ];
  }

  /**
   * Feature 9: Pitch Deck Outline Generator
   */
  static generatePitchDeckSlides(
    startupName: string,
    domain: string,
    tagline: string
  ): PitchDeckSlideType[] {
    return [
      {
        slideNumber: 1,
        title: startupName,
        subtitle: tagline || `Building the future of ${domain}`,
        bulletPoints: [
          "Founder Presentation Deck",
          `Domain: ${domain}`,
          "Confidential — For Discussion Purposes Only",
        ],
        speakerNotes: "Introduce yourself and the high-level founding vision.",
      },
      {
        slideNumber: 2,
        title: "The Problem",
        subtitle: "A Significant, Urgent Unmet Need",
        bulletPoints: [
          "Current solutions are fragmented, expensive, or insecure",
          "Users waste countless hours and money dealing with manual workarounds",
          "Market friction is growing as demands increase",
        ],
        speakerNotes: "Ground the problem in real user stories from your customer validation research.",
      },
      {
        slideNumber: 3,
        title: "The Solution",
        subtitle: "A 10x Better Product Experience",
        bulletPoints: [
          "Streamlined workflow built specifically for target customers",
          "Zero unnecessary overhead and rapid time to value",
          "Delivering measurable ROI within days of adoption",
        ],
        speakerNotes: "Show how your product fundamentally alters the status quo.",
      },
      {
        slideNumber: 4,
        title: "Target Market & TAM",
        subtitle: "Substantial Growth Opportunity",
        bulletPoints: [
          "Initial serviceable addressable market (SAM) highly concentrated",
          "Clear beachhead strategy to capture early adopters",
          "Favorable macroeconomic tailwinds driving category adoption",
        ],
        speakerNotes: "Highlight bottom-up market sizing rather than generic multi-billion dollar claims.",
      },
      {
        slideNumber: 5,
        title: "Product & Architecture",
        subtitle: "Engineered for Reliability and Scale",
        bulletPoints: [
          "Modern responsive stack with sub-second performance",
          "IdeaShield security and enterprise-grade privacy by default",
          "Continuous customer telemetry and rapid iteration loop",
        ],
        speakerNotes: "Demonstrate product craftsmanship and technical moat.",
      },
      {
        slideNumber: 6,
        title: "Business Model & Monetization",
        subtitle: "Predictable, High-Margin Unit Economics",
        bulletPoints: [
          "Tiered subscription plans (Free & Premium tiers)",
          "Low cost of goods sold (COGS) yielding strong gross margins",
          "Clear expansion path through volume usage and institutional licenses",
        ],
        speakerNotes: "Explain customer lifetime value (LTV) and sustainable unit economics.",
      },
      {
        slideNumber: 7,
        title: "Competitive Landscape & Moat",
        subtitle: "Why We Win",
        bulletPoints: [
          "Incumbents: Slow, outdated legacy user experience",
          "Generic Tools: Lack deep vertical integration and domain intelligence",
          "Our Moat: High switching costs, data flywheel, and privacy-first architecture",
        ],
        speakerNotes: "Acknowledge competitors respectfully while highlighting clear differentiation.",
      },
      {
        slideNumber: 8,
        title: "Go-to-Market Strategy",
        subtitle: "Efficient, Community-Led Distribution",
        bulletPoints: [
          "Targeted outreach through specialized industry communities",
          "Product-led growth loops and organic word-of-mouth referral",
          "Strategic partnerships with university entrepreneurship cells and hubs",
        ],
        speakerNotes: "Walk through customer acquisition channels and proven low CAC experiments.",
      },
      {
        slideNumber: 9,
        title: "Validation & Traction",
        subtitle: "Early Proof of Product-Market Fit",
        bulletPoints: [
          "Documented customer interviews confirming high problem severity",
          "Growing waitlist of pre-launch committed users",
          "Strong engagement with early MVP test cohorts",
        ],
        speakerNotes: "Share verified customer quotes and real validation metrics.",
      },
      {
        slideNumber: 10,
        title: "Financial Plan & Runway",
        subtitle: "Disciplined Capital Allocation",
        bulletPoints: [
          "Lean operational burn rate prioritized on core engineering and validation",
          "12-18 month runway roadmap to reach cash flow sustainability",
          "Detailed budget and unit economics tracked in real time",
        ],
        speakerNotes: "Reiterate financial discipline and transparent assumptions.",
      },
      {
        slideNumber: 11,
        title: "The Team",
        subtitle: "Proven Builders and Domain Operators",
        bulletPoints: [
          "Complementary technical, product, and operational leadership",
          "Track record of shipping software and scaling user communities",
          "Supported by experienced startup mentors and advisors",
        ],
        speakerNotes: "Demonstrate founder-market fit and team resilience.",
      },
      {
        slideNumber: 12,
        title: "The Ask & Next Milestones",
        subtitle: "Partnering for the Next Phase",
        bulletPoints: [
          "Seeking strategic partners, angel investment, and early design partners",
          "Milestone 1: Ship production v1 to 100 pilot organizations",
          "Milestone 2: Achieve monthly recurring revenue milestones",
          "Get in touch: founders@buildup.dev",
        ],
        speakerNotes: "State the clear investment ask and immediate milestones.",
      },
    ];
  }
}
