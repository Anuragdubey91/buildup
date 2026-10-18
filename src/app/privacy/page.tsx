import React from "react";
import Link from "next/link";
import { Shield, AlertTriangle, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy (Draft) — BuildUp",
  description: "IdeaShield privacy policy and data governance practices.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Legal Disclaimer Alert */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 mb-8">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold">LEGAL REVIEW NOTICE:</span> This document represents an architectural and policy draft reflecting BuildUp&apos;s current data protection controls. It is subject to formal review and finalization by licensed legal counsel before production corporate deployment.
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card mb-8">
          <div className="flex items-center gap-2.5 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>IdeaShield™ Privacy Architecture</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy & Idea Protection
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            Last Updated: October 2026 • Effective for all BuildUp workspaces
          </p>

          <hr className="my-6 border-slate-100" />

          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-2">
                1. Private-by-Default Commitment
              </h2>
              <p>
                Every startup workspace created on BuildUp is initialized in a strictly <strong>private</strong> state. Only the workspace creator and users explicitly invited with authorized membership roles (Admin, Member, Viewer) are granted read or write permissions to private idea details, customer interviews, roadmaps, and financial models.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-2">
                2. User Discovery & Profile Controls
              </h2>
              <p>
                Users have granular control over their profile visibility. You may toggle discovery participation off at any time under your profile settings. When opted into discovery, only public professional attributes (skills, general interests, availability, working style) are visible to other registered founders. Your private startup workspaces are completely separate and never exposed in discovery directories.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-2">
                3. Access History & Audit Logging
              </h2>
              <p>
                To provide transparency, BuildUp maintains an access event log for sensitive workspace operations, including invitations sent, membership role changes, access revocations, and privacy setting updates. Workspace administrators may review these audit records in the security settings tab.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-2">
                4. Realistic Security Boundaries & Limitations
              </h2>
              <p className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700">
                <strong>Important Disclosure:</strong> While BuildUp employs server-side authorization checks, session authentication, and permission enforcement to block unauthorized access, no technical system can prevent authorized collaborators from taking external screenshots, manually copying text, or disclosing discussions outside the software. Revoking workspace access terminates future platform access, but cannot erase information already independently viewed, downloaded, or memorized.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-2">
                5. AI Provider Data Governance
              </h2>
              <p>
                When you choose to utilize AI features (Idea Validator, Roadmap Generator, Pitch Deck Assistant), prompts are securely processed server-side through configured API adapters. BuildUp does not use private startup workspace prompts to train public machine learning models.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-2">
                6. Reporting Misuse or IP Infringement
              </h2>
              <p>
                If you suspect an authorized collaborator or registered user has violated confidentiality or misappropriated proprietary materials, you can immediately revoke their access and file an incident report using our{" "}
                <Link href="/contact?subject=misuse" className="text-brand-700 underline font-semibold">
                  Misuse Reporting Workflow
                </Link>
                .
              </p>
            </section>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <Link href="/terms" className="text-brand-700 hover:underline">
            View Terms of Service
          </Link>
          <Link href="/contact" className="text-brand-700 hover:underline">
            Contact Security Team
          </Link>
        </div>
      </div>
    </div>
  );
}
