import React, { useState } from 'react';
import { Search, Package } from 'lucide-react';

const PARTNERS = [
  { id: 'auto', name: 'Auto Detect (Global)', logo: '🌐 Any', url: (id: string) => `https://t.17track.net/en#nums=${id}` },
  { id: 'dhl', name: 'DHL Express', logo: '🔴 DHL', url: (id: string) => `https://www.dhl.com/in-en/home/tracking/tracking-express.html?submit=1&tracking-id=${id}` },
  { id: 'fedex', name: 'FedEx Priority', logo: '🟣 FedEx', url: (id: string) => `https://www.fedex.com/apps/fedextrack/?tracknumbers=${id}` },
  { id: 'ups', name: 'UPS Worldwide', logo: '🟤 UPS', url: (id: string) => `https://www.ups.com/track?loc=en_IN&tracknum=${id}` },
  { id: 'aramex', name: 'Aramex International', logo: '🔴 Aramex', url: (id: string) => `https://www.aramex.com/express/track-results?trackNumber=${id}` },
  { id: 'delhivery', name: 'Delhivery International', logo: '⚫ Delhivery', url: (id: string) => `https://www.delhivery.com/track/package/${id}` },
  { id: 'bluedart', name: 'BlueDart Express', logo: '🔵 BlueDart', url: (id: string) => `https://www.bluedart.com/` },
  { id: 'dtdc', name: 'DTDC Courier', logo: '🔵 DTDC', carrierCode: '190014', url: (id: string) => `https://www.dtdc.in/` },
  { id: 'indiapost', name: 'India Post Speed Post', logo: '🇮🇳 India Post', carrierCode: '190013', url: (id: string) => `https://www.indiapost.gov.in/_layouts/17/dop.portal.tracking/trackconsignment.aspx` }
];

export default function CourierTrackWidget() {
  const [trackingId, setTrackingId] = useState('');
  const [carrier, setCarrier] = useState('auto');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    const selectedPartnerObj = PARTNERS.find(p => p.id === carrier) || PARTNERS[0];
    window.open(selectedPartnerObj.url(trackingId.trim()), '_blank');
  };

  return (
    <div className="w-full">
      <div className="text-center max-w-xl mx-auto mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Track Your Shipment</h3>
        <p className="text-sm text-gray-600">
          Enter your unique Tracking AWB number to check real-time courier statuses, delivery milestones, and dispatch details.
        </p>
      </div>

      {/* Input Form */}
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
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Search className="w-4 h-4" /> Track Consignment Status
        </button>
      </form>
    </div>
  );
}
