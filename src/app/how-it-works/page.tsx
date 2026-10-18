import React from "react";
import Link from "next/link";
import {
  Shield,
  FileCheck2,
  Users,
  Compass,
  Presentation,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "How It Works — BuildUp Platform",
  description: "Learn how the BuildUp startup validation and collaboration workflow guides founders from idea to MVP.",
};

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      title: "Establish Your Private Workspace with IdeaShield™",
      tagline: "Private by Default • Zero Public Leaks",
      description:
        "Every project begins in an encrypted, private-by-default workspace. Only you and specifically invited collaborators can view your problem statements, roadmaps, customer interviews, and financial assumptions. You decide if and when to expose a limited public preview for discovery.",
      icon: <Shield className="w-6 h-6 text-emerald-600" />,
      badges: ["IdeaShield Active", "Private Storage", "Role-Based Access"],
    },
    {
      step: "02",
      title: "Validate the Problem & Capture Real Customer Feedback",
      tagline: "Empirical User Interviews • No Fake Traction",
      description:
        "Run the AI Idea Validator to generate targeted customer discovery interview scripts, competitor differentiation matrices, and MVP experiments. Log real customer interview quotes in the Customer Validation Hub to test willingness to pay before writing extensive code.",
      icon: <FileCheck2 className="w-6 h-6 text-cyan-600" />,
      badges: ["AI Idea Diagnostics", "Interview Logs", "Consent Records"],
    },
    {
      step: "03",
      title: "Find Complementary Co-Founders & Resolve Skill Gaps",
      tagline: "AI Matching • Synergistic Team Building",
      description:
        "Use the Co-Founder Discovery directory to match with verified students and entrepreneurs. Compatibility algorithms score complementary capabilities (e.g. Technical + Commercial), domain interests, role alignment, and weekly hours. Use the Skill-Gap Analyzer to identify missing execution capabilities.",
      icon: <Users className="w-6 h-6 text-brand-600" />,
      badges: ["Multi-Factor Score", "Connection Requests", "Role Recommendations"],
    },
    {
      step: "04",
      title: "Map the Lean Roadmap & Financial Runway",
      tagline: "Milestones • MoSCoW Prioritization • Burn Economics",
      description:
        "Structure your operational plan across 8 startup stages. Break milestones into assigned tasks with due dates. Plan your MVP with MoSCoW feature categorization, and use the Budget Planner to calculate your exact monthly burn and cash runway months.",
      icon: <Compass className="w-6 h-6 text-amber-600" />,
      badges: ["Stage Roadmaps", "Task Assignments", "Runway Simulator"],
    },
    {
      step: "05",
      title: "Align Equity Fairly & Generate Your Investor Deck",
      tagline: "Objective Ownership Matrix • 12-Slide Pitch Deck",
      description:
        "Calculate fair founder ownership using a 5-pillar mathematical model (Time, Responsibilities, Cash, IP, and Risk) with a reserved option pool. Finally, generate an editable 12-slide venture capital pitch deck with presenter notes ready for PDF export.",
      icon: <Presentation className="w-6 h-6 text-rose-600" />,
      badges: ["Equity Split Math", "Legal Disclaimers", "Pitch Deck Export"],
    },
  ];

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent-violet" />
            <span>The Founder Operating System</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            How BuildUp Works
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            A structured, repeatable methodology designed to take aspiring student and early-stage founders from raw concept to validated, collaborative MVP.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-10 relative">
          <div className="hidden md:block absolute left-8 top-10 bottom-10 w-0.5 bg-slate-200" />

          {steps.map((s, idx) => (
            <div key={s.step} className="relative flex flex-col md:flex-row gap-6 md:gap-10 items-start">
              {/* Step circle */}
              <div className="w-16 h-16 rounded-2xl bg-white border-2 border-brand-600 shadow-md flex items-center justify-center shrink-0 z-10 text-brand-700 font-extrabold text-lg font-mono">
                {s.step}
              </div>

              {/* Card */}
              <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card hover:border-brand-300 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                    {s.tagline}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    {s.icon}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-3">{s.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">{s.description}</p>

                <div className="flex flex-wrap gap-2">
                  {s.badges.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-card max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Ready to test your startup concept?
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Launch your workspace with IdeaShield privacy active in under two minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/startup/new"
              className="px-6 py-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-sm font-semibold shadow transition-all flex items-center gap-2"
            >
              <span>Create Startup Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors"
            >
              View Free & Campus Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
