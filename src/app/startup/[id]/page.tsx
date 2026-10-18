"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Rocket,
  Shield,
  Lock,
  Users,
  Compass,
  FileCheck2,
  BrainCircuit,
  MessagesSquare,
  Calculator,
  Layers,
  Presentation,
  CheckSquare,
  PieChart,
  Bot,
  AlertTriangle,
  Plus,
  Send,
  Printer,
  ChevronRight,
  Info,
  Clock,
  Sparkles,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/components/Toast";
import { StartupWorkspaceType, StartupStage } from "@/types";

export default function StartupWorkspacePage() {
  const params = useParams();
  const id = params?.id as string;
  const toast = useToast();

  const [workspace, setWorkspace] = useState<StartupWorkspaceType | null>(null);
  const [userRole, setUserRole] = useState<string>("viewer");
  const [isOwner, setIsOwner] = useState(false);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);
  const [isLimitedPreview, setIsLimitedPreview] = useState(false);
  const [loading, setLoading] = useState(true);

  // Active module tab
  const [activeTab, setActiveTab] = useState<
    | "roadmap"
    | "idea_validator"
    | "skill_gap"
    | "customer_hub"
    | "business_model"
    | "finance"
    | "equity"
    | "pitch_deck"
    | "team"
    | "assistant"
  >("roadmap");

  // Sub-feature states
  const [roadmap, setRoadmap] = useState<any>(null);
  const [validationReport, setValidationReport] = useState<any>(null);
  const [skillGapReport, setSkillGapReport] = useState<any>(null);
  const [customerHub, setCustomerHub] = useState<any>(null);
  const [businessModel, setBusinessModel] = useState<any>(null);
  const [budgetPlan, setBudgetPlan] = useState<any>(null);
  const [projections, setProjections] = useState<any>(null);
  const [equityData, setEquityData] = useState<any>(null);
  const [pitchDeck, setPitchDeck] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  // Assistant Chat states
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your BuildUp AI Startup Assistant. I have context on this private workspace. Ask me about your roadmap, customer interview questions, or MVP prioritization.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [assistantLoading, setAssistantLoading] = useState(false);

  // Invite state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviting, setInviting] = useState(false);

  // New task input
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // New feedback state
  const [newInterviewee, setNewInterviewee] = useState("");
  const [newFeedbackNotes, setNewFeedbackNotes] = useState("");

  const loadWorkspaceData = async () => {
    try {
      const res = await fetch(`/api/startups/${id}`);
      if (res.status === 403) {
        const err = await res.json();
        setAccessDenied(err.denialReason || "Access Denied by IdeaShield");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setAccessDenied("Workspace could not be loaded.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.isLimitedPreview) {
        setIsLimitedPreview(true);
        setWorkspace(data.workspace);
        setLoading(false);
        return;
      }

      setWorkspace(data.workspace);
      setUserRole(data.userRole || "viewer");
      setIsOwner(data.isOwner || false);
      setTeamMembers(data.members || []);

      // Load sub-modules
      const wsId = data.workspace._id || id;
      Promise.all([
        fetch(`/api/startups/${wsId}/roadmap`).then((r) => (r.ok ? r.json() : null)),
        fetch(`/api/startups/${wsId}/idea-validator`).then((r) => (r.ok ? r.json() : null)),
        fetch(`/api/startups/${wsId}/skill-gap`).then((r) => (r.ok ? r.json() : null)),
        fetch(`/api/startups/${wsId}/customer-validation`).then((r) => (r.ok ? r.json() : null)),
        fetch(`/api/startups/${wsId}/business-model`).then((r) => (r.ok ? r.json() : null)),
        fetch(`/api/startups/${wsId}/budget`).then((r) => (r.ok ? r.json() : null)),
        fetch(`/api/startups/${wsId}/equity`).then((r) => (r.ok ? r.json() : null)),
        fetch(`/api/startups/${wsId}/pitch-deck`).then((r) => (r.ok ? r.json() : null)),
      ]).then(([rm, iv, sg, cv, bm, bg, eq, pd]) => {
        if (rm?.roadmap) setRoadmap(rm.roadmap);
        if (iv?.report) setValidationReport(iv.report);
        if (sg?.report) setSkillGapReport(sg.report);
        if (cv?.hub) setCustomerHub(cv.hub);
        if (bm?.businessModel) setBusinessModel(bm.businessModel);
        if (bg?.plan) {
          setBudgetPlan(bg.plan);
          setProjections(bg.projections);
        }
        if (eq?.scenario) setEquityData(eq);
        if (pd?.deck) setPitchDeck(pd.deck);
      });
    } catch {
      setAccessDenied("Failed to connect to workspace.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaceData();
  }, [id]);

  // Assistant Send
  const handleAssistantSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || assistantLoading) return;

    const userMsg = { role: "user" as const, content: chatInput.trim() };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setChatInput("");
    setAssistantLoading(true);

    try {
      const res = await fetch(`/api/startups/${id}/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages([...updatedMessages, { role: "assistant", content: data.reply }]);
      } else {
        toast.error("Assistant query failed. Check rate limits.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setAssistantLoading(false);
    }
  };

  // Add Task Handler
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch(`/api/startups/${id}/roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "add_task",
          task: {
            title: newTaskTitle.trim(),
            priority: "medium",
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRoadmap(data.roadmap);
        setNewTaskTitle("");
        toast.success("Task added to roadmap.");
      }
    } catch {
      toast.error("Failed to add task.");
    }
  };

  // Toggle Task Completion
  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "done" ? "todo" : "done";
    try {
      const res = await fetch(`/api/startups/${id}/roadmap`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status: nextStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setRoadmap(data.roadmap);
      }
    } catch {
      toast.error("Failed to update task.");
    }
  };

  // Add Interview Feedback Handler
  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterviewee.trim() || !newFeedbackNotes.trim()) return;

    try {
      const res = await fetch(`/api/startups/${id}/customer-validation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "add_feedback",
          feedback: {
            intervieweeName: newInterviewee.trim(),
            notes: newFeedbackNotes.trim(),
            category: "problem_validation",
            validationStatus: "validated",
            consentObtained: true,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCustomerHub(data.hub);
        setNewInterviewee("");
        setNewFeedbackNotes("");
        toast.success("Customer interview feedback recorded!");
      }
    } catch {
      toast.error("Failed to record feedback.");
    }
  };

  // Invite Member Handler
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);

    try {
      const res = await fetch(`/api/startups/${id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      });

      if (res.ok) {
        toast.success(`Invitation sent to ${inviteEmail} with role: ${inviteRole}.`);
        setInviteEmail("");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to send invitation.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-28 bg-slate-200 rounded-2xl w-full" />
          <div className="h-96 bg-slate-200 rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  // IdeaShield Access Denied Screen (Testing non-member authorization)
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-rose-200 p-8 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            IdeaShield™ Access Restricted
          </h2>
          <div className="p-3.5 bg-rose-50 rounded-xl text-xs text-rose-900 text-left border border-rose-200 leading-relaxed">
            <strong>Security Rule Enforced:</strong> {accessDenied}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Default rule: every new startup workspace and idea must be private. You cannot access this workspace simply by knowing its URL or ID.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/dashboard"
              className="py-2.5 px-4 bg-brand-900 hover:bg-brand-800 text-white rounded-xl text-xs font-semibold shadow transition-colors"
            >
              Back to My Dashboard
            </Link>
            <p className="text-[10px] text-slate-400">
              Tip: Use the Persona Switcher in the bottom-left to switch back to the workspace owner or authorized admin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Limited Public Preview Mode
  if (isLimitedPreview && workspace) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Limited Public Preview
              </span>
              <h1 className="text-2xl font-bold text-slate-900 mt-2">{workspace.name}</h1>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <Shield className="w-3.5 h-3.5" />
              <span>IdeaShield Protected</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <p><strong>Tagline:</strong> {workspace.tagline || "Undisclosed"}</p>
            <p><strong>Domain:</strong> {workspace.domain}</p>
            <p><strong>Stage:</strong> {workspace.stage.replace("_", " ")}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-800">IdeaShield Protection Notice:</span> The founder has enabled a limited public preview for discovery. Full customer interviews, proprietary roadmaps, financial runway projections, and pitch decks are strictly private to authorized team members.
          </div>

          <div className="pt-2 flex justify-between items-center text-xs">
            <Link href="/discover" className="text-brand-700 font-semibold hover:underline">
              ← Return to Co-Founder Discovery
            </Link>
            <Link href="/contact" className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold">
              Request Team Access
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!workspace) return null;

  return (
    <div className="py-6 sm:py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Workspace Top Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {workspace.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <Lock className="w-3 h-3" />
                  {workspace.visibility.toUpperCase()} (IdeaShield)
                </span>
                <span className="text-[10px] font-mono font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md">
                  Stage: {workspace.stage.replace("_", " ")}
                </span>
                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  Your Role: {userRole.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {workspace.tagline || workspace.description}
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                href="/settings/privacy"
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>IdeaShield Settings</span>
              </Link>

              <button
                onClick={() => setActiveTab("pitch_deck")}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow transition-colors flex items-center gap-1.5"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>Pitch Deck</span>
              </button>
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1 overflow-x-auto no-scrollbar text-xs font-medium">
            {[
              { id: "roadmap", name: "Roadmap & Tasks", icon: <Compass className="w-3.5 h-3.5" /> },
              { id: "idea_validator", name: "AI Idea Validator", icon: <FileCheck2 className="w-3.5 h-3.5" /> },
              { id: "skill_gap", name: "Skill-Gap Analyzer", icon: <BrainCircuit className="w-3.5 h-3.5" /> },
              { id: "customer_hub", name: "Customer Validation", icon: <MessagesSquare className="w-3.5 h-3.5" /> },
              { id: "business_model", name: "Business Model & MVP", icon: <Layers className="w-3.5 h-3.5" /> },
              { id: "finance", name: "Budget & Runway", icon: <Calculator className="w-3.5 h-3.5" /> },
              { id: "equity", name: "Equity Split Calculator", icon: <PieChart className="w-3.5 h-3.5" /> },
              { id: "pitch_deck", name: "Pitch Deck Generator", icon: <Presentation className="w-3.5 h-3.5" /> },
              { id: "team", name: "Team & Permissions", icon: <Users className="w-3.5 h-3.5" /> },
              { id: "assistant", name: "AI Assistant", icon: <Bot className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-brand-50 text-brand-800 font-bold border border-brand-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Roadmap & Tasks */}
        {activeTab === "roadmap" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Startup Milestones</h2>
                  <p className="text-xs text-slate-500">
                    Execution phases tailored to current stage: {workspace.stage.replace("_", " ")}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {(roadmap?.milestones || []).map((ms: any) => (
                  <div key={ms.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{ms.title}</span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          {ms.priority} priority
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {ms.deadline ? `Due: ${ms.deadline}` : `~${ms.suggestedTimelineWeeks} weeks`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">{ms.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Management & Collaboration */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Sprint Tasks & Assignments</h2>
                  <p className="text-xs text-slate-500">
                    Assigned responsibilities across your founding team.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddTask} className="flex gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Add a new deliverable or validation task..."
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-brand-900 hover:bg-brand-800 text-white rounded-xl text-xs font-semibold shrink-0"
                >
                  Add Task
                </button>
              </form>

              <div className="space-y-2 pt-2">
                {(roadmap?.tasks || []).length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No open tasks yet.</p>
                ) : (
                  (roadmap?.tasks || []).map((tsk: any) => (
                    <div
                      key={tsk.id}
                      className="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTaskStatus(tsk.id, tsk.status)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            tsk.status === "done"
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-slate-300 hover:border-brand-600"
                          }`}
                        >
                          {tsk.status === "done" && <CheckSquare className="w-3.5 h-3.5" />}
                        </button>
                        <span
                          className={`text-xs font-medium ${
                            tsk.status === "done"
                              ? "line-through text-slate-400"
                              : "text-slate-800"
                          }`}
                        >
                          {tsk.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {tsk.deadline || "No date"}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
                          {tsk.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: AI Idea Validator */}
        {activeTab === "idea_validator" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">AI Idea Validation Report</h2>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                      10-Point Analysis
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Structured diagnostic of problem severity, assumptions, and validation experiments.
                  </p>
                </div>
              </div>

              {validationReport ? (
                <div className="space-y-6 text-xs text-slate-700">
                  {/* Scores Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-brand-50 border border-brand-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-brand-900">Problem Clarity Score</span>
                        <span className="text-xl font-extrabold text-brand-700">
                          {validationReport.problemClarityScore}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-800 mt-1">
                        High clarity reduces customer interview ambiguity and avoids premature scaling.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-900">Estimated Viability Score</span>
                        <span className="text-xl font-extrabold text-purple-700">
                          {validationReport.viabilityScore}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-800 mt-1">
                        Mathematical viability model based on target customer urgency and alternatives.
                      </p>
                    </div>
                  </div>

                  {/* Target Customer Analysis */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h3 className="font-bold text-slate-900 text-xs">Target Customer Analysis</h3>
                    <p className="leading-relaxed">{validationReport.targetCustomerAnalysis}</p>
                  </div>

                  {/* Core Assumptions */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-xs">Key Unresolved Assumptions</h3>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      {(validationReport.mainAssumptions || []).map((a: string, i: number) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggested Low-Cost Experiments */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-xs">Prescribed Validation Experiments</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(validationReport.suggestedExperiments || []).map((exp: any, i: number) => (
                        <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white">
                          <span className="font-bold text-slate-900 block mb-1">{exp.name}</span>
                          <p className="text-[11px] text-slate-500 mb-2"><strong>Hypothesis:</strong> {exp.hypothesis}</p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t pt-1.5">
                            <span>Metric: {exp.metric}</span>
                            <span>{exp.timelineDays} days</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interview Questions */}
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
                    <h3 className="font-bold text-blue-950 text-xs">Customer Interview Script</h3>
                    <ul className="list-disc pl-4 space-y-1 text-blue-900 text-[11px]">
                      {(validationReport.customerQuestions || []).map((q: string, i: number) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-[10px] text-slate-400 italic">
                    Disclaimer: AI-generated diagnostic report. Market and competitor considerations represent heuristic suggestions and must be independently verified.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-slate-500 mb-4">No validation report generated yet.</p>
                  <button
                    onClick={async () => {
                      const res = await fetch(`/api/startups/${id}/idea-validator`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          idea: workspace.name,
                          targetAudience: "College students and early tech founders",
                          problem: workspace.description || workspace.tagline || "Inefficient campus workflows",
                          solution: "Verified collaborative platform with instant peer matching",
                        }),
                      });
                      if (res.ok) {
                        const data = await res.json();
                        setValidationReport(data.report);
                        toast.success("AI Validation Diagnostic Generated!");
                      }
                    }}
                    className="px-5 py-2.5 bg-brand-900 text-white rounded-xl text-xs font-semibold shadow"
                  >
                    Run AI Validation Diagnostics
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Skill-Gap Analyzer */}
        {activeTab === "skill_gap" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">Team Skill-Gap Analyzer</h2>
                  <span className="text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
                    Readiness: {skillGapReport?.overallReadinessScore || 75}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Compares your active team skills against domain execution benchmarks.
                </p>
              </div>
            </div>

            {/* Covered vs Missing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Covered */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
                  <CheckSquare className="w-4 h-4 text-emerald-700" />
                  <span>Capabilities Covered by Current Team</span>
                </div>
                <div className="space-y-1.5">
                  {(skillGapReport?.coveredSkills || ["Technical Architecture", "Next.js Frontend"]).map((s: string, idx: number) => (
                    <div key={idx} className="p-2 rounded-lg bg-white border border-emerald-100 text-xs text-emerald-950 font-medium flex items-center justify-between">
                      <span>{s}</span>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase">Covered</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Skills & Recommendations */}
              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-xs text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Identified Capability Gaps</span>
                </div>
                <div className="space-y-1.5">
                  {(skillGapReport?.missingSkills || []).map((m: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white border border-rose-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{m.skill}</span>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                          {m.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">{m.reason}</p>
                      <div className="text-[10px] text-brand-700 font-semibold pt-1">
                        Recommended Role: {m.recommendedRole}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recruitment Guidance */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-xs">Recruitment Action Plan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                To resolve identified gaps, visit the{" "}
                <Link href="/discover" className="text-brand-700 font-semibold underline">
                  Co-Founder Discovery Directory
                </Link>{" "}
                and filter for roles matching the recommended titles above.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Customer Validation Hub */}
        {activeTab === "customer_hub" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Customer Validation Hub</h2>
                <p className="text-xs text-slate-500">
                  Record real customer interviews and empirical demand signals. (Demo data clearly labelled).
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Confidence: {customerHub?.overallDemandConfidence || "Tested"}
              </span>
            </div>

            {/* New Feedback Entry Form */}
            <form onSubmit={handleAddFeedback} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-bold text-xs text-slate-900 block">Record New Customer Interview</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Interviewee Name & Context (e.g. Karan, Block B Resident)"
                  value={newInterviewee}
                  onChange={(e) => setNewInterviewee(e.target.value)}
                  className="text-xs p-2 rounded-xl border border-slate-200"
                />
                <input
                  type="text"
                  required
                  placeholder="Direct Quotes & Validated Pain Points..."
                  value={newFeedbackNotes}
                  onChange={(e) => setNewFeedbackNotes(e.target.value)}
                  className="text-xs p-2 rounded-xl border border-slate-200"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-900 text-white rounded-xl text-xs font-semibold"
                >
                  Save Interview Feedback
                </button>
              </div>
            </form>

            {/* Feedback Records List */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Recorded Customer Interviews ({customerHub?.feedbackRecords?.length || 0})
              </h3>

              {(customerHub?.feedbackRecords || []).map((fb: any) => (
                <div key={fb.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900">{fb.intervieweeName}</span>
                      <span className="text-[10px] text-slate-400 ml-2">Date: {fb.date} • {fb.source}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {fb.validationStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    &ldquo;{fb.notes}&rdquo;
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Participant consent confirmed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Business Model & MVP */}
        {activeTab === "business_model" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Lean Canvas & MoSCoW MVP Backlog</h2>
                <p className="text-xs text-slate-500">
                  9-block canvas architecture paired with feature development prioritization.
                </p>
              </div>
            </div>

            {/* Canvas Blocks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">Target Customer Segments</span>
                <ul className="list-disc pl-4 text-slate-600 space-y-1">
                  {(businessModel?.customerSegments || ["Campus undergrads", "Graduating seniors"]).map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">Unique Value Proposition</span>
                <ul className="list-disc pl-4 text-slate-600 space-y-1">
                  {(businessModel?.valueProposition || ["Verified student community", "Safe designated drop spots"]).map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">Revenue Streams</span>
                <ul className="list-disc pl-4 text-slate-600 space-y-1">
                  {(businessModel?.revenueStreams || ["5% marketplace commission", "₹49 featured boost"]).map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* MoSCoW MVP Features */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                MoSCoW MVP Prioritization Board
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="font-bold text-xs text-emerald-900 block mb-2">Must Have (v1 Core)</span>
                  <div className="space-y-1.5 text-[11px] text-emerald-950">
                    <div className="p-2 bg-white rounded-lg border border-emerald-100">Student Email Auth (.edu)</div>
                    <div className="p-2 bg-white rounded-lg border border-emerald-100">Campus Category Feed</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                  <span className="font-bold text-xs text-blue-900 block mb-2">Should Have (Next Sprint)</span>
                  <div className="space-y-1.5 text-[11px] text-blue-950">
                    <div className="p-2 bg-white rounded-lg border border-blue-100">Escrow Payment Gateway</div>
                    <div className="p-2 bg-white rounded-lg border border-blue-100">In-App Chat Meetup Scheduler</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="font-bold text-xs text-slate-700 block mb-2">Later / Backlog</span>
                  <div className="space-y-1.5 text-[11px] text-slate-600">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">Campus Courier Tip Concierge</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Finance & Runway */}
        {activeTab === "finance" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Startup Budget & Finance Planner</h2>
                <p className="text-xs text-slate-500">
                  Mathematical burn calculations, cash runway, and unit economics break-even.
                </p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Available Cash</span>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  ₹{(projections?.effectiveCashBalance || 100000).toLocaleString()}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Net Monthly Burn</span>
                <div className="text-xl font-bold text-rose-600 mt-1">
                  ₹{(projections?.netMonthlyBurn || 15000).toLocaleString()}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-brand-50 border border-brand-200">
                <span className="text-[10px] text-brand-700 uppercase font-bold">Estimated Runway</span>
                <div className="text-xl font-extrabold text-brand-900 mt-1">
                  {projections?.runwayMonths} months
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                <span className="text-[10px] text-purple-700 uppercase font-bold">Break-Even Sales</span>
                <div className="text-xl font-extrabold text-purple-900 mt-1">
                  {projections?.breakEvenCustomers || 35} orders / mo
                </div>
              </div>
            </div>

            {/* Formula Explanations */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-900 text-xs">Transparent Mathematical Assumptions</span>
              {(projections?.formulas || []).map((f: any, idx: number) => (
                <div key={idx} className="text-slate-600">
                  <strong>{f.name}:</strong> <span className="font-mono text-brand-700">{f.formula}</span>
                </div>
              ))}
              <p className="text-[10px] text-slate-400 pt-2 italic">
                {projections?.disclaimer || "Financial simulations derived from supplied assumptions. Not formal investment advice."}
              </p>
            </div>
          </div>
        )}

        {/* Tab 7: Equity Split Calculator */}
        {activeTab === "equity" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Equity Split Calculator</h2>
                <p className="text-xs text-slate-500">
                  5-factor mathematical weighting: Time (35%), Responsibilities (20%), Cash (20%), IP (15%), Risk (10%).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(equityData?.calculation?.foundersWithShares || [
                { name: "Aarav Sharma (CTO)", calculatedSharePct: 53.5, timeCommitmentHoursPerWeek: 40, cashInvested: 100000 },
                { name: "Priya Patel (CEO)", calculatedSharePct: 36.5, timeCommitmentHoursPerWeek: 35, cashInvested: 50000 },
              ]).map((f: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{f.name}</span>
                    <span className="text-lg font-black text-brand-700">{f.calculatedSharePct}%</span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-0.5">
                    <div>Commitment: {f.timeCommitmentHoursPerWeek} hrs/week</div>
                    <div>Capital Invested: ₹{f.cashInvested?.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <span className="font-bold">Legal Disclaimer:</span>
              <p className="text-[11px] leading-relaxed">
                This equity model is an objective discussion aid and framework for founder alignment. It does not constitute legal, tax, or financial advice. Formal equity agreements and vesting cliffs require formal drafting by qualified startup corporate attorneys.
              </p>
            </div>
          </div>
        )}

        {/* Tab 8: Pitch Deck Generator */}
        {activeTab === "pitch_deck" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">12-Slide Pitch Deck</h2>
                <p className="text-xs text-slate-500">
                  Standard venture capital deck outline based on workspace validation.
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export to Print / PDF</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(pitchDeck?.slides || []).map((slide: any) => (
                <div
                  key={slide.slideNumber}
                  className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-mono text-xs font-bold text-brand-700">
                      Slide {slide.slideNumber}
                    </span>
                    <span className="font-bold text-xs text-slate-900">{slide.title}</span>
                  </div>

                  {slide.subtitle && (
                    <p className="text-xs font-semibold text-slate-700">{slide.subtitle}</p>
                  )}

                  <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                    {slide.bulletPoints.map((pt: string, i: number) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>

                  {slide.speakerNotes && (
                    <div className="p-2 bg-slate-50 rounded text-[11px] text-slate-500 border border-slate-100">
                      <strong>Presenter Notes:</strong> {slide.speakerNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 9: Team & Permissions */}
        {activeTab === "team" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Workspace Members & Permissions</h2>
                <p className="text-xs text-slate-500">
                  Strict server authorization. No access granted simply by guessing URLs or IDs.
                </p>
              </div>
            </div>

            {/* Invite Form */}
            <form onSubmit={handleInvite} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-bold text-xs text-slate-900 block">Invite New Team Collaborator</span>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Collaborator email address..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="member">Member (Can edit tasks & validation)</option>
                  <option value="admin">Admin (Can invite & edit privacy)</option>
                  <option value="viewer">Viewer (Read-only)</option>
                </select>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-5 py-2.5 bg-brand-900 hover:bg-brand-800 text-white rounded-xl text-xs font-semibold shrink-0"
                >
                  {inviting ? "Sending..." : "Send Invitation"}
                </button>
              </div>
            </form>

            {/* Active Members List */}
            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Active Members ({teamMembers.length})
              </h3>
              {teamMembers.map((m: any) => (
                <div
                  key={m._id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-xs text-slate-900">{m.userId}</span>
                    <span className="text-[10px] text-slate-500 ml-2">Title: {m.title || "Collaborator"}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 10: AI Assistant Chat */}
        {activeTab === "assistant" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-brand-600" />
                <div>
                  <h2 className="text-base font-bold text-slate-900">AI Startup Assistant</h2>
                  <p className="text-xs text-slate-500">
                    Workspace-isolated chat mentor. Has context exclusively on {workspace.name}.
                  </p>
                </div>
              </div>
            </div>

            {/* Messages box */}
            <div className="h-96 overflow-y-auto space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-brand-900 text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.content}</div>
                  </div>
                </div>
              ))}
              {assistantLoading && (
                <div className="text-xs text-slate-400 italic">BuildUp Assistant is analyzing...</div>
              )}
            </div>

            {/* Input bar */}
            <form onSubmit={handleAssistantSend} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask advice on roadmap priorities, customer questions, or pricing..."
                className="flex-1 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={assistantLoading}
                className="px-5 py-3 bg-brand-900 hover:bg-brand-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
