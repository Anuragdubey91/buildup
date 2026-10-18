"use client";

import React from "react";
import Link from "next/link";
import {
  Rocket,
  Shield,
  Users,
  BrainCircuit,
  Compass,
  PieChart,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  FileText,
  MessageSquare,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  const coreFeatures = [
    {
      icon: <Users className="w-6 h-6 text-brand-600" />,
      title: "AI Co-Founder Matching",
      description:
        "Match with students and entrepreneurs using complementary skills, weekly hours, working styles, and verified domain alignment.",
      link: "/discover",
      badge: "Feature 1",
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-accent-violet" />,
      title: "Team Skill-Gap Analyzer",
      description:
        "Detect missing execution capabilities in your founding team and generate prioritized role recruitment recommendations.",
      link: "/features#skill-gap",
      badge: "Feature 2",
    },
    {
      icon: <FileText className="w-6 h-6 text-cyan-600" />,
      title: "AI Idea Validator",
      description:
        "Privately test problem clarity, market assumptions, competitor differentiation, and lean experiments with structured reports.",
      link: "/features#idea-validator",
      badge: "Feature 3",
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-600" />,
      title: "IdeaShield™ Security",
      description:
        "Private-by-default architecture. Granular permission-based access, audit trails, and limited public previews protect your startup IP.",
      link: "/settings/privacy",
      badge: "Feature 12",
    },
    {
      icon: <Compass className="w-6 h-6 text-amber-600" />,
      title: "AI Startup Roadmap",
      description:
        "From Idea Discovery to Launch: structured milestones, dependencies, team task assignments, and progress tracking.",
      link: "/features#roadmap",
      badge: "Feature 5",
    },
    {
      icon: <PieChart className="w-6 h-6 text-rose-600" />,
      title: "Equity & Finance Calculators",
      description:
        "Objective 5-pillar equity split models and cash runway projections based on actual transparent formulas.",
      link: "/features#equity",
      badge: "Feature 7 & 11",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-slate-50 to-brand-50/30 border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(#3664d0_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-accent-violet" />
              <span>The Complete Platform for Student & Aspiring Founders</span>
              <span className="text-slate-300">•</span>
              <span className="text-brand-900 font-bold">100% Private by Default</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Find Your Team. <br />
              <span className="bg-gradient-to-r from-brand-700 via-brand-600 to-accent-violet bg-clip-text text-transparent">
                Build Your Dream.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              BuildUp gives you the complete startup operating system: match with complementary co-founders, validate real customer pain with AI, map your MVP roadmap, and safeguard confidential ideas with <strong>IdeaShield™</strong>.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/startup/new"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <span>Launch Startup Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/discover"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4 text-brand-600" />
                <span>Explore Co-Founders</span>
              </Link>
            </div>

            {/* Trust Points */}
            <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Private-by-Default Architecture</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>Zero Fabricated Traction</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-accent-violet" />
                <span>Server-Side AI Inference</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">
              All Twelve Core Modules
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Everything Needed to Go From Idea to Funded MVP
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Not a static landing page or basic checklist. BuildUp provides end-to-end interactive tools with real persistence and privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feat) => (
              <div
                key={feat.title}
                className="p-6 rounded-2xl border border-slate-200/90 hover:border-brand-300 hover:shadow-card transition-all bg-white flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {feat.icon}
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>
                <Link
                  href={feat.link}
                  className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
                >
                  <span>Explore Feature</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-brand-700 transition-colors"
            >
              <span>View full technical breakdown of all 12 modules</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* IdeaShield Security Focus Banner */}
      <section className="py-16 bg-navy-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>IdeaShield™ Privacy Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Your Idea Stays Confidential Until You Choose to Disclose It
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Most platforms make everything public by default. BuildUp enforces strict private-by-default storage. Only authorized members can inspect roadmaps, customer interviews, and financial projections.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-200">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>No Insecure Direct Object Access (IDOR)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Immutable security audit event logging</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>One-click team access revocation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Optional confidentiality agreements (NDA)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-navy-850 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  Workspace Privacy Status
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-semibold">
                  PRIVATE (Default)
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Public Discovery Visibility</span>
                  <span className="text-slate-400">Disabled</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Authorized Members</span>
                  <span className="text-white font-medium">Invited Only</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Confidentiality Acknowledgment</span>
                  <span className="text-emerald-400 font-medium">Recorded</span>
                </div>
              </div>
              <Link
                href="/settings/privacy"
                className="mt-5 w-full block text-center py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                Inspect IdeaShield Controls
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow CTA */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Ready to find your team and build your dream?
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Create your first private startup workspace in less than 2 minutes.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/startup/new"
              className="px-6 py-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm shadow transition-all"
            >
              Get Started Free
            </Link>
            <Link
              href="/how-it-works"
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-sm transition-all"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
