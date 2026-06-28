"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  Boxes, 
  ShoppingBag, 
  Sparkles, 
  TrendingUp, 
  Map, 
  BarChart3, 
  MessageSquare, 
  Settings as SettingsIcon,
  Bell,
  Compass,
  Menu,
  X,
  ChevronDown,
  AlertTriangle
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import AIAssistant from "@/components/AIAssistant";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { 
    activeOrg, 
    selectActiveOrg, 
    organizations, 
    notifications, 
    markAllNotificationsRead,
    requests,
    exchanges
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  // Build dynamic ticker alerts based on live database state
  const tickerAlerts = [];

  // 1. Add alert for each pending request (deficits)
  if (requests && requests.length > 0) {
    requests.forEach(req => {
      if (req.status === "Pending") {
        tickerAlerts.push(
          `🚨 URGENT SHORTAGE: ${req.creatorName} at ${req.location} needs ${req.quantity} ${req.unit} of ${req.resourceNeeded}.`
        );
      }
    });
  }

  // 2. Add alert for active exchanges (in transit)
  if (exchanges && exchanges.length > 0) {
    exchanges.forEach(ex => {
      if (ex.status === "In Transit") {
        tickerAlerts.push(
          `🚁 DRONE TRANSIT: Delivering ${ex.quantity} ${ex.unit} of ${ex.resource} from ${ex.supplierName} to ${ex.requesterName} (ETA: ${ex.routeDetails?.eta || 'in transit'}).`
        );
      } else if (ex.status === "Completed") {
        tickerAlerts.push(
          `✅ DELIVERED: ${ex.resource} successfully transferred to ${ex.requesterName}.`
        );
      }
    });
  }

  // 3. Fallback if no active alerts
  if (tickerAlerts.length === 0) {
    tickerAlerts.push("🟢 SYSTEM NORMAL: No active emergency alerts in the local network.");
    tickerAlerts.push("🟢 READY: Setup your relief node to monitor local emergency matches.");
  }

  // Rotate ticker messages
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % Math.max(1, tickerAlerts.length));
    }, 6000);
    return () => clearInterval(timer);
  }, [tickerAlerts.length]);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Organizations", path: "/dashboard/organizations", icon: Building2 },
    { name: "Inventory", path: "/dashboard/inventory", icon: Boxes },
    { name: "Marketplace", path: "/dashboard/marketplace", icon: ShoppingBag },
    { name: "AI Matching", path: "/dashboard/matching", icon: Sparkles },
    { name: "Predictions", path: "/dashboard/predictions", icon: TrendingUp },
    { name: "Crisis Map", path: "/dashboard/map", icon: Map },
    { name: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
    { name: "Messages", path: "/dashboard/messages", icon: MessageSquare },
    { name: "Settings", path: "/dashboard/settings", icon: SettingsIcon },
  ];

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-500/3 blur-[120px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-30 h-16 bg-blue-50/80 backdrop-blur-md border-b border-blue-100/50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo and Collapse Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded bg-slate-900/60 hover:bg-slate-800 text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6.5 h-6.5 shrink-0">
              <path d="M50 10L85 30V70L50 90L15 70V30L50 10Z" stroke="#2563eb" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M32 30V62L50 72L68 62V30" stroke="#2563eb" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M50 18L68 30L50 42L32 30Z" stroke="#2563eb" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M50 42V72" stroke="#2563eb" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M50 10V18" stroke="#2563eb" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 30L32 30" stroke="#2563eb" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M85 30L68 30" stroke="#2563eb" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 70L32 62" stroke="#2563eb" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M85 70L68 62" stroke="#2563eb" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M50 90V72" stroke="#2563eb" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <h1 className="text-sm font-black tracking-tight hidden sm:inline-block">
                <span className="text-blue-950">ResourceX</span>{" "}
                <span className="text-blue-600">AI</span>
              </h1>
            </div>
          </div>

          {/* AI Live Ticker */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded bg-blue-950/20 border border-blue-900/30 max-w-[420px] overflow-hidden">
            <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1 animate-pulse shrink-0">
              <AlertTriangle className="w-3 h-3" /> Live
            </span>
            <span className="text-[10px] text-blue-300 truncate tracking-wide animate-fade-in font-medium">
              {tickerAlerts[tickerIndex % tickerAlerts.length] || tickerAlerts[0]}
            </span>
          </div>
        </div>

        {/* Right Header: Org Switcher, Notifications, User Avatar */}
        <div className="flex items-center gap-4">
          
          {/* Organization Switcher Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-gray-300 hover:text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer"
            >
              <span className="text-[14px]">
                {activeOrg.type === "Hospital" ? "🏥" : activeOrg.type === "NGO" ? "🤝" : "🏢"}
              </span>
              <span className="max-w-[120px] truncate">{activeOrg.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {isOrgDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsOrgDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-slate-950 border border-slate-800 shadow-2xl p-1 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-900 mb-1">
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest">Active Organization Role</p>
                  </div>
                  {organizations.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => {
                        selectActiveOrg(org.id);
                        setIsOrgDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-xs flex items-center gap-2.5 transition cursor-pointer ${
                        activeOrg.id === org.id 
                          ? 'bg-blue-600/10 text-blue-400 font-bold border border-blue-500/20' 
                          : 'text-gray-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <span className="text-[14px]">
                        {org.type === "Hospital" ? "🏥" : org.type === "NGO" ? "🤝" : "🏢"}
                      </span>
                      <div className="truncate">
                        <p>{org.name}</p>
                        <p className="text-[9px] text-gray-500 font-normal">{org.type} &bull; {org.location}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                if (!isNotifOpen) markAllNotificationsRead();
              }}
              className="p-2 rounded bg-slate-900 border border-slate-800 text-gray-400 hover:text-white relative cursor-pointer active:scale-95"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] text-white font-bold flex items-center justify-center animate-bounce">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-900 flex justify-between items-center">
                    <span className="text-xs font-bold">AI Notification Center</span>
                    <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">Real-Time Routing</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-900/60">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`p-3 text-xs ${notif.read ? 'opacity-60' : 'bg-blue-950/10 border-l-2 border-blue-500'}`}>
                        <div className="flex justify-between mb-1">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            {notif.type === "prediction" ? "🔮" : notif.type === "match" ? "💡" : "📦"}
                            {notif.title}
                          </span>
                          <span className="text-[9px] text-gray-500 font-mono">{notif.time}</span>
                        </div>
                        <p className="text-gray-400 text-[10px] leading-relaxed">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="w-8 h-8 rounded-full border border-slate-800 bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white uppercase select-none">
            {activeOrg.name.charAt(0)}
          </div>
        </div>
      </header>

      {/* Main Body: Sidebar + Page Content Wrapper */}
      <div className="flex-grow flex relative z-10 overflow-hidden">
        
        {/* Navigation Sidebar */}
        <aside className={`bg-slate-950/30 border-r border-slate-900/80 transition-all duration-300 z-20 shrink-0 ${
          isSidebarOpen ? 'w-60' : 'w-16'
        } flex flex-col justify-between`}>
          <div className="py-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`mx-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-3 transition-all ${
                    isActive 
                      ? 'bg-blue-600 hover:bg-blue-500 text-slate-900 shadow shadow-blue-600/35 border border-blue-500/20' 
                      : 'text-gray-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>

          {/* User Organization Tag at bottom of sidebar */}
          {isSidebarOpen && (
            <div className="m-3 p-3 rounded-lg bg-slate-950/70 border border-slate-900 text-center">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-0.5">Trust Certified</span>
              <p className="text-[11px] font-bold text-white mb-1">Score: {activeOrg.trustScore}/100</p>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${activeOrg.trustScore}%` }}></div>
              </div>
            </div>
          )}
        </aside>

        {/* Dynamic Page Container */}
        <main className="flex-grow overflow-y-auto p-6 md:p-8 flex flex-col">
          {children}
        </main>
      </div>

      {/* Floating AI chatbot Assistant */}
      <AIAssistant />
    </div>
  );
}
