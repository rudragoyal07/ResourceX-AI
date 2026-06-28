"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";

const AppContext = createContext();

// Seed Organizations Data
const initialOrganizations = [
  {
    id: "delhi_city_hospital",
    name: "Delhi City Hospital (Saket)",
    type: "Hospital",
    location: "Saket, Delhi",
    coords: [28.5276, 77.2197],
    trustScore: 94,
    completedExchanges: 412,
    responseTime: "12 mins",
    reliability: 96,
    deliveryRating: 4.8,
    verified: true,
  },
  {
    id: "noida_med_center",
    name: "Noida Medical Center (Sector 62)",
    type: "Hospital",
    location: "Sector 62, Noida",
    coords: [28.6273, 77.3725],
    trustScore: 89,
    completedExchanges: 188,
    responseTime: "18 mins",
    reliability: 91,
    deliveryRating: 4.4,
    verified: true,
  },
  {
    id: "gurugram_warehouse",
    name: "Gurugram Logistics Depot (Sector 32)",
    type: "Warehouse",
    location: "Sector 32, Gurugram",
    coords: [28.4489, 77.0678],
    trustScore: 98,
    completedExchanges: 1240,
    responseTime: "5 mins",
    reliability: 99,
    deliveryRating: 4.9,
    verified: true,
  },
  {
    id: "red_cross_depot",
    name: "Red Cross Disaster Hub (Ghaziabad)",
    type: "NGO",
    location: "Ghaziabad Center",
    coords: [28.6692, 77.4538],
    trustScore: 95,
    completedExchanges: 852,
    responseTime: "9 mins",
    reliability: 97,
    deliveryRating: 4.7,
    verified: true,
  },
  {
    id: "airport_cargo",
    name: "Indira Gandhi Airport Cargo Hub",
    type: "Company",
    location: "Dwarka, Delhi",
    coords: [28.5562, 77.1000],
    trustScore: 97,
    completedExchanges: 2150,
    responseTime: "4 mins",
    reliability: 98,
    deliveryRating: 4.9,
    verified: true,
  },
  {
    id: "haryana_reserve",
    name: "Haryana Emergency Reserve (Faridabad)",
    type: "Government",
    location: "Sector 15, Faridabad",
    coords: [28.4089, 77.3178],
    trustScore: 92,
    completedExchanges: 630,
    responseTime: "15 mins",
    reliability: 93,
    deliveryRating: 4.5,
    verified: true,
  },
  {
    id: "max_speciality",
    name: "Max Super Speciality Hospital (Shalimar Bagh)",
    type: "Hospital",
    location: "Shalimar Bagh, Delhi",
    coords: [28.7159, 77.1584],
    trustScore: 91,
    completedExchanges: 290,
    responseTime: "14 mins",
    reliability: 94,
    deliveryRating: 4.6,
    verified: true,
  },
  {
    id: "fortis_gurugram",
    name: "Fortis Memorial Research Institute",
    type: "Hospital",
    location: "Sector 44, Gurugram",
    coords: [28.4595, 77.0726],
    trustScore: 93,
    completedExchanges: 310,
    responseTime: "10 mins",
    reliability: 95,
    deliveryRating: 4.7,
    verified: true,
  },
  {
    id: "pm_relief_camp",
    name: "PM Relief Camp (Connaught Place)",
    type: "NGO",
    location: "Connaught Place, Delhi",
    coords: [28.6304, 77.2177],
    trustScore: 96,
    completedExchanges: 450,
    responseTime: "8 mins",
    reliability: 98,
    deliveryRating: 4.8,
    verified: true,
  },
  {
    id: "delhi_disaster_cell",
    name: "Delhi Disaster Management Cell (Rohini)",
    type: "Government",
    location: "Rohini, Delhi",
    coords: [28.7041, 77.1025],
    trustScore: 95,
    completedExchanges: 780,
    responseTime: "6 mins",
    reliability: 97,
    deliveryRating: 4.7,
    verified: true,
  }
];

// Seed Inventory Data
const initialInventory = [
  {
    id: "inv_1",
    name: "Medical Grade Oxygen Cylinders",
    category: "Oxygen",
    quantity: 1200,
    unit: "cylinders",
    expiryDate: "2027-12-31",
    location: "Sector 32, Gurugram",
    ownerId: "gurugram_warehouse",
    condition: "Excellent",
    status: "Available",
    coords: [28.4489, 77.0678],
  },
  {
    id: "inv_2",
    name: "Liquid Oxygen Tanker",
    category: "Oxygen",
    quantity: 15000,
    unit: "liters",
    expiryDate: "2026-10-15",
    location: "Dwarka, Delhi",
    ownerId: "airport_cargo",
    condition: "Excellent",
    status: "Available",
    coords: [28.5562, 77.1000],
  },
  {
    id: "inv_3",
    name: "Emergency MRE Food Packs",
    category: "Food",
    quantity: 5000,
    unit: "packs",
    expiryDate: "2026-12-01",
    location: "Ghaziabad Center",
    ownerId: "red_cross_depot",
    condition: "Good",
    status: "Available",
    coords: [28.6692, 77.4538],
  },
  {
    id: "inv_4",
    name: "ICU Ventilators",
    category: "Medical Equipment",
    quantity: 15,
    unit: "units",
    expiryDate: "2030-05-20",
    location: "Saket, Delhi",
    ownerId: "delhi_city_hospital",
    condition: "Good",
    status: "Available",
    coords: [28.5276, 77.2197],
  },
  {
    id: "inv_5",
    name: "Critical Care Antibiotics",
    category: "Medicine",
    quantity: 3500,
    unit: "vials",
    expiryDate: "2026-08-30",
    location: "Sector 62, Noida",
    ownerId: "noida_med_center",
    condition: "Excellent",
    status: "Available",
    coords: [28.6273, 77.3725],
  },
  {
    id: "inv_6",
    name: "Solar Power Generators 5KW",
    category: "Solar Panels",
    quantity: 25,
    unit: "units",
    expiryDate: "2035-01-01",
    location: "Sector 15, Faridabad",
    ownerId: "haryana_reserve",
    condition: "Excellent",
    status: "Available",
    coords: [28.4089, 77.3178],
  },
  {
    id: "inv_7",
    name: "Diesel Power Generators 10KVA",
    category: "Generators",
    quantity: 8,
    unit: "units",
    expiryDate: "2032-06-15",
    location: "Sector 32, Gurugram",
    ownerId: "gurugram_warehouse",
    condition: "Good",
    status: "Available",
    coords: [28.4489, 77.0678],
  },
  {
    id: "inv_8",
    name: "Purified Drinking Water",
    category: "Water",
    quantity: 8000,
    unit: "liters",
    expiryDate: "2026-09-10",
    location: "Ghaziabad Center",
    ownerId: "red_cross_depot",
    condition: "Excellent",
    status: "Available",
    coords: [28.6692, 77.4538],
  },
  {
    id: "inv_9",
    name: "Industrial Batteries 12V",
    category: "Batteries",
    quantity: 120,
    unit: "units",
    expiryDate: "2029-04-10",
    location: "Sector 32, Gurugram",
    ownerId: "gurugram_warehouse",
    condition: "Excellent",
    status: "Available",
    coords: [28.4489, 77.0678],
  },
  {
    id: "inv_10",
    name: "Diesel Fuel Reserve",
    category: "Fuel",
    quantity: 6000,
    unit: "liters",
    expiryDate: "2028-11-20",
    location: "Sector 15, Faridabad",
    ownerId: "haryana_reserve",
    condition: "Excellent",
    status: "Available",
    coords: [28.4089, 77.3178],
  }
];

// Seed Requests Data
const initialRequests = [
  {
    id: "req_1",
    creatorId: "delhi_city_hospital",
    creatorName: "Delhi City Hospital (Saket)",
    resourceNeeded: "Medical Grade Oxygen",
    category: "Oxygen",
    quantity: 500,
    unit: "cylinders",
    reason: "Surge in respiratory emergencies due to heatwave crisis.",
    priority: "Critical",
    deadline: "2026-06-30",
    location: "Saket, Delhi",
    coords: [28.5276, 77.2197],
    status: "Pending",
    dateCreated: "2026-06-27T10:00:00.000Z",
  },
  {
    id: "req_2",
    creatorId: "noida_med_center",
    creatorName: "Noida Medical Center (Sector 62)",
    resourceNeeded: "Emergency Power Generators",
    category: "Generators",
    quantity: 4,
    unit: "units",
    reason: "Power grid failure affecting backup ICU ventilators.",
    priority: "Critical",
    deadline: "2026-06-29",
    location: "Sector 62, Noida",
    coords: [28.6273, 77.3725],
    status: "Pending",
    dateCreated: "2026-06-27T18:30:00.000Z",
  },
  {
    id: "req_3",
    creatorId: "fortis_gurugram",
    creatorName: "Fortis Memorial Research Institute",
    resourceNeeded: "Antibiotics & Bandages",
    category: "Medicine",
    quantity: 2000,
    unit: "vials",
    reason: "Critical Care ward stocking due to regional inventory drop.",
    priority: "High",
    deadline: "2026-07-05",
    location: "Sector 44, Gurugram",
    coords: [28.4595, 77.0726],
    status: "Pending",
    dateCreated: "2026-06-27T08:00:00.000Z",
  },
  {
    id: "req_4",
    creatorId: "pm_relief_camp",
    creatorName: "PM Relief Camp (Connaught Place)",
    resourceNeeded: "Emergency MRE Food Packs",
    category: "Food",
    quantity: 1000,
    unit: "packs",
    reason: "Support for heatwave-refugee rehabilitation shelters.",
    priority: "Medium",
    deadline: "2026-07-10",
    location: "Connaught Place, Delhi",
    coords: [28.6304, 77.2177],
    status: "Pending",
    dateCreated: "2026-06-27T11:00:00.000Z",
  }
];

// Seed Exchanges Pipeline
const initialExchanges = [
  {
    id: "exch_1",
    requestId: "req_demo_old",
    requesterId: "delhi_city_hospital",
    requesterName: "Delhi City Hospital (Saket)",
    supplierId: "red_cross_depot",
    supplierName: "Red Cross Disaster Hub (Ghaziabad)",
    resource: "Emergency MRE Food Packs",
    category: "Food",
    quantity: 1500,
    unit: "packs",
    status: "Completed",
    dateCreated: "2026-06-25T08:00:00.000Z",
    currentStageIndex: 6,
    rating: 5,
    feedback: "Extremely fast coordination. Saved critical delays in food aid.",
    routeDetails: {
      eta: "Delivered",
      cost: "Free (Grants)",
      risk: "Low",
      safety: 100,
      coords: [
        [28.6692, 77.4538],
        [28.5276, 77.2197]
      ]
    }
  },
  {
    id: "exch_2",
    requestId: "req_demo_transit_1",
    requesterId: "noida_med_center",
    requesterName: "Noida Medical Center (Sector 62)",
    supplierId: "airport_cargo",
    supplierName: "Indira Gandhi Airport Cargo Hub",
    resource: "ICU Ventilators",
    category: "Medical Equipment",
    quantity: 5,
    unit: "units",
    status: "In Transit",
    dateCreated: "2026-06-27T12:00:00.000Z",
    currentStageIndex: 5,
    routeDetails: {
      eta: "14 mins",
      cost: "$250 (Transit Fee)",
      risk: "Low",
      safety: 98,
      coords: [
        [28.5562, 77.1000],
        [28.6273, 77.3725]
      ]
    }
  },
  {
    id: "exch_3",
    requestId: "req_demo_transit_2",
    requesterId: "max_speciality",
    requesterName: "Max Super Speciality Hospital (Shalimar Bagh)",
    supplierId: "gurugram_warehouse",
    supplierName: "Gurugram Logistics Depot (Sector 32)",
    resource: "Medical Grade Oxygen Cylinders",
    category: "Oxygen",
    quantity: 300,
    unit: "cylinders",
    status: "In Transit",
    dateCreated: "2026-06-27T14:00:00.000Z",
    currentStageIndex: 5,
    routeDetails: {
      eta: "18 mins",
      cost: "$120 (Logistics)",
      risk: "Medium",
      safety: 95,
      coords: [
        [28.4489, 77.0678],
        [28.7159, 77.1584]
      ]
    }
  }
];

// Seed Chat Messages
const initialMessages = {
  "delhi_city_hospital-red_cross_depot": [
    { senderId: "red_cross_depot", text: "Hello Delhi City Hospital, we have dispatched the 1500 MRE food packs. Can you confirm receipt?", timestamp: "2026-06-25T09:00:00.000Z" },
    { senderId: "delhi_city_hospital", text: "Received! Thank you so much for the quick response. The matching system worked beautifully.", timestamp: "2026-06-25T09:15:00.000Z" }
  ],
  "noida_med_center-airport_cargo": [
    { senderId: "noida_med_center", text: "Hi, we see the ICU ventilators are in transit. Is the drone shipment on route?", timestamp: "2026-06-27T12:30:00.000Z" },
    { senderId: "airport_cargo", text: "Yes, cargo drone RX-14 is currently flying at altitude 120m. ETA is exactly 14 minutes.", timestamp: "2026-06-27T12:35:00.000Z" }
  ]
};

// Seed Notifications
const initialNotifications = [
  {
    id: "not_1",
    type: "prediction",
    title: "Oxygen Shortage Predicted",
    message: "AI predicts a critical oxygen shortage in Noida region within 48 hours due to supply bottlenecks.",
    time: "10 mins ago",
    read: false,
  },
  {
    id: "not_2",
    type: "match",
    title: "Optimal AI Match Found",
    message: "New supply of Generators at Gurugram Depot matches Noida Hospital request with 98% confidence.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "not_3",
    type: "inventory",
    title: "Stock Expiry Warning",
    message: "3500 vials of Critical Care Antibiotics at Noida Medical Center expire in less than 60 days.",
    time: "2 hours ago",
    read: true,
  }
];

const WORKFLOW_STAGES = [
  "Request Created",
  "AI Analysis Done",
  "Supplier Match Selected",
  "Supplier Approved",
  "Shipment Planned",
  "In Transit",
  "Delivered"
];

export const AppProvider = ({ children }) => {
  const guestPlaceholder = {
    id: "guest_node",
    name: "Setup Node Required",
    type: "Hospital",
    location: "Locating...",
    coords: [28.6139, 77.2090],
    trustScore: 100,
    completedExchanges: 0,
    responseTime: "N/A",
    reliability: 100,
    deliveryRating: 5.0,
    verified: false
  };

  const [activeOrg, setActiveOrg] = useState(() => {
    return initialOrganizations.length > 0 ? initialOrganizations[0] : guestPlaceholder;
  });
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [inventory, setInventory] = useState(initialInventory);
  const [requests, setRequests] = useState(initialRequests);
  const [exchanges, setExchanges] = useState(initialExchanges);
  const [messages, setMessages] = useState(initialMessages);
  const [notifications, setNotifications] = useState(initialNotifications);



  // Switch Active Organization
  const selectActiveOrg = (orgId) => {
    const org = organizations.find((o) => o.id === orgId);
    if (org) {
      setActiveOrg(org);
    }
  };

  // Add Inventory Item
  const addInventoryItem = (item) => {
    const newItem = {
      id: `inv_${Date.now()}`,
      ownerId: activeOrg.id,
      location: activeOrg.name,
      coords: activeOrg.coords,
      status: "Available",
      ...item,
    };
    setInventory((prev) => [newItem, ...prev]);

    // Send AI Notification for Inventory Health
    if (item.expiryDate) {
      const expiry = new Date(item.expiryDate);
      const diffTime = Math.abs(expiry - new Date());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 90) {
        addNotification({
          type: "inventory",
          title: "Expiry Alert Triggered",
          message: `${item.name} added to ${activeOrg.name} expires in ${diffDays} days. AI suggests immediate redistribution if unused.`,
        });
      }
    }
  };

  // Create Resource Request
  const createRequest = (req) => {
    const newRequest = {
      id: `req_${Date.now()}`,
      creatorId: activeOrg.id,
      creatorName: activeOrg.name,
      coords: activeOrg.coords,
      status: "Pending",
      dateCreated: new Date().toISOString(),
      ...req,
    };

    setRequests((prev) => [newRequest, ...prev]);

    // Add alert notification
    addNotification({
      type: "match",
      title: "Request Received",
      message: `Emergency request for ${req.quantity} ${req.unit} of ${req.resourceNeeded} submitted by ${activeOrg.name}. AI is analyzing matches...`,
    });

    return newRequest;
  };

  // Add Notification
  const addNotification = (notif) => {
    setNotifications((prev) => [
      {
        id: `not_${Date.now()}`,
        time: "Just now",
        read: false,
        ...notif,
      },
      ...prev,
    ]);
  };

  // Mark all notifications as read
  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Chat message sending
  const sendChatMessage = (receiverId, text) => {
    const threadKey = [activeOrg.id, receiverId].sort().join("-");
    const newMessage = {
      senderId: activeOrg.id,
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => ({
      ...prev,
      [threadKey]: [...(prev[threadKey] || []), newMessage],
    }));

    // Trigger basic simulated robot reply from warehouse or hospital after 1.5 seconds
    setTimeout(() => {
      const receivingOrg = organizations.find((o) => o.id === receiverId);
      if (receivingOrg) {
        const autoReply = {
          senderId: receiverId,
          text: `[SYSTEM] Thank you for messaging ${receivingOrg.name}. We have logged your query. Our logistics officer will verify our inventory matching coordinates and confirm the shipping plan.`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => ({
          ...prev,
          [threadKey]: [...(prev[threadKey] || []), autoReply],
        }));

        addNotification({
          type: "message",
          title: `New message from ${receivingOrg.name}`,
          message: `Update on exchange logistics. Check your messaging panel.`,
        });
      }
    }, 1500);
  };

  // Accept a Smart Match and initialize the Exchange Pipeline State Machine
  const acceptMatch = (requestId, supplierId, matchDetails) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    // Update Request status to Accepted
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "Accepted" } : r))
    );

    const supplier = organizations.find((o) => o.id === supplierId);
    
    // Create new exchange
    const newExchange = {
      id: `exch_${Date.now()}`,
      requestId: requestId,
      requesterId: req.creatorId,
      requesterName: req.creatorName,
      supplierId: supplierId,
      supplierName: supplier?.name || "Matched Supplier",
      resource: req.resourceNeeded,
      category: req.category,
      quantity: req.quantity,
      unit: req.unit,
      status: "Match Approved",
      dateCreated: new Date().toISOString(),
      currentStageIndex: 2, // Supplier Match Selected & Approved
      routeDetails: {
        eta: matchDetails?.eta || "5 hrs",
        cost: matchDetails?.cost || "$150 (Drone Transit)",
        risk: matchDetails?.risk || "Low",
        safety: 96,
        coords: [
          supplier?.coords || [28.4595, 77.0266],
          req.coords || [28.6139, 77.2090]
        ]
      }
    };

    setExchanges((prev) => [newExchange, ...prev]);

    addNotification({
      type: "match",
      title: "Exchange Confirmed",
      message: `Match approved! Shipping contract created between ${req.creatorName} and ${supplier?.name}.`,
    });

    // Start automatic background progression of the logistics pipeline stages
    simulateWorkflowProgression(newExchange.id);

    return newExchange.id;
  };

  // Simulates shipment status updates step by step
  const simulateWorkflowProgression = (exchangeId) => {
    let currentStage = 2; // Supplier Approved
    
    const interval = setInterval(() => {
      currentStage += 1;
      
      setExchanges((prev) =>
        prev.map((ex) => {
          if (ex.id === exchangeId) {
            let status = "Match Approved";
            if (currentStage === 3) status = "Shipment Planned";
            if (currentStage === 4) status = "In Transit";
            if (currentStage === 5) {
              status = "Delivered";
              // Fire confetti on delivery!
              confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 }
              });
            }
            if (currentStage === 6) {
              status = "Completed";
              clearInterval(interval);
            }
            return {
              ...ex,
              status,
              currentStageIndex: currentStage >= 6 ? 6 : currentStage
            };
          }
          return ex;
        })
      );

      // Trigger notification for updates
      setExchanges((prev) => {
        const ex = prev.find((e) => e.id === exchangeId);
        if (ex) {
          addNotification({
            type: "match",
            title: `Exchange Update: ${ex.status}`,
            message: `Shipment of ${ex.quantity} ${ex.unit} ${ex.resource} is now: ${ex.status}.`,
          });
        }
        return prev;
      });

      if (currentStage >= 6) {
        clearInterval(interval);
      }
    }, 12000); // Progresses every 12 seconds in dashboard for high engagement
  };

  // Register new organization with initial surplus inventories and requirements
  const registerOrganization = (orgData, surplusItems = [], requirementRequests = []) => {
    const newOrgId = `org_${Date.now()}`;
    const newOrg = {
      id: newOrgId,
      name: orgData.name,
      type: orgData.type || "Hospital",
      location: orgData.location || "Delhi Sector 10",
      coords: orgData.coords || [28.6139 + (Math.random() - 0.5) * 0.15, 77.2090 + (Math.random() - 0.5) * 0.15],
      trustScore: 90,
      completedExchanges: 0,
      responseTime: "10 mins",
      reliability: 95,
      deliveryRating: 5.0,
      verified: true
    };

    // Add to organizations list
    setOrganizations((prev) => [...prev, newOrg]);

    // Add initial surplus items to inventory
    const newInventoryItems = surplusItems.map((item, idx) => ({
      id: `inv_reg_${Date.now()}_${idx}`,
      name: item.name,
      category: item.category || "Oxygen",
      quantity: Number(item.quantity) || 100,
      unit: item.unit || "units",
      expiryDate: item.expiryDate || new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
      location: newOrg.name,
      ownerId: newOrgId,
      condition: item.condition || "Excellent",
      status: "Available",
      coords: newOrg.coords
    }));
    if (newInventoryItems.length > 0) {
      setInventory((prev) => [...newInventoryItems, ...prev]);
    }

    // Add initial requirement items to requests
    const newRequests = requirementRequests.map((req, idx) => ({
      id: `req_reg_${Date.now()}_${idx}`,
      creatorId: newOrgId,
      creatorName: newOrg.name,
      resourceNeeded: req.resourceNeeded,
      category: req.category || "Oxygen",
      quantity: Number(req.quantity) || 50,
      unit: req.unit || "units",
      reason: req.reason || "Urgent emergency deficit replenishment.",
      priority: req.priority || "High",
      deadline: req.deadline || new Date(Date.now() + 5*24*60*60*1000).toISOString().split('T')[0],
      location: newOrg.location,
      coords: newOrg.coords,
      status: "Pending",
      dateCreated: new Date().toISOString()
    }));
    if (newRequests.length > 0) {
      setRequests((prev) => [...newRequests, ...prev]);

      // AI MATCHING REDISTRIBUTION ROUTER:
      // Loop over requested needs, find the closest supplying node, and auto-dispatch
      newRequests.forEach((req) => {
        const matchingSupplies = inventory.filter(
          (item) => item.category === req.category && item.ownerId !== newOrgId && item.quantity >= req.quantity
        );

        if (matchingSupplies.length > 0) {
          let closestSupply = null;
          let minDistance = Infinity;

          matchingSupplies.forEach((supply) => {
            // Euclidean distance proxy
            const dist = Math.sqrt(
              Math.pow(newOrg.coords[0] - supply.coords[0], 2) +
              Math.pow(newOrg.coords[1] - supply.coords[1], 2)
            );
            if (dist < minDistance) {
              minDistance = dist;
              closestSupply = supply;
            }
          });

          if (closestSupply) {
            const supplierOrg = organizations.find((o) => o.id === closestSupply.ownerId);

            // Compute dynamic drone route ETA (1 degree lat/lng ~= 111 km. Assume drone speed 80 km/h -> ~83 mins per degree)
            const etaMinutes = Math.max(12, Math.ceil(minDistance * 83));

            const autoExchange = {
              id: `exch_auto_${Date.now()}`,
              requestId: req.id,
              requesterId: newOrgId,
              requesterName: newOrg.name,
              supplierId: closestSupply.ownerId,
              supplierName: supplierOrg?.name || "Matched Supplier",
              resource: req.resourceNeeded,
              category: req.category,
              quantity: req.quantity,
              unit: req.unit,
              status: "In Transit", // Plot dynamically on map!
              dateCreated: new Date().toISOString(),
              currentStageIndex: 5, // In Transit stage index
              routeDetails: {
                eta: `${etaMinutes} mins`,
                cost: `$${Math.max(45, Math.ceil(minDistance * 180))} (Auto-Allocation)`,
                risk: "Low",
                safety: 99,
                coords: [
                  closestSupply.coords, // Supplier start coords
                  newOrg.coords         // Requester end coords
                ]
              }
            };

            // Trigger AI auto routing notification
            addNotification({
              type: "match",
              title: "AI Auto-Redistribution Active",
              message: `Routing ${req.quantity} ${req.unit} of ${req.resourceNeeded} from '${autoExchange.supplierName}' to '${newOrg.name}' (ETA: ${autoExchange.routeDetails.eta}).`
            });

            // Append to exchanges state
            setExchanges((prev) => [autoExchange, ...prev]);
          }
        }
      });
    }

    // Auto log in as this new organization
    setActiveOrg(newOrg);

    // Trigger AI notification
    addNotification({
      type: "match",
      title: "New Node Registered",
      message: `Verified facility '${newOrg.name}' has joined the network at coordinates: ${newOrg.coords[0].toFixed(4)}, ${newOrg.coords[1].toFixed(4)}.`
    });

    return newOrgId;
  };

  return (
    <AppContext.Provider
      value={{
        activeOrg,
        selectActiveOrg,
        organizations,
        inventory,
        requests,
        exchanges,
        messages,
        notifications,
        addInventoryItem,
        createRequest,
        sendChatMessage,
        acceptMatch,
        markAllNotificationsRead,
        addNotification,
        registerOrganization,
        WORKFLOW_STAGES,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
