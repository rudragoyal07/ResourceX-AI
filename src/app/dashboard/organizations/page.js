"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Clock, 
  Search,
  Filter,
  Users,
  X,
  ShieldAlert,
  Package,
  Map as MapIcon
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function OrganizationsPage() {
  const { organizations, activeOrg, registerOrganization } = useApp();
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Registration modal states
  const [showRegModal, setShowRegModal] = useState(false);
  const [regName, setRegName] = useState("");
  const [regType, setRegType] = useState("Hospital");
  const [regLocation, setRegLocation] = useState("");
  const [regLat, setRegLat] = useState("28.6139");
  const [regLng, setRegLng] = useState("77.2090");
  
  // Surplus Seeding
  const [surplusName, setSurplusName] = useState("");
  const [surplusQty, setSurplusQty] = useState("");
  const [surplusCategory, setSurplusCategory] = useState("Oxygen");
  
  // Deficit Seeding
  const [deficitName, setDeficitName] = useState("");
  const [deficitQty, setDeficitQty] = useState("");
  const [deficitCategory, setDeficitCategory] = useState("Oxygen");

  const randomizeCoords = () => {
    const latOffset = (Math.random() - 0.5) * 0.15;
    const lngOffset = (Math.random() - 0.5) * 0.15;
    setRegLat((28.6139 + latOffset).toFixed(4));
    setRegLng((77.2090 + lngOffset).toFixed(4));
  };

  const filteredOrgs = organizations.filter((org) => {
    const textMatch = 
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const typeMatch = typeFilter === "all" || org.type === typeFilter;

    return textMatch && typeMatch;
  });

  return (
    <div className="space-y-8 flex-grow">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Grid Network Directory
            <Users className="w-5 h-5 text-blue-400" />
          </h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Verified relief nodes, hospital centers, and logistics warehouses</p>
        </div>
        <button 
          onClick={() => setShowRegModal(true)}
          className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-2 shadow-lg shadow-blue-600/35 active:scale-95 cursor-pointer shrink-0"
        >
          <span>+ Register Your Facility</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search organizations by name or city..."
            className="w-full bg-slate-950/80 text-xs pl-10 pr-4 py-3 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none text-white placeholder-gray-500"
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
        </div>
        
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-xs px-3 py-2.5 rounded-lg text-gray-300 focus:outline-none w-full sm:w-auto self-stretch sm:self-auto"
        >
          <option value="all">All Types</option>
          <option value="Hospital">Hospitals</option>
          <option value="Warehouse">Warehouses</option>
          <option value="NGO">NGO Hubs</option>
          <option value="Company">Logistics Partners</option>
          <option value="Government">Government Agencies</option>
        </select>
      </div>

      {/* Grid Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrgs.map((org) => {
          const isMe = org.id === activeOrg.id;
          
          return (
            <div 
              key={org.id} 
              className={`glass-card p-6 rounded-xl flex flex-col justify-between relative overflow-hidden ${
                isMe ? 'border-blue-500/20' : 'border-slate-900'
              }`}
            >
              {isMe && (
                <span className="absolute top-0 right-0 text-[8px] font-bold text-blue-400 bg-blue-500/10 border-l border-b border-blue-500/20 px-2 py-0.5 rounded-bl uppercase tracking-wider">
                  Active Org
                </span>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{org.type}</span>
                    <h3 className="font-extrabold text-white text-sm mt-0.5 truncate max-w-[180px]">{org.name}</h3>
                  </div>
                  <span className="text-xl">
                    {org.type === "Hospital" ? "🏥" : org.type === "NGO" ? "🤝" : org.type === "Warehouse" ? "🏢" : "🌐"}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-400">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-600" />
                    <span>{org.location} &bull; Coordinates: {org.coords[0].toFixed(4)}, {org.coords[1].toFixed(4)}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-600" />
                    <span>Average Dispatch Speed: <strong className="text-white font-semibold">{org.responseTime}</strong></span>
                  </p>
                </div>
              </div>

              {/* Trust Score & Verification badge at card bottom */}
              <div className="border-t border-slate-900/60 pt-4 mt-6 flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                  <span>Score: {org.trustScore}%</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">
                  {org.completedExchanges} exchanges done
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Registration Modal Overlay */}
      <AnimatePresence>
        {showRegModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg rounded-2xl border border-slate-805 bg-[#070c18] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowRegModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-gray-400 hover:text-white transition active:scale-95 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  Register Your Organization Node
                </h3>
                <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">Join the Crisis AI Redistribution Network</p>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  
                  const surplus = surplusName ? [{
                    name: surplusName,
                    category: surplusCategory,
                    quantity: Number(surplusQty) || 100,
                    unit: surplusCategory === "Oxygen" ? "cylinders" : surplusCategory === "Water" ? "liters" : "units",
                    condition: "Excellent"
                  }] : [];

                  const needs = deficitName ? [{
                    resourceNeeded: deficitName,
                    category: deficitCategory,
                    quantity: Number(deficitQty) || 50,
                    unit: deficitCategory === "Oxygen" ? "cylinders" : deficitCategory === "Water" ? "liters" : "units",
                    reason: "Initial deficit allocation.",
                    priority: "High"
                  }] : [];

                  registerOrganization({
                    name: regName,
                    type: regType,
                    location: regLocation,
                    coords: [Number(regLat), Number(regLng)]
                  }, surplus, needs);

                  // Reset states and close
                  setRegName("");
                  setRegLocation("");
                  setSurplusName("");
                  setSurplusQty("");
                  setDeficitName("");
                  setDeficitQty("");
                  setShowRegModal(false);
                }}
                className="space-y-5 text-left text-xs"
              >
                {/* Section 1: Core Facility Info */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest border-b border-slate-900 pb-1">1. Facility Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-gray-400 font-medium">Organization / Hospital Name</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Max Super Speciality"
                        className="w-full bg-slate-950 text-xs px-3 py-2.5 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none text-white placeholder-gray-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 font-medium">Organization Type</label>
                      <select
                        value={regType}
                        onChange={(e) => setRegType(e.target.value)}
                        className="w-full bg-slate-950 text-xs px-3 py-2.5 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none text-white cursor-pointer font-medium"
                      >
                        <option value="Hospital">Hospital (Shortage Node)</option>
                        <option value="Warehouse">Warehouse (Logistics Depot)</option>
                        <option value="NGO">NGO Hub (Disaster Relief)</option>
                        <option value="Company">Logistics Partner</option>
                        <option value="Government">Government Reserve Agency</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-400 font-medium">City Location Area</label>
                    <input
                      type="text"
                      required
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                      placeholder="e.g. Vasant Kunj, Delhi"
                      className="w-full bg-slate-950 text-xs px-3 py-2.5 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none text-white placeholder-gray-600"
                    />
                  </div>

                  {/* Coordinates Selection */}
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <MapIcon className="w-3.5 h-3.5 text-blue-400" /> Geographic GPS Location
                      </span>
                      <button
                        type="button"
                        onClick={randomizeCoords}
                        className="px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 hover:bg-blue-500/20 transition cursor-pointer active:scale-95"
                      >
                        🎲 Auto-Locate Coordinates on Map
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-gray-500 text-[10px]">Latitude (NCR Grid)</label>
                        <input
                          type="number"
                          step="0.0001"
                          required
                          value={regLat}
                          onChange={(e) => setRegLat(e.target.value)}
                          className="w-full bg-slate-900 text-xs px-3 py-2 rounded border border-slate-800 focus:outline-none focus:border-blue-500 text-white font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-500 text-[10px]">Longitude (NCR Grid)</label>
                        <input
                          type="number"
                          step="0.0001"
                          required
                          value={regLng}
                          onChange={(e) => setRegLng(e.target.value)}
                          className="w-full bg-slate-900 text-xs px-3 py-2 rounded border border-slate-800 focus:outline-none focus:border-blue-500 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Seeding Surplus */}
                <div className="space-y-4 pt-1">
                  <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest border-b border-slate-800 pb-1 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-emerald-400" /> 2. Seeding Initial Surplus Inventory
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-1 space-y-1">
                      <label className="text-gray-400">Resource Name</label>
                      <input
                        type="text"
                        value={surplusName}
                        onChange={(e) => setSurplusName(e.target.value)}
                        placeholder="e.g. Purified Drinking Water"
                        className="w-full bg-slate-950 text-xs px-2.5 py-2 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none text-white placeholder-gray-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400">Category</label>
                      <select
                        value={surplusCategory}
                        onChange={(e) => setSurplusCategory(e.target.value)}
                        className="w-full bg-slate-950 text-xs px-2.5 py-2 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none text-white cursor-pointer"
                      >
                        <option value="Oxygen">Oxygen</option>
                        <option value="Food">Food</option>
                        <option value="Water">Water</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Fuel">Fuel</option>
                        <option value="Generators">Generators</option>
                        <option value="Solar Panels">Solar Panels</option>
                        <option value="Medical Equipment">Equipment</option>
                        <option value="Batteries">Batteries</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={surplusQty}
                        onChange={(e) => setSurplusQty(e.target.value)}
                        placeholder="Qty"
                        className="w-full bg-slate-950 text-xs px-2.5 py-2 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none text-white placeholder-gray-600 text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Seeding Shortage Needs */}
                <div className="space-y-4 pt-1">
                  <h4 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest border-b border-slate-800 pb-1 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-orange-400" /> 3. Seeding Shortage Deficits / Needs
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-1 space-y-1">
                      <label className="text-gray-400">Required Item</label>
                      <input
                        type="text"
                        value={deficitName}
                        onChange={(e) => setDeficitName(e.target.value)}
                        placeholder="e.g. ICU Ventilators"
                        className="w-full bg-slate-950 text-xs px-2.5 py-2 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none text-white placeholder-gray-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400">Category</label>
                      <select
                        value={deficitCategory}
                        onChange={(e) => setDeficitCategory(e.target.value)}
                        className="w-full bg-slate-950 text-xs px-2.5 py-2 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none text-white cursor-pointer"
                      >
                        <option value="Oxygen">Oxygen</option>
                        <option value="Food">Food</option>
                        <option value="Water">Water</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Fuel">Fuel</option>
                        <option value="Generators">Generators</option>
                        <option value="Solar Panels">Solar Panels</option>
                        <option value="Medical Equipment">Equipment</option>
                        <option value="Batteries">Batteries</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={deficitQty}
                        onChange={(e) => setDeficitQty(e.target.value)}
                        placeholder="Qty"
                        className="w-full bg-slate-950 text-xs px-2.5 py-2 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none text-white placeholder-gray-600 text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 mt-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg transition active:scale-95 cursor-pointer text-center text-xs tracking-wider"
                >
                  Register Node & Plot on Map
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
