import React from "react";
import Link from "next/link";
import { AlertTriangle, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms of Service (Draft) — BuildUp",
  description: "Terms of service and platform usage agreements.",
};

export default function TermsOfServicePage() {
  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Legal Disclaimer Alert */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 mb-8">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold">LEGAL REVIEW NOTICE:</span> This terms document is a draft operational outline and requires final validation by qualified legal professionals before binding legal execution.
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card mb-8">
          <div className="flex items-center gap-2.5 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4 text-brand-600" />
            <span>Platform Agreement</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            Last Updated: October 2026 • BuildUp Startup Collaboration Platform
          </p>

          <hr className="my-6 border-slate-100" />

          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-2">
                1. Educational & Discussion Aid Disclaimer
              </h2>
              <p>
                All tools provided on BuildUp—including the Equity Split Calculator, AI Idea Validator, Pitch Deck Generator, Budget Planner, and Co-Founder Compatibility scores—are designed as educational frameworks and collaborative discussion aids. BuildUp does not provide formal legal, tax, accounting, or venture capital investment advice.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-2">
                2. No Commercial or Investment Guarantees
              </h2>
              <p>
                Startup ventures inherently carry substantial operational, market, and execution risks. BuildUp makes no warranties or representations that ideas validated through our tools will achieve commercial success, acquire paying customers, or secure venture funding. Projections and runway estimates are mathematical simulations based solely on user-supplied numbers.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-2">
                3. Ownership of Ideas & User Content
              </h2>
              <p>
                Founders retain full ownership of the startup ideas, customer interviews, business models, and notes they submit to their workspaces. BuildUp claims no intellectual property ownership over your proprietary startup materials.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-2">
                4. Acceptable Conduct & Prohibited Activities
              </h2>
              <p>
                Users agree not to: (a) impersonate others or fabricate false traction or credentials; (b) misappropriate trade secrets or proprietary data shared within confidential workspaces; (c) attempt to circumvent IdeaShield access controls or reverse-engineer private endpoints; or (d) harass, spam, or solicit members outside agreed startup discussions.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-2">
                5. Subscription & Payment Terms
              </h2>
              <p>
                Paid tiers are processed securely via approved payment gateways (such as Razorpay). Users may cancel their recurring subscriptions at any time via the billing management console. Refunds and cancellations adhere to standard operational service levels.
              </p>
            </section>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <Link href="/privacy" className="text-brand-700 hover:underline">
            View Privacy Policy
          </Link>
          <Link href="/contact" className="text-brand-700 hover:underline">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
