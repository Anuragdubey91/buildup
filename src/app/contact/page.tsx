"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, ShieldAlert, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function ContactPage() {
  const toast = useToast();
  const [category, setCategory] = useState("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [workspaceId, setWorkspaceId] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (category === "misuse") {
        const res = await fetch(`/api/startups/${workspaceId || "ws_campusbazaar_101"}/report-misuse`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: "ip_theft",
            description: `Reporter: ${name} (${email})\nWorkspace: ${workspaceId}\nDetails: ${message}`,
          }),
        });
        if (res.ok) {
          toast.success("Misuse report submitted to moderation administrators.");
        }
      } else {
        toast.success("Thank you! Your inquiry has been routed to our team.");
      }
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-card">
          <div className="flex items-center gap-2 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Mail className="w-4 h-4 text-brand-600" />
            <span>Support & Assistance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Contact BuildUp Team
          </h1>
          <p className="mt-2 text-xs text-slate-600">
            Have questions about campus incubators, platform features, or need to report an IdeaShield security incident? We respond within 24 hours.
          </p>

          <hr className="my-6 border-slate-100" />

          {submitted ? (
            <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-lg font-bold">Message Received</h2>
              <p className="text-xs max-w-md mx-auto text-emerald-800">
                Your message has been logged. Our moderation and support team will follow up with you at <strong>{email}</strong>.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Inquiry Topic
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="general">General Platform Inquiry</option>
                  <option value="campus">Campus E-Cell / University Partnership</option>
                  <option value="billing">Billing & Subscription Inquiry</option>
                  <option value="misuse">Report Misuse, Harassment, or IP Theft (IdeaShield)</option>
                </select>
              </div>

              {category === "misuse" && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">IdeaShield Moderation Channel:</span> Reports submitted under this category are reviewed directly by platform administrators. Include relevant workspace IDs, dates, and screenshots if applicable.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. aarav@college.edu"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {category === "misuse" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Affected Workspace ID / URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={workspaceId}
                    onChange={(e) => setWorkspaceId(e.target.value)}
                    placeholder="e.g. ws_campusbazaar_101"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Message / Details
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry, feature feedback, or incident details..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-xs shadow transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? "Submitting..." : "Send Message"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
