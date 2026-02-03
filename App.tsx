
import React, { useState, useRef } from 'react';
import { AppView, Salon, BookingRequest, UserProfile } from './types';
import { MOCK_SALONS, UGANDAN_CITIES, PLATFORM_INFO } from './constants';
import { Navigation } from './components/Navigation';
import { SalonCard } from './components/SalonCard';
import { BookingModal } from './components/BookingModal';
import { generateStylePreview } from './services/geminiService';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [searchCity, setSearchCity] = useState<string>('');
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Customer Name',
    phone: '+256 ',
    location: 'Kampala'
  });

  // Booking Flow State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);

  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewResult, setPreviewResult] = useState<string | null>(null);

  // Voice Assistant State
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [assistantText, setAssistantText] = useState('');
  const sessionRef = useRef<any>(null);
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const filteredSalons = searchCity 
    ? MOCK_SALONS.filter(s => s.city.toLowerCase() === searchCity.toLowerCase())
    : MOCK_SALONS;

  // --- Voice Assistant Implementation ---

  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const encodeToBase64 = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const toggleVoiceAssistant = async () => {
    if (isVoiceActive) {
      stopVoiceAssistant();
      return;
    }

    setIsConnecting(true);
    setAssistantText('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const apiKey = (process.env as any).API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });
      
      const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      audioContextInRef.current = new AudioCtx({ sampleRate: 16000 });
      audioContextOutRef.current = new AudioCtx({ sampleRate: 24000 });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: `You are Salon Connect Voice Assistant. Act as a real human salon receptionist in Uganda.
Sound calm, friendly, professional, and confident. Use simple English. 
Guide the client through booking hair braiding, makeup, or nails.
Confirm details and reassure them that the salon will contact them shortly.`
        },
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsVoiceActive(true);
            if (!audioContextInRef.current) return;
            const source = audioContextInRef.current.createMediaStreamSource(stream);
            const scriptProcessor = audioContextInRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob: Blob = {
                data: encodeToBase64(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setAssistantText(prev => prev + message.serverContent!.outputTranscription!.text);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextOutRef.current) {
              const ctx = audioContextOutRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              activeSourcesRef.current.add(source);
              source.onended = () => activeSourcesRef.current.delete(source);
            }
            if (message.serverContent?.interrupted) {
              activeSourcesRef.current.forEach(s => {
                try { s.stop(); } catch (e) {}
              });
              activeSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: () => stopVoiceAssistant(),
          onclose: () => stopVoiceAssistant()
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      setIsConnecting(false);
    }
  };

  const stopVoiceAssistant = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextInRef.current) {
      audioContextInRef.current.close();
      audioContextInRef.current = null;
    }
    if (audioContextOutRef.current) {
      audioContextOutRef.current.close();
      audioContextOutRef.current = null;
    }
    activeSourcesRef.current.forEach(s => {
      try { s.stop(); } catch (e) {}
    });
    activeSourcesRef.current.clear();
    setIsVoiceActive(false);
    setIsConnecting(false);
    setAssistantText('');
  };

  // --- End of Voice Assistant ---

  const handleOpenBooking = (salon: Salon) => {
    setSelectedSalon(salon);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (service: string, date: string) => {
    if (!selectedSalon) return;

    const newBooking: BookingRequest = {
      id: Math.random().toString(36).substring(2, 9),
      salonId: selectedSalon.id,
      salonName: selectedSalon.name,
      service: service,
      date: date,
      status: 'pending'
    };
    
    setBookings([newBooking, ...bookings]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAiImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAiPreview = async () => {
    if (!aiPrompt) return alert('Please describe the style you want to visualize.');
    setIsGenerating(true);
    const result = await generateStylePreview(aiPrompt, aiImage || undefined);
    if (result) {
      setPreviewResult(result);
    } else {
      alert('The designer is currently busy. Please try again in a moment.');
    }
    setIsGenerating(false);
  };

  const renderHome = () => (
    <div className="p-6 pt-12 text-center flex flex-col items-center">
      <div className="w-20 h-20 bg-teal-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg shadow-teal-100">
        SCU
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Salon Connect Uganda</h1>
      <p className="text-teal-600 font-medium tracking-widest uppercase text-xs mb-8">Discover. Compare. Book.</p>
      
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-10 text-left">
        <p className="text-gray-600 leading-relaxed text-sm">
          Salon Connect Uganda is a digital platform that helps customers discover salons and allows salon owners to list their services and receive booking requests.
        </p>
      </div>

      <div className="w-full space-y-4">
        <button 
          onClick={() => setCurrentView(AppView.FIND_SALONS)}
          className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition-all shadow-md active:scale-[0.98]"
        >
          Find a Salon
        </button>
        <button 
          onClick={() => window.open(`mailto:${PLATFORM_INFO.supportEmail}`)}
          className="w-full bg-white border-2 border-teal-600 text-teal-600 py-4 rounded-xl font-bold text-lg hover:bg-teal-50 transition-all active:scale-[0.98]"
        >
          List Your Salon
        </button>
      </div>

      <p className="mt-12 text-[10px] text-gray-400 max-w-xs uppercase tracking-tighter">
        All services are provided by independent salon owners. Salon Connect Uganda does not own or operate salons.
      </p>
    </div>
  );

  const renderFindSalons = () => (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Salons on the platform</h2>
      
      <div className="mb-6">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Filter by City</label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setSearchCity('')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${!searchCity ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-500 border-gray-200'}`}
          >
            All Cities
          </button>
          {UGANDAN_CITIES.map(city => (
            <button 
              key={city}
              onClick={() => setSearchCity(city)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${searchCity === city ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-500 border-gray-200'}`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {filteredSalons.length > 0 ? (
        <div className="space-y-4">
          {filteredSalons.map(salon => (
            <SalonCard key={salon.id} salon={salon} onRequestBooking={handleOpenBooking} />
          ))}
        </div>
      ) : (
        <div className="bg-blue-50 p-8 rounded-2xl text-center border border-blue-100">
          <p className="text-blue-800 font-medium mb-1">Salons are joining your area.</p>
          <p className="text-blue-600 text-xs">Check back soon or invite your favorite salon.</p>
        </div>
      )}
    </div>
  );

  const renderAiPreview = () => (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Style Designer</h2>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
        <p className="text-xs text-gray-600 leading-relaxed">
          Use the designer to visualize how a new style might look on you. You can share these visualizations with salon owners to help them understand exactly what you're looking for.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Step 1: Upload Reference (Optional)</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          />
          {aiImage && <img src={aiImage} className="mt-2 w-20 h-20 object-cover rounded-lg border" alt="preview" />}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Step 2: Describe the Style</label>
          <textarea 
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g. Cornrow braids with a twist at the back, colored extensions..."
            className="w-full p-4 border rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none min-h-[100px]"
          />
        </div>

        <button 
          onClick={handleAiPreview}
          disabled={isGenerating}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isGenerating ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg active:scale-95'}`}
        >
          {isGenerating ? 'Designing...' : 'Visualize Style ✨'}
        </button>

        {previewResult && (
          <div className="mt-8 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xl p-4">
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">✨</span> Your Visualization
            </h3>
            <img src={previewResult} className="w-full aspect-square object-cover rounded-lg mb-4" alt="Designed result" />
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = previewResult;
                link.download = 'style-designer-output.png';
                link.click();
              }}
              className="text-teal-600 text-sm font-semibold flex items-center justify-center w-full py-2 bg-teal-50 rounded-lg"
            >
              📥 Save to Device
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6">My Profile</h2>
      
      <div className="bg-white border rounded-2xl p-6 mb-8 space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
          <input 
            type="text" 
            value={userProfile.name}
            onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
            className="w-full text-sm font-medium text-gray-800 border-b border-gray-100 pb-1 focus:outline-none focus:border-teal-500"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
          <input 
            type="text" 
            value={userProfile.phone}
            onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
            className="w-full text-sm font-medium text-gray-800 border-b border-gray-100 pb-1 focus:outline-none focus:border-teal-500"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase">Location</label>
          <select 
            value={userProfile.location}
            onChange={(e) => setUserProfile({...userProfile, location: e.target.value})}
            className="w-full text-sm font-medium text-gray-800 bg-transparent py-1 border-b border-gray-100 focus:outline-none"
          >
            {UGANDAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Recent Bookings</h3>
        {bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b.id} className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800 text-sm">{b.salonName}</p>
                  <p className="text-xs text-gray-500">{b.service} • {b.date}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                  b.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                }`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No recent booking requests.</p>
        )}
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Contact & Support</h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="bg-white border rounded-xl p-4 flex items-center">
            <span className="mr-3 text-xl">📧</span>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Support Email</p>
              <a href={`mailto:${PLATFORM_INFO.supportEmail}`} className="text-sm text-teal-600 font-semibold">{PLATFORM_INFO.supportEmail}</a>
            </div>
          </div>

          <div className="bg-white border rounded-xl p-4 flex items-center">
            <span className="mr-3 text-xl">💬</span>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">WhatsApp Support</p>
              <a href={`https://wa.me/${PLATFORM_INFO.whatsappSupport.replace(/\s+/g, '')}`} className="text-sm text-teal-600 font-semibold">{PLATFORM_INFO.whatsappSupport}</a>
            </div>
          </div>

          <div className="bg-white border rounded-xl p-4 flex items-center">
            <span className="mr-3 text-xl">📞</span>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Partner Inquiry</p>
              <a href={`tel:${PLATFORM_INFO.inquiryContact.replace(/\s+/g, '')}`} className="text-sm text-teal-600 font-semibold">{PLATFORM_INFO.inquiryContact}</a>
            </div>
          </div>
        </div>

        <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100">
          <p className="text-xs text-teal-800 leading-relaxed mb-4">
            For app support or salon partnership inquiries, contact Salon Connect Uganda.
          </p>
          <p className="text-[11px] text-teal-700 font-medium">
            Salon Connect Uganda is a digital platform connecting customers with independent salons.
          </p>
          <p className="text-[11px] text-teal-900 font-bold mt-2">
            We do not own or operate salons.
          </p>
        </div>

        <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest mt-12">
          © 2024 Salon Connect Uganda
        </p>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case AppView.HOME: return renderHome();
      case AppView.FIND_SALONS: return renderFindSalons();
      case AppView.AI_PREVIEW: return renderAiPreview();
      case AppView.PROFILE: return renderProfile();
      case AppView.CONTACT: return renderContact();
      default: return renderHome();
    }
  };

  return (
    <div className="mobile-container flex flex-col pb-20 relative">
      <main className="flex-1 overflow-y-auto">
        {renderCurrentView()}
      </main>
      
      <Navigation currentView={currentView} onNavigate={setCurrentView} />

      {/* Voice Assistant Floating Interface */}
      <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end pointer-events-none">
        {isVoiceActive && assistantText && (
          <div className="max-w-[280px] bg-white p-4 rounded-2xl shadow-xl border border-teal-100 mb-4 animate-in fade-in slide-in-from-bottom-4 pointer-events-auto">
            <p className="text-xs text-gray-800 leading-relaxed font-medium">
              {assistantText}
            </p>
          </div>
        )}
        
        <div className="flex items-center gap-3 pointer-events-auto">
          {isVoiceActive && (
            <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border border-teal-100 flex items-center gap-2 animate-in slide-in-from-right-4">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-150"></span>
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-300"></span>
              </span>
              <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">Listening...</p>
            </div>
          )}
          
          <button
            onClick={toggleVoiceAssistant}
            disabled={isConnecting}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 ${
              isVoiceActive 
                ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-100' 
                : 'bg-teal-600 text-white hover:bg-teal-700'
            } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isConnecting ? (
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              isVoiceActive ? '⏹' : '🎤'
            )}
          </button>
        </div>
      </div>

      {isBookingModalOpen && selectedSalon && (
        <BookingModal 
          salon={selectedSalon} 
          onClose={() => setIsBookingModalOpen(false)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};

export default App;
