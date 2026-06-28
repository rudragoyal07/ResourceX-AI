"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Play, 
  Globe, 
  Activity, 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  Package, 
  Heart, 
  Award,
  X,
  Compass,
  Mail,
  Lock,
  Check
} from "lucide-react";

const LocationPickerMap = dynamic(() => import("@/components/LocationPickerMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-40 bg-slate-950 flex flex-col justify-center items-center gap-2 rounded border border-slate-900">
      <Compass className="w-5 h-5 text-blue-500 animate-spin" />
      <span className="text-[10px] text-gray-500 font-mono">Loading Picker Map Canvas...</span>
    </div>
  ),
});

// Custom Hook for Count Up Animation
const CountUp = ({ to, duration = 2, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = isNaN(parseInt(to)) ? 0 : parseInt(to);
    if (start === end) {
      setCount(end);
      return;
    }

    let totalMiliseconds = duration * 1000;
    let incrementTime = Math.abs(Math.floor(totalMiliseconds / end));
    
    // Safety check for super high numbers
    if (incrementTime < 1) incrementTime = 1;
    let step = Math.ceil(end / (totalMiliseconds / 16)); // ~60fps

    let timer = setInterval(() => {
      start += step;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [to, duration]);

  // Format with commas
  const formatted = count.toLocaleString();

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const { selectActiveOrg, organizations, registerOrganization, exchanges, requests } = useApp();

  // Dynamic statistics calculations
  const activeTransits = exchanges?.filter(ex => ex.status === "In Transit") || [];
  const avgTransitTime = activeTransits.length > 0
    ? Math.round(activeTransits.reduce((acc, ex) => acc + parseInt(ex.routeDetails?.eta || 0), 0) / activeTransits.length)
    : 0;

  const matchAccuracy = requests && requests.length > 0
    ? Math.round((requests.filter(req => req.status !== "Pending").length / requests.length) * 100)
    : 0;

  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Login form inputs
  const [emailText, setEmailText] = useState("ops@resourcex.org");
  const [passwordText, setPasswordText] = useState("••••••••");
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Registration form inputs
  const [isRegisterTab, setIsRegisterTab] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1); // 1: Email & Role, 2: Profile & Map, 3: Stocks Seeding
  const [loginRole, setLoginRole] = useState("organization"); // "individual" or "organization"
  const [regCoords, setRegCoords] = useState([28.6139, 77.2090]);
  const [regName, setRegName] = useState("");
  const [regType, setRegType] = useState("Hospital");
  const [regLocation, setRegLocation] = useState("Saket, Delhi");
  const [regSurplusName, setRegSurplusName] = useState("");
  const [regSurplusQty, setRegSurplusQty] = useState(250);
  const [regSurplusCategory, setRegSurplusCategory] = useState("Oxygen");
  const [regNeedName, setRegNeedName] = useState("");
  const [regNeedQty, setRegNeedQty] = useState(100);
  const [regNeedCategory, setRegNeedCategory] = useState("Oxygen");

  useEffect(() => {
    if (organizations && organizations.length > 0) {
      setSelectedOrgId(organizations[0].id);
    }
  }, [organizations]);

  // Auto rotate demo slides inside modal
  useEffect(() => {
    if (!showDemoModal) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(timer);
  }, [showDemoModal]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-900 flex flex-col justify-between overflow-hidden">
      
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-blue-500/3 blur-[120px] animate-pulse-glow" style={{ animationDelay: "4s" }} />
        
        {/* Animated Grid lines */}
        <div className="absolute inset-0 grid-bg opacity-25 animate-grid-move" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-900/30 to-slate-950" />
      </div>

      {/* Top Navbar */}
      <div className="relative z-10 w-full px-2 md:px-4 mt-6">
        <header className="w-full px-4 py-4 flex items-center justify-between rounded-2xl bg-blue-50/85 border border-blue-100/50 shadow-xl shadow-blue-500/5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 shrink-0">
              <path d="M50 8L88 30V74L50 96L12 74V30L50 8Z" stroke="#2563eb" strokeWidth="8" strokeLinejoin="round"/>
              <path d="M50 32L72 45V69L50 81L28 69V45L50 32Z" stroke="#2563eb" strokeWidth="6" strokeLinejoin="round"/>
              <path d="M50 8V32" stroke="#2563eb" strokeWidth="8"/>
              <path d="M12 30L28 45" stroke="#2563eb" strokeWidth="8"/>
              <path d="M88 30L72 45" stroke="#2563eb" strokeWidth="8"/>
              <path d="M28 69L12 74" stroke="#2563eb" strokeWidth="8"/>
              <path d="M72 69L88 74" stroke="#2563eb" strokeWidth="8"/>
              <path d="M50 81V96" stroke="#2563eb" strokeWidth="8"/>
            </svg>
            <div>
              <h1 className="text-lg font-black tracking-tight">
                <span className="text-blue-950">ResourceX</span>{" "}
                <span className="text-blue-600">AI</span>
              </h1>
              <p className="text-[9px] text-gray-500 tracking-widest uppercase font-semibold">Emergency Exchange</p>
            </div>
          </div>



          <div className="flex items-center gap-4">
            <button onClick={() => { setOnboardingStep(1); setShowLoginModal(true); }} className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/45 text-blue-400 hover:text-blue-300 transition flex items-center gap-2 active:scale-95 shadow-md shadow-blue-500/5 cursor-pointer">
              Login / Signup
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-6 py-12 md:py-20 lg:grid lg:grid-cols-12 lg:gap-12 items-center">
        
        {/* Hero Left Content */}
        <div className="col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8">
          


          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Intelligent Resource <br />
            <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-orange-400 bg-clip-text text-transparent">
              Exchange
            </span> for an <br />
            Uncertain World
          </h2>

          <p className="text-base md:text-lg text-gray-400 max-w-xl">
            AI predicts shortages, matches organizations with surplus resources, and optimizes emergency resource allocation before crises become disasters.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button 
              onClick={() => { setOnboardingStep(1); setShowLoginModal(true); }} 
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg font-bold shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 transition-all transform active:scale-95 text-base border border-blue-400/20 cursor-pointer"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Scrolling Statistics Section */}
          <div className="w-full pt-10 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-extrabold text-white">
                <CountUp to={organizations.length} />
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Active Relief Nodes</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-extrabold text-blue-400">
                <CountUp to={avgTransitTime} suffix=" min" />
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Avg. Drone Transit</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-extrabold text-emerald-400">
                <CountUp to={matchAccuracy} suffix="%" />
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">AI Match Accuracy</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-extrabold text-orange-400">
                <CountUp to={0} suffix=".0%" />
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Expiry Resource Waste</span>
            </div>
          </div>
        </div>

        {/* Hero Right Visual: SVG Connective World Map & Cargo lines */}
        <div className="col-span-6 w-full h-[320px] md:h-[480px] relative mt-12 lg:mt-0 flex items-center justify-center select-none">
          <div className="absolute w-[95%] h-[95%] rounded-full bg-blue-500/5 blur-[80px]" />
          
          <svg className="w-full h-full max-w-[500px]" viewBox="0 0 600 400" fill="none">
            {/* World Grid Silhouette outline */}
            <path d="M50 150 C 100 120, 200 80, 300 100 C 400 120, 500 80, 550 120 C 580 150, 500 250, 450 280 C 400 310, 200 350, 150 320 C 100 290, 20 200, 50 150 Z" 
              fill="rgba(59, 130, 246, 0.02)" stroke="rgba(59, 130, 246, 0.08)" strokeWidth="1" strokeDasharray="5,5" />
            
            {/* Grid latitude lines */}
            <ellipse cx="300" cy="200" rx="250" ry="120" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            <ellipse cx="300" cy="200" rx="180" ry="80" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            <line x1="300" y1="50" x2="300" y2="350" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            <line x1="100" y1="200" x2="500" y2="200" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />

            {/* Simulated Resource Flowing Curves */}
            {/* Flight Path 1: Gurugram to Delhi */}
            <path d="M120 180 Q 220 100 320 140" fill="none" stroke="rgba(59, 130, 246, 0.35)" strokeWidth="2" strokeDasharray="6,4">
              <animate attributeName="stroke-dashoffset" values="50;0" dur="4s" repeatCount="indefinite" />
            </path>
            {/* Flight Path 2: Delhi to Noida */}
            <path d="M320 140 Q 420 180 480 250" fill="none" stroke="rgba(16, 185, 129, 0.35)" strokeWidth="2" strokeDasharray="6,4">
              <animate attributeName="stroke-dashoffset" values="0;50" dur="3s" repeatCount="indefinite" />
            </path>
            {/* Flight Path 3: Ghaziabad to Gurugram */}
            <path d="M480 120 Q 300 280 120 180" fill="none" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="1.5" strokeDasharray="4,4">
              <animate attributeName="stroke-dashoffset" values="30;0" dur="6s" repeatCount="indefinite" />
            </path>

            {/* Glowing Network Nodes (Warehouses & Hospitals) */}
            {/* Node 1: West Hub */}
            <g>
              <circle cx="120" cy="180" r="12" fill="rgba(59, 130, 246, 0.15)" />
              <circle cx="120" cy="180" r="6" fill="#3b82f6" className="animate-pulse" />
              <text x="120" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">Gurugram Depot</text>
            </g>

            {/* Node 2: Center Hub */}
            <g>
              <circle cx="320" cy="140" r="16" fill="rgba(239, 68, 68, 0.15)" />
              <circle cx="320" cy="140" r="8" fill="#ef4444" className="animate-ping" style={{ animationDuration: '2s' }} />
              <circle cx="320" cy="140" r="6" fill="#ef4444" />
              <text x="320" y="120" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">Delhi City Center</text>
            </g>

            {/* Node 3: East Hub */}
            <g>
              <circle cx="480" cy="250" r="12" fill="rgba(16, 185, 129, 0.15)" />
              <circle cx="480" cy="250" r="6" fill="#10b981" />
              <text x="480" y="275" fill="#9ca3af" fontSize="10" textAnchor="middle">Noida Clinic</text>
            </g>

            {/* Node 4: North Hub */}
            <g>
              <circle cx="480" cy="120" r="10" fill="rgba(245, 158, 11, 0.15)" />
              <circle cx="480" cy="120" r="5" fill="#f59e0b" />
              <text x="480" y="105" fill="#9ca3af" fontSize="10" textAnchor="middle">Ghaziabad NGO</text>
            </g>

            {/* Animated Transit Vehicle Cargo Overlay */}
            <circle cx="0" cy="0" r="4" fill="#10b981">
              <animateMotion dur="4s" repeatCount="indefinite" path="M120 180 Q 220 100 320 140" />
            </circle>
            <circle cx="0" cy="0" r="4" fill="#3b82f6">
              <animateMotion dur="3s" repeatCount="indefinite" path="M320 140 Q 420 180 480 250" />
            </circle>
          </svg>
          
          {/* Glass Card Floating Widgets removed */}
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-900 bg-slate-950/40 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; 2026 ResourceX AI. Built for the E-Summit Hackathon. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <span className="hover:text-gray-400 cursor-pointer">Protocol Rules</span>
            <span className="hover:text-gray-400 cursor-pointer">Global Routing Network</span>
            <span className="hover:text-gray-400 cursor-pointer text-blue-400 font-medium">Dark Mode Enabled</span>
          </div>
        </div>
      </footer>

      {/* Watch Demo Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl glass-panel border border-slate-700/60 rounded-xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-blue-400 fill-blue-400/20" />
                  <span className="font-bold text-sm tracking-wide">ResourceX AI Platform Walkthrough</span>
                </div>
                <button 
                  onClick={() => setShowDemoModal(false)}
                  className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Video/Walkthrough Body */}
              <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center bg-[#070b16]">
                {/* Visual Simulation Screen */}
                <div className="flex-grow w-full md:w-3/5 aspect-video bg-slate-950 rounded-lg border border-blue-500/20 relative flex flex-col justify-between overflow-hidden p-4 shadow-inner">
                  {/* Dynamic Slide visuals based on activeStep */}
                  {activeStep === 0 && (
                    <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center space-y-4">
                      <div className="w-12 h-12 rounded bg-red-500/10 flex items-center justify-center text-2xl text-red-500 animate-pulse">🚨</div>
                      <h4 className="text-white font-bold text-sm">Step 1: Emergency Alarms Triggered</h4>
                      <p className="text-xs text-gray-400 max-w-xs">AI predicts oxygen shortage in Noida Hospital in 48 hours based on hospital ICU admission spikes.</p>
                      <div className="w-full max-w-xs bg-slate-900 rounded h-1.5 overflow-hidden">
                        <div className="bg-red-500 h-full animate-pulse" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center space-y-4">
                      <div className="w-12 h-12 rounded bg-blue-500/10 flex items-center justify-center text-2xl text-blue-400">🤖</div>
                      <h4 className="text-white font-bold text-sm">Step 2: AI Explores Smart Matches</h4>
                      <p className="text-xs text-gray-400 max-w-xs">AI calculates distance, trust score, route complexity and recommends top 5 local suppliers.</p>
                      <div className="text-[10px] text-emerald-400 font-mono py-1 px-2 rounded bg-emerald-950/40 border border-emerald-900">
                        Top Match: Gurugram Depot - 98% Confidence - 18min Delivery
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center space-y-4">
                      <div className="w-12 h-12 rounded bg-yellow-500/10 flex items-center justify-center text-2xl text-yellow-400">📦</div>
                      <h4 className="text-white font-bold text-sm">Step 3: Auto-Routing & Drone Dispatch</h4>
                      <p className="text-xs text-gray-400 max-w-xs">Match is approved. Real-time cargo routing is computed and shipment is dispatched via active lane.</p>
                      <div className="w-full flex justify-between max-w-xs text-[10px] text-gray-500 border-t border-slate-800 pt-2">
                        <span>Gurugram [Depot]</span>
                        <span className="text-blue-400">In Transit...</span>
                        <span>Noida [Hospital]</span>
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center space-y-4">
                      <div className="w-12 h-12 rounded bg-emerald-500/10 flex items-center justify-center text-2xl text-emerald-400">🏆</div>
                      <h4 className="text-white font-bold text-sm">Step 4: Resource Delivered & Score Updated</h4>
                      <p className="text-xs text-gray-400 max-w-xs">Shipment is safely delivered, emergency alert cleared, and supplier trust score increases +1.2 points.</p>
                      <div className="flex gap-1 text-emerald-400 text-xs">★★★★★ 5.0 Rating</div>
                    </div>
                  )}

                  {/* Playback Controls mockup */}
                  <div className="w-full flex items-center justify-between border-t border-slate-900/60 pt-2 mt-auto">
                    <span className="text-[9px] text-gray-500 font-mono">DEMO PLAYER (SIMULATED)</span>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((step) => (
                        <div 
                          key={step} 
                          className={`w-2.5 h-2.5 rounded-full cursor-pointer transition ${activeStep === step ? 'bg-blue-500' : 'bg-slate-800'}`}
                          onClick={() => setActiveStep(step)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Step Instructions Left Side */}
                <div className="w-full md:w-2/5 flex flex-col space-y-4 text-left">
                  <h3 className="text-lg font-bold text-white">How ResourceX AI Works</h3>
                  <div className="space-y-3">
                    {[
                      { title: "Predictive Shortage Analysis", desc: "Checks stock expiry dates and regional demand trends to predict shortages." },
                      { title: "Smart Matching Engine", desc: "Sorts matching reserves by distance, reliability, cost, and route risk." },
                      { title: "Visual Logistics Tracking", desc: "Tracks deliveries across 6 visual stages from request to feedback." },
                      { title: "Trust Score Performance", desc: "Builds a decentralized trust profile for hospitals, NGO warehouses, and companies." }
                    ].map((step, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setActiveStep(idx)}
                        className={`p-3 rounded-lg border transition cursor-pointer ${
                          activeStep === idx 
                            ? 'bg-blue-950/30 border-blue-500/35 text-white' 
                            : 'bg-slate-900/30 border-transparent hover:bg-slate-900/60 text-gray-400'
                        }`}
                      >
                        <h5 className="font-bold text-xs flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                            activeStep === idx ? 'bg-blue-500 text-white' : 'bg-slate-800 text-gray-500'
                          }`}>{idx + 1}</span>
                          {step.title}
                        </h5>
                        <p className="text-[10px] mt-1 text-gray-500 leading-relaxed">{step.desc}</p>
                      </div>
                    ))}
                  </div>

                  <Link 
                    href="/dashboard" 
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold text-center flex items-center justify-center gap-2 transition"
                  >
                    Enter Dashboard Now
                    <ArrowRight className="w-4.5 h-4.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {showLoginModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className={`relative w-full transition-all duration-300 rounded-3xl border border-white/10 shadow-2xl p-6 bg-white/5 backdrop-blur-2xl flex flex-col justify-between max-h-[92vh] overflow-y-auto ${
                onboardingStep === 2 ? 'max-w-lg' : 'max-w-sm'
              }`}
              style={{ boxShadow: '0 25px 50px -12px rgba(9, 15, 30, 0.9)' }}
            >
              {/* Close Circular Button */}
              <button 
                onClick={() => {
                  setShowLoginModal(false);
                  setOnboardingStep(1);
                  setIsRegisterTab(false);
                }}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#0d1627]/80 hover:bg-[#1a2948] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition cursor-pointer active:scale-90 z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Wizard Title */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-center text-white tracking-wider font-sans">
                  {onboardingStep === 1 && "Authentication Gateway"}
                  {onboardingStep === 2 && "Profile & Map Location"}
                  {onboardingStep === 3 && "Inventory Seeding"}
                </h3>
                {/* Progress bar */}
                <div className="w-full bg-slate-950/60 rounded-full h-1 mt-2.5 overflow-hidden flex">
                  <div className={`h-full bg-blue-500 transition-all duration-300 ${
                    onboardingStep === 1 ? 'w-1/3' : onboardingStep === 2 ? 'w-2/3' : 'w-full'
                  }`}></div>
                </div>
              </div>

              {/* STEP 1: AUTHENTICATION AND ROLE CHOICE */}
              {onboardingStep === 1 && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (loginRole === "individual") {
                      // Login as default Delhi City Hospital for individual mode
                      selectActiveOrg("city_hospital");
                      setShowLoginModal(false);
                      router.push("/dashboard");
                    } else {
                      // Proceed to organization onboarding setup
                      setOnboardingStep(2);
                      setIsRegisterTab(true);
                    }
                  }}
                  className="space-y-4 text-left pt-2"
                >
                  <p className="text-[10px] text-gray-400 leading-relaxed text-center mb-4">
                    Access the decentralized crisis logistics network. Enter your email and choose your access portal.
                  </p>

                  {/* Email */}
                  <div className="relative border-b border-slate-700 py-2">
                    <input
                      type="email"
                      required
                      value={emailText}
                      onChange={(e) => setEmailText(e.target.value)}
                      placeholder="Email Address"
                      className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none pr-8 py-0.5"
                    />
                    <Mail className="absolute right-2 top-2.5 w-4 h-4 text-gray-500" />
                  </div>

                  {/* Password */}
                  <div className="relative border-b border-slate-700 py-2">
                    <input
                      type="password"
                      required
                      value={passwordText}
                      onChange={(e) => setPasswordText(e.target.value)}
                      placeholder="Security Password"
                      className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none pr-8 py-0.5"
                    />
                    <Lock className="absolute right-2 top-2.5 w-4 h-4 text-gray-500" />
                  </div>

                  {/* Role Type Selector */}
                  <div className="pt-2 space-y-2 select-none">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold block">Select Access Portal</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        onClick={() => setLoginRole("individual")}
                        className={`p-3 rounded-xl border text-center cursor-pointer transition flex flex-col items-center gap-1.5 ${
                          loginRole === "individual" 
                            ? 'bg-blue-600/10 border-blue-500 text-white font-bold' 
                            : 'bg-slate-950/20 border-slate-800 hover:bg-slate-900/40 text-gray-400'
                        }`}
                      >
                        <span className="text-base">👤</span>
                        <span className="text-[10px] tracking-wide">Individual / Viewer</span>
                      </div>
                      
                      <div
                        onClick={() => setLoginRole("organization")}
                        className={`p-3 rounded-xl border text-center cursor-pointer transition flex flex-col items-center gap-1.5 ${
                          loginRole === "organization" 
                            ? 'bg-blue-600/10 border-blue-500 text-white font-bold' 
                            : 'bg-slate-950/20 border-slate-800 hover:bg-slate-900/40 text-gray-400'
                        }`}
                      >
                        <span className="text-base">🏥</span>
                        <span className="text-[10px] tracking-wide">Organization / Owner</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg transition active:scale-95 cursor-pointer text-center text-xs tracking-wider uppercase font-sans"
                  >
                    {loginRole === "individual" ? "Access Dashboard" : "Configure Organization"}
                  </button>

                  {/* Quick-switch dropdown for seeded demo roles */}
                  <div className="pt-3 border-t border-slate-900 flex flex-col gap-1 text-[10px]">
                    <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider text-center">Or Quick Login (Demo Profiles)</span>
                    <select
                      value={selectedOrgId}
                      onChange={(e) => {
                        setSelectedOrgId(e.target.value);
                        selectActiveOrg(e.target.value);
                        setShowLoginModal(false);
                        router.push("/dashboard");
                      }}
                      className="bg-slate-950 text-[10px] border border-slate-800 rounded px-2 py-1.5 text-gray-300 focus:outline-none cursor-pointer"
                    >
                      <option value="">Select pre-seeded facility...</option>
                      {organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.type === "Hospital" ? "🏥" : "🏢"} {org.name} ({org.location})
                        </option>
                      ))}
                    </select>
                  </div>
                </form>
              )}

              {/* STEP 2: REGISTER PROFILE AND MAP GEO-PICKER */}
              {onboardingStep === 2 && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!regName.trim() || !regLocation.trim()) return;
                    setOnboardingStep(3);
                  }}
                  className="space-y-4 text-left pt-2"
                >
                  <p className="text-[10px] text-gray-400 leading-relaxed mb-2">
                    Define your facility profile and map coordinates. Use the search bar or click the map canvas to set your location pin.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="relative border-b border-slate-700 py-1 flex flex-col">
                      <label className="text-[8px] text-gray-500 uppercase tracking-widest font-semibold">Organization Name</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Noida Trauma Center"
                        className="bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none py-1"
                      />
                    </div>
                    {/* Type */}
                    <div className="relative border-b border-slate-700 py-1 flex flex-col">
                      <label className="text-[8px] text-gray-500 uppercase tracking-widest font-semibold">Node Type</label>
                      <select
                        value={regType}
                        onChange={(e) => setRegType(e.target.value)}
                        className="bg-transparent text-xs text-white focus:outline-none py-1.5 cursor-pointer font-medium"
                      >
                        <option value="Hospital" className="bg-[#0b1325] text-white">Hospital (Shortage Node)</option>
                        <option value="Warehouse" className="bg-[#0b1325] text-white">Warehouse (Supply Depot)</option>
                        <option value="NGO" className="bg-[#0b1325] text-white">NGO relief node</option>
                        <option value="Company" className="bg-[#0b1325] text-white">Logistics center</option>
                        <option value="Government" className="bg-[#0b1325] text-white">Government reserve</option>
                      </select>
                    </div>
                  </div>

                  {/* Location Area Text */}
                  <div className="relative border-b border-slate-700 py-1 flex flex-col">
                    <label className="text-[8px] text-gray-500 uppercase tracking-widest font-semibold">Area / City Name</label>
                    <input
                      type="text"
                      required
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                      placeholder="e.g. Vasant Kunj, Delhi"
                      className="bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none py-1"
                    />
                  </div>

                  {/* Interactive Leaflet Picker Map */}
                  <div className="space-y-1">
                    <label className="text-[8px] text-gray-500 uppercase tracking-widest font-semibold block">Locate Your Node Pin</label>
                    <LocationPickerMap coords={regCoords} onChangeCoords={setRegCoords} />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setOnboardingStep(1);
                        setIsRegisterTab(false);
                      }}
                      className="w-1/3 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold transition text-xs tracking-wider"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition text-xs tracking-wider flex items-center justify-center gap-1.5"
                    >
                      Next: Seed Stock
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: SEED SURPLUS & SHORTAGE INVENTORIES */}
              {onboardingStep === 3 && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    
                    const surplus = regSurplusName ? [{
                      name: regSurplusName,
                      category: regSurplusCategory,
                      quantity: Number(regSurplusQty),
                      unit: regSurplusCategory === "Oxygen" ? "cylinders" : regSurplusCategory === "Water" ? "liters" : "units",
                      condition: "Excellent"
                    }] : [];

                    const needs = regNeedName ? [{
                      resourceNeeded: regNeedName,
                      category: regNeedCategory,
                      quantity: Number(regNeedQty),
                      unit: regNeedCategory === "Oxygen" ? "cylinders" : regNeedCategory === "Water" ? "liters" : "units",
                      reason: "Initial emergency coordination requirement.",
                      priority: "High"
                    }] : [];

                    // Save to database, center map coordinate, login org
                    registerOrganization({ 
                      name: regName, 
                      type: regType, 
                      location: regLocation,
                      coords: regCoords 
                    }, surplus, needs);
                    
                    // Reset modal step and close
                    setShowLoginModal(false);
                    setOnboardingStep(1);
                    setIsRegisterTab(false);
                    
                    // Redirect to Map / Dashboard view
                    router.push("/dashboard/map");
                  }}
                  className="space-y-4 text-left pt-2"
                >
                  <p className="text-[10px] text-gray-400 leading-relaxed mb-2">
                    Enter the items you currently have in excess (surplus) and the items you are low on and urgently need (shortage) to seed your node's database.
                  </p>

                  {/* Surplus Stockpile (Excess Amount) */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block flex items-center gap-1">
                      🟢 Things in Excess Amount (Surplus Stock)
                    </span>
                    
                    <div className="relative border-b border-slate-800 py-0.5">
                      <input
                        type="text"
                        value={regSurplusName}
                        onChange={(e) => setRegSurplusName(e.target.value)}
                        placeholder="Resource name (e.g. Purified Drinking Water)"
                        className="w-full bg-transparent text-[11px] text-white placeholder-gray-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <select
                        value={regSurplusCategory}
                        onChange={(e) => setRegSurplusCategory(e.target.value)}
                        className="bg-transparent text-[11px] text-white border border-slate-800 rounded px-1.5 py-1 focus:outline-none cursor-pointer"
                      >
                        <option value="Oxygen" className="bg-[#0b1325]">Oxygen</option>
                        <option value="Food" className="bg-[#0b1325]">Food</option>
                        <option value="Water" className="bg-[#0b1325]">Water</option>
                        <option value="Medicine" className="bg-[#0b1325]">Medicine</option>
                        <option value="Fuel" className="bg-[#0b1325]">Fuel</option>
                        <option value="Generators" className="bg-[#0b1325]">Generators</option>
                        <option value="Solar Panels" className="bg-[#0b1325]">Solar Panels</option>
                        <option value="Medical Equipment" className="bg-[#0b1325]">Equipment</option>
                        <option value="Batteries" className="bg-[#0b1325]">Batteries</option>
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={regSurplusQty}
                        onChange={(e) => setRegSurplusQty(Number(e.target.value))}
                        className="bg-transparent text-[11px] text-white border border-slate-800 rounded px-1.5 py-1 focus:outline-none text-center"
                        placeholder="Qty"
                      />
                    </div>
                  </div>

                  {/* Deficit Shortage (Needs) */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest block flex items-center gap-1">
                      🔴 Things Low / Needed (Shortage Deficit)
                    </span>
                    
                    <div className="relative border-b border-slate-800 py-0.5">
                      <input
                        type="text"
                        value={regNeedName}
                        onChange={(e) => setRegNeedName(e.target.value)}
                        placeholder="Required item (e.g. ICU Ventilator)"
                        className="w-full bg-transparent text-[11px] text-white placeholder-gray-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <select
                        value={regNeedCategory}
                        onChange={(e) => setRegNeedCategory(e.target.value)}
                        className="bg-transparent text-[11px] text-white border border-slate-800 rounded px-1.5 py-1 focus:outline-none cursor-pointer"
                      >
                        <option value="Oxygen" className="bg-[#0b1325]">Oxygen</option>
                        <option value="Food" className="bg-[#0b1325]">Food</option>
                        <option value="Water" className="bg-[#0b1325]">Water</option>
                        <option value="Medicine" className="bg-[#0b1325]">Medicine</option>
                        <option value="Fuel" className="bg-[#0b1325]">Fuel</option>
                        <option value="Generators" className="bg-[#0b1325]">Generators</option>
                        <option value="Solar Panels" className="bg-[#0b1325]">Solar Panels</option>
                        <option value="Medical Equipment" className="bg-[#0b1325]">Equipment</option>
                        <option value="Batteries" className="bg-[#0b1325]">Batteries</option>
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={regNeedQty}
                        onChange={(e) => setRegNeedQty(Number(e.target.value))}
                        className="bg-transparent text-[11px] text-white border border-slate-800 rounded px-1.5 py-1 focus:outline-none text-center"
                        placeholder="Qty"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(2)}
                      className="w-1/3 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold transition text-xs tracking-wider"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition text-xs tracking-wider"
                    >
                      Complete & Enter
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
