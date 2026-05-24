import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Corporation color mapping 
const getCorpColor = (corporation) => {
  const colors = {
    "Bengaluru Central": "#e11d48", // Rose
    "Bengaluru East": "#2563eb",    // Blue
    "Bengaluru West": "#16a34a",    // Green
    "Bengaluru North": "#9333ea",   // Purple
    "Bengaluru South": "#ea580c"    // Orange
  };
  return colors[corporation] || "#000000";
};

// --- CUSTOM CLUSTER ICON ---
const createClusterIcon = (corporation, count) => {
  const color = getCorpColor(corporation);
  
  return L.divIcon({
    html: `
      <div style="background-color: ${color}; opacity: 0.9;" class="relative w-10 h-10 rounded-full border-[3px] border-white shadow-xl flex items-center justify-center">
        <span class="text-white font-bold text-sm">${corporation.split(" ")[1]?.charAt(0) || "C"}</span>
        
        <div class="absolute -top-2 -right-2 bg-white text-black font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-gray-800 shadow-sm z-10">
          ${count}
        </div>
      </div>
    `,
    className: '', 
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], 15, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

// --- TRACK ZOOM LEVEL ---
const MapController = ({ onZoomChange }) => {
  const map = useMapEvents({
    zoomend: () => onZoomChange(map.getZoom()),
  });
  
  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);
  
  return null;
};


const MapView = ({ areas, selectedLocation, onMarkerClick }) => {
  // State for hybrid zoom logic
  const [currentZoom, setCurrentZoom] = useState(11);
  const MAX_ZOOM = 18; 
  const zoomPercentage = Math.round((currentZoom / MAX_ZOOM) * 100);

  // Group areas by corporation for the zoomed-out view
  const zoneClusters = useMemo(() => {
    if (!areas || areas.length === 0) return [];

    const groups = areas.reduce((acc, area) => {
      const corp = area.corporation || 'Unknown';
      if (!acc[corp]) acc[corp] = { count: 0, latSum: 0, lngSum: 0 };
      
      acc[corp].count += 1;
      acc[corp].latSum += area.lat;
      acc[corp].lngSum += area.lng;
      return acc;
    }, {});

    return Object.keys(groups).map(corp => ({
      corporation: corp,
      count: groups[corp].count,
      centerLat: groups[corp].latSum / groups[corp].count,
      centerLng: groups[corp].lngSum / groups[corp].count
    }));
  }, [areas]);

  // THRESHOLD: Zoomed out (<= 11) shows clusters. Zoomed in (> 11) shows original pins.
  const isZoomedOut = currentZoom <= 11;

  return (
    <div className="w-full h-full z-0 relative">
      
      {/* ZOOM PERCENTAGE */}
      <div className="absolute top-[12px] left-[60px] z-[1000] bg-white px-2 py-1 rounded shadow-md border border-gray-300 pointer-events-auto">
        <span className="text-sm font-bold text-gray-700">{zoomPercentage}%</span>
      </div>

      <MapContainer center={[12.9716, 77.5946]} zoom={11} className="w-full h-full">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">Carto</a>'
        />
        
        {}
        <MapController onZoomChange={setCurrentZoom} />
        
        {selectedLocation && <MapUpdater center={selectedLocation} />}

        {/* --- HYBRID RENDERING LOGIC --- */}
        {isZoomedOut ? (
          // 1. ZOOMED OUT: Render custom grouped clusters
          zoneClusters.map((cluster, idx) => (
            <Marker
              key={`cluster-${idx}`}
              position={[cluster.centerLat, cluster.centerLng]}
              icon={createClusterIcon(cluster.corporation, cluster.count)}
            >
              <Popup>
                <strong>{cluster.corporation}</strong><br/>
                Total Areas: {cluster.count}
              </Popup>
            </Marker>
          ))
        ) : (
          // 2. ZOOMED IN: Render CircleMarkers
          areas.map((area, idx) => (
            <CircleMarker
              key={`area-${idx}`}
              center={[area.lat, area.lng]}
              radius={8}
              pathOptions={{ 
                color: getCorpColor(area.corporation), 
                fillColor: getCorpColor(area.corporation), 
                fillOpacity: 0.7 
              }}
              eventHandlers={{
                click: () => onMarkerClick(area),
              }}
            >
              <Popup>
                <strong>{area.area}</strong><br/>
                Pincode: {area.pincode}<br/>
                {area.corporation}
              </Popup>
            </CircleMarker>
          ))
        )}

        {/* Highlight selected marker */}
        {selectedLocation && !isZoomedOut && (
           <CircleMarker
           center={[selectedLocation.lat, selectedLocation.lng]}
           radius={15}
           pathOptions={{ color: '#000', weight: 2, fillColor: 'yellow', fillOpacity: 0.5 }}
         />
        )}
      </MapContainer>
      
      {}
      <div className="absolute bottom-8 right-4 bg-white p-4 rounded shadow-lg z-[1000] text-sm pointer-events-auto">
        <h4 className="font-bold mb-2">Corporations (2026)</h4>
        {["Bengaluru Central", "Bengaluru East", "Bengaluru West", "Bengaluru North", "Bengaluru South"].map(corp => (
          <div key={corp} className="flex items-center mb-1">
            <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: getCorpColor(corp) }}></span>
            {corp}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapView;