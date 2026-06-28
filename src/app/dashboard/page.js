"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Boxes, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  ArrowUpRight,
  TrendingUp,
  BrainCircuit,
  Compass,
  ArrowRight,
  Info
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { generateExecutiveSummary } from "@/utils/aiEngine";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell 
} from "recharts";

export default function DashboardHome() {
  const { inventory, requests, exchanges, activeOrg } = useApp();
  const [mounted, setMounted] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [chartCategory, setChartCategory] = useState("All");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute metrics
  const totalQty = inventory.reduce((acc, curr) => acc + curr.quantity, 0);
  const activeExchanges = exchanges.filter(ex => ex.status !== "Completed" && ex.status !== "Rejected").length;
  const completedExchanges = exchanges.filter(ex => ex.status === "Completed").length;
  const criticalRequests = requests.filter(req => req.priority === "Critical" && req.status === "Pending").length;

  const summary = generateExecutiveSummary(inventory, requests, activeOrg);

  // Calculate dynamic totals based on selected category
  const filteredInventory = chartCategory === "All"
    ? inventory
    : inventory.filter(item => item.category.toLowerCase().includes(chartCategory.toLowerCase()));

  const filteredRequests = chartCategory === "All"
    ? requests
    : requests.filter(req => req.category.toLowerCase().includes(chartCategory.toLowerCase()));

  const totalQtySelected = filteredInventory.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalDemandSelected = filteredRequests.reduce((acc, curr) => acc + curr.quantity, 0);

  // Data for Recharts representing June timeline
  const supplyDemandData = [
    { name: "Jun 05", Supply: 0, Demand: 0 },
    { name: "Jun 10", Supply: 0, Demand: 0 },
    { name: "Jun 15", Supply: 0, Demand: 0 },
    { name: "Jun 20", Supply: 0, Demand: 0 },
    { name: "Jun 25", Supply: 0, Demand: 0 },
    { name: "Jun 28", Supply: totalQtySelected, Demand: totalDemandSelected },
  ];

  const categoryTotals = inventory.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.quantity;
    return acc;
  }, {});

  const barChartData = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    Quantity: categoryTotals[cat]
  })).slice(0, 5);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-8 flex-grow">
      
      {/* Welcome Title and AI Exec Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Logistics Console &bull; <span className="text-gray-400 font-semibold">{activeOrg.name}</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Autonomous Resource Allocation Hub</p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-bold flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 animate-bounce" />
          AI Engine Online
        </div>
      </div>

      {/* AI Insights Summary Bar */}
      <div className="glass-panel p-4 rounded-xl border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
            <BrainCircuit className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">AI Executive Briefing</span>
            <p className="text-xs text-gray-300 leading-relaxed mt-0.5" dangerouslySetInnerHTML={{ __html: summary.overview }} />
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
          <div className="text-center md:text-left">
            <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Regional Risk</span>
            <span className="text-xs font-bold text-red-400">{summary.riskIndex}</span>
          </div>
          <div className="text-center md:text-left ml-auto md:ml-0">
            <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Action Suggested</span>
            <span className="text-xs font-bold text-yellow-400">{summary.actionNeeded}</span>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
          <button 
            onClick={() => setActiveTooltip("total_reserves")}
            className="absolute top-3 right-3 text-gray-500 hover:text-white p-1 rounded-full hover:bg-slate-900 transition z-10 cursor-pointer"
            title="Learn more"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition" />
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Boxes className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-semibold border border-emerald-500/20">
              +14% (MoM)
            </span>
          </div>
          <h4 className="text-2xl font-black text-white mt-4 tracking-tight">
            {totalQty.toLocaleString()}
          </h4>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1 font-semibold">Total Pool Reserves</p>

          {activeTooltip === "total_reserves" && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md p-6 flex flex-col justify-between z-20 animate-fade-in border border-blue-500/30 rounded-xl">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Total Pool Reserves</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-3">
                  This metric sums up the total quantity of all relief supplies (oxygen, food packs, medical gear) currently stocked and available across all active local depots in our NCR database.
                </p>
              </div>
              <button 
                onClick={() => setActiveTooltip(null)}
                className="w-full py-1.5 bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/30 rounded text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-2 cursor-pointer transition active:scale-95"
              >
                Got it
              </button>
            </div>
          )}
        </div>

        {/* Metric 2 */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
          <button 
            onClick={() => setActiveTooltip("transfers_transit")}
            className="absolute top-3 right-3 text-gray-500 hover:text-white p-1 rounded-full hover:bg-slate-900 transition z-10 cursor-pointer"
            title="Learn more"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl group-hover:bg-yellow-500/10 transition" />
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 animate-spin" style={{ animationDuration: '10s' }}>
              <RefreshCw className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded font-semibold border border-yellow-500/20 animate-pulse">
              Active Pipeline
            </span>
          </div>
          <h4 className="text-2xl font-black text-white mt-4 tracking-tight">
            {activeExchanges}
          </h4>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1 font-semibold">Transfers In-Transit</p>

          {activeTooltip === "transfers_transit" && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md p-6 flex flex-col justify-between z-20 animate-fade-in border border-yellow-500/30 rounded-xl">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Transfers In-Transit</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-3">
                  Monitors the number of emergency drone deliveries and cargo vehicles currently flying or driving along logistics flight corridors in real-time.
                </p>
              </div>
              <button 
                onClick={() => setActiveTooltip(null)}
                className="w-full py-1.5 bg-yellow-600/20 hover:bg-yellow-600/35 border border-yellow-500/30 rounded text-[10px] font-bold text-yellow-300 uppercase tracking-widest mt-2 cursor-pointer transition active:scale-95"
              >
                Got it
              </button>
            </div>
          )}
        </div>

        {/* Metric 3 */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
          <button 
            onClick={() => setActiveTooltip("successful_exchanges")}
            className="absolute top-3 right-3 text-gray-500 hover:text-white p-1 rounded-full hover:bg-slate-900 transition z-10 cursor-pointer"
            title="Learn more"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition" />
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-semibold border border-emerald-500/20">
              98.5% Rate
            </span>
          </div>
          <h4 className="text-2xl font-black text-white mt-4 tracking-tight">
            {completedExchanges}
          </h4>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1 font-semibold">Successful Exchanges</p>

          {activeTooltip === "successful_exchanges" && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md p-6 flex flex-col justify-between z-20 animate-fade-in border border-emerald-500/30 rounded-xl">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Successful Exchanges</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-3">
                  Accumulates the total count of medical cargo shipments that have successfully completed all 6 routing stages and reached their destinations.
                </p>
              </div>
              <button 
                onClick={() => setActiveTooltip(null)}
                className="w-full py-1.5 bg-emerald-600/20 hover:bg-emerald-600/35 border border-emerald-500/30 rounded text-[10px] font-bold text-emerald-300 uppercase tracking-widest mt-2 cursor-pointer transition active:scale-95"
              >
                Got it
              </button>
            </div>
          )}
        </div>

        {/* Metric 4 */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group border-red-500/20">
          <button 
            onClick={() => setActiveTooltip("shortage_alarms")}
            className="absolute top-3 right-3 text-gray-500 hover:text-white p-1 rounded-full hover:bg-slate-900 transition z-10 cursor-pointer"
            title="Learn more"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl group-hover:bg-red-500/10 transition" />
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            {criticalRequests > 0 ? (
              <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded font-semibold border border-red-500/20 animate-pulse">
                Alarm
              </span>
            ) : (
              <span className="text-[10px] text-gray-500 bg-slate-900 px-2 py-0.5 rounded font-semibold border border-slate-800">
                Stable
              </span>
            )}
          </div>
          <h4 className="text-2xl font-black text-white mt-4 tracking-tight">
            {criticalRequests}
          </h4>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1 font-semibold">Critical Shortage Alarms</p>

          {activeTooltip === "shortage_alarms" && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md p-6 flex flex-col justify-between z-20 animate-fade-in border border-red-500/30 rounded-xl">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Critical Shortage Alarms</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-3">
                  Tracks critical supply deficits reported by hospitals and clinics that remain unmatched by local supplier reserves.
                </p>
              </div>
              <button 
                onClick={() => setActiveTooltip(null)}
                className="w-full py-1.5 bg-red-600/20 hover:bg-red-600/35 border border-red-500/30 rounded text-[10px] font-bold text-red-300 uppercase tracking-widest mt-2 cursor-pointer transition active:scale-95"
              >
                Got it
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Supply vs Demand Area Chart */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
          <button 
            onClick={() => setActiveTooltip("allocation_analytics")}
            className="absolute top-3 right-3 text-gray-500 hover:text-white p-1 rounded-full hover:bg-slate-900 transition z-10 cursor-pointer"
            title="Learn more"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Resource Allocation Analytics</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Supply Reserves vs Active Demands</p>
            </div>
            
            {/* Category Filter Selector */}
            <div className="flex flex-wrap items-center gap-2">
              {["All", "Oxygen", "Medicine", "Food"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setChartCategory(cat)}
                  className={`px-2.5 py-1 rounded text-[9px] font-bold tracking-wide uppercase transition cursor-pointer border ${
                    chartCategory === cat
                      ? "bg-blue-600/10 border-blue-500/30 text-blue-400 font-extrabold"
                      : "bg-slate-900/40 border-slate-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex gap-4 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-blue-500" />
                <span className="text-gray-400">Supply</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-emerald-500" />
                <span className="text-gray-400">Demand</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={supplyDemandData}>
                  <defs>
                    <linearGradient id="supplyColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="demandColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="Supply" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#supplyColor)" />
                  <Area type="monotone" dataKey="Demand" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#demandColor)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-slate-900/50 animate-pulse rounded-lg" />
            )}
          </div>

          {activeTooltip === "allocation_analytics" && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md p-6 flex flex-col justify-between z-20 animate-fade-in border border-blue-500/30 rounded-xl">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resource Allocation Analytics</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-3">
                  A chronological line chart contrasting the aggregate volume of local NCR supplies against requested emergency deficits, highlighting supply health trends.
                </p>
              </div>
              <button 
                onClick={() => setActiveTooltip(null)}
                className="w-full py-1.5 bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/30 rounded text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-2 cursor-pointer transition active:scale-95"
              >
                Got it
              </button>
            </div>
          )}
        </div>

        {/* Category Pool Reserves Bar Chart */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
          <button 
            onClick={() => setActiveTooltip("category_reserves")}
            className="absolute top-3 right-3 text-gray-500 hover:text-white p-1 rounded-full hover:bg-slate-900 transition z-10 cursor-pointer"
            title="Learn more"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          <div>
            <h3 className="text-sm font-bold text-white">Reserves by Category</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Top 5 Resource Groups</p>
          </div>

          <div className="h-64 w-full mt-6">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '12px' }} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar dataKey="Quantity" radius={[4, 4, 0, 0]}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-slate-900/50 animate-pulse rounded-lg" />
            )}
          </div>

          {activeTooltip === "category_reserves" && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md p-6 flex flex-col justify-between z-20 animate-fade-in border border-blue-500/30 rounded-xl">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Reserves by Category</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-3">
                  Breakdown of pool reserves grouped by category (e.g. Oxygen, Medicine, Food), allowing you to audit which supplies are well-stocked vs depleted.
                </p>
              </div>
              <button 
                onClick={() => setActiveTooltip(null)}
                className="w-full py-1.5 bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/30 rounded text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-2 cursor-pointer transition active:scale-95"
              >
                Got it
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Main Grid: Activity Feed and Smart Matching Action */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Recent Activity Feed */}
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
          <button 
            onClick={() => setActiveTooltip("activity_stream")}
            className="absolute top-3 right-3 text-gray-500 hover:text-white p-1 rounded-full hover:bg-slate-900 transition z-10 cursor-pointer"
            title="Learn more"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-white">Logistics Activity Stream</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Real-time pipeline logs</p>
            </div>
            <span className="text-[10px] text-blue-400 hover:underline cursor-pointer flex items-center gap-1 font-semibold">
              Live Feed <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-4">
            {exchanges.slice(0, 3).map((ex) => (
              <div key={ex.id} className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-900 hover:border-slate-800 transition flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-blue-600/10 flex items-center justify-center text-sm">
                    {ex.status === "Completed" ? "✅" : "🚚"}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">
                      {ex.resource} Allocation
                    </h5>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {ex.supplierName} &rarr; {ex.requesterName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                    ex.status === "Completed" 
                      ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20' 
                      : 'text-yellow-400 bg-yellow-500/5 border-yellow-500/20'
                  }`}>
                    {ex.status}
                  </span>
                  <p className="text-[9px] text-gray-500 font-mono mt-1">{ex.quantity} {ex.unit}</p>
                </div>
              </div>
            ))}
          </div>

          {activeTooltip === "activity_stream" && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md p-6 flex flex-col justify-between z-20 animate-fade-in border border-blue-500/30 rounded-xl">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Logistics Activity Stream</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-3">
                  Real-time stream logging critical logistics progress events, shipping stage changes, matching approvals, and delivery milestones.
                </p>
              </div>
              <button 
                onClick={() => setActiveTooltip(null)}
                className="w-full py-1.5 bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/30 rounded text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-2 cursor-pointer transition active:scale-95"
              >
                Got it
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Active Alarms & Quick AI Matching Trigger */}
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
          <button 
            onClick={() => setActiveTooltip("ai_optimizer")}
            className="absolute top-3 right-3 text-gray-500 hover:text-white p-1 rounded-full hover:bg-slate-900 transition z-10 cursor-pointer"
            title="Learn more"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-white">AI Resource Optimizer</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Auto matches open emergency demands</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/25 text-purple-300 font-bold animate-pulse">
                Auto-Suggest Ready
              </span>
            </div>

            <div className="space-y-4">
              {requests.filter(r => r.status === "Pending").slice(0, 2).map((req) => (
                <div key={req.id} className="p-4 rounded-lg bg-slate-950/60 border border-slate-900 flex justify-between items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        req.priority === "Critical" ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <span className="text-xs font-bold text-white">{req.resourceNeeded}</span>
                      <span className={`text-[9px] font-bold px-1.5 rounded ${
                        req.priority === "Critical" ? 'text-red-400 bg-red-500/10' : 'text-yellow-400 bg-yellow-500/10'
                      }`}>{req.priority}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 max-w-[280px] truncate">{req.reason}</p>
                  </div>
                  <Link 
                    href="/dashboard/matching" 
                    className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-[10px] font-bold text-white transition flex items-center gap-1 active:scale-95 cursor-pointer shadow-lg shadow-blue-600/20"
                  >
                    AI Match
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-900 pt-4 mt-6 flex justify-between items-center">
            <span className="text-[10px] text-gray-500">Need specific supplies immediately?</span>
            <Link 
              href="/dashboard/marketplace" 
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Submit Request <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {activeTooltip === "ai_optimizer" && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md p-6 flex flex-col justify-between z-20 animate-fade-in border border-blue-500/30 rounded-xl">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Resource Optimizer</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-3">
                  Our intelligent matchmaking sub-engine that scans pending emergency hospital requests and suggests matching nearby surplus supplies with direct allocation links.
                </p>
              </div>
              <button 
                onClick={() => setActiveTooltip(null)}
                className="w-full py-1.5 bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/30 rounded text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-2 cursor-pointer transition active:scale-95"
              >
                Got it
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
