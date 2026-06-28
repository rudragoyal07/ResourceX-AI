"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Mail, 
  Bell, 
  Lock, 
  Award, 
  Clock,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function SettingsPage() {
  const { activeOrg } = useApp();

  // Profile Form States
  const [name, setName] = useState(activeOrg.name);
  const [location, setLocation] = useState(activeOrg.location);
  const [email, setEmail] = useState("ops@" + activeOrg.id + ".org");

  // Notifications Toggles
  const [notifyShortage, setNotifyShortage] = useState(true);
  const [notifyMatch, setNotifyMatch] = useState(true);
  const [notifyTransit, setNotifyTransit] = useState(true);

  // Security States
  const [publicKey, setPublicKey] = useState("0x3B82...F610B");

  return (
    <div className="space-y-8 flex-grow">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">Trust Profile & Settings</h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Configure your organization and review verified trust audit metrics</p>
      </div>

      {/* Grid: Trust Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Trust audit breakdown */}
        <div className="md:col-span-4 space-y-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trust Performance Audit</h3>

          <div className="glass-panel p-6 rounded-xl space-y-6 relative overflow-hidden border border-emerald-500/20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl" />
            
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 mb-3 shadow shadow-emerald-500/10">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                Verified Node
              </span>
              <h3 className="text-3xl font-black text-white mt-4">{activeOrg.trustScore}/100</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Audit Score Rating</p>
            </div>

            {/* Performance Parameters */}
            <div className="space-y-4 pt-4 border-t border-slate-900 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-1.5"><Award className="w-4 h-4" /> Completion Rate</span>
                <span className="font-bold text-white">{activeOrg.reliability}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-1.5"><Clock className="w-4 h-4" /> Average Latency</span>
                <span className="font-bold text-white">{activeOrg.responseTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Transfers</span>
                <span className="font-bold text-white">{activeOrg.completedExchanges} completed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Delivery Rating</span>
                <span className="font-bold text-emerald-400">★★★★★ {activeOrg.deliveryRating}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Forms */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Profile details */}
          <div className="glass-panel p-6 rounded-xl space-y-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" /> Organization Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block text-gray-500 mb-1.5 font-semibold">Facility Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1.5 font-semibold">Location (City)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1.5 font-semibold">Contact Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1.5 font-semibold">Organization Type</label>
                <div className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded text-gray-400 font-semibold select-none">
                  {activeOrg.type} (Role Managed)
                </div>
              </div>
            </div>
          </div>

          {/* Notifications config */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Bell className="w-4 h-4 text-orange-400" /> AI Notification Alert Toggles
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded hover:bg-slate-900/40">
                <div>
                  <h5 className="font-bold text-white">AI Shortage Prediction Warnings</h5>
                  <p className="text-[10px] text-gray-500 mt-0.5">Alert immediately when local reserves forecast drops below threshold.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyShortage}
                  onChange={(e) => setNotifyShortage(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center p-2.5 rounded hover:bg-slate-900/40">
                <div>
                  <h5 className="font-bold text-white">Smart Match Suggestions</h5>
                  <p className="text-[10px] text-gray-500 mt-0.5">Notify when matching surplus inventory items are listed on marketplace.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyMatch}
                  onChange={(e) => setNotifyMatch(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center p-2.5 rounded hover:bg-slate-900/40">
                <div>
                  <h5 className="font-bold text-white">Shipment Progress updates</h5>
                  <p className="text-[10px] text-gray-500 mt-0.5">Alert at each workflow stage during active drone cargo transfers.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyTransit}
                  onChange={(e) => setNotifyTransit(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Cryptographic security section */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" /> Decentralized Security Verification
            </h3>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Every emergency contract is signed with your local key and published to the decentralized logistics audit network for immutable verification.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-500 mb-1 font-semibold">Public Signature Node Key</label>
                <input
                  type="text"
                  readOnly
                  value={publicKey}
                  className="w-full bg-slate-950 border border-slate-850 text-gray-500 p-2.5 rounded font-mono select-all focus:outline-none"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  className="px-4 py-2.5 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 font-bold rounded cursor-pointer w-full text-center active:scale-95 transition"
                >
                  Regenerate Node Key
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
