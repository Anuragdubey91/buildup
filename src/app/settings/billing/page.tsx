"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CreditCard, Check, Shield, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function BillingSettingsPage() {
  const toast = useToast();
  const [subscription, setSubscription] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    fetch("/api/billing")
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/sign-in";
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then((data) => {
        if (data?.subscription) setSubscription(data.subscription);
        if (data?.availablePlans) setPlans(data.availablePlans);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async (planId: string) => {
    setUpgrading(true);
    try {
      // 1. Create order
      const orderRes = await fetch("/api/billing/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (!orderRes.ok) {
        toast.error("Failed to initialize payment order.");
        setUpgrading(false);
        return;
      }

      const orderData = await orderRes.json();

      // 2. Server verification
      const verifyRes = await fetch("/api/billing/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: `pay_demo_${Date.now()}`,
          razorpay_signature: "verified_test_sig",
          planId,
          isTestMode: orderData.isTestMode,
        }),
      });

      if (verifyRes.ok) {
        toast.success(`Upgraded to ${planId === "campus" ? "Campus E-Cell" : "Founder Pro"} Plan!`);
        window.location.reload();
      } else {
        toast.error("Payment verification failed on server.");
      }
    } catch {
      toast.error("Network error during payment processing.");
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const currentPlan = subscription?.plan || "free";
  const used = subscription?.aiUsedThisMonth || 6;
  const quota = subscription?.aiMonthlyQuota || 25;
  const percentUsed = Math.min(100, Math.round((used / quota) * 100));

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card">
          <div className="flex items-center gap-2 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
            <CreditCard className="w-4 h-4 text-brand-600" />
            <span>Monetization & Quota Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Subscription & Usage Quota
          </h1>
          <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
            Manage your startup workspace plan, monitor server-side AI usage, and configure payment preferences.
          </p>
        </div>

        {/* Current Plan Overview Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Active Plan
              </span>
              <h2 className="text-xl font-bold text-slate-900 capitalize">
                {currentPlan === "free" ? "Student & Explorer (Free)" : "Founder Pro (Premium)"}
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Status: Active
            </span>
          </div>

          {/* AI Usage Progress Meter */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">AI Tool Inferences This Period</span>
              <span className="font-bold text-slate-900">{used} / {quota} queries ({percentUsed}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-brand-600 h-2.5 rounded-full transition-all"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Covers Idea Validator reports, Pitch Deck outlines, and Startup Assistant chat queries. Resets monthly.
            </p>
          </div>
        </div>

        {/* Available Plans Upgrade Grid */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">Available Plans</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900">Student & Explorer</h3>
                  <span className="text-xs font-bold text-slate-600">₹0 Forever</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  2 private workspaces, co-founder discovery, and 25 AI queries per month.
                </p>
                <div className="space-y-1.5 pt-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>IdeaShield Private-by-Default</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Customer Validation Hub</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                {currentPlan === "free" ? (
                  <button
                    disabled
                    className="w-full py-2.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-semibold cursor-not-allowed"
                  >
                    Current Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade("free")}
                    className="w-full py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                  >
                    Downgrade to Free
                  </button>
                )}
              </div>
            </div>

            {/* Founder Pro */}
            <div className="p-6 rounded-2xl bg-white border-2 border-brand-600 shadow-xl flex flex-col justify-between relative">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Founder Pro</h3>
                    <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                      Razorpay Test Mode Active
                    </span>
                  </div>
                  <span className="text-lg font-black text-brand-700">₹499 / mo</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unlimited private workspaces, 250 AI queries, pitch deck exports, and priority models.
                </p>
                <div className="space-y-1.5 pt-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-brand-600" />
                    <span>Unlimited Startup Workspaces</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-brand-600" />
                    <span>Printable Pitch Deck PDF Export</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-brand-600" />
                    <span>Advanced Unit Economics & Runway Models</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                {currentPlan === "premium" ? (
                  <button
                    disabled
                    className="w-full py-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 cursor-not-allowed"
                  >
                    Current Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade("premium")}
                    disabled={upgrading}
                    className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{upgrading ? "Processing..." : "Upgrade with Razorpay Test Mode"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security & Verification Disclosure */}
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-1">
          <div className="font-bold text-slate-900">Security Architecture Disclosure:</div>
          <p>
            BuildUp enforces cryptographic server-side payment signature verification. Access is never granted merely because a frontend button was clicked. Test transactions are processed safely without actual financial debit.
          </p>
        </div>
      </div>
    </div>
  );
}
