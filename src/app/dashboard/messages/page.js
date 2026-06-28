"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  MessageSquare,
  Truck,
  Check,
  Paperclip
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function MessagesPage() {
  const { messages, sendChatMessage, organizations, activeOrg, exchanges } = useApp();
  
  // Select first available thread receiver org
  const [activeReceiver, setActiveReceiver] = useState(null);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Seed default receiver
    const otherOrgs = organizations.filter(o => o.id !== activeOrg.id);
    if (otherOrgs.length > 0 && !activeReceiver) {
      setActiveReceiver(otherOrgs[0]);
    }
  }, [organizations, activeOrg]);

  // Scroll to chat bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeReceiver]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeReceiver) return;
    
    sendChatMessage(activeReceiver.id, inputText);
    setInputText("");
  };

  // Get active thread messages
  const getThreadMessages = () => {
    if (!activeReceiver) return [];
    const threadKey = [activeOrg.id, activeReceiver.id].sort().join("-");
    return messages[threadKey] || [];
  };

  const activeThreadMessages = getThreadMessages();

  // Find exchanges involving these two organizations
  const activeExchanges = exchanges.filter(
    ex => 
      (ex.requesterId === activeOrg.id && ex.supplierId === activeReceiver?.id) ||
      (ex.requesterId === activeReceiver?.id && ex.supplierId === activeOrg.id)
  );

  return (
    <div className="space-y-6 flex-grow flex flex-col h-[calc(100vh-140px)] overflow-hidden">
      
      {/* Title */}
      <div className="shrink-0">
        <h2 className="text-xl font-bold tracking-tight text-white">Logistics Messaging Hub</h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Direct coordination pipeline between emergency organizations</p>
      </div>

      {/* Main chat layout */}
      <div className="flex-grow flex glass-panel rounded-xl overflow-hidden border border-slate-900">
        
        {/* Left Side: Organizations Channels List */}
        <div className="w-1/3 border-r border-slate-900 bg-slate-950/20 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-900">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Channels</span>
          </div>
          <div className="divide-y divide-slate-900/60 flex-grow">
            {organizations
              .filter((o) => o.id !== activeOrg.id)
              .map((org) => {
                const isSelected = activeReceiver && activeReceiver.id === org.id;
                
                // Get latest message in thread
                const threadKey = [activeOrg.id, org.id].sort().join("-");
                const threadMsgs = messages[threadKey] || [];
                const latestMsg = threadMsgs[threadMsgs.length - 1];

                return (
                  <button
                    key={org.id}
                    onClick={() => setActiveReceiver(org)}
                    className={`w-full text-left p-4 flex items-start gap-3 transition cursor-pointer ${
                      isSelected ? 'bg-blue-950/20 border-l-2 border-blue-500' : 'hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shrink-0">
                      {org.type === "Hospital" ? "🏥" : org.type === "NGO" ? "🤝" : "🏢"}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-xs text-white truncate">{org.name}</h4>
                        <span className="text-[9px] text-gray-500">{org.location}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 truncate mt-1">
                        {latestMsg ? latestMsg.text : "No messages yet. Start chat."}
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right Side: Conversation Area */}
        <div className="w-2/3 flex flex-col justify-between bg-slate-950/10 relative">
          
          {activeReceiver ? (
            <>
              {/* Active Header */}
              <div className="p-4 border-b border-slate-900 bg-slate-950/40 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center text-sm">
                    {activeReceiver.type === "Hospital" ? "🏥" : activeReceiver.type === "NGO" ? "🤝" : "🏢"}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">{activeReceiver.name}</h4>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" /> {activeReceiver.location} &bull; Trust: {activeReceiver.trustScore}%
                    </p>
                  </div>
                </div>
                
                {/* Verification badge */}
                <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> SECURE CHANNEL
                </span>
              </div>

              {/* Chat Messages Scrolling Area */}
              <div className="flex-grow p-6 overflow-y-auto space-y-4 dots-bg">
                {activeThreadMessages.map((msg, idx) => {
                  const isSenderMe = msg.senderId === activeOrg.id;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`flex flex-col ${isSenderMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`p-3 rounded-lg text-xs leading-relaxed max-w-[75%] ${
                        isSenderMe 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-slate-900 border border-slate-800 text-gray-300 rounded-bl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-gray-500 mt-1 px-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}

                {/* Inline Exchange Logistics Confirmation Widget */}
                {activeExchanges.length > 0 && activeExchanges[0].status !== "Completed" && (
                  <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 max-w-md mx-auto my-6 space-y-3">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Truck className="w-4 h-4 animate-bounce" />
                      <span className="text-xs font-bold">Active Logistics Transfer Contract</span>
                    </div>
                    <p className="text-[11px] text-gray-300">
                      <strong>Resource:</strong> {activeExchanges[0].quantity} {activeExchanges[0].unit} of {activeExchanges[0].resource}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      <strong>Status:</strong> {activeExchanges[0].status}
                    </p>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-900/60">
                      <span className="text-[9px] text-gray-500">Logistics status is auto-managed.</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSend} className="p-4 border-t border-slate-900 bg-slate-950/60 flex items-center gap-3 shrink-0">
                <button type="button" className="p-2.5 rounded bg-slate-900 border border-slate-800 text-gray-500 hover:text-white transition cursor-pointer">
                  <Paperclip className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Send message to ${activeReceiver.name}...`}
                  className="flex-grow bg-slate-900 border border-slate-800 text-xs text-white px-3 py-3 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white transition active:scale-95 cursor-pointer shadow-lg shadow-blue-600/25"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
              <MessageSquare className="w-8 h-8 text-gray-700 mb-2 animate-pulse" />
              <h4 className="text-sm font-bold text-white">No active thread selected</h4>
              <p className="text-xs text-gray-500 max-w-xs mt-1">Select an active logistics organization channel from the left sidebar to coordinate transfers.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
