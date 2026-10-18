"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Rocket, Shield, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/Toast";
import { StartupStage } from "@/types";

export default function NewStartupPage() {
  const router = useRouter();
  const toast = useToast();

  const [name, setName] = useState("");
  const [domain, setDomain] = useState("EdTech & Marketplaces");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<StartupStage>("idea_discovery");
  const [confidentialityRequired, setConfidentialityRequired] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.user) {
          window.location.href = "/sign-in";
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !domain.trim()) {
      toast.error("Please provide startup name and domain.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/startups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          domain,
          tagline,
          description,
          stage,
          confidentialityAgreementRequired: confidentialityRequired,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Workspace created with IdeaShield Private-by-Default protection!");
        router.push(`/startup/${data.workspace._id || data.workspace.slug}`);
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create workspace.");
        setSubmitting(false);
      }
    } catch {
      toast.error("Network error while creating workspace.");
      setSubmitting(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card">
          <div className="flex items-center gap-2 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Rocket className="w-4 h-4 text-brand-600" />
            <span>Workspace Provisioning</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create a New Startup Workspace
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Set up your team collaboration hub, AI validation pipeline, and lean roadmap.
          </p>

          <hr className="my-6 border-slate-100" />

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* IdeaShield Guarantee Notice */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <Shield className="w-4 h-4 text-emerald-700" />
                <span>IdeaShield™ Security Default: 100% Private</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-snug">
                Your new startup workspace is automatically set to private. Roadmaps, customer notes, and business models are completely inaccessible to non-members.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Startup Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CampusBazaar, EcoPack, HealthPulse AI"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Domain / Vertical <span className="text-rose-500">*</span>
                </label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="EdTech & Marketplaces">EdTech & Marketplaces</option>
                  <option value="FinTech & Web3">FinTech & Web3</option>
                  <option value="HealthTech & Biotech">HealthTech & Biotech</option>
                  <option value="B2B SaaS & Developer Tools">B2B SaaS & Dev Tools</option>
                  <option value="AI & Automation">AI & Automation</option>
                  <option value="CleanTech & Sustainability">CleanTech & Energy</option>
                  <option value="Consumer & Social">Consumer & Social</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Startup Stage
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="idea_discovery">Idea Discovery</option>
                  <option value="problem_validation">Problem Validation</option>
                  <option value="customer_research">Customer Research</option>
                  <option value="mvp_planning">MVP Planning</option>
                  <option value="mvp_development">MVP Development</option>
                  <option value="testing">Testing / Closed Beta</option>
                  <option value="launch">Public Launch</option>
                  <option value="growth">Growth & Scaling</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                One-Sentence Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Hyperlocal verified student marketplace for university dorms"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pitch Description / Problem Solved
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what problem this startup solves, who experiences it, and why existing solutions are broken..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confidentialityRequired}
                  onChange={(e) => setConfidentialityRequired(e.target.checked)}
                  className="mt-0.5 rounded text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <span className="font-semibold text-slate-900">
                    Require Confidentiality Acknowledgment (NDA Discussion Aid)
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Newly invited team members must record signed acknowledgment of workspace confidentiality terms before inspecting roadmaps or interviews.
                  </p>
                </div>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-xs shadow flex items-center gap-2"
              >
                <span>{submitting ? "Provisioning..." : "Launch Workspace"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
