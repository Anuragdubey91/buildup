import React from "react";
import Link from "next/link";
import { Shield, Rocket, Heart, ExternalLink, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-accent-violet flex items-center justify-center text-white">
                <Rocket className="w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Build<span className="text-brand-400">Up</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find Your Team. Build Your Dream. The complete full-stack platform for students and aspiring entrepreneurs to validate ideas, find co-founders, and build real startups.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-300 bg-brand-950/60 p-2.5 rounded-lg border border-brand-800/40">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>IdeaShield™ Private-by-Default Architecture</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Platform Features
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/discover" className="hover:text-white transition-colors">
                  AI Co-Founder Matching
                </Link>
              </li>
              <li>
                <Link href="/features#skill-gap" className="hover:text-white transition-colors">
                  Team Skill-Gap Analyzer
                </Link>
              </li>
              <li>
                <Link href="/features#idea-validator" className="hover:text-white transition-colors">
                  AI Idea Validator
                </Link>
              </li>
              <li>
                <Link href="/features#customer-hub" className="hover:text-white transition-colors">
                  Customer Validation Hub
                </Link>
              </li>
              <li>
                <Link href="/features#pitch-deck" className="hover:text-white transition-colors">
                  Pitch Deck Generator
                </Link>
              </li>
              <li>
                <Link href="/features#equity" className="hover:text-white transition-colors">
                  Equity Split Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Workspaces */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Resources
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How BuildUp Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing & Campus Plans
                </Link>
              </li>
              <li>
                <Link href="/startup/new" className="hover:text-white transition-colors">
                  Create Workspace
                </Link>
              </li>
              <li>
                <Link href="/settings/privacy" className="hover:text-white transition-colors">
                  IdeaShield Security Settings
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Support & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance Notice */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Legal & Trust
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy (Under Review)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service (Under Review)
                </Link>
              </li>
              <li>
                <Link href="/contact?subject=misuse" className="hover:text-rose-400 transition-colors">
                  Report Misuse or IP Theft
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-300 leading-tight">
              Legal Disclaimer: BuildUp tools, roadmap projections, and equity calculators are educational discussion aids and do not constitute formal legal, financial, or investment advice.
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-4">
          <p>© {new Date().getFullYear()} BuildUp Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              IdeaShield Active
            </span>
            <span className="text-slate-700">|</span>
            <Link href="/settings/privacy" className="hover:text-white">
              Access History
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
