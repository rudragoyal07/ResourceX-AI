"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  Award,
  Sparkles,
  ArrowUpRight,
  TrendingDown
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Seed Analytics Mock Data
  const monthlyExchangeData = [
    { name: "Jan", volume: 45, completed: 42 },
    { name: "Feb", volume: 60, completed: 58 },
    { name: "Mar", volume: 85, completed: 80 },
    { name: "Apr", volume: 70, completed: 68 },
    { name: "May", volume: 110, completed: 104 },
    { name: "Jun", volume: 145, completed: 140 }
  ];

  const demandDistributionData = [
    { name: "Oxygen", value: 35 },
    { name: "Medicine", value: 25 },
    { name: "Food/Water", value: 20 },
    { name: "Generators", value: 12 },
    { name: "Batteries", value: 8 }
  ];

  const responseTimeData = [
    { name: "Red Cross", time: 9 },
    { name: "Gurugram Depot", time: 5 },
    { name: "Airport Cargo", time: 4 },
    { name: "Delhi Hospital", time: 12 },
    { name: "Noida Med", time: 18 },
    { name: "Haryana Reserve", time: 15 }
  ];

  const topPerformanceData = [
    { name: "Dwarka Airport Cargo", rating: 98, completed: 2150 },
    { name: "Gurugram Logistics Depot", rating: 99, completed: 1240 },
    { name: "Red Cross Disaster Hub", rating: 97, completed: 852 },
    { name: "Haryana Emergency Reserve", rating: 93, completed: 630 }
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-8 flex-grow">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          System Analytics Center
          <BarChart3 className="w-5 h-5 text-blue-400" />
        </h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Detailed allocation performance, response latencies & regional stats</p>
      </div>

      {/* Analytics stats metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="glass-card p-5 rounded-xl text-left">
          <div className="flex items-center gap-2.5 text-blue-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Average Match Latency</span>
          </div>
          <h3 className="text-2xl font-black text-white">4.2 <span className="text-xs text-gray-400 font-semibold">seconds</span></h3>
          <p className="text-[10px] text-gray-500 mt-1 italic">Real-time matching computation speed</p>
        </div>

        <div className="glass-card p-5 rounded-xl text-left">
          <div className="flex items-center gap-2.5 text-emerald-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Average Dispatch Time</span>
          </div>
          <h3 className="text-2xl font-black text-white">10.5 <span className="text-xs text-gray-400 font-semibold">minutes</span></h3>
          <p className="text-[10px] text-gray-500 mt-1 italic">Approval to transit start duration</p>
        </div>

        <div className="glass-card p-5 rounded-xl text-left">
          <div className="flex items-center gap-2.5 text-purple-400 mb-2">
            <Award className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Grid Success Rate</span>
          </div>
          <h3 className="text-2xl font-black text-white">98.4%</h3>
          <p className="text-[10px] text-gray-500 mt-1 italic">Total completed vs canceled ratios</p>
        </div>

      </div>

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Monthly exchanges Line Chart */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-xl space-y-6">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Monthly Allocation Trends</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Pipeline requests vs completed contracts</p>
          </div>

          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyExchangeData}>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} name="Total Contracts" activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Successful Transfers" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-slate-900/50 animate-pulse rounded-lg" />
            )}
          </div>
        </div>

        {/* Demand Pie Chart */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Demand By Category</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Allocation volume slice</p>
          </div>

          <div className="h-48 w-full mt-4 flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demandDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {demandDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-slate-900/50 animate-pulse rounded-lg" />
            )}
          </div>

          {/* Legend Table */}
          <div className="space-y-1 mt-4">
            {demandDistributionData.map((d, idx) => (
              <div key={d.name} className="flex justify-between items-center text-[11px] text-gray-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span>{d.name}</span>
                </div>
                <span className="font-bold text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid bottom: Latency analysis area chart & Top list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Latency by Org Bar chart */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-xl space-y-6">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Response Times by Node</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Average dispatch delay in minutes</p>
          </div>

          <div className="h-60 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={responseTimeData}>
                  <defs>
                    <linearGradient id="timeColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="time" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#timeColor)" name="Latency (mins)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-slate-900/50 animate-pulse rounded-lg" />
            )}
          </div>
        </div>

        {/* Top Organizations list */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Top Grid Contributors</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Ranked by exchange volumes & reliability</p>
          </div>

          <div className="divide-y divide-slate-900 flex-grow mt-4">
            {topPerformanceData.map((item, idx) => (
              <div key={item.name} className="py-3 flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-gray-600 text-sm">#0{idx+1}</span>
                  <div>
                    <h5 className="font-bold text-white truncate max-w-[160px]">{item.name}</h5>
                    <p className="text-[9px] text-gray-500 mt-0.5">{item.completed} transfers</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">
                    {item.rating}% Reliability
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
