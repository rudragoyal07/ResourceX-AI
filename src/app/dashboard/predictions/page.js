"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  AlertTriangle, 
  MapPin, 
  Activity, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight,
  TrendingDown
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { forecastShortages } from "@/utils/aiEngine";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from "recharts";

export default function PredictionsPage() {
  const { inventory, requests } = useApp();
  const [forecasts, setForecasts] = useState([]);
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const data = forecastShortages(inventory, requests);
    setForecasts(data);
    if (data.length > 0) {
      setSelectedForecast(data[0]);
    }
  }, []);

  const handleSelect = (id) => {
    const found = forecasts.find((f) => f.id === id);
    if (found) {
      setSelectedForecast(found);
    }
  };

  // Mock data for heatmap grid: cities vs resource groups
  const heatmapData = [
    { city: "New Delhi", oxygen: "Low", medicine: "Good", fuel: "Good", food: "Medium" },
    { city: "Noida", oxygen: "Critical", medicine: "Medium", fuel: "Good", food: "Good" },
    { city: "Gurugram", oxygen: "Good", medicine: "Good", fuel: "Low", food: "Good" },
    { city: "Ghaziabad", oxygen: "Good", medicine: "Critical", fuel: "Good", food: "Low" },
    { city: "Dwarka", oxygen: "Good", medicine: "Good", fuel: "Good", food: "Good" },
    { city: "Faridabad", oxygen: "Medium", medicine: "Good", fuel: "Good", food: "Good" }
  ];

  const getHeatmapColor = (status) => {
    if (status === "Critical") return "bg-red-500/20 text-red-400 border border-red-500/35 glow-border-red";
    if (status === "Low") return "bg-orange-500/15 text-orange-400 border border-orange-500/25";
    if (status === "Medium") return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
    return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  };

  return (
    <div className="space-y-8 flex-grow">
      
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          AI Shortage Predictions
          <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
        </h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Predictive supply chain exhaustion modeling & risk mitigations</p>
      </div>

      {/* Forecast Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {forecasts.map((f) => {
          const isSelected = selectedForecast && selectedForecast.id === f.id;
          let threatColor = "text-yellow-400 border-yellow-500/25";
          if (f.riskLevel === "Critical") {
            threatColor = "text-red-400 border-red-500/30 glow-border-red";
          } else if (f.riskLevel === "High") {
            threatColor = "text-orange-400 border-orange-500/25";
          }

          return (
            <div
              key={f.id}
              onClick={() => handleSelect(f.id)}
              className={`glass-card p-5 rounded-xl border cursor-pointer text-left transition relative overflow-hidden ${
                isSelected ? 'bg-blue-950/20 border-blue-500/40 shadow shadow-blue-500/10' : 'border-slate-900 hover:border-slate-800'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{f.category}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${threatColor}`}>
                  {f.riskLevel}
                </span>
              </div>
              <h3 className="font-extrabold text-white text-sm mt-3 tracking-tight">{f.title}</h3>
              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-500" /> {f.affectedRegion}
              </p>
              
              <div className="mt-5 flex justify-between items-baseline">
                <span className="text-[9px] text-gray-500 uppercase tracking-wider">Probability</span>
                <span className="text-2xl font-black text-white">{f.probability}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Charts & Recommendations (Left) and Heatmap (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Detailed Chart & Action plans */}
        <div className="lg:col-span-8 space-y-6">
          {selectedForecast && (
            <div className="glass-panel p-6 rounded-xl space-y-6">
              
              <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-900 pb-4">
                <div>
                  <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">AI Forecast Modeling</span>
                  <h3 className="font-extrabold text-white text-base mt-0.5">{selectedForecast.title} Details</h3>
                  <p className="text-xs text-gray-400 mt-1 italic">{selectedForecast.reasoning}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Expected Exhaustion</span>
                  <span className="text-xs font-bold text-red-400">{selectedForecast.predictedTime}</span>
                </div>
              </div>

              {/* Chart */}
              <div className="h-60 w-full">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedForecast.chartData}>
                      <defs>
                        <linearGradient id="predSupplyColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="predDemandColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="#6b7280" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#6b7280" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="supply" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#predSupplyColor)" name="Supply Reserve" />
                      <Area type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#predDemandColor)" name="Demand Spike" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-slate-900/50 animate-pulse rounded-lg" />
                )}
              </div>

              {/* AI Recommended mitigation strategies */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" /> AI Recommended Mitigation Strategies
                </h4>
                <div className="space-y-2">
                  {selectedForecast.recommendedActions.map((action, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-slate-950 border border-slate-900 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-gray-300 leading-relaxed">{action}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Right: Regional Threat Heatmap */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-xl space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white">Regional Threat Heatmap</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Current supply rating by sector</p>
          </div>

          {/* Grid Layout Heatmap */}
          <div className="space-y-4">
            <div className="grid grid-cols-5 text-center text-[9px] text-gray-500 uppercase tracking-wider border-b border-slate-900 pb-2">
              <span className="text-left">Sector</span>
              <span>O2</span>
              <span>Med</span>
              <span>Fuel</span>
              <span>Food</span>
            </div>
            
            {heatmapData.map((row) => (
              <div key={row.city} className="grid grid-cols-5 items-center text-center text-xs">
                <span className="text-left font-bold text-gray-400 text-[11px] truncate">{row.city}</span>
                <span className={`py-1 rounded text-[10px] font-bold ${getHeatmapColor(row.oxygen)}`}>{row.oxygen}</span>
                <span className={`py-1 rounded text-[10px] font-bold ${getHeatmapColor(row.medicine)}`}>{row.medicine}</span>
                <span className={`py-1 rounded text-[10px] font-bold ${getHeatmapColor(row.fuel)}`}>{row.fuel}</span>
                <span className={`py-1 rounded text-[10px] font-bold ${getHeatmapColor(row.food)}`}>{row.food}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-900 text-[10px] text-gray-500 flex flex-wrap gap-x-4 gap-y-2 justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500/10 border border-emerald-500/20" />
              <span>Good</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-yellow-500/10 border border-yellow-500/20" />
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-orange-500/15 border border-orange-500/25" />
              <span>Low</span>
            </div>
            <div className="flex items-center gap-1.5 animate-pulse">
              <span className="w-2.5 h-2.5 rounded bg-red-500/20 border border-red-500/35" />
              <span>Critical</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
