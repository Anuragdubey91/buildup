"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  Shield,
  Users,
  Rocket,
  AlertTriangle,
  Server,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/components/Toast";

export default function AdminPage() {
  const toast = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    fetch("/api/admin/metrics")
      .then((res) => {
        if (res.status === 403) {
          setForbidden(true);
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then((metrics) => {
        if (metrics) setData(metrics);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  // 403 Forbidden for non-admins
  if (forbidden || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-rose-200 p-8 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Restricted Administration Area
          </h2>
          <div className="p-3.5 bg-rose-50 rounded-xl text-xs text-rose-900 text-left border border-rose-200 leading-relaxed">
            <strong>Access Denied:</strong> This console is restricted exclusively to authorized platform administrators. A normal user cannot grant themselves administrative privileges.
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Tip: Use the Persona Switcher in the bottom-left to select <strong>System Administrator</strong> to inspect this console.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="w-full inline-block py-2.5 px-4 bg-brand-900 hover:bg-brand-800 text-white rounded-xl text-xs font-semibold shadow transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { stats, abuseReports, systemHealth } = data;

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              <Lock className="w-3.5 h-3.5" />
              <span>Restricted Administration Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Administration
            </h1>
            <p className="text-xs text-slate-600">
              System health metrics, abuse moderation queues, and operational subscription metrics.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 max-w-xs leading-snug">
            <span className="font-semibold text-slate-800">Privacy Safeguard:</span> Private startup contents and roadmaps are strictly shielded from administrative views to protect founder IP.
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Registered Users
              </span>
              <Users className="w-5 h-5 text-brand-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">{stats.totalUsers}</div>
            <p className="text-[11px] text-slate-500 mt-1">Founders & Students</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Workspaces
              </span>
              <Rocket className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">{stats.totalWorkspaces}</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% IdeaShield Private</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Abuse Reports
              </span>
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">{stats.totalReports}</div>
            <p className="text-[11px] text-slate-500 mt-1">Pending moderation</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Subscriptions
              </span>
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">{stats.activeSubscriptions}</div>
            <p className="text-[11px] text-brand-700 font-semibold mt-1">
              {stats.premiumUsers} Founder Pro / Campus
            </p>
          </div>
        </div>

        {/* System Health Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Server className="w-4 h-4 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900">System Telemetry & Health</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-semibold block text-[10px]">Database Status</span>
              <span className="font-bold text-slate-800">{systemHealth.database}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-semibold block text-[10px]">Authentication Engine</span>
              <span className="font-bold text-slate-800">{systemHealth.authProvider}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-semibold block text-[10px]">AI Model Adapter</span>
              <span className="font-bold text-slate-800">{systemHealth.aiProvider}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-semibold block text-[10px]">Runtime Environment</span>
              <span className="font-bold text-slate-800">{systemHealth.nodeVersion} (Up {systemHealth.uptimeHours}h)</span>
            </div>
          </div>
        </div>

        {/* Abuse Reports & Misuse Moderation Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h2 className="text-base font-bold text-slate-900">Reported Misuse & IP Infringements</h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Moderation Queue</span>
          </div>

          <div className="space-y-3">
            {abuseReports.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No reported misuse incidents.</p>
            ) : (
              abuseReports.map((report: any) => (
                <div
                  key={report._id}
                  className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Category: {report.category}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold uppercase">
                        {report.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-line">
                    {report.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400">Reporter: {report.reporterUserId}</span>
                    <button
                      onClick={() => toast.success("Marked report as investigated.")}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs"
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
