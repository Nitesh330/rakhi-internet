import React, { useState } from 'react';
import { MessageCircle, Phone, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function QuickResponseWidget({ openContactModal }: { openContactModal: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsApp = () => {
    window.open('https://wa.me/918059000054?text=Hi!%20I%20need%20a%20quick%20response%20regarding%20your%20services.', '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="flex flex-col gap-2"
          >
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-3 bg-white p-3 pr-4 rounded-full shadow-lg border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm text-gray-700">WhatsApp Us</span>
            </button>
            <button
              onClick={openContactModal}
              className="flex items-center gap-3 bg-white p-3 pr-4 rounded-full shadow-lg border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="bg-blue-100 p-2 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm text-gray-700">Request a Call</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
      >
        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75"></div>
        {isOpen ? (
          <X className="w-6 h-6 relative z-10" />
        ) : (
          <Zap className="w-6 h-6 relative z-10" />
        )}
      </button>
    </div>
  );
}
