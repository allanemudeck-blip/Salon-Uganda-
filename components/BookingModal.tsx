
import React, { useState } from 'react';
import { Salon, UserProfile } from '../types';
import { PLATFORM_INFO } from '../constants';

interface BookingModalProps {
  salon: Salon;
  userProfile: UserProfile;
  onClose: () => void;
  onConfirm: (service: string, date: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ salon, userProfile, onClose, onConfirm }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [selectedService, setSelectedService] = useState(salon.services[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    const message = `Hello Salon Connect Uganda 👋
I would like to book an appointment.
Name: ${userProfile.name}
Phone: ${userProfile.phone}
Service: ${selectedService}
Salon: ${salon.name} (${salon.location})
Date: ${selectedDate}
Time: ${selectedTime}
Thank you.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = PLATFORM_INFO.whatsappSupport.replace(/\s+/g, '').replace('+', '');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Simulate network delay before opening WhatsApp
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      onConfirm(selectedService, selectedDate);
      setIsSubmitting(false);
      setStep('success');
    }, 1000);
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Preferred Date</label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Preferred Time</label>
                  <input 
                    type="time" 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center ${
                isSubmitting ? 'bg-gray-400 text-white' : 'bg-[#25D366] text-white hover:bg-[#128C7E]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </>
              ) : (
                <div className="flex items-center">
                  <span className="mr-2">Book via WhatsApp</span>
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.187-2.59-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.984-.365-1.739-.757-2.874-2.513-2.96-2.63-.086-.115-.693-.921-.693-1.756 0-.835.432-1.245.586-1.42.154-.175.335-.219.446-.219.111 0 .223.002.32.006.1.004.235-.038.368.283.133.321.455 1.104.495 1.185.04.081.067.175.013.283-.053.108-.08.187-.16.283-.079.096-.167.214-.24.283-.087.081-.177.169-.076.342.101.173.447.737.958 1.192.658.585 1.21.767 1.383.854.173.087.274.072.376-.045.102-.117.434-.506.551-.679.117-.173.235-.145.394-.087.16.059 1.014.478 1.187.566.173.088.289.132.332.206.043.074.043.431-.101.836z" />
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964 1-3.61c-.666-1.057-1.017-2.28-1.017-3.533.002-3.733 3.041-6.771 6.774-6.771 1.808 0 3.507.705 4.786 1.983a6.721 6.721 0 0 1 1.986 4.791c-.001 3.733-3.041 6.772-6.774 6.772z" />
                  </svg>
                </div>
              )}
            </button>
            <p className="mt-4 text-[10px] text-center text-gray-400 uppercase tracking-tight">
              A pre-filled booking message will open in WhatsApp. No app-based payment is required.
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Redirecting to WhatsApp</h3>
            <p className="text-sm text-gray-500 mb-8 max-w-[250px] mx-auto">
              Please send the pre-filled message to <strong>{salon.name}</strong> support to finalize your booking.
            </p>
            <button
              onClick={onClose}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all"
            >
              Return to App
            </button>
            <p className="mt-4 text-[10px] text-gray-400 uppercase font-bold">
              Check "Profile" for booking history
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
