// Helper to calculate distance in km between two coordinates (Euclidean simplification for demo)
export const calculateDistance = (coord1, coord2) => {
  if (!coord1 || !coord2) return 5;
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

// 1. AI Resource Matching Engine
export const matchSuppliers = (request, inventory, organizations) => {
  if (!request) return [];

  // Filter inventory items matching the request category
  const matchingItems = inventory.filter(
    (item) =>
      item.category.toLowerCase() === request.category.toLowerCase() &&
      item.ownerId !== request.creatorId &&
      item.quantity > 0
  );

  const results = matchingItems.map((item) => {
    const supplier = organizations.find((o) => o.id === item.ownerId) || {};
    
    // Calculate parameters
    const distance = calculateDistance(request.coords, item.coords);
    const quantityScore = Math.min(item.quantity / request.quantity, 1.2); // Cap at 120%
    const trustScore = supplier.trustScore || 85;
    
    // Calculate Match Score (0 - 100)
    // Distance penalty: -0.5% per km (max penalty 35%)
    // Trust score weight: 40%
    // Quantity matching weight: 30%
    // Distance weight: 30%
    const distanceWeightScore = Math.max(100 - distance * 2, 30); // minimum 30 for distance
    const trustWeightScore = trustScore;
    const qtyWeightScore = quantityScore * 100;
    
    const rawScore = (trustWeightScore * 0.4) + (distanceWeightScore * 0.3) + (qtyWeightScore * 0.3);
    const matchScore = Math.min(Math.round(rawScore), 99);
    const confidence = Math.min(Math.round(matchScore - (distance > 30 ? 5 : 0)), 98);

    // Estimate Delivery Time (50km/hr speed + logistics overhead)
    const travelTimeHrs = (distance / 45) + 0.3; // hours
    let etaString = "";
    if (travelTimeHrs < 1) {
      etaString = `${Math.round(travelTimeHrs * 60)} mins`;
    } else {
      etaString = `${Math.round(travelTimeHrs * 10) / 10} hrs`;
    }

    // Cost calculation ($1.2 per km + base fee)
    const cost = distance === 0 ? 0 : Math.round(50 + distance * 1.5);

    // Transport Complexity & Risk Analysis
    let risk = "Low";
    let reasoning = "";
    let routeComplexity = "Direct route via city expressway. Weather conditions normal.";

    if (distance > 30) {
      risk = "Medium";
      routeComplexity = "Multi-sector drone corridor transit. Potential signal latency in high density zones.";
      reasoning = `Highly reliable supplier (${trustScore}% trust) but located ${distance} km away. Estimated delivery is ${etaString}.`;
    } else if (item.quantity < request.quantity) {
      risk = "Medium";
      reasoning = `Supplier is nearby (${distance} km) but can only provide partial inventory (${item.quantity}/${request.quantity} units).`;
      routeComplexity = "Local dispatch. Minor delays near city borders.";
    } else {
      reasoning = `Excellent match! Low latency dispatch (${distance} km), 100% quantity available, and high supplier reliability (${trustScore}%).`;
    }

    if (item.condition === "Fair") {
      risk = "Medium";
      reasoning += " Note: Stock condition is marked as Fair.";
    }

    return {
      supplierId: supplier.id,
      supplierName: supplier.name,
      resourceName: item.name,
      availableQty: item.quantity,
      unit: item.unit,
      distance,
      matchScore,
      confidence,
      eta: etaString,
      cost: cost === 0 ? "Free (Grant)" : `$${cost} (Transit Fee)`,
      risk,
      reasoning,
      routeComplexity,
      reliability: supplier.reliability || 90,
      avatar: supplier.type === "Warehouse" ? "🏢" : supplier.type === "NGO" ? "🤝" : "🏥"
    };
  });

  // Sort by match score descending
  return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
};

// 2. Urgency Detection AI
export const detectUrgency = (reason, resourceName) => {
  const text = `${reason} ${resourceName}`.toLowerCase();
  
  if (
    text.includes("critical") ||
    text.includes("icu") ||
    text.includes("die") ||
    text.includes("dying") ||
    text.includes("life support") ||
    text.includes("failure") ||
    text.includes("immediate") ||
    text.includes("power grid") ||
    text.includes("suffocating") ||
    text.includes("emergency")
  ) {
    return "Critical";
  }
  
  if (
    text.includes("shortage") ||
    text.includes("running low") ||
    text.includes("out of") ||
    text.includes("needs soon") ||
    text.includes("within 24") ||
    text.includes("surge") ||
    text.includes("floods") ||
    text.includes("heatwave")
  ) {
    return "High";
  }
  
  if (
    text.includes("replenish") ||
    text.includes("stock") ||
    text.includes("reserve") ||
    text.includes("plan") ||
    text.includes("relief camp") ||
    text.includes("upcoming")
  ) {
    return "Medium";
  }
  
  return "Low";
};

// 3. Demand Forecast & Shortage Prediction AI
export const forecastShortages = (inventory, requests) => {
  return [
    {
      id: "pred_1",
      category: "Oxygen",
      title: "Oxygen Shortage Forecast",
      probability: 94,
      riskLevel: "Critical",
      affectedRegion: "Noida Sector 62",
      predictedTime: "Within 48 hours",
      reasoning: "Surging ICU admissions combined with a grid restriction at Greater Noida oxygen refilling plants.",
      recommendedActions: [
        "Reallocate 3,000L Liquid Oxygen from IGI Cargo Hub (Dwarka) via Drone Corridor B.",
        "Authorize transfer of 200 unused cylinders from Gurugram Logistics Depot."
      ],
      chartData: [
        { day: "Mon", supply: 5000, demand: 4200 },
        { day: "Tue", supply: 4800, demand: 4500 },
        { day: "Wed", supply: 4000, demand: 4900 },
        { day: "Thu (Pred)", supply: 3200, demand: 5200 },
        { day: "Fri (Pred)", supply: 2500, demand: 5800 },
      ]
    },
    {
      id: "pred_2",
      category: "Medicine",
      title: "Critical Antibiotic Exhaustion",
      probability: 82,
      riskLevel: "High",
      affectedRegion: "Ghaziabad & East Delhi",
      predictedTime: "Within 5 days",
      reasoning: "Flood alerts in neighboring Uttar Pradesh regions are drawing heavy stocks from Ghaziabad Red Cross Depot.",
      recommendedActions: [
        "Request bulk restocking from Apex Diagnostics (Noida).",
        "Initiate express highway transit contract from Haryana Emergency Reserve."
      ],
      chartData: [
        { day: "Mon", supply: 10000, demand: 6000 },
        { day: "Tue", supply: 9000, demand: 7200 },
        { day: "Wed", supply: 7500, demand: 8100 },
        { day: "Thu (Pred)", supply: 5000, demand: 9000 },
        { day: "Fri (Pred)", supply: 3000, demand: 9800 },
      ]
    },
    {
      id: "pred_3",
      category: "Fuel",
      title: "Generator Diesel Deficit",
      probability: 76,
      riskLevel: "High",
      affectedRegion: "Gurugram Industrial Belt",
      predictedTime: "Within 3 days",
      reasoning: "Scheduled maintenance of state electricity grid will force prolonged backup generator run times.",
      recommendedActions: [
        "Mobilize 2,000L diesel fuel reserves from Haryana Government Reserve.",
        "Equip facilities with solar panel backups to mitigate generator wear."
      ],
      chartData: [
        { day: "Mon", supply: 8000, demand: 3000 },
        { day: "Tue", supply: 7500, demand: 4200 },
        { day: "Wed", supply: 6500, demand: 5800 },
        { day: "Thu (Pred)", supply: 4000, demand: 7500 },
        { day: "Fri (Pred)", supply: 2200, demand: 8200 },
      ]
    },
    {
      id: "pred_4",
      category: "Batteries",
      title: "Telecommunications Battery Drop",
      probability: 60,
      riskLevel: "Medium",
      affectedRegion: "Faridabad Emergency Towers",
      predictedTime: "Within 7 days",
      reasoning: "Excessive heat causing batteries to discharge rapidly at mobile base transceiver stations.",
      recommendedActions: [
        "Procure 50 backup battery packs from Gurugram Depot.",
        "Establish shade enclosures to reduce thermal load on power supplies."
      ],
      chartData: [
        { day: "Mon", supply: 300, demand: 150 },
        { day: "Tue", supply: 280, demand: 180 },
        { day: "Wed", supply: 240, demand: 210 },
        { day: "Thu (Pred)", supply: 200, demand: 230 },
        { day: "Fri (Pred)", supply: 150, demand: 250 },
      ]
    }
  ];
};

// 4. Inventory Health AI (Expiring stock alerts)
export const checkInventoryHealth = (inventory) => {
  const today = new Date();
  
  return inventory.map((item) => {
    const expiry = new Date(item.expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let healthStatus = "Healthy";
    let healthScore = 100;
    let description = "Stock is secure and has a long shell life.";
    
    if (diffDays <= 0) {
      healthStatus = "Expired";
      healthScore = 0;
      description = "Critical: Stock has expired. Immediate removal required.";
    } else if (diffDays <= 60) {
      healthStatus = "Critical Expiry";
      healthScore = 30;
      description = `Expiring in ${diffDays} days! Needs redistribution request immediately.`;
    } else if (diffDays <= 120) {
      healthStatus = "Near Expiry";
      healthScore = 70;
      description = `Expiring in ${diffDays} days. Flagged for review.`;
    }

    if (item.condition === "Fair") {
      healthScore = Math.max(healthScore - 20, 10);
    }
    
    return {
      ...item,
      healthStatus,
      healthScore,
      daysToExpiry: diffDays,
      healthDescription: description
    };
  });
};

// 5. Executive Summary AI
export const generateExecutiveSummary = (inventory, requests, activeOrg) => {
  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const criticalRequests = requests.filter((r) => r.priority === "Critical" && r.status === "Pending");
  const expiringSoonCount = inventory.filter((item) => {
    const diffDays = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 90;
  }).length;

  let summary = `Global logistics routing is active. We are monitoring **${inventory.length}** inventory allocations across Northern India. Currently, there are **${pendingCount}** open requests waiting for redistribution approval.`;

  if (criticalRequests.length > 0) {
    summary += ` **${criticalRequests.length} critical shortage alarms** are active in Noida and New Delhi. AI suggests routing surplus oxygen from IGI Airport Dwarka Cargo immediately.`;
  } else {
    summary += ` Supply chains are stable. No critical priority requests are outstanding.`;
  }

  if (expiringSoonCount > 0) {
    summary += ` AI detects **${expiringSoonCount} item categories** expiring within 90 days. Recommend matching them with medium priority requests before wastage occurs.`;
  }

  return {
    overview: summary,
    actionNeeded: criticalRequests.length > 0 ? "Immediate Match Approvals Required" : "Optimize Reserve Storage",
    riskIndex: criticalRequests.length > 0 ? "82% (High Risk)" : "24% (Low Risk)"
  };
};

// 6. Natural Language Search Engine for Resource Queries
export const naturalLanguageSearch = (query, inventory, organizations) => {
  if (!query) return inventory;
  
  const text = query.toLowerCase();
  
  // Categorize keywords
  const categories = ["oxygen", "food", "water", "medicine", "fuel", "generator", "solar", "battery", "equipment"];
  const matchingCategories = categories.filter(c => text.includes(c));
  
  // City names
  const cities = ["delhi", "noida", "gurgaon", "gurugram", "ghaziabad", "dwarka", "faridabad"];
  const matchingCities = cities.filter(c => text.includes(c));

  // Condition words
  const isExcellent = text.includes("excellent") || text.includes("new");
  const isGood = text.includes("good") || text.includes("fair");
  
  return inventory.filter((item) => {
    const supplier = organizations.find((o) => o.id === item.ownerId) || {};
    
    // Check category match
    let catMatch = true;
    if (matchingCategories.length > 0) {
      catMatch = matchingCategories.some(cat => 
        item.category.toLowerCase().includes(cat) || 
        item.name.toLowerCase().includes(cat)
      );
    }
    
    // Check location/city match
    let cityMatch = true;
    if (matchingCities.length > 0) {
      cityMatch = matchingCities.some(city => 
        item.location.toLowerCase().includes(city) ||
        supplier.location?.toLowerCase().includes(city)
      );
    }
    
    // Check quantity search (e.g. "more than 100", "over 1000", "has oxygen")
    let qtyMatch = true;
    if (text.includes("more than") || text.includes(">")) {
      const match = text.match(/\d+/);
      if (match) {
        const threshold = parseInt(match[0]);
        qtyMatch = item.quantity >= threshold;
      }
    }

    // Text generic match
    const textMatch = 
      item.name.toLowerCase().includes(text) ||
      item.category.toLowerCase().includes(text) ||
      item.location.toLowerCase().includes(text);

    // If query has specific structured items, combine them. Otherwise fallback to generic text match.
    if (matchingCategories.length > 0 || matchingCities.length > 0) {
      return catMatch && cityMatch && qtyMatch;
    }
    
    return textMatch;
  });
};
