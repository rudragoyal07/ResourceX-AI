"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useApp } from "@/context/AppContext";
import L from "leaflet";

// Helper component to center map when coords change
function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 12); // Pans and zooms in on active node
    }
  }, [center, map]);
  return null;
}

export default function CrisisMap() {
  const { activeOrg, organizations, inventory, requests, exchanges } = useApp();
  const [leafletReady, setLeafletReady] = useState(false);

  useEffect(() => {
    // Ensure Leaflet is loaded on client
    setLeafletReady(true);
  }, []);

  if (!leafletReady) {
    return (
      <div className="w-full h-full bg-[#060913] flex items-center justify-center text-xs text-gray-500">
        Initializing Global Crisis Map Canvas...
      </div>
    );
  }

  // Helper to create custom glowing HTML markers for Leaflet
  const createHtmlIcon = (type, label) => {
    let glowColor = "bg-blue-500";
    let badge = "🏢";
    
    if (type === "Hospital") {
      glowColor = "bg-red-500";
      badge = "🏥";
    } else if (type === "NGO") {
      glowColor = "bg-emerald-500";
      badge = "🤝";
    } else if (type === "Government") {
      glowColor = "bg-yellow-500";
      badge = "🏛️";
    }

    return L.divIcon({
      html: `
        <div class="relative w-8 h-8 flex items-center justify-center">
          <div class="absolute inset-0 rounded-full ${glowColor} opacity-20 animate-ping"></div>
          <div class="w-6 h-6 rounded-full ${glowColor} flex items-center justify-center border border-white/20 shadow-lg text-[11px] text-white">
            ${badge}
          </div>
        </div>
      `,
      className: "custom-marker-icon",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  // Noida region crisis zone indicator (represented as red pulsing circle overlay or large marker)
  const disasterZoneCoords = [28.5355, 77.3910]; // Noida

  // CartoDB Dark Matter tiles look extremely premium
  const tileUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

  // Compute suggestion paths (Matching Need & Excess for closest nodes)
  const suggestionRoutes = [];
  if (requests && inventory) {
    requests
      .filter((req) => req.status === "Pending")
      .forEach((req) => {
        // Find all available inventories of the same category owned by other facilities
        const matchingSupplies = inventory.filter(
          (item) => item.category === req.category && item.ownerId !== req.creatorId && item.status === "Available"
        );

        if (matchingSupplies.length > 0) {
          let closestSupply = null;
          let minDistance = Infinity;

          matchingSupplies.forEach((supply) => {
            // Euclidean distance
            const dist = Math.sqrt(
              Math.pow(req.coords[0] - supply.coords[0], 2) +
              Math.pow(req.coords[1] - supply.coords[1], 2)
            );
            if (dist < minDistance) {
              minDistance = dist;
              closestSupply = supply;
            }
          });

          if (closestSupply) {
            // Check if they are already linked by an active exchange
            const alreadyLinked = exchanges.some(
              (ex) =>
                ex.requestId === req.id &&
                ex.supplierId === closestSupply.ownerId &&
                (ex.status === "In Transit" || ex.status === "Match Approved" || ex.status === "Shipment Planned")
            );

            if (!alreadyLinked) {
              suggestionRoutes.push({
                id: `suggest_${req.id}_${closestSupply.id}`,
                fromCoords: closestSupply.coords,
                toCoords: req.coords,
                resource: req.resourceNeeded,
                quantity: req.quantity,
                unit: req.unit,
                category: req.category,
                distance: minDistance
              });
            }
          }
        }
      });
  }

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-slate-900 shadow-inner">
      <MapContainer 
        center={[28.5355, 77.2090]} // Center between Delhi & Noida
        zoom={11} 
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
      >
        <TileLayer url={tileUrl} attribution={attribution} />
        <ChangeMapView center={activeOrg?.coords} />

        {/* Noida Crisis Zone Glow overlay */}
        <Marker 
          position={disasterZoneCoords} 
          icon={L.divIcon({
            html: `<div class="w-24 h-24 -ml-12 -mt-12 rounded-full bg-red-500/10 border border-red-500/20 animate-pulse-glow"></div>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0]
          })}
        />

        {/* Render Organizations Markers */}
        {organizations.map((org) => {
          // Get inventory items belonging to this organization
          const orgInventory = inventory.filter((item) => item.ownerId === org.id);

          return (
            <Marker 
              key={org.id} 
              position={org.coords} 
              icon={createHtmlIcon(org.type, org.name)}
            >
              <Popup>
                <div className="p-2 space-y-2 text-xs select-none">
                  <div className="border-b border-slate-800 pb-1.5">
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{org.type}</span>
                    <h4 className="font-extrabold text-white text-xs mt-0.5">{org.name}</h4>
                    <p className="text-[9px] text-gray-500 flex items-center gap-1 mt-0.5">📍 {org.location}</p>
                  </div>
                  
                  {/* Stock List inside Popup */}
                  <div>
                    <h5 className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">Local Reserves</h5>
                    {orgInventory.length > 0 ? (
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {orgInventory.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-[10px] text-gray-300">
                            <span>{item.name}</span>
                            <span className="font-bold text-white ml-2">{item.quantity} {item.unit}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-gray-500 italic">No supplies allocated here.</p>
                    )}
                  </div>

                  <div className="pt-1.5 border-t border-slate-800 text-[9px] text-gray-500">
                    Trust Rating: <strong className="text-emerald-400">{org.trustScore}%</strong>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Render AI Match Suggested Paths (Potential links meeting need & excess) */}
        {suggestionRoutes.map((route) => (
          <Polyline 
            key={route.id}
            positions={[route.fromCoords, route.toCoords]}
            pathOptions={{
              color: "#10b981", 
              weight: 1.5,
              dashArray: "4, 8",
              opacity: 0.75,
              className: "animate-pulse"
            }}
          >
            <Popup>
              <div className="p-2 space-y-1 text-xs select-none">
                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest block">💡 AI Match Proposal</span>
                <p className="text-gray-300 text-[10px] leading-relaxed mt-1">
                  Deficit at this node can be resolved by nearest supply: <strong className="text-white">{route.quantity} {route.unit}</strong> of <strong className="text-white">{route.resource}</strong>.
                </p>
                <div className="text-[8px] text-gray-500 pt-1 border-t border-slate-800 mt-1">
                  Est. Flight Time: <span className="text-emerald-400 font-semibold">{Math.max(10, Math.ceil(route.distance * 83))} mins</span>
                </div>
              </div>
            </Popup>
          </Polyline>
        ))}

        {/* Render Shipment Path PolyLines for active transfers */}
        {exchanges
          .filter((ex) => ex.status === "In Transit" || ex.status === "Match Approved" || ex.status === "Shipment Planned")
          .map((ex) => {
            const pathCoords = ex.routeDetails.coords;
            if (!pathCoords || pathCoords.length < 2) return null;

            return (
              <React.Fragment key={ex.id}>
                {/* Polyline Path */}
                <Polyline 
                  positions={pathCoords} 
                  pathOptions={{ 
                    color: ex.status === "In Transit" ? "#3b82f6" : "#f59e0b", 
                    weight: 2.5, 
                    dashArray: "6, 6",
                    className: "animate-pulse"
                  }} 
                />

                {/* Pulsing Cargo drone position pin */}
                <Marker 
                  position={pathCoords[0]} 
                  icon={L.divIcon({
                    html: `
                      <div class="relative w-6 h-6 flex items-center justify-center">
                        <div class="absolute inset-0 rounded-full bg-blue-400 animate-ping"></div>
                        <div class="w-4 h-4 rounded-full bg-blue-500 border border-white/20 shadow-lg text-[9px] flex items-center justify-center">🚁</div>
                      </div>
                    `,
                    className: "cargo-icon",
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })}
                />
              </React.Fragment>
            );
          })}
      </MapContainer>
    </div>
  );
}
