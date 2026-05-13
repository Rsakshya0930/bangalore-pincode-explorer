import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from './components/MapView';
import SearchBar from './components/Searchbar';
import InfoPanel from './components/InfoPanel';
import Sidebar from './components/Sidebar';

const App = () => {
  const [areas, setAreas] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState('');

  // Fetch all areas on load from the live Render API
  useEffect(() => {
    axios.get('https://bangalore-pincode-explorer-backend.onrender.com/api/areas')
      .then(res => setAreas(res.data))
      .catch(err => console.error("Error fetching areas:", err));
  }, []);

  const handleSearch = async (query, type) => {
    setError('');
    try {
      const url = type === 'pincode' 
        ? `https://bangalore-pincode-explorer-backend.onrender.com/api/lookup?pincode=${query}`
        : `https://bangalore-pincode-explorer-backend.onrender.com/api/lookup?area=${query}`;
      
      const res = await axios.get(url);
      setSelectedLocation(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Location not found');
      setSelectedLocation(null);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans">
      <Sidebar areas={areas} onSelect={(area) => setSelectedLocation(area)} />
      
      <div className="flex flex-col flex-grow relative">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-11/12 max-w-md">
          <SearchBar onSearch={handleSearch} />
          {error && <div className="mt-2 p-2 bg-red-100 text-red-700 rounded shadow">{error}</div>}
        </div>

        <MapView areas={areas} selectedLocation={selectedLocation} onMarkerClick={setSelectedLocation} />
        
        {selectedLocation && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[1000]">
            <InfoPanel data={selectedLocation} onClose={() => setSelectedLocation(null)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;