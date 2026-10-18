"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  AlertTriangle,
  History,
  CheckCircle2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/components/Toast";
import { StartupWorkspaceType, SecurityAuditEventType } from "@/types";

export default function PrivacySettingsPage() {
  const toast = useToast();
  const [workspaces, setWorkspaces] = useState<StartupWorkspaceType[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditEventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((authData) => {
        if (!authData?.user) {
          window.location.href = "/sign-in";
          return null;
        }
        return fetch("/api/startups").then((r) => (r.ok ? r.json() : null));
      })
      .then(async (wsData) => {
        if (wsData?.workspaces) {
          setWorkspaces(wsData.workspaces);
          const firstWs = wsData.workspaces[0];
          if (firstWs) {
            const logsRes = await fetch(`/api/startups/${firstWs._id || firstWs.slug}/audit-logs`);
            if (logsRes.ok) {
              const logData = await logsRes.json();
              if (logData?.logs) setAuditLogs(logData.logs);
            }
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const updateVisibility = async (workspaceId: string, newVisibility: "private" | "preview" | "public") => {
    try {
      const res = await fetch(`/api/startups/${workspaceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: newVisibility }),
      });

      if (res.ok) {
        toast.success(`Workspace visibility updated to: ${newVisibility.toUpperCase()}`);
        setWorkspaces((prev) =>
          prev.map((w) => (w._id === workspaceId ? { ...w, visibility: newVisibility } : w))
        );
      } else {
        toast.error("Failed to update visibility.");
      }
    } catch {
      toast.error("Network error.");
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card">
          <div className="flex items-center gap-2 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>IdeaShield™ Security Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Idea Privacy & Access Controls
          </h1>
          <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
            Manage granular visibility settings, confidentiality terms, and review immutable access audit events across your startup workspaces.
          </p>

          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-900">IdeaShield Core Policy:</div>
            <p className="leading-relaxed">
              Default rule: every new startup workspace and idea must be private. A user never gains access simply by guessing URLs or database IDs.
            </p>
          </div>
        </div>

        {/* Workspace Visibility Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b pb-2">
            Workspace Visibility Settings
          </h2>

          <div className="space-y-4">
            {workspaces.map((ws) => (
              <div
                key={ws._id}
                className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{ws.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {ws.domain}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{ws.tagline}</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={ws.visibility}
                    onChange={(e) => updateVisibility(ws._id!, e.target.value as any)}
                    className="text-xs p-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800"
                  >
                    <option value="private">🔒 Private (Default - Members Only)</option>
                    <option value="preview">👁️ Limited Preview (Public discovery only)</option>
                    <option value="public">🌐 Public (All fields visible)</option>
                  </select>

                  <Link
                    href={`/startup/${ws._id}`}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Audit Event History */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-brand-600" />
              <h2 className="text-base font-bold text-slate-900">
                Security Audit Log History
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Captures sensitive membership and privacy events
            </span>
          </div>

          <div className="space-y-2">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No security events recorded yet.</p>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log._id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.actorName}</span>
                      <span className="text-[10px] font-mono text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded border border-brand-200">
                        {log.action}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-snug">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Misuse & Legal Boundaries Box */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Platform Security Boundaries</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            IdeaShield provides server-side authorization to prevent unauthorized electronic access. However, no software can prevent a collaborator from taking external screenshots, copies, or notes. If you suspect intellectual property theft, please file an official misuse report immediately.
          </p>
          <div className="pt-2">
            <Link
              href="/contact?subject=misuse"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors shadow"
            >
              Report IP Theft or Misuse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
