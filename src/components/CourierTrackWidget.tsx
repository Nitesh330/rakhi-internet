import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SeventeenTrackWidget from './SeventeenTrackWidget';
import { Plane, Search, Package, Clock, ShieldCheck, ExternalLink, MapPin, CheckCircle2, ArrowRight, Info, HelpCircle } from 'lucide-react';

interface TrackingEvent {
  status: string;
  location: string;
  date: string;
  time: string;
  description: string;
  completed: boolean;
}

const PARTNERS = [
  { id: 'auto', name: 'Auto Detect (Global)', logo: '🌐 Any', url: (id: string) => `https://t.17track.net/en#nums=${id}` },
  { id: 'dhl', name: 'DHL Express', logo: '🔴 DHL', url: (id: string) => `https://www.dhl.com/in-en/home/tracking/tracking-express.html?submit=1&tracking-id=${id}` },
  { id: 'fedex', name: 'FedEx Priority', logo: '🟣 FedEx', url: (id: string) => `https://www.fedex.com/apps/fedextrack/?tracknumbers=${id}` },
  { id: 'ups', name: 'UPS Worldwide', logo: '🟤 UPS', url: (id: string) => `https://www.ups.com/track?loc=en_IN&tracknum=${id}` },
  { id: 'aramex', name: 'Aramex International', logo: '🔴 Aramex', url: (id: string) => `https://www.aramex.com/express/track-results?trackNumber=${id}` },
  { id: 'delhivery', name: 'Delhivery International', logo: '⚫ Delhivery', url: (id: string) => `https://www.delhivery.com/track/package/${id}` },
  { id: 'bluedart', name: 'BlueDart Express', logo: '🔵 BlueDart', url: (id: string) => `https://t.17track.net/en#nums=${id}` },
  { id: 'dtdc', name: 'DTDC Courier', logo: '🔵 DTDC', carrierCode: '190014', url: (id: string) => `https://t.17track.net/en#nums=${id}` },
  { id: 'indiapost', name: 'India Post Speed Post', logo: '🇮🇳 India Post', carrierCode: '190013', url: (id: string) => `https://t.17track.net/en#nums=${id}` }
];


const RakhiAirplane = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 1200 500" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fuse-top" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#f8fafc" />
        <stop offset="80%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
      
      <linearGradient id="fuse-belly" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1e3a8a" />
        <stop offset="70%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      
      <linearGradient id="tail" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e40af" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </linearGradient>
      
      <linearGradient id="wing" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f1f5f9" />
        <stop offset="50%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
      
      <linearGradient id="engine" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>

      <linearGradient id="glass" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>

      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="15" dy="35" stdDeviation="20" floodColor="#000000" floodOpacity="0.3"/>
      </filter>
    </defs>

    <g filter="url(#shadow)" transform="translate(50, 50) rotate(-4 500 200)">
      
      {/* Background Wing (Left Wing) */}
      <path d="M 650 160 L 470 90 L 450 95 L 550 170 Z" fill="url(#wing)" />
      
      {/* Background Engine */}
      <path d="M 550 130 C 570 145, 550 155, 530 140 L 510 120 C 500 110, 520 100, 530 115 Z" fill="url(#engine)" />

      {/* Fuselage Belly (Dark Blue) */}
      <path d="
        M 1050 160
        C 1000 165, 850 165, 550 165
        C 350 165, 200 145, 100 120
        C 130 150, 250 185, 400 195
        C 650 210, 950 200, 1050 160 Z" fill="url(#fuse-belly)" />
        
      {/* Fuselage Top (White) */}
      <path d="
        M 1050 160
        C 1060 130, 1000 110, 850 110
        L 350 110
        C 200 110, 120 115, 100 120
        C 200 145, 350 165, 550 165
        C 850 165, 1000 165, 1050 160 Z" fill="url(#fuse-top)" />

      {/* Top Highlight for 3D realism */}
      <path d="
        M 1030 140
        C 1000 115, 850 115, 350 115
        C 250 115, 170 120, 150 125
        C 250 125, 850 125, 1030 140 Z" fill="#ffffff" opacity="0.6" />

      {/* Cockpit Windows */}
      <path d="M 1035 140 C 1020 125, 1000 125, 980 135 L 980 145 C 1000 140, 1020 140, 1035 145 Z" fill="url(#glass)" />
      <path d="M 1020 137 L 1020 145" stroke="#94a3b8" strokeWidth="1.5" />
      <path d="M 1000 137 L 1000 145" stroke="#94a3b8" strokeWidth="1.5" />

      {/* Tail (Vertical Stabilizer) */}
      <path d="M 300 110 L 220 10 L 170 10 L 130 115 Z" fill="url(#tail)" />
      
      {/* Tail accents */}
      <path d="M 200 10 L 190 10 L 160 115 L 170 115 Z" fill="#0ea5e9" opacity="0.8"/>
      <path d="M 180 10 L 170 10 L 140 115 L 150 115 Z" fill="#ffffff" opacity="0.5"/>
      <circle cx="230" cy="50" r="3" fill="#ffffff" opacity="0.8"/>
      <circle cx="210" cy="80" r="4" fill="#ffffff" opacity="0.6"/>
      <circle cx="250" cy="80" r="2" fill="#ffffff" opacity="0.9"/>
      
      {/* Right Horizontal Stabilizer */}
      <path d="M 180 120 L 100 90 L 80 95 L 160 130 Z" fill="url(#wing)" />

      {/* Passenger Windows */}
      <path d="M 920 140 C 750 140, 550 135, 350 130" fill="none" stroke="url(#glass)" strokeWidth="4" strokeDasharray="6 12" />

      {/* Doors */}
      <rect x="950" y="125" width="8" height="22" rx="2" fill="none" stroke="#64748b" strokeWidth="1.5" />
      <rect x="700" y="123" width="8" height="22" rx="2" fill="none" stroke="#64748b" strokeWidth="1.5" />
      <rect x="400" y="118" width="8" height="22" rx="2" fill="none" stroke="#64748b" strokeWidth="1.5" />

      {/* IndiGo Logo Text */}
      <text x="500" y="135" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="32" fill="#1e3a8a" fontStyle="italic" letterSpacing="0">RakhiInternet</text>

      {/* Foreground Wing (Right Wing) */}
      <path d="M 650 165 C 500 280, 300 360, 300 360 L 330 370 C 450 300, 750 165, 750 165 Z" fill="url(#wing)" />
      
      {/* Winglet */}
      <path d="M 300 360 L 280 320 L 295 315 L 320 365 Z" fill="url(#tail)" />

      {/* Foreground Engine */}
      <path d="M 520 210 L 480 240 L 500 245 L 540 210 Z" fill="#94a3b8" />
      <path d="M 530 250 L 450 260 C 430 260, 430 290, 450 290 L 540 280 Z" fill="url(#engine)" />
      <ellipse cx="450" cy="275" rx="8" ry="20" fill="#0f172a" transform="rotate(-5 450 275)" />
      <ellipse cx="450" cy="275" rx="3" ry="8" fill="#94a3b8" transform="rotate(-5 450 275)" />
      <path d="M 460 258 L 470 258 L 470 288 L 460 289 Z" fill="#1e3a8a" />
      
      {/* Lights */}
      <circle cx="300" cy="360" r="4" fill="#10b981" />
      <circle cx="90" cy="120" r="3" fill="#ffffff" />
      <circle cx="1050" cy="160" r="3" fill="#ffffff" />
    </g>
  </svg>
);

export default function CourierTrackWidget() {
  const [trackingId, setTrackingId] = useState('');
  const [carrier, setCarrier] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    
    setLoading(true);
    const selectedPartnerObj = PARTNERS.find(p => p.id === carrier) || PARTNERS[0];
    
    setTimeout(() => {
        setResultUrl(selectedPartnerObj.url(trackingId.trim()));
        setLoading(false);
    }, 7000);
  };

  const selectedPartnerObj = PARTNERS.find(p => p.id === carrier) || PARTNERS[0];

  return (
    <div className="w-full relative">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden"
          >
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <motion.div
                initial={{ x: '-100vw', y: 150, rotate: 10, scale: 0.7 }}
                animate={{ 
                  x: [ '-100vw', '0vw', '5vw', '120vw' ], 
                  y: [ 150, 0, -10, -250 ],
                  rotate: [ 10, 0, 0, -5 ],
                  scale: [ 0.7, 1.1, 1.1, 0.8 ]
                }}
                transition={{ duration: 8, ease: "easeInOut", times: [0, 0.4, 0.7, 1] }}
                className="text-emerald-600 flex justify-center items-center w-full absolute inset-0 z-50 pointer-events-none"
              >
                <RakhiAirplane className="w-[350px] sm:w-[500px] md:w-[750px] lg:w-[950px] h-auto drop-shadow-2xl" />
              </motion.div>
              
              {/* Sky and clouds background effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-sky-100 to-sky-300 opacity-80 z-[-1]" />
              
              <motion.div 
                initial={{ x: '100vw' }} animate={{ x: '-100vw' }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                className="absolute top-[20%] z-0"
              >
                <svg width="150" height="100" viewBox="0 0 150 100" fill="white" className="drop-shadow-lg opacity-80"><path d="M 40 50 C 40 20, 80 20, 100 40 C 130 40, 140 70, 110 80 L 30 80 C 10 80, 10 50, 40 50 Z" /></svg>
              </motion.div>

              <motion.div 
                initial={{ x: '100vw' }} animate={{ x: '-100vw' }}
                transition={{ duration: 35, delay: 0.5, repeat: Infinity, ease: 'linear' }}
                className="absolute top-[50%] z-0 scale-75"
              >
                <svg width="150" height="100" viewBox="0 0 150 100" fill="white" className="drop-shadow-md opacity-60"><path d="M 50 60 C 50 30, 90 30, 110 50 C 140 50, 150 80, 120 90 L 40 90 C 20 90, 20 60, 50 60 Z" /></svg>
              </motion.div>
              
              <motion.div 
                initial={{ x: '100vw' }} animate={{ x: '-100vw' }}
                transition={{ duration: 50, delay: 1, repeat: Infinity, ease: 'linear' }}
                className="absolute top-[70%] z-20 scale-125"
              >
                <svg width="150" height="100" viewBox="0 0 150 100" fill="white" className="drop-shadow-xl opacity-90"><path d="M 60 70 C 60 40, 100 40, 120 60 C 150 60, 160 90, 130 100 L 50 100 C 30 100, 30 70, 60 70 Z" /></svg>
              </motion.div>

              
              
              {/* Cloud animations */}
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="text-center max-w-xl mx-auto mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Track Your Shipment</h3>
        <p className="text-sm text-gray-600">
          Enter your unique Tracking AWB number to check real-time courier statuses, delivery milestones, and dispatch details.
        </p>
      </div>

      {/* Input Form */}
      
      {resultUrl ? (
        <div className="bg-white p-8 rounded-2xl border border-emerald-200 shadow-sm max-w-2xl mx-auto mb-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Tracking Result Ready</h3>
          <p className="text-slate-500 mb-6">Your package information has been located on the carrier's network.</p>
          <div className="flex gap-4 justify-center">
            <button type="button" onClick={() => setResultUrl(null)} className="px-6 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors border border-transparent">Track Another</button>
            <a href={resultUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 inline-flex items-center gap-2">View Live Status <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleTrack} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm max-w-2xl mx-auto mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Select Carrier Partner</label>
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            >
              {PARTNERS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Tracking ID / AWB Number</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. DHL9834281"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-gray-400"
                required
              />
              <Package className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-400" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              Querying Tracking Servers...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" /> Track Consignment Status
            </>
          )}
        </button>
      </form>
      )}
    </div>
  );
}
