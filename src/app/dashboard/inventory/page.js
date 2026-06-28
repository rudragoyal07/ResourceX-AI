"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  MapPin, 
  Info,
  Sparkles,
  RefreshCw,
  X
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { checkInventoryHealth, naturalLanguageSearch } from "@/utils/aiEngine";

export default function InventoryPage() {
  const { inventory, addInventoryItem, organizations, activeOrg } = useApp();
  
  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [nlpSearchActive, setNlpSearchActive] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form States for New Item
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Oxygen");
  const [newItemQty, setNewItemQty] = useState(100);
  const [newItemUnit, setNewItemUnit] = useState("units");
  const [newItemExpiry, setNewItemExpiry] = useState("");
  const [newItemCondition, setNewItemCondition] = useState("Excellent");

  // Health analyzed inventory list
  const [analyzedInventory, setAnalyzedInventory] = useState([]);

  useEffect(() => {
    // Run inventory health analysis on mount or database update
    setAnalyzedInventory(checkInventoryHealth(inventory));
  }, [inventory]);

  // Handle NLP Search Toggle
  const toggleNlpSearch = () => {
    setNlpSearchActive(!nlpSearchActive);
    setSearchTerm("");
  };

  // Filter and Search logic
  const handleSearch = () => {
    let list = checkInventoryHealth(inventory);

    // Apply category
    if (categoryFilter !== "all") {
      list = list.filter(item => item.category === categoryFilter);
    }

    // Apply condition
    if (conditionFilter !== "all") {
      list = list.filter(item => item.condition === conditionFilter);
    }

    // Apply search query
    if (searchTerm.trim() !== "") {
      if (nlpSearchActive) {
        list = naturalLanguageSearch(searchTerm, list, organizations);
      } else {
        list = list.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }

    return list;
  };

  const filteredItems = handleSearch();

  // Handle Form Submit
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addInventoryItem({
      name: newItemName,
      category: newItemCategory,
      quantity: Number(newItemQty),
      unit: newItemUnit,
      expiryDate: newItemExpiry || new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
      condition: newItemCondition,
    });

    // Reset Form & Close Modal
    setNewItemName("");
    setNewItemCategory("Oxygen");
    setNewItemQty(100);
    setNewItemUnit("units");
    setNewItemExpiry("");
    setNewItemCondition("Excellent");
    setIsAddModalOpen(false);
  };

  const categories = [
    "Oxygen", "Food", "Water", "Medicine", "Fuel", "Generators", "Solar Panels", "Medical Equipment", "Batteries"
  ];

  return (
    <div className="space-y-8 flex-grow">
      
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Resource Inventory Manager</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Manage stockpiles & assess inventory shelf health</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded text-white flex items-center gap-2 shadow-lg shadow-blue-600/35 active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Resource
        </button>
      </div>

      {/* Dynamic Inventory Health Alarm Banner */}
      {analyzedInventory.some(item => item.ownerId === activeOrg.id && item.healthStatus === "Critical Expiry") && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <h4 className="text-xs font-bold text-red-400">Critical Expiry Warning Detected</h4>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
              Some stockpiles owned by your organization are expiring in less than 60 days. The Smart Match Engine suggests listing them on the Marketplace or matching them with open requests to prevent resource waste.
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
        
        {/* Search Input Box */}
        <div className="relative flex-grow w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={nlpSearchActive ? "Try: 'excellent oxygen near Delhi' or 'purified water > 1000'" : "Search inventory by name or facility..."}
            className={`w-full bg-slate-950/80 text-xs pl-10 pr-24 py-3 rounded-lg border text-white focus:outline-none transition ${
              nlpSearchActive ? 'border-purple-500/40 focus:border-purple-500' : 'border-slate-800 focus:border-blue-500'
            }`}
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
          
          {/* AI Search Switch Toggle */}
          <button
            onClick={toggleNlpSearch}
            className={`absolute right-2 top-2 px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition cursor-pointer active:scale-95 flex items-center gap-1.5 ${
              nlpSearchActive 
                ? 'bg-purple-600 text-white shadow shadow-purple-500/30' 
                : 'bg-slate-900 border border-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Search
          </button>
        </div>

        {/* Filters Select boxes */}
        <div className="flex gap-4 w-full md:w-auto self-stretch md:self-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs px-2 py-2 rounded text-gray-300 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs px-2 py-2 rounded text-gray-300 focus:outline-none"
          >
            <option value="all">All Conditions</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>

      </div>

      {/* Inventory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isOwner = item.ownerId === activeOrg.id;
          
          // Color based on health score
          let healthColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/25";
          if (item.healthScore <= 30) {
            healthColor = "text-red-400 bg-red-500/10 border-red-500/25 animate-pulse";
          } else if (item.healthScore <= 70) {
            healthColor = "text-yellow-400 bg-yellow-500/10 border-yellow-500/25";
          }

          return (
            <div 
              key={item.id} 
              className={`glass-card p-6 rounded-xl flex flex-col justify-between relative overflow-hidden ${
                isOwner ? 'border-blue-500/20' : 'border-slate-900'
              }`}
            >
              {/* Ownership badge */}
              {isOwner && (
                <span className="absolute top-0 right-0 text-[8px] font-bold text-blue-400 bg-blue-500/10 border-l border-b border-blue-500/20 px-2 py-0.5 rounded-bl uppercase tracking-wider">
                  My Stock
                </span>
              )}

              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                      {item.category}
                    </span>
                    <h3 className="font-extrabold text-white text-sm mt-0.5 max-w-[80%] leading-snug">
                      {item.name}
                    </h3>
                  </div>
                  <span className="text-[14px]">
                    {item.category === "Oxygen" ? "💨" : item.category === "Food" ? "🍎" : item.category === "Water" ? "💧" : "📦"}
                  </span>
                </div>

                {/* Location and Info */}
                <div className="mt-4 space-y-2 text-xs text-gray-400">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-600" />
                    <span>{item.location}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-600" />
                    <span>Expires: {item.expiryDate}</span>
                  </p>
                  <div className="flex gap-4">
                    <p>Condition: <span className="text-white font-semibold">{item.condition}</span></p>
                    <p>Status: <span className="text-emerald-400 font-semibold">{item.status}</span></p>
                  </div>
                </div>
              </div>

              {/* AI Health Assessment Score Bar */}
              <div className="border-t border-slate-900/60 pt-4 mt-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-400" /> Stock Health Assessment
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${healthColor}`}>
                    {item.healthStatus}
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full ${
                      item.healthScore <= 30 ? 'bg-red-500' : item.healthScore <= 70 ? 'bg-yellow-500' : 'bg-emerald-500'
                    }`} 
                    style={{ width: `${item.healthScore}%` }}
                  />
                </div>
                <p className="text-[9px] text-gray-500 mt-1.5 italic">
                  {item.healthDescription}
                </p>
              </div>

              {/* Quantity bottom summary */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-900/40">
                <span className="text-[10px] text-gray-500">Available Pool Quantity</span>
                <span className="text-base font-black text-white">
                  {item.quantity.toLocaleString()} <span className="text-[10px] text-gray-400 font-bold uppercase">{item.unit}</span>
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="glass-panel p-12 text-center rounded-xl max-w-md mx-auto">
          <Info className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-white">No Inventory Matches</h4>
          <p className="text-xs text-gray-500 mt-1">Try resetting category filters, or disabling AI search for basic matching.</p>
        </div>
      )}

      {/* Add Inventory Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md glass-panel border border-slate-800 rounded-xl overflow-hidden shadow-2xl p-6">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-white">Allocate Resource Stockpile</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded bg-slate-900 text-gray-400 hover:text-white"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Resource Name</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Hospital ICU Liquid Oxygen"
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Condition</label>
                  <select
                    value={newItemCondition}
                    onChange={(e) => setNewItemCondition(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded focus:outline-none"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Quantity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Unit</label>
                  <input
                    type="text"
                    required
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    placeholder="e.g. cylinders, liters"
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={newItemExpiry}
                  onChange={(e) => setNewItemExpiry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold shadow-lg shadow-blue-600/30 transition active:scale-95 cursor-pointer mt-4"
              >
                Confirm Allocation
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
