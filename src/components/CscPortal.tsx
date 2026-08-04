import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Search, CheckSquare, Info, ShieldAlert, FileText, 
  User, CreditCard, Landmark, GraduationCap, ClipboardList, Clock, 
  Sparkles, AlertCircle, Phone, MapPin, CheckCircle2, ChevronRight, 
  FileCheck, ShieldCheck, SquareCheck, Check, Image as ImageIcon,
  ExternalLink
} from 'lucide-react';

interface CscService {
  id: string;
  name: string;
  hindiName: string;
  category: 'govt-id' | 'certificates' | 'pensions' | 'utility' | 'exams';
  desc: string;
  hindiDesc: string;
  requiredDocs: string[];
  duration: string;
  status: 'Active' | 'Under Maintenance';
  officialUrl?: string;
}

const CSC_SERVICES: CscService[] = [
  // Govt IDs
  {
    id: 'aadhaar',
    name: 'Aadhaar Card Services',
    hindiName: 'आधार कार्ड सेवाएं',
    category: 'govt-id',
    desc: 'New enrolment, demographic updates (Name, Address, DOB, Gender), mobile number linkage, and biometric update scheduling.',
    hindiDesc: 'नया नामांकन, जनसांख्यिकीय अपडेट (नाम, पता, जन्म तिथि), मोबाइल नंबर लिंक करना और बायोमेट्रिक अपडेट।',
    requiredDocs: ['Identity Proof (PAN/Voter/Passport)', 'Address Proof (Electricity Bill/Ration Card)', 'Date of Birth Proof'],
    duration: '5 - 10 working days',
    status: 'Active',
    officialUrl: 'https://myaadhaar.uidai.gov.in/'
  },
  {
    id: 'pan',
    name: 'New PAN Card & Correction',
    hindiName: 'नया पैन कार्ड और सुधार',
    category: 'govt-id',
    desc: 'Application for fresh Permanent Account Number (PAN) for individuals and firms, corrections in name/DOB, and instant e-PAN generation.',
    hindiDesc: 'नया स्थायी खाता संख्या (PAN) आवेदन, नाम/जन्म तिथि में सुधार और तत्काल ई-पैन।',
    requiredDocs: ['Aadhaar Card (Mandatory)', 'Passport Size Photo (with white background)', 'Active Mobile Number for OTP'],
    duration: '7 - 15 working days (e-PAN in 2 hours)',
    status: 'Active',
    officialUrl: 'https://www.pan.utiitsl.com/'
  },
  {
    id: 'voter',
    name: 'Voter ID Card (EPIC)',
    hindiName: 'वोटर आईडी कार्ड',
    category: 'govt-id',
    desc: 'New voter registration (Form 6), correction in existing details (Form 8), change of address, and PVC card printing.',
    hindiDesc: 'नया मतदाता पंजीकरण (फॉर्म 6), मौजूदा विवरण में सुधार (फॉर्म 8), पता बदलना और पीवीसी कार्ड प्रिंटिंग।',
    requiredDocs: ['Aadhaar Card', 'Age Proof (10th mark sheet/DOB certificate)', 'Passport Size Photo'],
    duration: '15 - 30 working days',
    status: 'Active',
    officialUrl: 'https://voters.eci.gov.in/'
  },
  {
    id: 'family-id',
    name: 'Family ID (Parivar Pehchan Patra)',
    hindiName: 'परिवार पहचान पत्र (PPP)',
    category: 'govt-id',
    desc: 'Mandatory ID for all Haryana citizens. Creating new Family ID, member addition/deletion, income verification updates, and scheme linkage.',
    hindiDesc: 'हरियाणा के सभी नागरिकों के लिए अनिवार्य आईडी। नया पीपीपी बनाना, सदस्य जोड़ना/हटाना, आय सत्यापन अपडेट।',
    requiredDocs: ['Aadhaar Cards of all members', 'Bank Account details of HoF', 'Voter Cards (if adult)', 'Mobile linked with Aadhaar'],
    duration: '2 - 5 working days',
    status: 'Active',
    officialUrl: 'https://meraparivar.haryana.gov.in/'
  },
  {
    id: 'ration',
    name: 'Ration Card (BPL/AAY/OPH)',
    hindiName: 'राशन कार्ड (BPL/खाद्य)',
    category: 'govt-id',
    desc: 'Checking eligibility for BPL/AAY cards, downloading digital ration cards, adding family members, and filing grievances.',
    hindiDesc: 'बीपीएल राशन कार्ड की पात्रता की जांच, डाउनलोड, नए सदस्य जोड़ना और शिकायत दर्ज करना।',
    requiredDocs: ['Family ID (Haryana PPP)', 'Aadhaar Card of all members', 'Income Certificate (if applicable)'],
    duration: '7 - 10 working days',
    status: 'Active',
    officialUrl: 'https://epds.haryanafood.gov.in/'
  },

  // Certificates
  {
    id: 'caste-cert',
    name: 'Caste Certificate (SC/BC/OBC)',
    hindiName: 'जाति प्रमाण पत्र',
    category: 'certificates',
    desc: 'Official certificate for reserved categories (SC, Backward Class, OBC) for state and central government educational and employment benefits.',
    hindiDesc: 'आरक्षित श्रेणियों (SC, BC, OBC) के लिए राज्य और केंद्र सरकारी नौकरियों और शिक्षा लाभ के लिए जाति प्रमाण पत्र।',
    requiredDocs: ['Family ID (PPP)', 'Aadhaar Card', 'Patwari Report / Land registry', 'School Certificate/Father Caste Certificate'],
    duration: '3 - 5 working days',
    status: 'Active',
    officialUrl: 'https://saralharyana.gov.in/'
  },
  {
    id: 'income-cert',
    name: 'Income Certificate',
    hindiName: 'आय प्रमाण पत्र',
    category: 'certificates',
    desc: 'Verification of family income, highly required for scholarships, government scheme subsidies, and educational fee concessions.',
    hindiDesc: 'पारिवारिक वार्षिक आय का सत्यापन, छात्रवृत्ति और सरकारी योजनाओं के लिए आवश्यक।',
    requiredDocs: ['Family ID (PPP) with verified income', 'Aadhaar Card', 'Self Declaration Form', 'Salary slip or ITR (if applicable)'],
    duration: '2 - 4 working days',
    status: 'Active',
    officialUrl: 'https://saralharyana.gov.in/'
  },
  {
    id: 'domicile',
    name: 'Residence / Domicile Certificate',
    hindiName: 'मूल निवासी प्रमाण पत्र',
    category: 'certificates',
    desc: 'Certificate proving permanent residency in Haryana state (Haryana Resident Certificate).',
    hindiDesc: 'हरियाणा राज्य में स्थायी निवास सिद्ध करने वाला निवास प्रमाण पत्र।',
    requiredDocs: ['Family ID (PPP)', 'Aadhaar Card', '15 Years Residence Proof (Voter list/Land/School certificate)', 'Patwari Verification'],
    duration: '3 - 5 working days',
    status: 'Active',
    officialUrl: 'https://saralharyana.gov.in/'
  },
  {
    id: 'ews',
    name: 'EWS Certificate',
    hindiName: 'EWS प्रमाण पत्र',
    category: 'certificates',
    desc: 'Economically Weaker Section certificate providing 10% reservation in central/state government jobs and admissions.',
    hindiDesc: 'आर्थिक रूप से कमजोर वर्ग (EWS) के लिए नौकरियों और कॉलेज प्रवेश में 10% आरक्षण हेतु।',
    requiredDocs: ['Family ID (PPP)', 'Aadhaar Card', 'All India Income verification report', 'Land property declaration certificate'],
    duration: '5 - 7 working days',
    status: 'Active',
    officialUrl: 'https://saralharyana.gov.in/'
  },

  // Pensions
  {
    id: 'old-pension',
    name: 'Old Age Samman Allowance',
    hindiName: 'बुढ़ापा पेंशन योजना',
    category: 'pensions',
    desc: 'State pension scheme for senior citizens aged 60 and above with household income under 3 Lakhs annually.',
    hindiDesc: '60 वर्ष और उससे अधिक आयु के वरिष्ठ नागरिकों के लिए सम्मान भत्ता पेंशन योजना।',
    requiredDocs: ['Family ID (Age verified)', 'Aadhaar Card', 'Bank Account Passbook (linked with Aadhaar)', 'Voter List copy'],
    duration: '15 - 30 working days',
    status: 'Active',
    officialUrl: 'https://saralharyana.gov.in/'
  },
  {
    id: 'widow-pension',
    name: 'Widow / Destitute Pension',
    hindiName: 'विधवा एवं बेसहारा पेंशन',
    category: 'pensions',
    desc: 'Financial assistance and social security for widows and destitute women in Haryana.',
    hindiDesc: 'हरियाणा की विधवाओं और निराश्रित महिलाओं के लिए वित्तीय सहायता योजना।',
    requiredDocs: ['Family ID', 'Husband Death Certificate', 'Aadhaar Card', 'Bank Passbook copy', 'Residence Verification'],
    duration: '15 - 30 working days',
    status: 'Active',
    officialUrl: 'https://saralharyana.gov.in/'
  },
  {
    id: 'disability-pension',
    name: 'Divyang (Disability) Pension',
    hindiName: 'विकलांग / दिव्यांग पेंशन',
    category: 'pensions',
    desc: 'Pension for individuals with 40% or more disability certified by CMO medical board.',
    hindiDesc: 'CMO चिकित्सा बोर्ड द्वारा प्रमाणित 40% या अधिक विकलांगता वाले व्यक्तियों के लिए मासिक पेंशन।',
    requiredDocs: ['Family ID', 'Disability Certificate (min 40%)', 'Aadhaar Card', 'Bank Passbook', 'UDID Card'],
    duration: '15 - 30 working days',
    status: 'Active',
    officialUrl: 'https://saralharyana.gov.in/'
  },

  // Utilities & Banking
  {
    id: 'electricity',
    name: 'Electricity Bill Payment',
    hindiName: 'बिजली बिल भुगतान',
    category: 'utility',
    desc: 'Instant online bill payments for DHBVN/UHBVN power connections and instant receipt printing.',
    hindiDesc: 'DHBVN/UHBVN बिजली बिलों का तत्काल भुगतान व पक्की रसीद।',
    requiredDocs: ['Consumer Account Number (Electricity Bill)', 'Registered Mobile Number'],
    duration: 'Instant (Receipt in 1 minute)',
    status: 'Active',
    officialUrl: 'https://epayment.dhbvn.org.in/'
  },
  {
    id: 'water',
    name: 'Water Bill Payment',
    hindiName: 'पानी बिल भुगतान',
    category: 'utility',
    desc: 'Instant online bill payments for water and sewer charges, and instant receipt printing.',
    hindiDesc: 'पानी के बिलों का तत्काल भुगतान व पक्की रसीद।',
    requiredDocs: ['Consumer Account Number / Water Bill Number', 'Registered Mobile Number'],
    duration: 'Instant (Receipt in 1 minute)',
    status: 'Active',
    officialUrl: 'https://phedharyana.gov.in/'
  },
  {
    id: 'aeps',
    name: 'Aadhaar ATM (AEPS) Cash Withdrawal',
    hindiName: 'आधार निकासी और मनी ट्रांसफर',
    category: 'utility',
    desc: 'Withdraw cash securely from any bank account using biometric thumbprint verification and domestic money transfers (DMT) 24x7.',
    hindiDesc: 'बायोमेट्रिक अंगूठे की छाप और घरेलू धन हस्तांतरण का उपयोग करके सुरक्षित रूप से नकद निकालें।',
    requiredDocs: ['Aadhaar Card (Linked with bank)', 'Biometric verification (at our center)'],
    duration: 'Instant',
    status: 'Active',
    officialUrl: 'https://www.npci.org.in/what-we-do/aeps/product-overview'
  },

  // Job & Exams
  {
    id: 'cet-haryana',
    name: 'HSSC CET Haryana Portal',
    hindiName: 'CET हरियाणा पंजीकरण',
    category: 'exams',
    desc: 'Registration for Haryana Common Eligibility Test (CET) for Group C and Group D government posts.',
    hindiDesc: 'ग्रुप सी और ग्रुप डी सरकारी पदों के लिए हरियाणा सामान्य पात्रता परीक्षा (CET) के लिए पंजीकरण।',
    requiredDocs: ['Family ID (PPP)', '10th & 12th Marksheets', 'Graduation Certificate (if applicable)', 'No Govt Job Certificate (if claiming marks)'],
    duration: 'Instant Submission',
    status: 'Active',
    officialUrl: 'https://onetimeregn.haryana.gov.in/'
  },
  {
    id: 'hkrn',
    name: 'Haryana Kaushal Rozgar Nigam (HKRN)',
    hindiName: 'हरियाणा कौशल रोजगार निगम (HKRN)',
    category: 'exams',
    desc: 'Registration for contract and temporary government jobs in Haryana schools, departments, and municipalities.',
    hindiDesc: 'हरियाणा के विभागों, बोर्डों और निगमों में संविदात्मक नौकरियों के लिए पंजीकरण।',
    requiredDocs: ['Family ID', 'Educational Qualification details', 'Skill Certificate / Experience (if any)', 'Socio-economic marks self-declaration'],
    duration: 'Instant Submission',
    status: 'Active',
    officialUrl: 'https://hkrnl.itiharyana.gov.in/'
  },
  {
    id: 'scholarship',
    name: 'Post-Matric Scholarship Forms',
    hindiName: 'छात्रवृत्ति ऑनलाइन फॉर्म',
    category: 'exams',
    desc: 'Online registration for SC/BC scholarships on central and state portals like National Scholarship Portal (NSP) and Har-Chhatravratti.',
    hindiDesc: 'राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) और हर-छात्रवृत्ति पोर्टल पर छात्रवृत्ति के लिए ऑनलाइन पंजीकरण।',
    requiredDocs: ['Family ID', 'Aadhaar Card', 'Income Certificate', 'Caste Certificate', 'Previous Year Marksheet', 'Fee Receipt & Bonafide Certificate'],
    duration: 'Instant Submission',
    status: 'Active',
    officialUrl: 'https://harchhatravratti.highereduhry.ac.in/'
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All Seva (सभी)', icon: ClipboardList },
  { id: 'govt-id', name: 'Govt Cards (पहचान पत्र)', icon: CreditCard },
  { id: 'certificates', name: 'Certificates (प्रमाण पत्र)', icon: FileText },
  { id: 'pensions', name: 'Sarkari Pension (पेंशन)', icon: Landmark },
  { id: 'utility', name: 'Utility & Cash (भुगतान)', icon: MoneyTransferIcon },
  { id: 'exams', name: 'Jobs & Exams (नौकरी)', icon: GraduationCap }
];

function MoneyTransferIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

interface CscPortalProps {
  onBackToHome: () => void;
  openContactModal: (serviceName?: string) => void;
}

export default function CscPortal({ onBackToHome, openContactModal }: CscPortalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [enquiryService, setEnquiryService] = useState<string>('');
  
  // Enquiry form states
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  // Toggle document selection for the live checklist builder
  const toggleDocSelection = (doc: string) => {
    setSelectedDocs(prev => 
      prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc]
    );
  };

  // Filter services based on category and search query
  const filteredServices = useMemo(() => {
    return CSC_SERVICES.filter(service => {
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesSearch = 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.hindiName.includes(searchQuery) ||
        service.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.hindiDesc.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Aggregate all required documents for the filtered/searched list
  const aggregatedDocuments = useMemo(() => {
    const docs = new Set<string>();
    filteredServices.forEach(s => s.requiredDocs.forEach(d => docs.add(d)));
    return Array.from(docs);
  }, [filteredServices]);

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryName || !enquiryPhone) return;
    
    // Process enquiry simulation (connecting to local visual feedback)
    setEnquirySubmitted(true);
    setTimeout(() => {
      setEnquiryName('');
      setEnquiryPhone('');
      setEnquiryMessage('');
      setEnquirySubmitted(false);
      openContactModal(`CSC Service Inquiry: ${enquiryService || 'General'}`);
    }, 1500);
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen text-slate-800 pb-20">
      {/* 1. Header Banner */}
      <div className="relative w-full overflow-hidden bg-slate-900 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Abstract background graphics */}
        <div className="absolute inset-0 bg-radial-gradient from-orange-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-gradient-to-r from-orange-600/10 to-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <button 
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold mb-4 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Homepage
            </button>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-black tracking-widest uppercase mb-3 border border-orange-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Digital India Portal
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none mb-4">
              CSC Online Seva Portal <span className="text-orange-500 text-3xl font-normal block sm:inline sm:ml-2">सीएससी सेवाएं</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-light">
              We process all Government registrations, PAN/Aadhaar/Family ID services, certificates, pensions, and college form applications with 100% accuracy and speed.
            </p>
          </div>

          <div className="flex gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50 backdrop-blur-md">
            <div className="text-center px-4 py-1.5">
              <span className="block text-xl sm:text-2xl font-black text-orange-400">100%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Secure Seva</span>
            </div>
            <div className="w-px bg-slate-700 self-stretch"></div>
            <div className="text-center px-4 py-1.5">
              <span className="block text-xl sm:text-2xl font-black text-blue-400">Govt</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Approved</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Section Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Quick Search & Filters */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-200/50 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="relative flex-grow max-w-xl">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
              <Search className="w-5 h-5" />
            </span>
            <input 
              type="text" 
              placeholder="Search services (e.g. Aadhar, Caste Certificate, Cet)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Notice */}
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-3 max-w-md">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-800 font-semibold leading-relaxed">
              <strong>हरियाणा नागरिकों के लिए महत्वपूर्ण:</strong> सभी प्रमाण पत्र, पेंशन, और फैमिली आईडी (PPP) के कार्य परिवार पहचान पत्र के माध्यम से ही किए जाते हैं।
            </p>
          </div>
        </div>

        {/* Categories Tab Swapper */}
        <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-thin scrollbar-thumb-slate-200/80 mb-10 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer ${isSelected ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 border-orange-500' : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900'}`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Service Directory List (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-orange-500" />
                Select & Explore Services ({filteredServices.length})
              </h2>
              {selectedCategory !== 'all' && (
                <button onClick={() => setSelectedCategory('all')} className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
                  Reset Category
                </button>
              )}
            </div>

            <div className="grid gap-6">
              <AnimatePresence mode="popLayout">
                {filteredServices.length > 0 ? (
                  filteredServices.map(service => (
                    <motion.div
                      key={service.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (
                          target.closest('button') || 
                          target.closest('a') || 
                          target.closest('input') || 
                          target.tagName === 'BUTTON' || 
                          target.tagName === 'A'
                        ) {
                          return;
                        }
                        if (service.officialUrl) {
                          window.open(service.officialUrl, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className={`bg-white rounded-3xl border border-slate-200/60 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-slate-300 p-5 sm:p-6 transition-all group flex flex-col sm:flex-row gap-5 items-start justify-between ${service.officialUrl ? 'cursor-pointer' : ''}`}
                    >
                      {/* Service Details */}
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full">
                            {service.category.replace('-', ' ')}
                          </span>
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
                            <ShieldCheck className="w-3 h-3" /> {service.status}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-xs text-orange-600 font-bold mb-3 mt-0.5">{service.hindiName}</p>
                        
                        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mb-4">
                          {service.desc}
                        </p>

                        {/* Hindi Helper Description */}
                        <div className="bg-slate-50 border-l-4 border-orange-400 p-3 rounded-r-xl text-xs text-slate-600 italic leading-relaxed mb-4">
                          {service.hindiDesc}
                        </div>

                        {/* Required Documents Tag List */}
                        <div>
                          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Required Documents / दस्तावेज:</span>
                          <div className="flex flex-wrap gap-2">
                            {service.requiredDocs.map((doc, idx) => {
                              const isSelected = selectedDocs.includes(doc);
                              return (
                                <button
                                  key={idx}
                                  onClick={() => toggleDocSelection(doc)}
                                  className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all text-left cursor-pointer ${isSelected ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'}`}
                                >
                                  {isSelected ? <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> : <div className="w-2.5 h-2.5 rounded-full bg-slate-300 flex-shrink-0" />}
                                  {doc}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Info Panel & Apply CTA */}
                      <div className="flex flex-col sm:items-end gap-3.5 self-stretch justify-between sm:w-44 flex-shrink-0 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-5">
                        <div className="flex flex-col sm:items-end">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Estimated Duration</span>
                          <span className="text-sm font-black text-slate-800 flex items-center gap-1 sm:text-right mt-0.5">
                            <Clock className="w-4 h-4 text-orange-500" /> {service.duration}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                          {service.officialUrl && (
                            <a
                              href={service.officialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-4 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98"
                            >
                              Open Official Link <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button 
                            onClick={() => openContactModal(service.name)}
                            className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5 text-orange-500" /> Call Center
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-xs">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
                      <Search className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">No services found matching your criteria</h4>
                    <p className="text-slate-500 text-sm max-w-sm">Try tweaking your search term or selecting a different category from above.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: Document Checklist & Enquiry Box (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-24">
            
            {/* 1. Document Checklist Builder */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <h3 className="text-lg font-extrabold flex items-center gap-2 mb-2">
                <FileCheck className="w-5 h-5 text-orange-500" />
                Document Checklist Builder
              </h3>
              <p className="text-slate-300 text-xs leading-normal mb-5">
                Select documents below to build a dynamic list of things you need to carry when you visit Rakhi Internet.
              </p>

              <div className="flex flex-col gap-3 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 pr-2">
                {aggregatedDocuments.map((doc, idx) => {
                  const isChecked = selectedDocs.includes(doc);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleDocSelection(doc)}
                      className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all text-xs cursor-pointer ${isChecked ? 'bg-orange-500/10 border-orange-500/40 text-orange-400' : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'}`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {isChecked ? (
                          <div className="w-4.5 h-4.5 bg-orange-500 text-white flex items-center justify-center rounded-md">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-4.5 h-4.5 border border-slate-600 rounded-md bg-transparent" />
                        )}
                      </div>
                      <span className="font-semibold">{doc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Check List Result Display */}
              {selectedDocs.length > 0 ? (
                <div className="mt-6 pt-5 border-t border-slate-800">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Custom Checklist:</span>
                    <button onClick={() => setSelectedDocs([])} className="text-[10px] font-bold text-slate-400 hover:text-white underline transition-colors">
                      Clear All
                    </button>
                  </div>
                  <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 flex flex-col gap-2">
                    {selectedDocs.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="font-medium line-clamp-1">{doc}</span>
                      </div>
                    ))}
                    <p className="text-[10px] text-slate-400 font-medium italic mt-2 text-center">
                      ✓ Take screenshot or list down these items before visiting us!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 pt-5 border-t border-slate-800 text-center py-4 bg-slate-800/30 rounded-2xl border border-dashed border-slate-800">
                  <span className="text-xs text-slate-400 italic">No items selected in checklist yet.</span>
                </div>
              )}
            </div>

            {/* Visit Office Info */}
            <div className="bg-gradient-to-br from-slate-100 to-slate-200/50 rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center border border-orange-200/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Visit Rakhi Internet Center</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hissar, Haryana</p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 text-xs text-slate-600">
                <div className="flex gap-2">
                  <strong className="font-extrabold text-slate-800 w-16">Narnaund:</strong>
                  <span>Bus Stand, Front of Police Station, Old, Narnaund, Haryana 125039</span>
                </div>
                <div className="flex gap-2">
                  <strong className="font-extrabold text-slate-800 w-16">Jind:</strong>
                  <span>Bhiwani Bypass, main chowk, Jind, Haryana 126102</span>
                </div>
                <div className="flex gap-2">
                  <strong className="font-extrabold text-slate-800 w-16">Uchana:</strong>
                  <span>main market railway road uchana</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
