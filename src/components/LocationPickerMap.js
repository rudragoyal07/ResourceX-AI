"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

const LOCATION_PRESETS = {
  "delhi": [28.6139, 77.2090],
  "new delhi": [28.6139, 77.2090],
  "saket": [28.5244, 77.2100],
  "vasant kunj": [28.5387, 77.1606],
  "connaught place": [28.6304, 77.2177],
  "dwarka": [28.5823, 77.0500],
  "gurgaon": [28.4595, 77.0266],
  "gurugram": [28.4595, 77.0266],
  "noida": [28.5355, 77.3910],
  "ghaziabad": [28.6692, 77.4538],
  "faridabad": [28.4089, 77.3178],
  "south ext": [28.5684, 77.2201],
  "hauz khas": [28.5494, 77.2001],
  "karol bagh": [28.6444, 77.1874],
  "rohini": [28.7041, 77.1025],
  "mayur vihar": [28.6045, 77.2911]
};

// Helper component to center map when coords change
function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

// Click listener to place pin
function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function LocationPickerMap({ coords, onChangeCoords }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]);
  const [loading, setLoading] = useState(false);

  // Handle OSM geocoding search (OpenStreetMap Nominatim API)
  const handleSearchCoords = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const newCoords = [lat, lon];
        setMapCenter(newCoords);
        onChangeCoords(newCoords);
      } else {
        // Fallback: Check local presets
        fallbackPresetSearch();
      }
    } catch (error) {
      console.error("OSM Geocoding failed, trying preset fallback:", error);
      fallbackPresetSearch();
    } finally {
      setLoading(false);
    }
  };

  const fallbackPresetSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    let matchedCoords = null;

    for (const key in LOCATION_PRESETS) {
      if (query.includes(key) || key.includes(query)) {
        matchedCoords = LOCATION_PRESETS[key];
        break;
      }
    }

    if (!matchedCoords) {
      const latOffset = (Math.random() - 0.5) * 0.1;
      const lngOffset = (Math.random() - 0.5) * 0.1;
      matchedCoords = [28.6139 + latOffset, 77.2090 + lngOffset];
    }

    setMapCenter(matchedCoords);
    onChangeCoords(matchedCoords);
  };

  const markerIcon = L.divIcon({
    html: `
      <div class="relative w-8 h-8 flex items-center justify-center">
        <div class="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping"></div>
        <div class="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center border border-white/20 shadow-lg text-[11px] text-white">
          📍
        </div>
      </div>
    `,
    className: "custom-marker-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  const tileUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="space-y-2 select-none">
      {/* Search Input inside Map frame */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent parent form from submitting
              handleSearchCoords();
            }
          }}
          placeholder="Search location (e.g. Saket, Noida, Dwarka)..."
          className="flex-grow bg-slate-950 text-[11px] px-3 py-2 rounded border border-slate-800 focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
        />
        <button
          type="button"
          disabled={loading}
          onClick={(e) => {
            e.preventDefault();
            handleSearchCoords();
          }}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-bold transition active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {loading ? "Searching..." : "Locate"}
        </button>
      </div>

      {/* Map Element */}
      <div className="w-full h-40 rounded-lg overflow-hidden border border-slate-900 shadow-inner relative z-0">
        <MapContainer
          center={mapCenter}
          zoom={11}
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
        >
          <TileLayer url={tileUrl} />
          <ChangeMapView center={mapCenter} />
          <MapClickHandler onClick={onChangeCoords} />
          <Marker position={coords} icon={markerIcon} />
        </MapContainer>
      </div>
      <p className="text-[9px] text-gray-500 italic mt-1">
        * Search above or click anywhere on the dark map canvas to drop your facility pin.
      </p>
    </div>
  );
}
