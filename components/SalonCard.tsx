
import React from 'react';
import { Salon } from '../types';

interface SalonCardProps {
  salon: Salon;
  onRequestBooking: (salon: Salon) => void;
}

export const SalonCard: React.FC<SalonCardProps> = ({ salon, onRequestBooking }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm mb-4 transition-transform active:scale-[0.98]">
      <img src={salon.imageUrl} alt={salon.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg text-gray-800">{salon.name}</h3>
          <div className="flex items-center bg-yellow-50 px-2 py-0.5 rounded">
            <span className="text-yellow-600 text-xs font-bold mr-1">★</span>
            <span className="text-xs font-semibold text-yellow-700">{salon.rating}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-2">{salon.location}, {salon.city}</p>
        <p className="text-xs font-medium text-teal-600 mb-3 bg-teal-50 inline-block px-2 py-1 rounded">
          {salon.category}
        </p>
        <div className="flex flex-wrap gap-1 mb-4">
          {salon.services.map((s, idx) => (
            <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {s}
            </span>
          ))}
        </div>
        <button
          onClick={() => onRequestBooking(salon)}
          className="w-full bg-teal-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-teal-700 transition-colors"
        >
          Request Appointment
        </button>
      </div>
    </div>
  );
};
