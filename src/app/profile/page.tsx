"use client";

import React, { useState, useEffect } from "react";
import { User, Shield, Plus, Trash2, Save, Globe, EyeOff, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/Toast";
import { UserProfileType, UserSkill } from "@/types";

export default function ProfilePage() {
  const toast = useToast();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New skill input state
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProficiency, setNewSkillProficiency] = useState<"beginner" | "intermediate" | "expert">("intermediate");

  // Domain & Goal input states
  const [newDomain, setNewDomain] = useState("");
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    fetch("/api/users/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.profile) {
          setProfile(data.profile);
        } else {
          window.location.href = "/sign-in";
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch {
      toast.error("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (!newSkillName.trim() || !profile) return;
    const updatedSkills: UserSkill[] = [
      ...profile.skills,
      { name: newSkillName.trim(), proficiency: newSkillProficiency },
    ];
    setProfile({ ...profile, skills: updatedSkills });
    setNewSkillName("");
  };

  const removeSkill = (index: number) => {
    if (!profile) return;
    const updatedSkills = profile.skills.filter((_, i) => i !== index);
    setProfile({ ...profile, skills: updatedSkills });
  };

  const addDomain = () => {
    if (!newDomain.trim() || !profile) return;
    setProfile({
      ...profile,
      preferredDomains: [...(profile.preferredDomains || []), newDomain.trim()],
    });
    setNewDomain("");
  };

  const removeDomain = (idx: number) => {
    if (!profile) return;
    setProfile({
      ...profile,
      preferredDomains: profile.preferredDomains.filter((_, i) => i !== idx),
    });
  };

  const addGoal = () => {
    if (!newGoal.trim() || !profile) return;
    setProfile({
      ...profile,
      goals: [...(profile.goals || []), newGoal.trim()],
    });
    setNewGoal("");
  };

  const removeGoal = (idx: number) => {
    if (!profile) return;
    setProfile({
      ...profile,
      goals: profile.goals.filter((_, i) => i !== idx),
    });
  };

  if (loading || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-slate-200 rounded-xl" />
          <div className="h-64 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Founder Profile & Capabilities
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Configure your verified skills, weekly availability, and discoverability settings for AI co-founder matching.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-xs shadow transition-all flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Profile"}</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Privacy & Discovery Settings Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">
                    Public Co-Founder Discovery
                  </span>
                  {profile.isPublicInDiscovery ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <Globe className="w-3 h-3" />
                      Opted In
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-full">
                      <EyeOff className="w-3 h-3" />
                      Hidden from Discovery
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 max-w-xl">
                  When enabled, registered founders can discover your skills and send connection requests. Your private startup workspaces and roadmaps are never exposed.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.isPublicInDiscovery}
                  onChange={(e) =>
                    setProfile({ ...profile, isPublicInDiscovery: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
              </label>
            </div>
          </div>

          {/* Basic Identity Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Identity & Background
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Bio & Founder Vision
              </label>
              <textarea
                rows={3}
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Describe your background, what startups you love building, and what you seek in a co-founder..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Experience Level
                </label>
                <select
                  value={profile.experienceLevel}
                  onChange={(e) =>
                    setProfile({ ...profile, experienceLevel: e.target.value as any })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="student">Student / Early Project</option>
                  <option value="early_career">Early Career (1-3 yrs)</option>
                  <option value="mid_level">Mid-Level Engineer/PM (3-6 yrs)</option>
                  <option value="senior">Senior Operator (6+ yrs)</option>
                  <option value="seasoned_founder">Repeat / Seasoned Founder</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Weekly Hours Commitment
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={profile.weeklyHours}
                  onChange={(e) =>
                    setProfile({ ...profile, weeklyHours: Number(e.target.value) })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Working Style
                </label>
                <select
                  value={profile.workingStyle}
                  onChange={(e) =>
                    setProfile({ ...profile, workingStyle: e.target.value as any })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="agile">Agile (Sprint-based, daily standups)</option>
                  <option value="async">Async (Documentation-first, independent)</option>
                  <option value="structured">Structured (Formal milestones)</option>
                  <option value="flexible">Flexible (Evenings & weekends)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Collaboration Mode
                </label>
                <select
                  value={profile.collaborationMode}
                  onChange={(e) =>
                    setProfile({ ...profile, collaborationMode: e.target.value as any })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="remote">Remote (Any location)</option>
                  <option value="hybrid">Hybrid (Local city meetups)</option>
                  <option value="in_person">In-Person (Same campus or incubator)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Preference
                </label>
                <select
                  value={profile.contactPreference}
                  onChange={(e) =>
                    setProfile({ ...profile, contactPreference: e.target.value as any })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="platform_message">Platform Messages Only</option>
                  <option value="email">Direct Email</option>
                  <option value="linkedin">LinkedIn Profile</option>
                </select>
              </div>
            </div>
          </div>

          {/* Skills & Capabilities Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Skills & Proficiencies
            </h2>

            {/* Existing Skills List */}
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <span className="font-semibold text-slate-800">{skill.name}</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                      skill.proficiency === "expert"
                        ? "bg-purple-100 text-purple-700"
                        : skill.proficiency === "intermediate"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {skill.proficiency}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Skill Row */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="e.g. Next.js, Financial Modeling, UI/UX"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 text-xs p-2 rounded-xl border border-slate-200"
              />
              <select
                value={newSkillProficiency}
                onChange={(e) => setNewSkillProficiency(e.target.value as any)}
                className="text-xs p-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
              <button
                type="button"
                onClick={addSkill}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Skill
              </button>
            </div>
          </div>

          {/* Preferred Domains Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Target Startup Domains & Goals
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Startup Domains
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(profile.preferredDomains || []).map((dom, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-50 border border-brand-200 text-brand-800 text-xs font-medium"
                  >
                    <span>{dom}</span>
                    <button
                      type="button"
                      onClick={() => removeDomain(i)}
                      className="text-brand-400 hover:text-brand-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. EdTech, FinTech, B2B SaaS, HealthTech"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="flex-1 text-xs p-2 rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={addDomain}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
                >
                  Add Domain
                </button>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Startup Goals
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(profile.goals || []).map((goal, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium"
                  >
                    <span>{goal}</span>
                    <button
                      type="button"
                      onClick={() => removeGoal(i)}
                      className="text-slate-400 hover:text-slate-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Build bootstrapped MVP in 60 days, Raise pre-seed"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="flex-1 text-xs p-2 rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={addGoal}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
                >
                  Add Goal
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
