
import React, { useState } from 'react';
import { Salon } from '../types';

interface BookingModalProps {
  salon: Salon;
  onClose: () => void;
  onConfirm: (service: string, date: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ salon, onClose, onConfirm }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [selectedService, setSelectedService] = useState(salon.services[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate network delay
    setTimeout(() => {
      onConfirm(selectedService, selectedDate);
      setIsSubmitting(false);
      setStep('success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div 
        className="w-full max-w-[480px] bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 'form' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Request Appointment</h3>
                <p className="text-sm text-gray-500">with {salon.name}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                ✕
              </button>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Select Service</label>
                <div className="grid grid-cols-2 gap-2">
                  {salon.services.map(service => (
                    <button
                      key={service}
                      onClick={() => setSelectedService(service)}
                      className={`p-3 text-xs font-semibold rounded-xl border transition-all ${
                        selectedService === service 
                          ? 'border-teal-600 bg-teal-50 text-teal-700' 
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Preferred Date</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center ${
                isSubmitting ? 'bg-gray-400 text-white' : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : 'Confirm Request'}
            </button>
            <p className="mt-4 text-[10px] text-center text-gray-400 uppercase tracking-tight">
              Request is sent via SCU platform. No payment is required yet.
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
            <p className="text-sm text-gray-500 mb-8 max-w-[250px] mx-auto">
              Your request for <strong>{selectedService}</strong> at <strong>{salon.name}</strong> has been submitted.
            </p>
            <button
              onClick={onClose}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all"
            >
              Back to Salons
            </button>
            <p className="mt-4 text-[10px] text-gray-400 uppercase font-bold">
              Check "Profile" for updates
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
