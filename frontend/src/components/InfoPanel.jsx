import React from 'react';
import { X, MapPin } from 'lucide-react';

const InfoPanel = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 min-w-[300px] border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{data.area}</h2>
          <p className="text-gray-500 font-mono text-lg">{data.pincode}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      <div className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md w-fit">
        <MapPin size={16} className="mr-1.5" />
        {data.corporation}
      </div>
    </div>
  );
};

export default InfoPanel;