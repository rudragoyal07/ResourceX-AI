"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, AlertCircle, Compass, HelpCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { naturalLanguageSearch, forecastShortages } from "@/utils/aiEngine";

export default function AIAssistant() {
  const { inventory, organizations } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "m1",
      sender: "ai",
      text: "Hello! I am your ResourceX AI logistics coordinator. Ask me to locate resources, predict regional shortages, or find routing safety guidelines.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const presetPrompts = [
    { label: "Who has oxygen near Delhi?", text: "Who has oxygen near Delhi?" },
    { label: "Predict food shortages", text: "Predict food shortages" },
    { label: "Find generators near Gurugram", text: "Find generators within 100 km of Gurugram." },
    { label: "Show hospital surpluses", text: "Show hospitals with surplus medicines or equipment." }
  ];

  const handleSend = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: `m_user_${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      let replyText = "";
      let structuredData = null;

      const query = text.toLowerCase();

      if (query.includes("oxygen") && (query.includes("delhi") || query.includes("near"))) {
        const results = naturalLanguageSearch("oxygen Delhi", inventory, organizations);
        replyText = `I found **${results.length} oxygen inventory listings** located near Delhi NCR:`;
        structuredData = results.map(r => ({
          title: r.name,
          details: `${r.quantity} ${r.unit} available at ${r.location} (${r.condition} condition)`
        }));
      } else if (query.includes("food") || query.includes("shortage")) {
        const forecasts = forecastShortages();
        const foodShortage = forecasts.find(f => f.category === "Food") || forecasts[0];
        replyText = `### AI Shortage Forecast Alert\n**Category:** ${foodShortage.title}\n**Risk Probability:** ${foodShortage.probability}%\n**Affected Region:** ${foodShortage.affectedRegion}\n**Time Window:** ${foodShortage.predictedTime}\n\n**Recommended Action:** ${foodShortage.recommendedActions[0]}`;
      } else if (query.includes("generator") || query.includes("gurugram")) {
        const results = naturalLanguageSearch("generator Gurugram", inventory, organizations);
        replyText = `Here are the diesel/solar generators currently positioned near Gurugram Depot:`;
        structuredData = results.map(r => ({
          title: r.name,
          details: `${r.quantity} ${r.unit} available. Status: ${r.status}`
        }));
      } else if (query.includes("hospital") || query.includes("surplus") || query.includes("medicine")) {
        const results = inventory.filter(item => {
          const owner = organizations.find(o => o.id === item.ownerId);
          return owner?.type === "Hospital" && item.status === "Available";
        });
        replyText = `Found **${results.length} surplus allocations** located directly inside active Hospitals:`;
        structuredData = results.map(r => ({
          title: r.name,
          details: `${r.quantity} ${r.unit} at ${r.location}`
        }));
      } else {
        replyText = `I processed your request using Natural Language Search. I suggest checking the **Inventory** and **Marketplace** tabs where you can filter allocations by Category (Food, Water, Medicine, Fuel, Oxygen, Generators) and Distance. Try typing "Who has oxygen near Delhi?" for a specific demonstration.`;
      }

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `m_ai_${Date.now()}`,
          sender: "ai",
          text: replyText,
          structuredData,
          timestamp: new Date()
        }
      ]);
    }, 12000 / 10); // Quick response, ~1.2s
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {!isOpen ? (
          // Hovering Bot Bubble Button
          <motion.button
            layoutId="ai-chat-bubble"
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 flex items-center justify-center text-white shadow-2xl border border-blue-400/20 active:scale-95 cursor-pointer relative group"
            whileHover={{ scale: 1.05 }}
          >
            <Bot className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#060913]" />
            <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all duration-150 origin-right whitespace-nowrap bg-slate-950/90 text-[10px] text-blue-400 font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg border border-blue-500/20 backdrop-blur">
              AI Logistics Officer
            </span>
          </motion.button>
        ) : (
          // Chat Interface Window
          <motion.div
            layoutId="ai-chat-bubble"
            className="w-[360px] md:w-[400px] h-[500px] glass-panel border border-blue-500/35 rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Window Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-950/60 to-slate-900 border-b border-blue-500/25 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    ResourceX AI Assistant
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </h4>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest">Global Logistics Routing</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-gray-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Logs */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 dots-bg">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                      m.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-slate-900/90 border border-slate-800 text-gray-300 rounded-bl-none"
                    }`}
                  >
                    {/* Render basic markdown/lines in simple text */}
                    {m.text.split("\n").map((line, lIdx) => {
                      if (line.startsWith("###")) {
                        return <h5 key={lIdx} className="font-bold text-blue-400 mt-1 mb-1">{line.replace("###", "")}</h5>;
                      }
                      if (line.startsWith("**")) {
                        return (
                          <p key={lIdx} className="mt-0.5">
                            <strong>{line.split("**")[1]}:</strong>{line.split("**")[2]}
                          </p>
                        );
                      }
                      return <p key={lIdx} className="mt-0.5">{line}</p>;
                    })}

                    {/* Render structured result node cards if present */}
                    {m.structuredData && (
                      <div className="mt-3 space-y-1.5">
                        {m.structuredData.map((node, nIdx) => (
                          <div key={nIdx} className="p-2 rounded bg-slate-950 border border-blue-500/10 flex items-start gap-2">
                            <span className="text-xs">📍</span>
                            <div>
                              <p className="font-bold text-[11px] text-white">{node.title}</p>
                              <p className="text-[10px] text-gray-400">{node.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-gray-500 mt-1 px-1">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 bg-slate-900/95 border border-slate-800/80 p-3 rounded-lg w-20">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Presets and Chat Inputs */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/60 backdrop-blur">
              {/* Presets */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {presetPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(p.text)}
                    className="px-2 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-[10px] text-blue-400 hover:text-blue-300 border border-slate-800 transition active:scale-95 cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Text Area */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask ResourceX AI..."
                  className="flex-grow bg-slate-900 text-xs px-3 py-2.5 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none text-[#f3f4f6] placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition active:scale-95 cursor-pointer shadow-lg shadow-blue-600/25"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
