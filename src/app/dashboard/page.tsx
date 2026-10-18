"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Rocket,
  Shield,
  Users,
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Lock,
  Plus,
  Bot,
  AlertCircle,
  CreditCard,
  UserCheck,
  CheckSquare,
  MessageSquare,
} from "lucide-react";
import { StartupWorkspaceType, UserProfileType } from "@/types";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [workspaces, setWorkspaces] = useState<StartupWorkspaceType[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [billing, setBilling] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/users/profile").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/startups").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/users/discover").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/billing").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([userData, profileData, wsData, discoverData, billingData]) => {
        if (!userData?.user) {
          window.location.href = "/sign-in";
          return;
        }
        setUser(userData.user);
        if (profileData?.profile) setProfile(profileData.profile);
        if (wsData?.workspaces) setWorkspaces(wsData.workspaces);
        if (discoverData?.candidates) setMatches(discoverData.candidates.slice(0, 3));
        if (billingData) setBilling(billingData);
      })
      .finally(() => setLoading(false));
  }, []);

  // Compute profile completion percentage
  const calculateProfileCompletion = () => {
    if (!profile) return 60;
    let score = 20; // base registered
    if (profile.bio && profile.bio.length > 20) score += 20;
    if (profile.skills && profile.skills.length >= 3) score += 20;
    if (profile.preferredDomains && profile.preferredDomains.length >= 1) score += 15;
    if (profile.weeklyHours && profile.weeklyHours > 0) score += 15;
    if (profile.linkedinUrl || profile.githubUrl) score += 10;
    return Math.min(100, score);
  };

  const profileCompletion = calculateProfileCompletion();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-20 bg-slate-200 rounded-2xl w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 bg-slate-200 rounded-2xl" />
            <div className="h-48 bg-slate-200 rounded-2xl" />
            <div className="h-48 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const activeWorkspace = workspaces[0];

  return (
    <div className="py-8 sm:py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
              <Sparkles className="w-3.5 h-3.5 text-accent-violet" />
              <span>Workspace Central</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.displayName || "Founder"}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Find Your Team. Build Your Dream. Track real validation, tasks, and co-founder connections.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/startup/new"
              className="px-4 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold shadow transition-all flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Startup Workspace</span>
            </Link>
            <Link
              href="/discover"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-2 shrink-0"
            >
              <Users className="w-4 h-4 text-brand-600" />
              <span>Find Co-Founders</span>
            </Link>
          </div>
        </div>

        {/* IdeaShield Status & Quota Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: IdeaShield Alert */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">IdeaShield™ Active</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-slate-600 leading-snug">
                {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""} protected with Private-by-Default security. Non-members cannot access your roadmaps or validation data.
              </p>
              <Link href="/settings/privacy" className="text-brand-700 font-semibold hover:underline block pt-1">
                View Access History & NDA Status →
              </Link>
            </div>
          </div>

          {/* Card 2: AI Quota & Plan */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-700 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">AI Monthly Usage</span>
                <span className="font-semibold text-brand-700 uppercase tracking-wider text-[10px] bg-brand-50 px-2 py-0.5 rounded">
                  {billing?.subscription?.plan || "Free"} Plan
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className="bg-brand-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      ((billing?.subscription?.aiUsedThisMonth || 6) /
                        (billing?.subscription?.aiMonthlyQuota || 25)) *
                        100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>{billing?.subscription?.aiUsedThisMonth || 6} / {billing?.subscription?.aiMonthlyQuota || 25} queries used</span>
                <Link href="/settings/billing" className="text-brand-700 font-semibold hover:underline">
                  Upgrade
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Profile Completion */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Founder Profile</span>
                <span className="font-bold text-purple-700">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <p className="text-slate-500 text-[11px] pt-1 leading-snug">
                Complete your skills & weekly hours to maximize co-founder matching accuracy.
              </p>
              <Link href="/profile" className="text-purple-700 font-semibold hover:underline block pt-0.5">
                Edit Skills & Bio →
              </Link>
            </div>
          </div>
        </div>

        {/* Startup Workspaces Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Startup Workspaces</h2>
              <p className="text-xs text-slate-500">
                Authorized environments containing roadmaps, validation logs, and financial models.
              </p>
            </div>
            <Link
              href="/startup/new"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
            >
              <span>+ Create Workspace</span>
            </Link>
          </div>

          {workspaces.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300">
              <Rocket className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">No Startup Workspaces Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Create your first private startup workspace to unlock AI validation reports, roadmaps, and team task tracking.
              </p>
              <Link
                href="/startup/new"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-900 text-white rounded-xl text-xs font-semibold shadow hover:bg-brand-800 transition-colors"
              >
                Create Workspace
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workspaces.map((ws) => (
                <div
                  key={ws._id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:border-brand-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-slate-900">{ws.name}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3" />
                          {ws.visibility.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Stage: {ws.stage.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                      {ws.tagline || ws.description || "Startup workspace"}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>Domain: <strong className="text-slate-700">{ws.domain}</strong></span>
                      <span>•</span>
                      <span>Owner: <strong className="text-slate-700">{ws.ownerId === user?.userId ? "You" : "Co-Founder"}</strong></span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      IdeaShield Protected
                    </span>
                    <Link
                      href={`/startup/${ws._id || ws.slug}`}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-brand-900 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggested Co-Founder Matches */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Suggested Co-Founder Matches</h2>
              <p className="text-xs text-slate-500">
                Registered founders opted into discovery, matched against your skills and goals.
              </p>
            </div>
            <Link
              href="/discover"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
            >
              <span>Explore All Candidates →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {matches.map((candidate) => (
              <div
                key={candidate.userId}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <img
                      src={candidate.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                      alt={candidate.displayName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-brand-700">
                        {candidate.compatibility?.overallScore || 85}%
                      </div>
                      <div className="text-[10px] text-slate-500">Compatibility</div>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{candidate.displayName}</h3>
                  <p className="text-xs text-brand-700 font-medium mb-2">
                    {candidate.preferredRoles?.[0] || "Co-Founder"}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {candidate.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(candidate.skills || []).slice(0, 3).map((s: any) => (
                      <span
                        key={s.name}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/discover"
                  className="w-full text-center py-2 px-3 rounded-lg bg-slate-100 hover:bg-brand-50 text-slate-800 hover:text-brand-700 text-xs font-semibold transition-colors block"
                >
                  View Compatibility Breakdown
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
