"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, ShieldAlert, ChevronUp, ChevronDown, Check } from "lucide-react";

interface Persona {
  id: string;
  name: string;
  roleDescription: string;
  avatar: string;
  isOwner?: boolean;
  isAdmin?: boolean;
}

const PERSONAS: Persona[] = [
  {
    id: "user_aarav_sharma",
    name: "Aarav Sharma",
    roleDescription: "Founder & Owner of CampusBazaar & HealthPulse",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    isOwner: true,
  },
  {
    id: "user_priya_patel",
    name: "Priya Patel",
    roleDescription: "Admin Member on CampusBazaar (Growth Lead)",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "user_rohan_mehta",
    name: "Rohan Mehta",
    roleDescription: "External Visitor (Tests IdeaShield 403 Access Denied)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "user_admin",
    name: "System Administrator",
    roleDescription: "Platform Admin (Authorized for /admin)",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    isAdmin: true,
  },
];

export function PersonaSwitcher() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentId, setCurrentId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
          setCurrentId(data.user.userId);
        } else {
          setCurrentUser(null);
          setCurrentId("");
        }
      })
      .catch(() => {});
  }, []);

  const switchPersona = async (personaId: string) => {
    setIsSwitching(true);
    try {
      const res = await fetch("/api/auth/switch-persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: personaId }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch {
      setIsSwitching(false);
    }
  };

  const activePersona = PERSONAS.find((p) => p.id === currentId);

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {isOpen && (
        <div className="mb-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <UserCheck className="w-4 h-4 text-brand-600" />
              Role & Persona Switcher
            </div>
            <span className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">
              Live Testing
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mb-2 leading-tight">
            Switch identities instantly to verify IdeaShield access restrictions, member roles, and owner controls:
          </p>

          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {PERSONAS.map((persona) => {
              const isSelected = persona.id === currentId;
              return (
                <button
                  key={persona.id}
                  disabled={isSwitching}
                  onClick={() => switchPersona(persona.id)}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? "bg-brand-50 border border-brand-200"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <img
                    src={persona.avatar}
                    alt={persona.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900 truncate">
                        {persona.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-slate-600 truncate">
                      {persona.roleDescription}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Toggle Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-full shadow-lg border border-slate-700 text-xs font-medium transition-all group"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-slate-200">
          {activePersona ? "Persona:" : currentUser ? "User:" : "Status:"}
        </span>
        <span className="text-white font-medium max-w-[120px] truncate">
          {activePersona?.name || currentUser?.displayName || "Signed Out"}
        </span>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
        )}
      </button>
    </div>
  );
}
