"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  HelpCircle,
  Truck,
  Activity,
  CheckCircle,
  XCircle,
  Compass
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { matchSuppliers } from "@/utils/aiEngine";

// Sub-component to wrap the matching logic that uses searchParams
function MatchingContent() {
  const { requests, inventory, organizations, acceptMatch, exchanges, WORKFLOW_STAGES } = useApp();
  const searchParams = useSearchParams();
  const reqIdParam = searchParams.get("reqId");

  // State
  const [selectedReq, setSelectedReq] = useState(null);
  const [matches, setMatches] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [activeExchangeId, setActiveExchangeId] = useState(null);

  // Set initial request based on search param or fallback to first pending request
  useEffect(() => {
    const pendingReqs = requests.filter((r) => r.status === "Pending");
    if (reqIdParam) {
      const match = requests.find((r) => r.id === reqIdParam);
      if (match) {
        setSelectedReq(match);
        return;
      }
    }
    if (pendingReqs.length > 0) {
      setSelectedReq(pendingReqs[0]);
    } else {
      setSelectedReq(null);
    }
  }, [reqIdParam, requests]);

  // Compute matches when selected request changes
  useEffect(() => {
    if (selectedReq) {
      const recommended = matchSuppliers(selectedReq, inventory, organizations);
      setMatches(recommended);
      setCompareList([]); // reset comparison
    } else {
      setMatches([]);
    }
  }, [selectedReq, inventory, organizations]);

  const handleSelectReq = (reqId) => {
    const req = requests.find((r) => r.id === reqId);
    if (req) {
      setSelectedReq(req);
    }
  };

  const handleToggleCompare = (supplierId) => {
    const supplierMatch = matches.find((m) => m.supplierId === supplierId);
    if (!supplierMatch) return;

    setCompareList((prev) => {
      const exists = prev.some((item) => item.supplierId === supplierId);
      if (exists) {
        return prev.filter((item) => item.supplierId !== supplierId);
      } else {
        if (prev.length >= 3) return prev; // Limit comparison to 3
        return [...prev, supplierMatch];
      }
    });
  };

  const handleAccept = (supplierId, matchDetails) => {
    if (!selectedReq) return;
    const exchId = acceptMatch(selectedReq.id, supplierId, matchDetails);
    setActiveExchangeId(exchId);
  };

  // Find active exchange if it exists
  const activeExchange = exchanges.find((ex) => ex.id === activeExchangeId || (selectedReq && ex.requestId === selectedReq.id && ex.status !== "Completed"));

  return (
    <div className="space-y-8 flex-grow">
      
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          AI Smart Matching Engine
          <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
        </h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Autonomous supplier matching, route optimization & transit forecasting</p>
      </div>

      {/* Grid: Request Selector (Left) & Matching Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Requests List Selector */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Alarms</h3>
          
          <div className="space-y-3 max-h-[480px] overflow-y-auto">
            {requests.filter(r => r.status === "Pending").map((req) => {
              const isSelected = selectedReq && selectedReq.id === req.id;
              
              return (
                <div
                  key={req.id}
                  onClick={() => handleSelectReq(req.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer text-left ${
                    isSelected 
                      ? 'bg-blue-950/20 border-blue-500/40 shadow shadow-blue-500/10' 
                      : 'bg-slate-900/40 border-slate-900 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{req.category}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      req.priority === "Critical" ? 'text-red-400 bg-red-500/10' : 'text-yellow-400 bg-yellow-500/10'
                    }`}>{req.priority}</span>
                  </div>
                  <h4 className="font-bold text-xs text-white truncate">{req.quantity} {req.unit} of {req.resourceNeeded}</h4>
                  <p className="text-[10px] text-gray-400 mt-1 truncate">{req.creatorName}</p>
                </div>
              );
            })}

            {requests.filter(r => r.status === "Pending").length === 0 && (
              <div className="glass-panel p-6 text-center rounded-xl">
                <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs text-gray-400 font-semibold">All alarms resolved</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Supply chains stable.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Matches Recommendations */}
        <div className="lg:col-span-8 space-y-6">
          {selectedReq ? (
            <>
              {/* Selected Request Summary */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Active Target Request</span>
                  <h3 className="text-sm font-extrabold text-white mt-0.5">
                    {selectedReq.quantity} {selectedReq.unit} {selectedReq.resourceNeeded}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">Requested by: {selectedReq.creatorName} &bull; Destination: {selectedReq.location}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-500/15 border border-yellow-500/25 px-2.5 py-1 rounded">
                  <Activity className="w-4 h-4 animate-pulse" />
                  Status: Finding Matches...
                </div>
              </div>

              {/* Check if an active exchange is already executing */}
              {activeExchange ? (
                // Interactive Workflow progress tracker
                <div className="glass-panel p-6 rounded-xl space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-white">Logistics Routing Pipeline</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Transfers status: {activeExchange.status}</p>
                    </div>
                    <span className="text-xs text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20 flex items-center gap-1.5 animate-pulse">
                      <Truck className="w-4 h-4" />
                      Active Dispatch
                    </span>
                  </div>

                  {/* Visual Timeline bar */}
                  <div className="relative pt-6 pb-2">
                    {/* Background Progress bar line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-900 -translate-y-1/2 z-0" />
                    <div 
                      className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 z-0 transition-all duration-1000" 
                      style={{ width: `${(activeExchange.currentStageIndex / 6) * 100}%` }}
                    />

                    {/* Timeline Stages nodes */}
                    <div className="flex justify-between relative z-10">
                      {WORKFLOW_STAGES.map((stage, idx) => {
                        const isDone = idx <= activeExchange.currentStageIndex;
                        const isCurrent = idx === activeExchange.currentStageIndex;
                        return (
                          <div key={idx} className="flex flex-col items-center select-none">
                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs transition duration-500 ${
                              isDone 
                                ? 'bg-blue-600 border-blue-500 text-white shadow shadow-blue-500/40' 
                                : 'bg-slate-950 border-slate-900 text-gray-600'
                            } ${isCurrent ? 'ring-4 ring-blue-500/20' : ''}`}>
                              {idx === 0 ? "📝" : idx === 1 ? "🤖" : idx === 2 ? "🤝" : idx === 3 ? "👍" : idx === 4 ? "📦" : idx === 5 ? "🚁" : "🏁"}
                            </div>
                            <span className={`text-[8px] font-bold mt-2 max-w-[50px] text-center truncate ${
                              isCurrent ? 'text-blue-400' : isDone ? 'text-gray-400' : 'text-gray-600'
                            }`}>{stage}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Route parameters details */}
                  <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500 uppercase tracking-widest text-[9px] block">Carrier Type</span>
                      <span className="font-bold text-white">Autonomous Cargo Drone</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase tracking-widest text-[9px] block">Estimated Delivery</span>
                      <span className="font-bold text-emerald-400">{activeExchange.routeDetails.eta}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase tracking-widest text-[9px] block">Transit Fee</span>
                      <span className="font-bold text-white">{activeExchange.routeDetails.cost}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase tracking-widest text-[9px] block">Pipeline Safety</span>
                      <span className="font-bold text-white">{activeExchange.routeDetails.safety}% (Low Risk)</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-500 italic text-center">
                    Status updates automatically every 12 seconds in simulated live coordination.
                  </p>
                </div>
              ) : (
                <>
                  {/* Top Supplier Recommendations */}
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Ranked Supplier Matches</h3>
                  
                  <div className="space-y-4">
                    {matches.map((match) => {
                      const isComparing = compareList.some((item) => item.supplierId === match.supplierId);
                      
                      let riskBadgeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
                      if (match.risk === "Medium") riskBadgeColor = "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";

                      return (
                        <div key={match.supplierId} className="glass-panel p-5 rounded-xl border border-slate-900 flex flex-col sm:flex-row justify-between gap-6 hover:border-slate-800 transition">
                          
                          {/* Score and Core Specs */}
                          <div className="flex-grow space-y-3">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{match.avatar}</span>
                              <div>
                                <h4 className="font-extrabold text-white text-sm">{match.supplierName}</h4>
                                <p className="text-[10px] text-gray-500 mt-0.5">
                                  {match.resourceName} &bull; {match.availableQty} units available
                                </p>
                              </div>
                            </div>

                            <p className="text-xs text-gray-400 leading-relaxed italic">{match.reasoning}</p>

                            <div className="flex flex-wrap gap-4 text-[10px] text-gray-500">
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {match.distance} km away</span>
                              <span>ETA: <strong className="text-white">{match.eta}</strong></span>
                              <span>Cost: <strong className="text-white">{match.cost}</strong></span>
                              <span className={`px-1.5 py-0.5 rounded border ${riskBadgeColor}`}>Risk: {match.risk}</span>
                            </div>
                          </div>

                          {/* Scores & Match actions */}
                          <div className="shrink-0 sm:border-l border-slate-900 sm:pl-6 flex flex-col justify-between items-end gap-4 min-w-[130px]">
                            <div className="text-right">
                              <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-semibold">Match Score</span>
                              <span className="text-2xl font-black text-blue-400">{match.matchScore}%</span>
                              <span className="text-[9px] text-gray-500 block">Confidence: {match.confidence}%</span>
                            </div>

                            <div className="flex gap-2 w-full">
                              <button
                                onClick={() => handleToggleCompare(match.supplierId)}
                                className={`px-2 py-1.5 rounded text-[10px] font-bold border transition flex-grow active:scale-95 cursor-pointer text-center ${
                                  isComparing 
                                    ? 'bg-blue-600 border-blue-500 text-white' 
                                    : 'border-slate-800 text-gray-400 hover:text-white hover:bg-slate-900'
                                }`}
                              >
                                {isComparing ? "Added" : "Compare"}
                              </button>
                              <button
                                onClick={() => handleAccept(match.supplierId, match)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold flex-grow active:scale-95 transition cursor-pointer text-center"
                              >
                                Accept Match
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })}

                    {matches.length === 0 && (
                      <div className="glass-panel p-12 text-center rounded-xl">
                        <AlertTriangle className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                        <h4 className="text-sm font-bold text-white">No matches found</h4>
                        <p className="text-xs text-gray-500 mt-1">There are no third-party facilities holding surplus inventories of this category.</p>
                      </div>
                    )}
                  </div>

                  {/* Comparison Matrix Table */}
                  {compareList.length > 0 && (
                    <div className="glass-panel p-6 rounded-xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest">Supplier Comparison Matrix</h3>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Limit: 3 candidates</span>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-900 text-gray-500 text-[10px] uppercase tracking-wider">
                              <th className="py-2 pr-4 font-normal">Metric</th>
                              {compareList.map((m) => (
                                <th key={m.supplierId} className="py-2 pr-4 font-bold text-white">{m.supplierName}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-900 text-gray-300">
                            <tr>
                              <td className="py-2 pr-4 font-semibold text-gray-500">Match Score</td>
                              {compareList.map((m) => (
                                <td key={m.supplierId} className="py-2 pr-4 text-blue-400 font-bold">{m.matchScore}%</td>
                              ))}
                            </tr>
                            <tr>
                              <td className="py-2 pr-4 font-semibold text-gray-500">Confidence</td>
                              {compareList.map((m) => (
                                <td key={m.supplierId} className="py-2 pr-4">{m.confidence}%</td>
                              ))}
                            </tr>
                            <tr>
                              <td className="py-2 pr-4 font-semibold text-gray-500">Distance</td>
                              {compareList.map((m) => (
                                <td key={m.supplierId} className="py-2 pr-4">{m.distance} km</td>
                              ))}
                            </tr>
                            <tr>
                              <td className="py-2 pr-4 font-semibold text-gray-500">ETA</td>
                              {compareList.map((m) => (
                                <td key={m.supplierId} className="py-2 pr-4 text-emerald-400 font-semibold">{m.eta}</td>
                              ))}
                            </tr>
                            <tr>
                              <td className="py-2 pr-4 font-semibold text-gray-500">Transit Cost</td>
                              {compareList.map((m) => (
                                <td key={m.supplierId} className="py-2 pr-4">{m.cost}</td>
                              ))}
                            </tr>
                            <tr>
                              <td className="py-2 pr-4 font-semibold text-gray-500">Supplier Reliability</td>
                              {compareList.map((m) => (
                                <td key={m.supplierId} className="py-2 pr-4">{m.reliability}%</td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="glass-panel p-12 text-center rounded-xl">
              <Compass className="w-8 h-8 text-gray-600 mx-auto mb-3 animate-spin" style={{ animationDuration: '20s' }} />
              <h4 className="text-sm font-bold text-white">No active requests selected</h4>
              <p className="text-xs text-gray-500 mt-1">Please select an alarm request on the left menu to compute matching logistics.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default function MatchingPage() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-gray-400">Loading Smart Matching...</div>}>
      <MatchingContent />
    </Suspense>
  );
}
