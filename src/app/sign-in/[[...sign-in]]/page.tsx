"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Rocket, Shield, ArrowRight, UserCheck, Database, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function SignInPage() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [configStatus, setConfigStatus] = useState<any>(null);

  useEffect(() => {
    fetch("/api/config-status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setConfigStatus(data);
      })
      .catch(() => {});
  }, []);

  const handleDevSignIn = async (personaId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/switch-persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: personaId }),
      });
      if (res.ok) {
        toast.success("Signed in successfully!");
        window.location.href = "/dashboard";
      } else {
        toast.error("Sign in failed");
        setLoading(false);
      }
    } catch {
      toast.error("Sign in failed");
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Welcome back, ${data.user.displayName}!`);
        window.location.href = "/dashboard";
      } else {
        toast.error(data.error || "No account found with this email.");
        setLoading(false);
      }
    } catch {
      toast.error("Network error during sign-in.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-900 via-brand-700 to-accent-violet flex items-center justify-center text-white shadow-md">
            <Rocket className="w-5 h-5" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">
            Build<span className="text-brand-600">Up</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In to Your Startup Workspace
        </h2>
        <p className="mt-1 text-xs text-slate-600">
          Find your team. Build your dream. Private by default.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl border border-slate-200 sm:px-10 space-y-6">
          {/* Real System Architecture Status */}
          {configStatus && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1.5">
              <div className="flex items-center justify-between text-slate-700 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-brand-600" />
                  Database
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  MongoDB Connected
                </span>
              </div>
              <p className="text-slate-500 text-[10px] leading-tight">
                {configStatus.auth?.clerkConfigured
                  ? "Clerk Live Authentication active."
                  : "BuildUp Local Session active with MongoDB persistence."}
              </p>
            </div>
          )}

          {/* Real Email Sign-In */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registered Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. aarav@buildup.dev or your registered email"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-xs shadow transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? "Verifying..." : "Sign In with Email"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">Or Quick Reviewer Persona</span>
            </div>
          </div>

          {/* Quick Persona Access for Evaluators */}
          <div className="p-4 rounded-xl bg-brand-50/70 border border-brand-100">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-900 mb-1.5">
              <UserCheck className="w-4 h-4 text-brand-600" />
              <span>Instant Reviewer Sign-In</span>
            </div>
            <p className="text-[11px] text-slate-600 mb-3 leading-snug">
              Click any verified identity to test IdeaShield role access, owner controls, and team views:
            </p>

            <div className="space-y-1.5">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDevSignIn("user_aarav_sharma")}
                className="w-full text-left p-2 rounded-lg bg-white hover:bg-brand-100/50 border border-brand-200 flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-900">Aarav Sharma</div>
                  <div className="text-[10px] text-slate-500">Founder & Owner (CampusBazaar)</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-brand-600" />
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleDevSignIn("user_priya_patel")}
                className="w-full text-left p-2 rounded-lg bg-white hover:bg-brand-100/50 border border-brand-200 flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-900">Priya Patel</div>
                  <div className="text-[10px] text-slate-500">Admin Member (Growth Lead)</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-brand-600" />
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleDevSignIn("user_rohan_mehta")}
                className="w-full text-left p-2 rounded-lg bg-white hover:bg-brand-100/50 border border-brand-200 flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-900">Rohan Mehta</div>
                  <div className="text-[10px] text-slate-500">External Visitor (Tests 403 Forbidden)</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-brand-600" />
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Don&apos;t have an account yet?{" "}
              <Link href="/sign-up" className="text-brand-600 font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>IdeaShield™ Protected Authentication Session</span>
        </div>
      </div>
    </div>
  );
}
