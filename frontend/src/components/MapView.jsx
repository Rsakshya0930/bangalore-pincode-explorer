import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';

// Corporation color mapping [cite: 20]
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

// Component to handle pan/zoom smoothly [cite: 63]
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], 15, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

const MapView = ({ areas, selectedLocation, onMarkerClick }) => {
  return (
    <div className="w-full h-full z-0 relative">
      <MapContainer center={[12.9716, 77.5946]} zoom={11} className="w-full h-full">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">Carto</a>'
        />
        
        {selectedLocation && <MapUpdater center={selectedLocation} />}

        {areas.map((area, idx) => (
          <CircleMarker
            key={idx}
            center={[area.lat, area.lng]}
            radius={8}
            pathOptions={{ color: getCorpColor(area.corporation), fillColor: getCorpColor(area.corporation), fillOpacity: 0.7 }}
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
        ))}

        {/* Highlight selected marker [cite: 25] */}
        {selectedLocation && (
           <CircleMarker
           center={[selectedLocation.lat, selectedLocation.lng]}
           radius={15}
           pathOptions={{ color: '#000', weight: 2, fillColor: 'yellow', fillOpacity: 0.5 }}
         />
        )}
      </MapContainer>
      
      {/* Map Legend [cite: 21, 64] */}
      <div className="absolute bottom-8 right-4 bg-white p-4 rounded shadow-lg z-[1000] text-sm">
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