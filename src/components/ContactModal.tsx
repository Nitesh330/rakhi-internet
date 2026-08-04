import React, { useState, useEffect } from 'react';
import { X, Send, Phone, MapPin, MessageSquare, Check, ExternalLink, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
  defaultBranch?: string; // 'narnaund' | 'jind' | 'uchana'
}

interface ContactNumber {
  label: string;
  hindiLabel: string;
  number: string;
}

interface BranchInfo {
  id: 'narnaund' | 'jind' | 'uchana';
  name: string;
  hindiName: string;
  address: string;
  contacts: ContactNumber[];
  whatsapp: string;
  manager: string;
  email: string;
  mapLink: string;
  gradient: string;
  badgeBg: string;
  textColor: string;
}

const BRANCHES: Record<string, BranchInfo> = {
  jind: {
    id: 'jind',
    name: 'Jind Branch',
    hindiName: 'जींद प्रवेश केंद्र',
    address: 'Bhiwani Bypass, main chowk, Jind, Haryana 126102',
    contacts: [
      { label: 'Pankaj Pawar', hindiLabel: 'पंकज पंवार', number: '+91 80535-04080' },
      { label: 'Ashish Dhankar', hindiLabel: 'आशीष धनखड़', number: '+91 86830-30747' }
    ],
    whatsapp: '918683030747',
    manager: 'Sonu Sheoran (Senior Counselor)',
    email: 'jind@rakhiinternet.com',
    mapLink: 'https://maps.google.com/?q=Bhiwani+Bypass,+main+chowk,+Jind,+Haryana+126102',
    gradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-100',
    textColor: 'text-purple-600'
  },
  narnaund: {
    id: 'narnaund',
    name: 'Narnaund Branch',
    hindiName: 'नारनौंद शाखा',
    address: 'Bus Stand, Front of Police Station, Old, Narnaund, Haryana 125039',
    contacts: [
      { label: 'Manish Sheoran', hindiLabel: 'मनीष श्योराण', number: '+91 98960-73011' },
      { label: 'Sonu Sheoran', hindiLabel: 'सोनू श्योराण', number: '+91 80599-70904' }
    ],
    whatsapp: '918059970904',
    manager: 'Manish Sheoran (Branch Head)',
    email: 'narnaund@rakhiinternet.com',
    mapLink: 'https://maps.google.com/?q=Bus+Stand,+Front+of+Police+Station,+Old,+Narnaund,+Haryana+125039',
    gradient: 'from-blue-600 via-indigo-600 to-indigo-700',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-100',
    textColor: 'text-blue-600'
  },
  uchana: {
    id: 'uchana',
    name: 'Uchana Branch',
    hindiName: 'उचाना कूरियर डेस्क',
    address: 'main market railway road uchana',
    contacts: [
      { label: 'Aman Sheokand', hindiLabel: 'अमन श्योकंद', number: '+91 90532-51092' }
    ],
    whatsapp: '919053251092',
    manager: 'Aman Sheokand (Branch Head)',
    email: 'uchana@rakhiinternet.com',
    mapLink: 'https://maps.google.com/?q=main+market+railway+road+uchana',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    textColor: 'text-emerald-600'
  }
};

export default function ContactModal({ isOpen, onClose, defaultBranch = 'jind' }: ContactModalProps) {
  const [selectedBranch, setSelectedBranch] = useState<'narnaund' | 'jind' | 'uchana'>('jind');

  useEffect(() => {
    if (isOpen) {
      if (defaultBranch && BRANCHES[defaultBranch]) {
        setSelectedBranch(defaultBranch as 'narnaund' | 'jind' | 'uchana');
      }
    }
  }, [isOpen, defaultBranch]);

  const activeBranchInfo = BRANCHES[selectedBranch] || BRANCHES.jind;

  const handleWhatsAppDirect = () => {
    const greetingText = `Hello *Rakhi Internet (${activeBranchInfo.name})*,%0A%0AI would like to inquire about your services. Please connect me with your advisor.`;
    window.open(`https://wa.me/${activeBranchInfo.whatsapp}?text=${greetingText}`, '_blank');
  };

  const handleCallDirect = (num: string) => {
    window.location.href = `tel:${num.replace(/[^0-9+]/g, '')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/40 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-[0_25px_70px_rgba(15,23,42,0.18)] border border-slate-100 overflow-hidden flex flex-col md:flex-row z-10 max-h-[92vh] md:max-h-[85vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-full transition-all border border-slate-100 shadow-sm cursor-pointer"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>

            {/* LEFT SIDE: Branch Selection */}
            <div className="w-full md:w-[45%] bg-slate-50 p-6 sm:p-8 flex flex-col justify-between border-r border-slate-100 overflow-y-auto">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-blue-600 uppercase bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-100/40 mb-4">
                  <Sparkles className="w-3 h-3 text-blue-500 animate-pulse" /> Instant Connection
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase mb-2">
                  Select Location
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm font-medium mb-5">
                  Choose nearest branch to get instant contact numbers & direct support.
                </p>

                {/* Direct branch buttons */}
                <div className="space-y-2.5 mb-6">
                  {(Object.keys(BRANCHES) as Array<keyof typeof BRANCHES>).map((key) => {
                    const b = BRANCHES[key];
                    const isSelected = selectedBranch === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedBranch(key as 'narnaund' | 'jind' | 'uchana')}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-3 cursor-pointer relative group/btn ${
                          isSelected
                            ? `bg-white border-slate-900 shadow-[0_8px_20px_rgba(0,0,0,0.03)]`
                            : 'bg-slate-100/50 border-slate-200/50 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        {isSelected && (
                          <motion.div 
                            layoutId="activeBranchIndicatorSimple"
                            className={`absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b ${b.gradient} rounded-r-md`} 
                          />
                        )}

                        <div className={`p-2 rounded-xl border ${
                          isSelected ? `${b.badgeBg}` : 'bg-slate-100 text-slate-500 border-slate-200/40'
                        } transition-colors flex-shrink-0`}>
                          <MapPin className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-xs sm:text-sm text-slate-800 tracking-tight truncate group-hover/btn:text-blue-600 transition-colors">
                              {b.name}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Little map card info */}
              <div className="bg-white rounded-2xl p-4.5 border border-slate-200/60 shadow-sm mt-auto relative overflow-hidden">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-2">Office Address:</span>
                <p className="text-slate-700 text-xs font-semibold leading-relaxed mb-3">{activeBranchInfo.address}</p>
                <a
                  href={activeBranchInfo.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200 hover:border-slate-900 rounded-xl py-2 px-3 text-[10px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer text-slate-600"
                >
                  <ExternalLink className="w-3 h-3" /> View on Google Map
                </a>
              </div>
            </div>

            {/* RIGHT SIDE: Action panel (Only direct calling numbers) */}
            <div className="w-full md:w-[55%] p-6 sm:p-8 flex flex-col justify-center overflow-y-auto bg-white">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
                    Direct Contact Numbers
                  </h3>
                  <p className="text-slate-400 text-xs font-semibold">
                    Call <span className={`font-bold ${activeBranchInfo.textColor}`}>{activeBranchInfo.name}</span> instantly. Click on any number below to dial:
                  </p>
                </div>

                {/* The 2 direct calling buttons */}
                <div className="space-y-3.5">
                  {activeBranchInfo.contacts.map((contact, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCallDirect(contact.number)}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black p-4 rounded-2xl shadow-md hover:shadow-lg hover:shadow-slate-950/10 transition-all flex items-center justify-between cursor-pointer active:scale-[0.98] group/call animate-fade-in"
                    >
                      <div className="flex items-center gap-3.5 text-left">
                        <div className="bg-white/15 p-2.5 rounded-xl group-hover/call:bg-white/20 group-hover/call:scale-110 transition-all">
                          <Phone className="w-5 h-5 text-blue-300" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-300 font-extrabold block uppercase tracking-wider">
                            {contact.label}
                          </span>
                          <span className="text-[14px] font-black block mt-0.5 tracking-wider">
                            {contact.number}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white/10 p-2 rounded-xl group-hover/call:bg-white/25 transition-all">
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-extrabold justify-center pt-4 border-t border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>DIRECT OFFICE DESK ROUTING & INSTANT CALL CONNECTION</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
