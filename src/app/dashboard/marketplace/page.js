"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Send,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Plus,
  X,
  Shield,
  Loader2
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { detectUrgency } from "@/utils/aiEngine";

export default function MarketplacePage() {
  const { requests, createRequest, organizations, activeOrg } = useApp();
  const router = useRouter();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Form States for Request
  const [reqResource, setReqResource] = useState("");
  const [reqCategory, setReqCategory] = useState("Oxygen");
  const [reqQty, setReqQty] = useState(100);
  const [reqUnit, setReqUnit] = useState("units");
  const [reqReason, setReqReason] = useState("");
  const [reqPriority, setReqPriority] = useState("Medium");
  const [reqLocation, setReqLocation] = useState("");
  const [reqDeadline, setReqDeadline] = useState("");

  // AI Loading Scanning overlay state
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  // Auto classify priority when resource/reason changes
  useEffect(() => {
    if (reqResource.trim() || reqReason.trim()) {
      const autoPriority = detectUrgency(reqReason, reqResource);
      setReqPriority(autoPriority);
    }
  }, [reqResource, reqReason]);

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!reqResource.trim() || !reqLocation.trim()) return;

    // Create the request
    const newReq = createRequest({
      resourceNeeded: reqResource,
      category: reqCategory,
      quantity: Number(reqQty),
      unit: reqUnit,
      reason: reqReason,
      priority: reqPriority,
      deadline: reqDeadline || new Date(Date.now() + 5*24*60*60*1000).toISOString().split('T')[0],
      location: reqLocation,
    });

    // Close request form and trigger AI scanning simulation
    setIsRequestModalOpen(false);
    setIsAiScanning(true);
    setScanStep(0);
  };

  // Simulate AI Analysis stages
  useEffect(() => {
    if (!isAiScanning) return;
    
    const scanStages = [
      "AI Urgency Detection Engine active...",
      "Analyzing geographical distances and routing hazards...",
      "Verifying supplier trust indices & historical delivery rates...",
      "Simulating supply-chain health and forecast impact...",
      "Generative matching completed. Redirecting to matches..."
    ];

    const timer = setInterval(() => {
      setScanStep((prev) => {
        if (prev >= scanStages.length - 1) {
          clearInterval(timer);
          setIsAiScanning(false);
          // Redirect user straight to AI Matching page where they can review matches
          router.push("/dashboard/matching");
          return prev;
        }
        return prev + 1;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, [isAiScanning]);

  const categories = [
    "Oxygen", "Food", "Water", "Medicine", "Fuel", "Generators", "Solar Panels", "Medical Equipment", "Batteries"
  ];

  // Filtering open requests (excluding ours for marketplace matching, or showing all but highlighting)
  const filteredRequests = requests.filter((req) => {
    // Basic search filtering
    const textMatch = 
      req.resourceNeeded.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.location.toLowerCase().includes(searchTerm.toLowerCase());

    const priorityMatch = priorityFilter === "all" || req.priority === priorityFilter;

    return textMatch && priorityMatch;
  });

  return (
    <div className="space-y-8 flex-grow">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Emergency Resource Marketplace</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Request critical supplies or view active regional needs</p>
        </div>
        <button
          onClick={() => {
            // Pre-populate user location for convenience
            setReqLocation(activeOrg.location);
            setIsRequestModalOpen(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold rounded text-white flex items-center gap-2 shadow-lg shadow-blue-600/35 active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Submit Resource Request
        </button>
      </div>

      {/* Search and filter controls */}
      <div className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search open requests by resource type or facility..."
            className="w-full bg-slate-950/80 text-xs pl-10 pr-4 py-3 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none text-white placeholder-gray-500"
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
        </div>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-xs px-3 py-2.5 rounded-lg text-gray-300 focus:outline-none w-full sm:w-auto self-stretch sm:self-auto"
        >
          <option value="all">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Requests Directory Listings */}
      <div className="space-y-4">
        {filteredRequests.map((req) => {
          // Get creator organization to display trust score
          const creator = organizations.find((o) => o.id === req.creatorId) || {};
          const isOurs = req.creatorId === activeOrg.id;
          
          let priorityColor = "text-yellow-400 bg-yellow-500/10 border-yellow-500/25";
          if (req.priority === "Critical") {
            priorityColor = "text-red-400 bg-red-500/10 border-red-500/25 animate-pulse";
          } else if (req.priority === "High") {
            priorityColor = "text-orange-400 bg-orange-500/10 border-orange-500/25";
          } else if (req.priority === "Low") {
            priorityColor = "text-blue-400 bg-blue-500/10 border-blue-500/25";
          }

          return (
            <div 
              key={req.id} 
              className={`glass-panel p-5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition hover:border-slate-800 ${
                isOurs ? 'border-blue-500/20' : 'border-slate-900'
              }`}
            >
              
              {/* Request Info Left Side */}
              <div className="space-y-3 flex-grow">
                <div className="flex flex-wrap items-center gap-2.5">
                  {isOurs && (
                    <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                      My Request
                    </span>
                  )}
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${priorityColor}`}>
                    {req.priority} Priority
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">Submitted: {new Date(req.dateCreated).toLocaleDateString()}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-white text-base">
                    {req.quantity.toLocaleString()} {req.unit} of {req.resourceNeeded}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">{req.reason}</p>
                </div>

                {/* Organization Details row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {req.creatorName}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {req.location}
                  </span>
                  
                  {/* Trust Score indicator */}
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                    <Shield className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10" />
                    Trust Score: {creator.trustScore || 90}
                  </span>
                </div>
              </div>

              {/* Action Buttons Right Side */}
              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto border-t md:border-t-0 border-slate-900 pt-4 md:pt-0">
                <button 
                  onClick={() => {
                    // Navigate to matching with query param
                    router.push(`/dashboard/matching?reqId=${req.id}`);
                  }}
                  className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 text-xs font-semibold rounded flex items-center gap-1.5 active:scale-95 transition cursor-pointer flex-grow md:flex-grow-0 justify-center"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  AI Smart Match
                </button>
              </div>

            </div>
          );
        })}

        {filteredRequests.length === 0 && (
          <div className="glass-panel p-12 text-center rounded-xl max-w-md mx-auto">
            <AlertTriangle className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-white">No active requests matches</h4>
            <p className="text-xs text-gray-500 mt-1">Try expanding priority filters or clearing search text.</p>
          </div>
        )}
      </div>

      {/* Submit Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md glass-panel border border-slate-800 rounded-xl overflow-hidden shadow-2xl p-6">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-white">Create Emergency Resource Request</h3>
              <button 
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1 rounded bg-slate-900 text-gray-400 hover:text-white"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Resource Needed</label>
                <input
                  type="text"
                  required
                  value={reqResource}
                  onChange={(e) => setReqResource(e.target.value)}
                  placeholder="e.g. Oxygen Cylinder Refills or ICU Monitors"
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Category</label>
                  <select
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">AI Calculated Priority</label>
                  <div className="w-full bg-slate-900/60 border border-slate-800 text-white p-2.5 rounded font-bold text-center select-none uppercase tracking-wide">
                    {reqPriority === "Critical" ? "🚨 Critical" : reqPriority === "High" ? "🟠 High" : "🟡 Medium"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Quantity Required</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={reqQty}
                    onChange={(e) => setReqQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Unit Type</label>
                  <input
                    type="text"
                    required
                    value={reqUnit}
                    onChange={(e) => setReqUnit(e.target.value)}
                    placeholder="e.g. cylinders, boxes"
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Reason for Request</label>
                <textarea
                  required
                  rows="3"
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  placeholder="Explain the emergency scenario and impact details..."
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Location / Sector</label>
                  <input
                    type="text"
                    required
                    value={reqLocation}
                    onChange={(e) => setReqLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Required Deadline</label>
                  <input
                    type="date"
                    required
                    value={reqDeadline}
                    onChange={(e) => setReqDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded font-bold shadow-lg shadow-blue-600/30 transition active:scale-95 cursor-pointer mt-4"
              >
                Submit Request
              </button>

            </form>

          </div>
        </div>
      )}

      {/* Holographic AI Scanning Screen Overlay */}
      {isAiScanning && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
          <div className="text-center space-y-6 max-w-md">
            
            {/* Spinning Hologram Radar */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center border border-purple-500/20 rounded-full">
              <div className="absolute inset-0 border-t-2 border-purple-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
              <div className="absolute inset-3 border-r-2 border-blue-500 rounded-full animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
              <div className="absolute inset-6 border-b-2 border-emerald-500 rounded-full animate-spin" style={{ animationDuration: '4s' }} />
              <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-white tracking-wide">AI Smart Routing Active</h3>
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Scanning Global Logistics Grid</p>
            </div>

            {/* Current Scanner Log */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-900 font-mono text-[10px] text-gray-400 text-left min-h-[60px] flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
              <span>
                {[
                  "AI Urgency Detection Engine active...",
                  "Analyzing geographical distances and routing hazards...",
                  "Verifying supplier trust indices & historical delivery rates...",
                  "Simulating supply-chain health and forecast impact...",
                  "Generative matching completed. Redirecting to matches..."
                ][scanStep]}
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
