import React from "react";
import Link from "next/link";
import {
  Users,
  BrainCircuit,
  FileCheck2,
  MessagesSquare,
  Compass,
  Bot,
  Calculator,
  Layers,
  Presentation,
  CheckSquare,
  PieChart,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Features — BuildUp Startup Platform",
  description: "Comprehensive guide to all 12 modules of the BuildUp startup platform.",
};

export default function FeaturesPage() {
  const modules = [
    {
      id: "matching",
      number: "01",
      title: "AI Co-Founder Matching",
      icon: <Users className="w-6 h-6 text-brand-600" />,
      tagline: "Find complementary co-founders based on mathematical synergy, not random chat.",
      description:
        "Calculates multi-dimensional compatibility using complementary skill sets (e.g. Technical + Commercial), shared domain enthusiasm, role friction avoidance (e.g. single CEO clarity), weekly hours parity, and working styles.",
      keyCapabilities: [
        "Dynamic compatibility score with clear factor breakdown",
        "Connection requests with send, accept, decline, and cancel workflows",
        "Only matches against verified opted-in registered users",
        "Explicit disclaimer that estimates guide discovery, not legal partnerships",
      ],
      ctaText: "Discover Co-Founders",
      ctaLink: "/discover",
    },
    {
      id: "skill-gap",
      number: "02",
      title: "Team Skill-Gap Analyzer",
      icon: <BrainCircuit className="w-6 h-6 text-accent-violet" />,
      tagline: "Pinpoint missing competencies before they derail product delivery.",
      description:
        "Analyzes your startup domain and current team's declared skills to generate an automated readiness score. Identifies critical blindspots (e.g. lack of regulatory compliance in FinTech, or missing backend in an AI app) and prescribes exact recruitment roles.",
      keyCapabilities: [
        "Domain-specific competency benchmark matrices",
        "Prioritized recruitment recommendations (Critical, High, Medium)",
        "Resolution tracking as you recruit new team members",
        "Clear distinction between user-provided data and AI suggestions",
      ],
      ctaText: "Try Skill Analyzer",
      ctaLink: "/startup/new",
    },
    {
      id: "idea-validator",
      number: "03",
      title: "AI Idea Validator",
      icon: <FileCheck2 className="w-6 h-6 text-cyan-600" />,
      tagline: "Rigorous 10-point stress test for startup assumptions.",
      description:
        "Privately submit your problem, proposed solution, target audience, and current validation evidence. Generates an objective structured diagnostic report covering problem clarity, risk mitigations, competitor differentiation, and low-cost experiment hypotheses.",
      keyCapabilities: [
        "Problem clarity and market viability scoring",
        "Competitor blindspot analysis with suggested differentiation",
        "Prescribed customer discovery interview scripts",
        "Never fabricates market data or promises guaranteed returns",
      ],
      ctaText: "Validate Startup Idea",
      ctaLink: "/startup/new",
    },
    {
      id: "customer-hub",
      number: "04",
      title: "Customer Validation Hub",
      icon: <MessagesSquare className="w-6 h-6 text-emerald-600" />,
      tagline: "Central repository for real customer interviews and empirical feedback.",
      description:
        "Stop building based on gut feelings. Organize target customer personas, draft structured interview questions, log real verbatim feedback with consent tracking, and categorize validated vs invalidated pain points.",
      keyCapabilities: [
        "Structured interview & survey question designer",
        "Customer persona cards with core frustrations and goals",
        "Feedback log with validation status (Validated, Inconclusive, Invalidated)",
        "AI pain-point synthesis across multiple interviews",
      ],
      ctaText: "Explore Customer Hub",
      ctaLink: "/startup/ws_campusbazaar_101",
    },
    {
      id: "roadmap",
      number: "05",
      title: "AI Startup Roadmap",
      icon: <Compass className="w-6 h-6 text-amber-600" />,
      tagline: "Stage-by-stage operational execution from discovery to growth.",
      description:
        "Follow an adaptable roadmap tailored to your startup stage (Idea Discovery, Problem Validation, Customer Research, MVP Planning, MVP Development, Testing, Launch, Growth). Keep team members aligned on deadlines and dependencies.",
      keyCapabilities: [
        "Milestones with suggested timelines, priorities, and dependencies",
        "Task assignments with due dates and completion toggles",
        "Dynamic progress percentage calculated from real task states",
        "Interactive milestone creation and editing",
      ],
      ctaText: "View Interactive Roadmap",
      ctaLink: "/startup/ws_campusbazaar_101",
    },
    {
      id: "assistant",
      number: "06",
      title: "AI Startup Assistant",
      icon: <Bot className="w-6 h-6 text-purple-600" />,
      tagline: "Context-aware startup mentor inside each workspace.",
      description:
        "Ask questions about customer discovery, unit economics, MVP scoping, and experiment design. The assistant has strict workspace data isolation, meaning it only has context on authorized data for the signed-in user.",
      keyCapabilities: [
        "Server-side AI calls with rate limits and usage accounting",
        "Pragmatic startup mentoring focused on customer validation",
        "Strict isolation preventing cross-workspace data leakage",
        "Clear notification that AI suggestions are advisory",
      ],
      ctaText: "Chat with Assistant",
      ctaLink: "/startup/ws_campusbazaar_101",
    },
    {
      id: "finance",
      number: "07",
      title: "Startup Budget & Finance Planner",
      icon: <Calculator className="w-6 h-6 text-indigo-600" />,
      tagline: "Know your exact runway, burn rate, and break-even targets.",
      description:
        "Input expected one-time setup costs, recurring monthly expenses, revenues, and funding. The planner calculates net monthly burn, remaining runway months, and customer sales units needed to break even.",
      keyCapabilities: [
        "Transparent mathematical formulas displayed clearly",
        "Break-even calculations based on average price & unit variable costs",
        "Distinguishes user projections from actual accounting records",
        "Disclaimer on financial models and risk",
      ],
      ctaText: "Check Financial Planner",
      ctaLink: "/startup/ws_campusbazaar_101",
    },
    {
      id: "business-model",
      number: "08",
      title: "Business Model & MVP Planner",
      icon: <Layers className="w-6 h-6 text-blue-600" />,
      tagline: "Lean Canvas builder combined with MoSCoW MVP feature backlog.",
      description:
        "Map out your 9 canvas blocks: Customer Segments, Problems, Value Proposition, Solutions, Revenue, Costs, Distribution, Relationships, and Key Metrics. Prioritize your engineering backlog into Must Have, Should Have, Could Have, and Later.",
      keyCapabilities: [
        "Interactive editable Lean Canvas blocks",
        "MoSCoW MVP feature prioritization board",
        "Status tracking for feature development (Backlog, In Dev, Shipped)",
        "Zero fluff — focuses on the core user action",
      ],
      ctaText: "Build Business Model",
      ctaLink: "/startup/ws_campusbazaar_101",
    },
    {
      id: "pitch-deck",
      number: "09",
      title: "Pitch Deck Generator",
      icon: <Presentation className="w-6 h-6 text-rose-600" />,
      tagline: "12-slide standard investor presentation outline.",
      description:
        "Generate a complete 12-slide investor deck incorporating your workspace problem, solution, TAM, business model, competition, early traction, team, and funding ask. Includes speaker notes and clean print/PDF export formatting.",
      keyCapabilities: [
        "12 structured slides adhering to venture capital standards",
        "Editable bullet points and presenter speaker notes",
        "Built-in Print & PDF export layout",
        "Honest presentation: never fabricates unverified metrics",
      ],
      ctaText: "Generate Pitch Deck",
      ctaLink: "/startup/ws_campusbazaar_101",
    },
    {
      id: "collaboration",
      number: "10",
      title: "Team Tasks & Collaboration",
      icon: <CheckSquare className="w-6 h-6 text-teal-600" />,
      tagline: "Role-based permissions, invitations, and milestone task management.",
      description:
        "Invite collaborators with specific permissions: Owner, Administrator, Member, or Read-Only Viewer. Assign tasks to specific teammates with due dates, priorities, and status updates.",
      keyCapabilities: [
        "Secure tokenized invitations with expiration dates",
        "Four explicit permission tiers (Owner, Admin, Member, Viewer)",
        "Task assignments linked to roadmap milestones",
        "Server-enforced access checks on every mutation",
      ],
      ctaText: "Explore Team Workflows",
      ctaLink: "/startup/ws_campusbazaar_101",
    },
    {
      id: "equity",
      number: "11",
      title: "Equity Split Calculator",
      icon: <PieChart className="w-6 h-6 text-orange-600" />,
      tagline: "Objective 5-factor weighting model for fair founder ownership.",
      description:
        "Avoid co-founder disputes with an objective model evaluating Time Commitment (35%), Responsibilities (20%), Cash Invested (20%), IP/Inception (15%), and Risk (10%), with an unallocated option pool for future employees.",
      keyCapabilities: [
        "Dynamic multi-factor weighting normalization",
        "Configurable Employee Stock Option Pool (ESOP %)",
        "Scenario comparison notes and founder vesting recommendations",
        "Clear legal disclaimer that this serves as a discussion aid",
      ],
      ctaText: "Calculate Founder Equity",
      ctaLink: "/startup/ws_campusbazaar_101",
    },
    {
      id: "ideashield",
      number: "12",
      title: "IdeaShield™ Privacy Protection",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      tagline: "Private-by-default architecture ensuring zero unauthorized idea leaks.",
      description:
        "Every new workspace is private by default. Features granular field-level public preview toggles, revocable memberships, immutable security audit event logs, misuse reporting, and optional confidentiality agreement (NDA) workflows.",
      keyCapabilities: [
        "Private-by-default: non-members cannot read private startup data",
        "Server-side access checks preventing IDOR vulnerabilities",
        "Immutable access history audit log viewer",
        "Immediate member revocation and IP misuse report mechanism",
      ],
      ctaText: "Inspect IdeaShield Engine",
      ctaLink: "/settings/privacy",
    },
  ];

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent-violet" />
            <span>Complete Architecture Overview</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            The 12 Core BuildUp Modules
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Engineered specifically to solve the real bottlenecks faced by early-stage founders: co-founder discovery, problem validation, execution pacing, and confidential IP protection.
          </p>
        </div>

        {/* Modules List */}
        <div className="space-y-8">
          {modules.map((m) => (
            <div
              key={m.id}
              id={m.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card hover:border-brand-300 transition-all scroll-mt-24"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
                      Module {m.number}
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900">{m.title}</h2>
                  </div>

                  <p className="text-sm font-semibold text-brand-700 mb-3">{m.tagline}</p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{m.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                    {m.keyCapabilities.map((cap, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0 mt-1.5" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:w-64 shrink-0 flex flex-col justify-between self-stretch pt-4 lg:pt-0 lg:border-l lg:border-slate-100 lg:pl-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                    {m.icon}
                  </div>
                  <Link
                    href={m.ctaLink}
                    className="w-full text-center py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-brand-900 text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5 group"
                  >
                    <span>{m.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-navy-900 text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            Start building your startup today with BuildUp
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6">
            Private by default, collaborative by design. Set up your workspace or discover co-founders now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/startup/new"
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold shadow-md transition-colors"
            >
              Create Free Workspace
            </Link>
            <Link
              href="/discover"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors"
            >
              Browse Potential Co-Founders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
