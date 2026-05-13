import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Determine search type: numbers = pincode, text = area
    const isPincode = /^\d+$/.test(query.trim());
    onSearch(query.trim(), isPincode ? 'pincode' : 'area');
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full bg-white rounded-full shadow-lg overflow-hidden">
      <input
        type="text"
        className="flex-grow px-6 py-4 outline-none text-gray-700"
        placeholder="Search by area name or 6-digit pincode..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="px-6 bg-blue-600 hover:bg-blue-700 text-white transition">
        <Search size={20} />
      </button>
    </form>
  );
};

export default SearchBar;