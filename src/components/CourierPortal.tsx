import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Package, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Info, 
  Plane, 
  Calculator, 
  Table, 
  Sliders, 
  Navigation,
  Sparkles,
  Phone,
  HelpCircle,
  Truck
} from 'lucide-react';

interface TrackingEvent {
  status: string;
  location: string;
  date: string;
  time: string;
  description: string;
  completed: boolean;
}

// Brand Logo Components
const DTDCLogo = () => (
  <svg viewBox="0 0 120 40" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 8 L22 20 L5 32 L11 20 Z" fill="#009933" />
    <path d="M12 8 L29 20 L12 32 L18 20 Z" fill="#0D2C6C" />
    <text x="36" y="26" fill="#0D2C6C" fontSize="19" fontWeight="900" fontFamily="system-ui, sans-serif" fontStyle="italic" letterSpacing="-0.5">DTDC</text>
  </svg>
);

const FedExLogo = () => (
  <div className="flex items-center justify-center h-6 font-sans font-black tracking-tight text-base select-none">
    <span className="text-[#4D148C]">Fed</span>
    <span className="text-[#FF6200] bg-[#FF6200]/5 px-1 py-0.5 rounded-sm">Ex</span>
  </div>
);

const UPSLogo = () => (
  <svg viewBox="0 0 40 40" className="h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2 C28 2 34 5 34 14 C34 26 20 38 20 38 C20 38 6 26 6 14 C6 5 12 2 20 2 Z" fill="#351C15" />
    <path d="M20 4 C26.5 4 31.5 6.5 31.5 14 C31.5 24 20 34.5 20 34.5 C20 34.5 8.5 24 8.5 14 C8.5 6.5 13.5 4 20 4 Z" fill="#FFB500" />
    <text x="20" y="21" fill="#351C15" fontSize="10" fontWeight="900" fontFamily="monospace" textAnchor="middle">ups</text>
  </svg>
);

const DHLLogo = () => (
  <div className="flex flex-col items-center justify-center bg-[#FFCC00] px-2 py-0.5 rounded-md border border-[#E2B400] h-6 shadow-2xs select-none">
    <span className="text-[#D40511] font-sans font-black tracking-tighter text-[11px] italic leading-none">DHL</span>
    <div className="flex gap-0.5 mt-0.5 w-6">
      <div className="h-[1.5px] bg-[#D40511] flex-1"></div>
      <div className="h-[1.5px] bg-[#D40511] flex-1"></div>
      <div className="h-[1.5px] bg-[#D40511] flex-1"></div>
    </div>
  </div>
);

const AramexLogo = () => (
  <div className="flex items-center justify-center h-6 select-none">
    <span className="text-[#E31B23] font-sans font-extrabold tracking-tighter text-xs">aramex</span>
    <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23] ml-0.5"></span>
  </div>
);

const DelhiveryLogo = () => (
  <div className="flex items-center justify-center bg-slate-950 px-2 py-0.5 rounded-md h-6 border border-slate-800 select-none">
    <span className="text-white font-mono font-black tracking-widest text-[8px]">DELHIVERY</span>
    <div className="w-1 h-1 rounded-full bg-yellow-400 ml-1"></div>
  </div>
);

const BlueDartLogo = () => (
  <div className="flex items-center justify-center font-sans font-black italic tracking-tighter text-[10px] h-6 select-none">
    <span className="text-[#0033A0]">BLUE</span>
    <span className="text-[#FFC72C] bg-[#0033A0] px-1 py-0.5 rounded-xs ml-0.5">DART</span>
  </div>
);

const IndiaPostLogo = () => (
  <div className="flex items-center justify-center bg-red-600 px-2.5 py-1 rounded-lg h-7 border border-red-700 shadow-sm select-none gap-1">
    <span className="text-yellow-400 font-black italic tracking-tighter text-[10px] uppercase">India Post</span>
  </div>
);

const CarrierLogo = ({ id }: { id: string }) => {
  switch (id) {
    case 'dtdc':
      return <DTDCLogo />;
    case 'fedex':
      return <FedExLogo />;
    case 'ups':
      return <UPSLogo />;
    case 'dhl':
      return <DHLLogo />;
    case 'aramex':
      return <AramexLogo />;
    case 'delhivery':
      return <DelhiveryLogo />;
    case 'bluedart':
      return <BlueDartLogo />;
    case 'indiapost':
      return <IndiaPostLogo />;
    default:
      return <span className="text-lg">📦</span>;
  }
};

const CARRIERS = [
  { id: 'auto', name: 'Auto Detect (Global)', code: 'AUTO', logo: '🌐 Any', color: 'from-slate-600 to-slate-800', url: (id: string) => `https://t.17track.net/en#nums=${id}` },
  { id: 'dtdc', name: 'DTDC Express', code: 'DTDC', logo: '🔵 DTDC', color: 'from-blue-600 to-blue-800', carrierCode: '190014', url: (id: string) => `https://t.17track.net/en#nums=${id}` },
  { id: 'fedex', name: 'FedEx Priority', code: 'FEDEX', logo: '🟣 FedEx', color: 'from-purple-600 to-indigo-700', url: (id: string) => `https://www.fedex.com/apps/fedextrack/?tracknumbers=${id}` },
  { id: 'ups', name: 'UPS Worldwide', code: 'UPS', logo: '🟤 UPS', color: 'from-yellow-700 to-amber-900', url: (id: string) => `https://www.ups.com/track?loc=en_IN&tracknum=${id}` },
  { id: 'dhl', name: 'DHL Express', code: 'DHL', logo: '🔴 DHL', color: 'from-red-600 to-yellow-500', url: (id: string) => `https://www.dhl.com/in-en/home/tracking/tracking-express.html?submit=1&tracking-id=${id}` },
  { id: 'bluedart', name: 'BlueDart', code: 'BLUEDART', logo: '🔵 BlueDart', color: 'from-blue-500 to-yellow-600', url: (id: string) => `https://t.17track.net/en#nums=${id}` },
  { id: 'indiapost', name: 'India Post Speed', code: 'INDIAPOST', logo: '🇮🇳 India Post', color: 'from-red-600 to-yellow-600', carrierCode: '190013', url: (id: string) => `https://t.17track.net/en#nums=${id}` }
];

const COUNTRIES = [
  { code: 'USA', name: 'United States of America (USA)', baseDoc: 1800, baseParcel: 2800, perKg: 650 },
  { code: 'GBR', name: 'United Kingdom (UK)', baseDoc: 1500, baseParcel: 2400, perKg: 550 },
  { code: 'CAN', name: 'Canada (CA)', baseDoc: 1900, baseParcel: 2950, perKg: 700 },
  { code: 'AUS', name: 'Australia (AU)', baseDoc: 1900, baseParcel: 2900, perKg: 680 },
  { code: 'ARE', name: 'United Arab Emirates (UAE)', baseDoc: 1200, baseParcel: 1800, perKg: 400 },
  { code: 'DEU', name: 'Germany & Europe (EU)', baseDoc: 1600, baseParcel: 2600, perKg: 600 },
  { code: 'SGP', name: 'Singapore (SG)', baseDoc: 1300, baseParcel: 1900, perKg: 450 },
  { code: 'SAU', name: 'Saudi Arabia (KSA)', baseDoc: 1400, baseParcel: 2100, perKg: 480 },
  { code: 'NPL', name: 'Nepal & Neighbours', baseDoc: 800, baseParcel: 1200, perKg: 250 },
  { code: 'OTH', name: 'Other International Countries', baseDoc: 2200, baseParcel: 3500, perKg: 800 }
];

interface CourierPortalProps {
  onBackToHome: () => void;
  openContactModal: (service?: string) => void;
  initialTab?: 'track' | 'calculator';
}


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

export default function CourierPortal({ onBackToHome, openContactModal, initialTab = 'track' }: CourierPortalProps) {
  const [activeTab, setActiveTab] = useState<'track'>('track');
  const [trackingId, setTrackingId] = useState('');
  const [carrier, setCarrier] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<{
    awb: string;
    partnerName: string;
    status: string;
    origin: string;
    destination: string;
    estimatedDelivery: string;
    weight: string;
    steps: TrackingEvent[];
  } | null>(null);

  // Rate calculator states
  const [countryCode, setCountryCode] = useState('USA');
  const [weight, setWeight] = useState<number>(1.0);
  const [packType, setPackType] = useState<'doc' | 'parcel'>('parcel');

  // Handle Tracking Form Submission
  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    const selectedPartner = CARRIERS.find(p => p.id === carrier) || CARRIERS[0];
    
    
    
    // Simulate airplane loading and then jump
    setTimeout(() => {
        setResultUrl(selectedCarrierObj.url(trackingId.trim()));
        setLoading(false);
    }, 7000);
  };

  const selectedCarrierObj = CARRIERS.find(p => p.id === carrier) || CARRIERS[0];

  // Rate calculations
  const selectedCountry = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];
  const weightVal = isNaN(weight) || weight <= 0 ? 0.5 : weight;

  let calculatedPrice = 0;
  if (packType === 'doc') {
    calculatedPrice = selectedCountry.baseDoc + Math.max(0, weightVal - 0.5) * (selectedCountry.perKg * 0.8);
  } else {
    calculatedPrice = selectedCountry.baseParcel + Math.max(0, weightVal - 1.0) * selectedCountry.perKg;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  const carrierRates = [
    {
      id: 'rakhi_saver',
      name: 'Rakhi International Saver',
      provider: 'Rakhi Logistics Economy',
      price: Math.round(calculatedPrice * 0.9),
      days: '6 - 9 Working Days',
      badge: '💰 Best Value',
      features: ['Economic Air Cargo Routing', 'Customs documentation assistance', 'Complementary secure packaging']
    },
    {
      id: 'dtdc_express',
      name: 'DTDC International Premium',
      provider: 'Co-Branded DTDC Air Express',
      price: Math.round(calculatedPrice * 1.02),
      days: '4 - 7 Working Days',
      badge: '✨ Popular',
      features: ['DTDC global line haul network', 'End-to-end tracking feedback', 'Waterproof bubble wrap packaging']
    },
    {
      id: 'ups_worldwide',
      name: 'UPS Worldwide Saver',
      provider: 'Co-Branded UPS Express',
      price: Math.round(calculatedPrice * 1.12),
      days: '3 - 5 Working Days',
      badge: '🛡️ Highly Trusted',
      features: ['Priority dispatch & aircraft clearance', 'Signature-required delivery secure', 'Best for commercial samples & files']
    },
    {
      id: 'fedex_priority',
      name: 'FedEx Priority Service',
      provider: 'Co-Branded FedEx Express',
      price: Math.round(calculatedPrice * 1.10),
      days: '4 - 6 Working Days',
      badge: '⚡ Ultra Fast',
      features: ['Priority flight transit routes', 'Live barcode scanning alerts', 'Includes premium document envelopes']
    },
    {
      id: 'dhl_premium',
      name: 'DHL Express Premium',
      provider: 'Co-Branded DHL Worldwide',
      price: Math.round(calculatedPrice * 1.18),
      days: '3 - 4 Working Days',
      badge: '👑 Premium Service',
      features: ['Global network priority handling', 'Advanced customs clearance pre-arrival', 'Weather-proof strong courier box']
    }
  ];

  const rateCardData = [
    { country: '🇺🇸 USA', doc05: '₹1,800', kg1: '₹2,800', kg5: '₹5,400', kg10: '₹8,650', kg20: '₹15,150' },
    { country: '🇬🇧 UK', doc05: '₹1,500', kg1: '₹2,400', kg5: '₹4,600', kg10: '₹7,350', kg20: '₹12,850' },
    { country: '🇨🇦 Canada', doc05: '₹1,900', kg1: '₹2,950', kg5: '₹5,750', kg10: '₹9,250', kg20: '₹16,250' },
    { country: '🇦🇺 Australia', doc05: '₹1,900', kg1: '₹2,900', kg5: '₹5,620', kg10: '₹9,020', kg20: '₹15,820' },
    { country: '🇦🇪 UAE (Dubai)', doc05: '₹1,200', kg1: '₹1,800', kg5: '₹3,400', kg10: '₹5,400', kg20: '₹9,400' }
  ];

  return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 relative">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-white/90 backdrop-blur-sm overflow-hidden"
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

              
              
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation & Page header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <button 
            onClick={onBackToHome}
            className="self-start inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-full shadow-sm border border-slate-200 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-orange-500 transition-transform group-hover:-translate-x-1" />
            Back to Home (मुख्य पृष्ठ)
          </button>
          
          <div className="flex items-center gap-3 bg-teal-50 border border-teal-100/80 px-4 py-2 rounded-2xl">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-xs font-black text-teal-800 uppercase tracking-widest">Rakhi International Logistics Authorized Portal</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-8 md:p-12 mb-10 shadow-xl border border-teal-900/40">
          <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-cover mix-blend-color-dodge"></div>
          
          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/15 border border-teal-500/30 rounded-full text-xs font-bold text-teal-300 uppercase tracking-wider">
                <Truck className="w-3.5 h-3.5 animate-pulse" /> All-Carrier Shipping & Tracking Hub
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                International Courier <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-400">Services & Tracking</span>
              </h1>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Track global shipments via <strong className="text-white font-bold">DTDC, FedEx, UPS, DHL, Aramex, Delhivery</strong>, and estimate shipping costs to USA, UK, Canada, Australia, UAE, Europe & more. Fast offline tools for quick and accurate booking information.
              </p>
              
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-1 rounded-full text-teal-300">✈️ Air Cargo Express</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-1 rounded-full text-teal-300">🌍 Worldwide Logistics</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-1 rounded-full text-teal-300">🛡️ Customs Cleared</span>
              </div>
            </div>

            {/* Right Map Animation Column (Direct user request match) */}
            <div className="lg:col-span-5 relative w-full h-[300px] bg-slate-950/40 backdrop-blur-xs border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl p-4 flex flex-col justify-between">
              {/* Overlay world map base */}
              <div className="absolute inset-0 opacity-15 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-contain pointer-events-none"></div>
              


              {/* Central SVG Map Content with multiple animated planes */}
              <div className="absolute inset-0 flex items-center justify-center pt-8 pointer-events-none">
                <svg viewBox="0 0 400 220" className="w-full h-full max-w-[360px]">
                  {/* India Origin point */}
                  <g transform="translate(230, 115)">
                    <circle r="14" className="fill-teal-500/20 animate-ping" />
                    <circle r="6" className="fill-teal-400" />
                    <circle r="2" className="fill-white" />
                    <text y="-11" textAnchor="middle" className="text-[8px] font-black fill-white bg-slate-900/90 px-1 rounded uppercase tracking-wider">India</text>
                  </g>

                  <style>{`
                    @keyframes flightDash {
                      to {
                        stroke-dashoffset: -20;
                      }
                    }
                    .flight-path {
                      animation: flightDash 1.2s linear infinite;
                    }
                  `}</style>

                  {/* US Node */}
                  <g transform="translate(60, 65)">
                    <circle r="8" className="fill-teal-400/20 animate-ping" />
                    <circle r="3.5" className="fill-emerald-400 stroke-slate-900 stroke-[1px]" />
                    <text y="-7" textAnchor="middle" className="text-[7px] font-bold fill-slate-300">USA</text>
                  </g>
                  <path d="M 230 115 Q 145 25 60 65" fill="none" stroke="rgba(20, 184, 166, 0.45)" strokeWidth="1.5" strokeDasharray="5 3" className="flight-path" />
                  <g>
                    <circle r="6" className="fill-teal-500 stroke-white stroke-[1px]" />
                    <g transform="rotate(90)">
                      <path 
                        d="M0,-3 L0.9,-0.6 L3,0.6 L0.9,0.9 L1.2,3 L0,2.1 L-1.2,3 L-0.9,0.9 L-3,0.6 L-0.9,-0.6 Z" 
                        fill="white" 
                      />
                    </g>
                    <animateMotion 
                      dur="8s" 
                      repeatCount="indefinite" 
                      rotate="auto"
                      path="M 230 115 Q 145 25 60 65" 
                    />
                  </g>

                  {/* UK Node */}
                  <g transform="translate(150, 45)">
                    <circle r="8" className="fill-teal-400/20 animate-ping" />
                    <circle r="3.5" className="fill-emerald-400 stroke-slate-900 stroke-[1px]" />
                    <text y="-7" textAnchor="middle" className="text-[7px] font-bold fill-slate-300">UK</text>
                  </g>
                  <path d="M 230 115 Q 190 45 150 45" fill="none" stroke="rgba(20, 184, 166, 0.45)" strokeWidth="1.5" strokeDasharray="5 3" className="flight-path" />
                  <g>
                    <circle r="6" className="fill-teal-500 stroke-white stroke-[1px]" />
                    <g transform="rotate(90)">
                      <path 
                        d="M0,-3 L0.9,-0.6 L3,0.6 L0.9,0.9 L1.2,3 L0,2.1 L-1.2,3 L-0.9,0.9 L-3,0.6 L-0.9,-0.6 Z" 
                        fill="white" 
                      />
                    </g>
                    <animateMotion 
                      dur="5s" 
                      repeatCount="indefinite" 
                      rotate="auto"
                      path="M 230 115 Q 190 45 150 45" 
                    />
                  </g>

                  {/* Canada Node */}
                  <g transform="translate(45, 50)">
                    <circle r="8" className="fill-teal-400/20 animate-ping" />
                    <circle r="3.5" className="fill-emerald-400 stroke-slate-900 stroke-[1px]" />
                    <text y="-7" textAnchor="middle" className="text-[7px] font-bold fill-slate-300">CA</text>
                  </g>
                  <path d="M 230 115 Q 135 10 45 50" fill="none" stroke="rgba(20, 184, 166, 0.45)" strokeWidth="1.5" strokeDasharray="5 3" className="flight-path" />
                  <g>
                    <circle r="6" className="fill-teal-500 stroke-white stroke-[1px]" />
                    <g transform="rotate(90)">
                      <path 
                        d="M0,-3 L0.9,-0.6 L3,0.6 L0.9,0.9 L1.2,3 L0,2.1 L-1.2,3 L-0.9,0.9 L-3,0.6 L-0.9,-0.6 Z" 
                        fill="white" 
                      />
                    </g>
                    <animateMotion 
                      dur="10s" 
                      repeatCount="indefinite" 
                      rotate="auto"
                      path="M 230 115 Q 135 10 45 50" 
                    />
                  </g>

                  {/* Australia Node */}
                  <g transform="translate(330, 175)">
                    <circle r="8" className="fill-teal-400/20 animate-ping" />
                    <circle r="3.5" className="fill-emerald-400 stroke-slate-900 stroke-[1px]" />
                    <text y="11" textAnchor="middle" className="text-[7px] font-bold fill-slate-300">AUS</text>
                  </g>
                  <path d="M 230 115 Q 280 145 330 175" fill="none" stroke="rgba(20, 184, 166, 0.45)" strokeWidth="1.5" strokeDasharray="5 3" className="flight-path" />
                  <g>
                    <circle r="6" className="fill-teal-500 stroke-white stroke-[1px]" />
                    <g transform="rotate(90)">
                      <path 
                        d="M0,-3 L0.9,-0.6 L3,0.6 L0.9,0.9 L1.2,3 L0,2.1 L-1.2,3 L-0.9,0.9 L-3,0.6 L-0.9,-0.6 Z" 
                        fill="white" 
                      />
                    </g>
                    <animateMotion 
                      dur="9s" 
                      repeatCount="indefinite" 
                      rotate="auto"
                      path="M 230 115 Q 280 145 330 175" 
                    />
                  </g>

                  {/* Dubai Node */}
                  <g transform="translate(185, 95)">
                    <circle r="8" className="fill-teal-400/20 animate-ping" />
                    <circle r="3" className="fill-emerald-400 stroke-slate-900 stroke-[1px]" />
                    <text y="-7" textAnchor="middle" className="text-[7px] font-bold fill-slate-300">UAE</text>
                  </g>
                  <path d="M 230 115 Q 208 105 185 95" fill="none" stroke="rgba(20, 184, 166, 0.45)" strokeWidth="1.5" strokeDasharray="5 3" className="flight-path" />
                  <g>
                    <circle r="6" className="fill-teal-500 stroke-white stroke-[1px]" />
                    <g transform="rotate(90)">
                      <path 
                        d="M0,-3 L0.9,-0.6 L3,0.6 L0.9,0.9 L1.2,3 L0,2.1 L-1.2,3 L-0.9,0.9 L-3,0.6 L-0.9,-0.6 Z" 
                        fill="white" 
                      />
                    </g>
                    <animateMotion 
                      dur="4s" 
                      repeatCount="indefinite" 
                      rotate="auto"
                      path="M 230 115 Q 208 105 185 95" 
                    />
                  </g>
                </svg>
              </div>

              {/* Floating bottom-left status card */}
              <div className="relative z-10 bg-slate-900/90 border border-white/10 rounded-2xl p-2.5 max-w-[170px] shadow-lg pointer-events-none">
                <div className="flex gap-1 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[9px] font-black text-white">AU</span>
                  <span className="w-6 h-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[9px] font-black text-white">CA</span>
                  <span className="w-6 h-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[9px] font-black text-white">GB</span>
                  <span className="w-6 h-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[9px] font-black text-white">US</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                  <span className="text-[9px] font-black tracking-wider text-teal-300 uppercase">Global Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Content Tabs */}
        <AnimatePresence mode="wait">
          
            <motion.div 
              key="track-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Form and Selection */}
              
              {resultUrl ? (
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-emerald-200 shadow-[0_4px_30px_rgba(16,185,129,0.1)] text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                     <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">Tracking Details Ready</h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto">We've securely connected to the carrier's tracking network. Click below to view your real-time parcel status.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button type="button" onClick={() => setResultUrl(null)} className="px-8 py-3.5 rounded-2xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors">Track Another Parcel</button>
                    <a href={resultUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 flex items-center gap-2">
                      View Live Status 
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  </div>
                </div>
              ) : (
              <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-6 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
                <div className="max-w-2xl mx-auto text-center mb-8">
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-2">Track Any Global Parcel Instantly</h2>
                  <p className="text-slate-500 text-xs md:text-sm">
                    Choose your shipping network carrier from our integrated networks and input your consignment booking ID / tracking number.
                  </p>
                </div>

                <form onSubmit={handleTrackSubmit} className="max-w-3xl mx-auto space-y-6">
                  {/* Carrier Grid Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center sm:text-left">Select Logistic Carrier / कूरियर नेटवर्क चुनें:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                      {CARRIERS.map(c => {
                        const isSelected = carrier === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setCarrier(c.id)}
                            className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-between gap-2.5 cursor-pointer min-h-[90px] ${isSelected ? 'bg-teal-50/70 border-teal-500 text-teal-800 font-extrabold shadow-sm scale-102 ring-2 ring-teal-500/10' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-bold hover:shadow-2xs'}`}
                          >
                            <div className="flex items-center justify-center h-8 w-full">
                              <CarrierLogo id={c.id} />
                            </div>
                            <span className="text-[10px] tracking-tight font-extrabold truncate max-w-full text-slate-500">{c.name.replace(' Express', '').replace(' Priority', '').replace(' Worldwide', '').replace(' International', '')}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Input Box */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <input 
                        type="text"
                        required
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        placeholder={`Enter ${selectedCarrierObj.name} Tracking ID / AWB Number...`}
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-teal-500 focus:bg-white text-sm font-bold text-slate-900 rounded-2xl py-4.5 pl-12 pr-4 transition-all focus:outline-none placeholder:text-slate-400 placeholder:font-medium"
                      />
                      <Package className="absolute left-4.5 top-5 w-5 h-5 text-slate-400" />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-br from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold px-8 py-4.5 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-teal-600/10 active:scale-98 disabled:opacity-80"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          Connecting servers...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" /> Track Courier Status
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
              )}

              {/* Tracking Results */}
              {trackingData ? (
                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.03)] animate-fadeIn">
                  {/* Status header banner */}
                  <div className="bg-gradient-to-r from-slate-900 to-teal-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-teal-400 uppercase">Waybill Consignment ID</span>
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight flex items-center flex-wrap gap-2.5 mt-0.5">
                        {trackingData.awb}
                        <span className="text-xs font-black bg-teal-500/20 text-teal-200 border border-teal-500/30 px-3 py-1 rounded-full uppercase">
                          {trackingData.partnerName}
                        </span>
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 bg-white/10 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-md self-start sm:self-center">
                      <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></span>
                      <div>
                        <div className="text-[10px] text-teal-200 font-bold uppercase tracking-wider leading-none">Live Package Status</div>
                        <div className="text-sm font-black tracking-wide mt-1 text-teal-100">{trackingData.status}</div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Step-by-Step Progress (Shown directly on page) */}
                  <div className="p-6 md:p-10 border-t border-slate-100 bg-slate-50/50">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Clock className="w-4.5 h-4.5 text-teal-600" /> Transit History & Real-Time Scans / लाइव प्रगति विवरण
                    </h4>

                    {trackingData.steps && trackingData.steps.length > 0 ? (
                      <div className="relative border-l border-teal-200 ml-4 space-y-8 py-2">
                        {trackingData.steps.map((step, idx) => (
                          <div key={idx} className="relative pl-8 group">
                            {/* Animated Node Circle */}
                            <div className="absolute -left-2 top-1.5 w-4 h-4 rounded-full border-2 border-teal-500 bg-white flex items-center justify-center transition-transform group-hover:scale-125">
                              {idx === 0 ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping"></div>
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500/60"></div>
                              )}
                            </div>

                            <div className="space-y-1 bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-3xs hover:shadow-2xs transition-all">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <span className="font-extrabold text-slate-900 text-sm">{step.status}</span>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{step.date} {step.time}</span>
                                </div>
                              </div>
                              {step.location && (
                                <div className="flex items-center gap-1 text-[11px] text-teal-700 font-bold">
                                  <MapPin className="w-3 h-3" />
                                  <span>{step.location}</span>
                                </div>
                              )}
                              <p className="text-slate-500 text-xs font-medium leading-relaxed pt-1">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-8 bg-white border border-slate-200 rounded-2xl">
                        <p className="text-slate-500 text-xs">Searching databases... details will refresh directly here as soon as carrier scans are fetched.</p>
                      </div>
                    )}
                  </div>

                  {/* Bridge Gateway Action */}
                  <div className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-start gap-3 text-xs text-slate-500 max-w-xl">
                        <Info className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span>
                          For direct status query on official network data logs, you can click to launch the dedicated official gateway for tracking. Rakhi Internet partners with these networks to deliver robust shipments.
                        </span>
                      </div>
                      <a
                        href={selectedCarrierObj.url(trackingData.awb)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-700 py-3 px-5 rounded-xl border border-slate-200 hover:border-teal-200 transition-colors cursor-pointer w-full md:w-auto justify-center"
                      >
                        Launch Carrier Portal <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                </div>
              ) : (
                <div className="bg-slate-100/50 rounded-[2.5rem] border border-slate-200/60 border-dashed p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 mb-4 shadow-2xs">
                    <Package className="w-8 h-8 text-teal-600" />
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-800 mb-1">Enter your Waybill ID above to track</h4>
                  <p className="text-slate-500 text-xs max-w-md">
                    Input your DTDC, FedEx, UPS or other partner tracking AWB number to check step-by-step progress and transit updates instantly.
                  </p>
                </div>
              )}

            </motion.div>
        </AnimatePresence>

        {/* Dynamic FAQ Help block */}
        <div className="mt-16 bg-white rounded-[2rem] border border-slate-200/60 p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.015)]">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <HelpCircle className="w-4.5 h-4.5 text-teal-600" /> Courier Services FAQ (अक्सर पूछे जाने वाले सवाल)
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs block mb-1">Q: How do I book an international parcel?</span>
              <p className="text-slate-600 text-xs leading-relaxed">
                A: Just pack your items and visit our Narnaund branch, or use the "Book Now" query option to reach us via phone/WhatsApp. We will weight it and prepare the custom documents.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs block mb-1">Q: Are there prohibited items for shipping?</span>
              <p className="text-slate-600 text-xs leading-relaxed">
                A: Yes, battery items, flammable liquids, aerosols, perishable items, coins, currency, and drugs are prohibited by aviation customs.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs block mb-1">Q: क्या आप घर से पिकअप की सुविधा देते हैं?</span>
              <p className="text-slate-600 text-xs leading-relaxed">
                A: हाँ, आस-पास के क्षेत्रों (जींद, हांसी, हिसार) के लिए हम कूरियर पार्सल का पिकअप अरेंज करवा सकते हैं। कृपया हमारी टीम से संपर्क करें।
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs block mb-1">Q: How can we track DTDC, FedEx, or UPS?</span>
              <p className="text-slate-600 text-xs leading-relaxed">
                A: Once we book your courier, we provide an AWB booking number. You can enter it on our multi-carrier tracking tool above to fetch status instantly in real-time.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
