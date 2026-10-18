"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Sparkles,
  CheckCircle2,
  Clock,
  Compass,
  Briefcase,
  Send,
  Check,
  X,
  ChevronDown,
  Info,
  Shield,
} from "lucide-react";
import { useToast } from "@/components/Toast";
import { CompatibilityResult } from "@/types";

interface Candidate {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  skills: { name: string; proficiency: string }[];
  preferredDomains: string[];
  preferredRoles: string[];
  workingStyle: string;
  weeklyHours: number;
  collaborationMode: string;
  experienceLevel?: string;
  compatibility: CompatibilityResult;
  connectionStatus: "none" | "pending" | "accepted" | "declined";
  connectionId?: string;
  isOutgoing?: boolean;
}

export default function DiscoverPage() {
  const toast = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [connectMessage, setConnectMessage] = useState("");
  const [sendingConnect, setSendingConnect] = useState(false);

  const fetchCandidates = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (domainFilter !== "all") params.set("domain", domainFilter);
    if (roleFilter !== "all") params.set("role", roleFilter);

    fetch(`/api/users/discover?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.candidates) setCandidates(data.candidates);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCandidates();
  }, [domainFilter, roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCandidates();
  };

  const sendConnectionRequest = async (candidateId: string) => {
    setSendingConnect(true);
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: candidateId,
          message: connectMessage || "Hi! I saw your profile and compatibility breakdown on BuildUp and would love to connect.",
        }),
      });

      if (res.ok) {
        toast.success("Connection request sent!");
        setSelectedCandidate(null);
        setConnectMessage("");
        fetchCandidates();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to send connection request.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setSendingConnect(false);
    }
  };

  const updateConnection = async (connectionId: string, action: "accept" | "decline" | "cancel") => {
    try {
      const res = await fetch("/api/connections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId, action }),
      });
      if (res.ok) {
        toast.success(`Connection request ${action}ed.`);
        fetchCandidates();
      }
    } catch {
      toast.error("Action failed.");
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-accent-violet" />
                <span>Feature 1: AI Co-Founder Matching</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Discover Potential Co-Founders
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Only matches against actual registered users who have opted into discovery. Compatibility scores evaluate complementary skills, weekly hours, working style, and domain alignment.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 max-w-xs leading-tight">
              <span className="font-semibold text-slate-700">Notice:</span> Compatibility scores are algorithmic estimates to assist discovery, not guarantees of successful business partnerships.
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by skill (e.g. Next.js, Python), bio, or name..."
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </form>

            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">All Domains</option>
              <option value="edtech">EdTech</option>
              <option value="fintech">FinTech</option>
              <option value="saas">B2B SaaS</option>
              <option value="health">HealthTech</option>
              <option value="marketplaces">Marketplaces</option>
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">All Roles</option>
              <option value="cto">CTO / Technical</option>
              <option value="ceo">CEO / Product</option>
              <option value="cfo">CFO / Finance</option>
              <option value="growth">Growth / Marketing</option>
            </select>
          </div>
        </div>

        {/* Candidates Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : candidates.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Users className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Candidates Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search keywords or resetting domain filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {candidates.map((candidate) => {
              const score = candidate.compatibility?.overallScore || 70;
              const rating = candidate.compatibility?.rating || "Strong";

              return (
                <div
                  key={candidate.userId}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:border-brand-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Avatar & Compatibility Score */}
                    <div className="flex items-start justify-between mb-4">
                      <img
                        src={
                          candidate.avatarUrl ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
                        }
                        alt={candidate.displayName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />

                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 border border-brand-200">
                          <span className="text-sm font-extrabold text-brand-700">
                            {score}%
                          </span>
                          <span className="text-[10px] font-bold text-brand-800 uppercase">
                            {rating}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-600 mt-0.5">Synergy Estimate</div>
                      </div>
                    </div>

                    <h2 className="font-bold text-base text-slate-900">{candidate.displayName}</h2>
                    <p className="text-xs font-semibold text-brand-700 mb-2">
                      {candidate.preferredRoles?.[0] || "Co-Founder"}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {candidate.bio || "Active startup builder"}
                    </p>

                    {/* Work Style Meta */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4">
                      <div>
                        <span>Commitment:</span> <strong className="text-slate-700">{candidate.weeklyHours}h/wk</strong>
                      </div>
                      <div>
                        <span>Style:</span> <strong className="text-slate-700 capitalize">{candidate.workingStyle}</strong>
                      </div>
                      <div className="col-span-2">
                        <span>Mode:</span> <strong className="text-slate-700 capitalize">{candidate.collaborationMode.replace("_", " ")}</strong>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-1 mb-4">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Top Skills
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(candidate.skills || []).slice(0, 4).map((s) => (
                          <span
                            key={s.name}
                            className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <button
                      onClick={() => setSelectedCandidate(candidate)}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Info className="w-3.5 h-3.5 text-brand-600" />
                      <span>View Compatibility Breakdown</span>
                    </button>

                    {candidate.connectionStatus === "none" && (
                      <button
                        onClick={() => setSelectedCandidate(candidate)}
                        className="w-full py-2 px-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Connection Request</span>
                      </button>
                    )}

                    {candidate.connectionStatus === "pending" && candidate.isOutgoing && (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                        <span className="font-medium">Request Sent (Pending)</span>
                        <button
                          onClick={() => updateConnection(candidate.connectionId!, "cancel")}
                          className="text-[10px] font-bold text-amber-900 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {candidate.connectionStatus === "pending" && !candidate.isOutgoing && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateConnection(candidate.connectionId!, "accept")}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateConnection(candidate.connectionId!, "decline")}
                          className="py-1.5 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {candidate.connectionStatus === "accepted" && (
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Connected</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Compatibility Breakdown Modal */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCandidate.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                    alt={selectedCandidate.displayName}
                    className="w-12 h-12 rounded-xl object-cover border"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      Compatibility Breakdown: {selectedCandidate.displayName}
                    </h3>
                    <p className="text-xs text-brand-700 font-medium">
                      {selectedCandidate.preferredRoles?.[0]} • {selectedCandidate.experienceLevel}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Overall Score */}
              <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 mb-6 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-brand-800 uppercase tracking-wide">
                    Overall Synergy Rating
                  </div>
                  <div className="text-sm text-brand-900 mt-0.5">
                    {selectedCandidate.compatibility?.recommendation}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-brand-700">
                    {selectedCandidate.compatibility?.overallScore}%
                  </div>
                  <span className="text-[10px] font-bold text-brand-800 uppercase">
                    {selectedCandidate.compatibility?.rating}
                  </span>
                </div>
              </div>

              {/* Factor Breakdown */}
              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Six Contributing Dimensions
                </h4>

                <div className="space-y-3">
                  {(selectedCandidate.compatibility?.factors || []).map((factor, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-800">
                          {factor.name} <span className="text-slate-400 font-normal">({factor.weight}% weight)</span>
                        </span>
                        <span className="font-extrabold text-brand-700">{factor.score}/100</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1.5">
                        <div
                          className="bg-brand-600 h-1.5 rounded-full"
                          style={{ width: `${factor.score}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">{factor.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Potential Frictions / Realism Note */}
              {selectedCandidate.compatibility?.potentialFrictions?.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs mb-6">
                  <div className="font-bold mb-1">Honest Alignment Notes:</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    {selectedCandidate.compatibility.potentialFrictions.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Message Input for Connection */}
              {selectedCandidate.connectionStatus === "none" && (
                <div className="border-t border-slate-100 pt-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Personalized Introduction Note
                  </label>
                  <textarea
                    rows={3}
                    value={connectMessage}
                    onChange={(e) => setConnectMessage(e.target.value)}
                    placeholder="Describe your startup concept or ask for an introductory video call..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mb-3"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedCandidate(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={sendingConnect}
                      onClick={() => sendConnectionRequest(selectedCandidate.userId)}
                      className="px-5 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold shadow flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{sendingConnect ? "Sending..." : "Send Request"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
