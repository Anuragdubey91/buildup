"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Shield, Sparkles, HelpCircle, ArrowRight, Lock } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function PricingPage() {
  const toast = useToast();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const plans = [
    {
      id: "free",
      name: "Student & Explorer",
      badge: "Free Forever",
      price: "₹0",
      period: "forever",
      description: "Everything you need to test an idea and find your initial co-founder.",
      features: [
        "Up to 2 Private Startup Workspaces",
        "AI Co-Founder Matching & Discovery",
        "25 AI Idea & Assistant queries / month",
        "Full IdeaShield™ Private-by-Default security",
        "Customer Validation Hub & Feedback records",
        "Interactive 8-stage Startup Roadmap",
        "Basic Cash Runway & Expense calculator",
      ],
      ctaText: "Start Free Now",
      ctaHref: "/startup/new",
      isPrimary: false,
    },
    {
      id: "premium",
      name: "Founder Pro",
      badge: "Most Popular",
      price: billingCycle === "monthly" ? "₹499" : "₹399",
      period: billingCycle === "monthly" ? "per month" : "per month (billed annually)",
      description: "For active founding teams building and testing their MVP with advanced AI.",
      features: [
        "Unlimited Private Startup Workspaces",
        "250 Advanced AI queries / month",
        "Priority Gemini 1.5 Pro inference speed",
        "Printable Pitch Deck PDF & PPTX Export",
        "Unit Economics & Break-Even Simulation",
        "Full IdeaShield Security Audit History exports",
        "Priority Co-Founder Match badge",
        "Dedicated Team Role & Task Collaboration",
      ],
      ctaText: "Upgrade to Founder Pro",
      ctaHref: "/settings/billing",
      isPrimary: true,
    },
    {
      id: "campus",
      name: "Campus E-Cell Partner",
      badge: "University Cohorts",
      price: "₹2,499",
      period: "per semester batch",
      description: "Tailored for college incubators, entrepreneurship cells, and student hackathons.",
      features: [
        "Up to 50 Student Founder Accounts",
        "Central E-Cell Mentor Overview Dashboard",
        "Unlimited AI Idea Validations for cohort",
        "Custom Campus Verification (.edu badge)",
        "Dedicated onboarding workshop support",
      ],
      ctaText: "Contact Campus Team",
      ctaHref: "/contact?subject=campus",
      isPrimary: false,
    },
  ];

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent-violet" />
            <span>Transparent Startup Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Fair Plans for Ambitious Founders
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Start completely free. Upgrade only when your startup needs deeper AI diagnostics, pitch deck exports, or multi-workspace capacity.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center p-1 rounded-xl bg-slate-200/80 border border-slate-300">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`rounded-2xl p-8 flex flex-col justify-between transition-all ${
                p.isPrimary
                  ? "bg-white border-2 border-brand-600 shadow-xl relative scale-105 z-10"
                  : "bg-white border border-slate-200 shadow-card hover:border-slate-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">{p.name}</h2>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      p.isPrimary
                        ? "bg-brand-50 text-brand-700 border border-brand-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {p.badge}
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-4xl font-extrabold text-slate-900">{p.price}</span>
                  <span className="text-xs text-slate-500 ml-1.5">/ {p.period}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">{p.description}</p>

                <div className="border-t border-slate-100 pt-6 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Included Capabilities
                  </p>
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href={p.ctaHref}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-xs text-center block shadow transition-all ${
                    p.isPrimary
                      ? "bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/20"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {p.ctaText}
                </Link>
                {p.id === "free" && (
                  <p className="text-center text-[10px] text-slate-400 mt-2">
                    No credit card or payment required
                  </p>
                )}
                {p.id === "premium" && (
                  <p className="text-center text-[10px] text-slate-400 mt-2">
                    Razorpay Test Mode Active • Cancel anytime
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Security & Payment Transparency Note */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-4xl mx-auto shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div className="space-y-1 text-xs text-slate-600">
              <h3 className="font-bold text-sm text-slate-900">
                IdeaShield & Payment Processing Transparency
              </h3>
              <p className="leading-relaxed">
                Payments are securely processed via Razorpay in test/production mode with server-side signature verification. BuildUp never stores raw credit card numbers. Your private startup workspaces, financial plans, and validation records remain strictly confidential under IdeaShield protection regardless of subscription tier.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 text-xs">
            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">
                Is the Free plan truly free forever for students?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Yes. You can create up to 2 full startup workspaces, match with co-founders, run 25 AI queries monthly, and log unlimited customer interviews with zero charges.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">
                How does payment testing work during development?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                BuildUp integrates Razorpay test mode. During development, you can test subscription upgrades safely without any actual bank or UPI debit. Server-side verification strictly verifies cryptographic signatures.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">
                Does upgrading give anyone else access to my private ideas?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                No. IdeaShield privacy is identical across all plans. Your workspaces remain private by default, accessible only to explicitly authorized members.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
