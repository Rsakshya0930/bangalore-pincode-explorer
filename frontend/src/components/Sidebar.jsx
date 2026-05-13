import React, { useState } from 'react';

const Sidebar = ({ areas, onSelect }) => {
  const [filter, setFilter] = useState('');

  const filteredAreas = areas.filter(a => a.area.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="w-80 bg-white shadow-xl flex flex-col z-10 hidden md:flex">
      <div className="p-6 bg-blue-600 text-white">
        <h1 className="text-xl font-bold">Bangalore Explorer</h1>
        <p className="text-blue-100 text-sm mt-1">2026 Municipal Map</p>
      </div>
      
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Filter areas..."
          className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="flex-grow overflow-y-auto">
        {filteredAreas.map((area, idx) => (
          <div 
            key={idx} 
            onClick={() => onSelect(area)}
            className="p-4 border-b hover:bg-gray-50 cursor-pointer transition"
          >
            <div className="font-semibold text-gray-800">{area.area}</div>
            <div className="text-xs text-gray-500 flex justify-between mt-1">
              <span>{area.corporation}</span>
              <span className="font-mono">{area.pincode}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;