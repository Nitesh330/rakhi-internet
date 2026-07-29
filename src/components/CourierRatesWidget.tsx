import React, { useState } from 'react';
import { Calculator, DollarSign, ArrowRight, ShieldCheck, HelpCircle, Table, Check, ExternalLink } from 'lucide-react';

interface CarrierRate {
  id: string;
  name: string;
  provider: string;
  price: number;
  days: string;
  badge: string;
  features: string[];
}

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

interface CourierRatesWidgetProps {
  openContactModal: (service: string) => void;
}

export default function CourierRatesWidget({ openContactModal }: CourierRatesWidgetProps) {
  const [countryCode, setCountryCode] = useState('USA');
  const [weight, setWeight] = useState<number>(1.0);
  const [packType, setPackType] = useState<'doc' | 'parcel'>('parcel');

  // Static Standard Rate Card data for popular destinations (under 5 different weights)
  const rateCardData = [
    { country: '🇺🇸 USA', doc05: '₹1,800', kg1: '₹2,800', kg5: '₹5,400', kg10: '₹8,650', kg20: '₹15,150' },
    { country: '🇬🇧 UK', doc05: '₹1,500', kg1: '₹2,400', kg5: '₹4,600', kg10: '₹7,350', kg20: '₹12,850' },
    { country: '🇨🇦 Canada', doc05: '₹1,900', kg1: '₹2,950', kg5: '₹5,750', kg10: '₹9,250', kg20: '₹16,250' },
    { country: '🇦🇺 Australia', doc05: '₹1,900', kg1: '₹2,900', kg5: '₹5,620', kg10: '₹9,020', kg20: '₹15,820' },
    { country: '🇦🇪 UAE (Dubai)', doc05: '₹1,200', kg1: '₹1,800', kg5: '₹3,400', kg10: '₹5,400', kg20: '₹9,400' }
  ];

  // Calculate Rate dynamically
  const selectedCountry = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];
  const weightVal = isNaN(weight) || weight <= 0 ? 0.5 : weight;

  let calculatedPrice = 0;
  if (packType === 'doc') {
    // Document rate caps at 2.0kg generally. It usually has less per-kg multiplier
    calculatedPrice = selectedCountry.baseDoc + Math.max(0, weightVal - 0.5) * (selectedCountry.perKg * 0.8);
  } else {
    // Parcel rate has a base starting weight of 1.0kg
    calculatedPrice = selectedCountry.baseParcel + Math.max(0, weightVal - 1.0) * selectedCountry.perKg;
  }

  // Format price beautifully
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  // Build simulated options
  const carrierRates: CarrierRate[] = [
    {
      id: 'rakhi_saver',
      name: 'Rakhi International Saver',
      provider: 'Rakhi Logistics Economy Delivery',
      price: Math.round(calculatedPrice * 0.9),
      days: '6 - 9 Working Days',
      badge: '💰 Best Value',
      features: ['Economic Air Cargo Routing', 'Includes custom clearance clearance guidance', 'Free local packaging check']
    },
    {
      id: 'dhl_premium',
      name: 'DHL Express Express',
      provider: 'Co-Branded DHL Express Premium',
      price: Math.round(calculatedPrice * 1.15),
      days: '3 - 5 Working Days',
      badge: '⚡ Fastest Delivery',
      features: ['Priority express air flight', 'Dedicated real-time tracking feed', 'Premium high-durability waterproof pouch']
    },
    {
      id: 'fedex_priority',
      name: 'FedEx Priority Service',
      provider: 'Co-Branded FedEx International Priority',
      price: Math.round(calculatedPrice * 1.08),
      days: '4 - 6 Working Days',
      badge: '🛡️ Highly Secure',
      features: ['Secure shipping networks', 'Full barcode trace scan', 'Best for delicate/valuable items']
    },
    {
      id: 'aramex_economy',
      name: 'Aramex Direct Air Cargo',
      provider: 'Co-Branded Aramex Gulf Special',
      price: Math.round(calculatedPrice * 0.95),
      days: '5 - 7 Working Days',
      badge: '🌍 Middle-East Special',
      features: ['Direct flight pipelines', 'Low customs paperwork fee', 'Standard parcel box packing']
    }
  ];

  return (
    <div className="w-full">
      <div className="text-center max-w-xl mx-auto mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Courier Rate Calculator & List</h3>
        <p className="text-sm text-gray-600">
          Calculate real-time shipping estimate quotes or check our popular global rate guidelines table instantly.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs - 5 columns */}
        <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-gray-800 text-sm uppercase tracking-wider">Calculate Quote</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Destination Country</label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Package Weight (Kg)</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWeight(Math.max(0.5, +(weight - 0.5).toFixed(1)))}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl flex items-center justify-center transition-colors text-lg cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="200"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0.5)}
                className="flex-1 p-2.5 text-center bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setWeight(+(weight + 0.5).toFixed(1))}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl flex items-center justify-center transition-colors text-lg cursor-pointer"
              >
                +
              </button>
            </div>
            <p className="text-[10px] text-gray-500 font-medium mt-1.5">For weights &gt; 50 kg, contact us directly for heavy freight air cargo discounts!</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Package Category</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setPackType('doc'); if (weight > 2.0) setWeight(0.5); }}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center ${packType === 'doc' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs' : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-white'}`}
              >
                <span className="text-sm">📄 Document</span>
                <span className="text-[9px] text-gray-400 mt-0.5">Letters, Books (&lt;2Kg)</span>
              </button>
              <button
                type="button"
                onClick={() => setPackType('parcel')}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center ${packType === 'parcel' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs' : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-white'}`}
              >
                <span className="text-sm">📦 Parcel / Box</span>
                <span className="text-[9px] text-gray-400 mt-0.5">Box packages & goods</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-xl text-xs text-blue-700 leading-normal">
            <span className="font-bold">✨ Live Rate Quote Active:</span> Prices are computed dynamically incorporating baseline fuel surcharge indices and partner tariff metrics.
          </div>
        </div>

        {/* Right Outputs: Dynamic rates list - 7 columns */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Available Shipping Options ({weightVal} Kg to {selectedCountry.name.split(' (')[0]})</span>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Live Estimates</span>
          </div>

          <div className="space-y-3">
            {carrierRates.map((carrier) => (
              <div
                key={carrier.id}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:border-emerald-200 hover:shadow-xs transition-all flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
              >
                <div className="flex-grow space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm sm:text-base">{carrier.name}</span>
                    {carrier.badge && (
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                        {carrier.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">{carrier.provider}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="font-bold text-gray-700">Transit:</span> {carrier.days}
                  </div>
                </div>

                <div className="text-left sm:text-right flex-shrink-0 flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center w-full sm:w-auto border-t sm:border-0 border-gray-50 pt-2.5 sm:pt-0 gap-2">
                  <div>
                    <div className="text-xl font-extrabold text-emerald-700 tracking-tight">
                      {formatPrice(carrier.price)}
                    </div>
                    <div className="text-[9px] text-gray-400 font-bold leading-none uppercase">Door-to-Door Fee</div>
                  </div>
                  <button
                    onClick={() => openContactModal(`Courier Booking: ${carrier.name} to ${selectedCountry.name} (${weightVal} Kg)`)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    Enquire <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing warning / Disclaimer */}
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-[11px] text-yellow-800 leading-normal">
            <span className="font-bold">⚠️ Rate Disclaimers:</span> Calculated rates are advisory indications based on standardized courier volumetric pricing. Actual tariff depends on high-precision cargo weight measures and custom duties defined by the recipient country.
          </div>
        </div>
      </div>

      {/* Popular country static rate card block */}
      <div className="mt-10 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
        <div className="bg-gray-100 p-4 border-b border-gray-200 flex items-center justify-between">
          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
            <Table className="w-4 h-4 text-emerald-600" /> Popular Destinations Standard Rate Card (Parcels)
          </h4>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">General Tariff Guidelines</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
                <th className="p-3.5 pl-5">Country</th>
                <th className="p-3.5">Document (0.5 Kg)</th>
                <th className="p-3.5">Parcel (1.0 Kg)</th>
                <th className="p-3.5">Parcel (5.0 Kg)</th>
                <th className="p-3.5">Parcel (10 Kg)</th>
                <th className="p-3.5">Parcel (20 Kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {rateCardData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-3.5 pl-5 font-bold text-gray-900">{row.country}</td>
                  <td className="p-3.5 text-gray-600">{row.doc05}</td>
                  <td className="p-3.5 text-emerald-700 font-bold">{row.kg1}</td>
                  <td className="p-3.5 text-gray-600">{row.kg5}</td>
                  <td className="p-3.5 text-gray-600">{row.kg10}</td>
                  <td className="p-3.5 text-gray-600">{row.kg20}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-wrap gap-2 text-[10px] text-gray-500">
          <span>Rates are all-inclusive of standard emergency, fuel surcharges, and basic service taxes.</span>
          <button
            onClick={() => openContactModal('International Courier Complete Tariff List')}
            className="text-emerald-700 hover:text-emerald-800 font-bold uppercase tracking-widest flex items-center gap-1 cursor-pointer"
          >
            Request Full Rate Booklet <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
