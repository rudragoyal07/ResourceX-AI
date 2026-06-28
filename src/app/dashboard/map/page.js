"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Sparkles, Map, ShieldAlert, Navigation, Compass } from "lucide-react";
import { useApp } from "@/context/AppContext";

// Load the CrisisMap component dynamically with SSR disabled to prevent Leaflet window reference errors
const CrisisMap = dynamic(() => import("@/components/CrisisMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-950 flex flex-col justify-center items-center gap-4">
      <Compass className="w-8 h-8 text-blue-500 animate-spin" />
      <span className="text-xs text-gray-500 font-mono">Loading Interactive Logistics Map Layer...</span>
    </div>
  ),
});

export default function MapPage() {
  const { exchanges } = useApp();

  const activeDroneTransfers = exchanges.filter(
    (ex) => ex.status === "In Transit" || ex.status === "Match Approved" || ex.status === "Shipment Planned"
  );

  return (
    <div className="space-y-6 flex-grow flex flex-col h-[calc(100vh-140px)] overflow-hidden">
      
      {/* Title */}
      <div className="shrink-0">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Global Crisis Logistics Map
          <Map className="w-5 h-5 text-blue-400 animate-pulse" />
        </h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Real-time inventory positions, node statuses, and cargo routes</p>
      </div>

      {/* Main Map Grid */}
      <div className="flex-grow flex flex-col lg:flex-row gap-6 overflow-hidden">
        
        {/* Left Side: Dynamic Leaflet Map Container */}
        <div className="flex-grow min-h-[500px] lg:h-full lg:w-3/4">
          <CrisisMap />
        </div>

        {/* Right Side: Map Controls & Cargo Stream */}
        <div className="lg:w-1/4 h-full shrink-0 flex flex-col gap-6 overflow-y-auto">
          
          {/* Map Legend */}
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Network Nodes Legend</h3>
            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-xs">🏥</span>
                <span>Hospitals (Shortage Nodes)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-xs">🏢</span>
                <span>Logistics Warehouses</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs">🤝</span>
                <span>NGO Disaster Hubs</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-xs">🏛️</span>
                <span>Government Reserves</span>
              </div>
            </div>
          </div>

          {/* Active Cargo Ticker */}
          <div className="glass-panel p-5 rounded-xl flex-grow flex flex-col">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-blue-400" /> Active Transports
            </h3>
            
            <div className="space-y-3 overflow-y-auto flex-grow max-h-[220px]">
              {activeDroneTransfers.map((ex) => (
                <div key={ex.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-900 flex justify-between items-center text-xs">
                  <div>
                    <h5 className="font-bold text-white max-w-[120px] truncate">{ex.resource}</h5>
                    <p className="text-[9px] text-gray-500 mt-0.5">{ex.supplierName} &rarr; {ex.requesterName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[9px] font-bold text-blue-400 animate-pulse block">ETA {ex.routeDetails.eta}</span>
                    <span className="text-[8px] text-gray-500 font-mono mt-0.5 block">{ex.quantity} units</span>
                  </div>
                </div>
              ))}

              {activeDroneTransfers.length === 0 && (
                <div className="text-center py-6 text-gray-500 italic text-[11px]">
                  No active cargo drone lanes.
                </div>
              )}
            </div>
          </div>

          {/* Alert panel */}
          <div className="p-4 rounded-xl bg-red-950/15 border border-red-500/20 flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h5 className="text-xs font-bold text-red-400">Noida Sector 62</h5>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
                Region flagged as **Critical Shortage**. Red pulsing overlay represents simulated oxygen supply bottleneck warnings.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
