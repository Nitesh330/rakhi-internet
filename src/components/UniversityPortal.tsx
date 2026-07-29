import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  GraduationCap, 
  ExternalLink, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Info, 
  Phone, 
  HelpCircle, 
  BookOpen, 
  Calendar, 
  Building2, 
  Award, 
  Clock, 
  Bookmark, 
  FileText,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  Link2
} from 'lucide-react';

interface University {
  id: string;
  name: string;
  hindiName: string;
  shortName: string;
  type: 'state' | 'central' | 'tech' | 'agri-medical' | 'distance';
  location: string;
  established: number;
  grade: string;
  website: string;
  admissionUrl: string;
  courses: string[];
  distanceAvailable: boolean;
  desc: string;
  hindiDesc: string;
  admissionStatus: 'Open' | 'Closed' | 'Coming Soon';
  importantDates?: string;
  assistanceFee?: string;
}

const UNIVERSITIES: University[] = [
  {
    id: 'ignou',
    name: 'Indira Gandhi National Open University (IGNOU)',
    hindiName: 'इन्दिरा गाँधी राष्ट्रीय मुक्त विश्वविद्यालय (इग्नू)',
    shortName: 'IGNOU',
    type: 'distance',
    location: 'Maidan Garhi, New Delhi (All-India Centers)',
    established: 1985,
    grade: 'A++ (NAAC)',
    website: 'https://www.ignou.ac.in',
    admissionUrl: 'https://ignouadmission.samarth.edu.in/',
    courses: ['BA', 'B.Com', 'MA', 'M.Com', 'BCA', 'MCA', 'B.Ed', 'MBA', 'Diploma & Certificate Courses'],
    distanceAvailable: true,
    desc: "The world's largest university, offering highly-recognized distance education and online degrees. Highly popular in Haryana and across India for flexible higher education.",
    hindiDesc: "दुनिया का सबसे बड़ा मुक्त विश्वविद्यालय, जो उच्च मान्यता प्राप्त दूरस्थ शिक्षा और ऑनलाइन डिग्री प्रदान करता है। लचीली उच्च शिक्षा के लिए हरियाणा और पूरे भारत में अत्यधिक लोकप्रिय।",
    admissionStatus: 'Open',
    importantDates: 'Fresh admission & Re-registration cycles active for January & July sessions.',
    assistanceFee: '₹100 + University Fee'
  },
  {
    id: 'kuk',
    name: 'Kurukshetra University (KUK)',
    hindiName: 'कुरुक्षेत्र विश्वविद्यालय, कुरुक्षेत्र',
    shortName: 'KUK',
    type: 'state',
    location: 'Kurukshetra, Haryana',
    established: 1956,
    grade: 'A++ (NAAC)',
    website: 'https://www.kuk.ac.in',
    admissionUrl: 'https://iums.kuk.ac.in/anon_admissionHome.htm',
    courses: ['BA (Regular/Distance)', 'MA', 'B.Sc', 'B.Ed', 'M.Ed', 'M.Com', 'MBA', 'B.Tech', 'Ph.D'],
    distanceAvailable: true,
    desc: 'One of the oldest and most prestigious premier universities of India, offering regular, self-financing, and distance learning programs with a top-tier A++ NAAC rating.',
    hindiDesc: 'भारत के सबसे पुराने और सबसे प्रतिष्ठित विश्वविद्यालयों में से एक, जो A++ NAAC रेटिंग के साथ नियमित, स्व-वित्तपोषित और दूरस्थ शिक्षा पाठ्यक्रम प्रदान करता है।',
    admissionStatus: 'Open',
    importantDates: 'Distance Admissions active till Oct/Nov, Regular admissions start around June-July.',
    assistanceFee: '₹100 + University Fee'
  },
  {
    id: 'mdu',
    name: 'Maharshi Dayanand University (MDU)',
    hindiName: 'महर्षि दयानंद विश्वविद्यालय, रोहतक',
    shortName: 'MDU',
    type: 'state',
    location: 'Rohtak, Haryana',
    established: 1976,
    grade: 'A+ (NAAC)',
    website: 'https://www.mdu.ac.in',
    admissionUrl: 'https://admission.mdu.ac.in/',
    courses: ['BA (Distance & Regular)', 'B.Com', 'MA', 'M.Sc', 'MBA', 'MCA', 'B.Ed', 'B.Pharmacy', 'L.L.B'],
    distanceAvailable: true,
    desc: 'A prominent state university in Rohtak, majorly preferred by students in Haryana for regular B.Ed/M.Ed and distance learning courses (CDOE MDU).',
    hindiDesc: 'रोहतक में स्थित एक प्रमुख राज्य विश्वविद्यालय, जो नियमित B.Ed/M.Ed और दूरस्थ शिक्षा पाठ्यक्रमों (CDOE MDU) के लिए हरियाणा के छात्रों की पहली पसंद है।',
    admissionStatus: 'Open',
    importantDates: 'Distance admissions open for BA/B.Com/MA cycles. Regular exams ongoing.',
    assistanceFee: '₹100 + University Fee'
  },
  {
    id: 'gjust',
    name: 'Guru Jambheshwar University of Science & Technology',
    hindiName: 'गुरु जम्भेश्वर विज्ञान एवं प्रौद्योगिकी विश्वविद्यालय, हिसार',
    shortName: 'GJUST',
    type: 'tech',
    location: 'Hisar, Haryana',
    established: 1995,
    grade: 'A+ (NAAC)',
    website: 'https://www.gjust.ac.in',
    admissionUrl: 'https://www.gjust.ac.in/admission.php',
    courses: ['B.Tech', 'M.Tech', 'MBA', 'MCA', 'B.Sc (Hons)', 'M.Sc (Physics/Chemistry)', 'B.Pharmacy', 'BBA (Distance)'],
    distanceAvailable: true,
    desc: 'A leading state-level technology and science university in Hisar, highly popular for computer engineering, printing technology, and professional management degrees.',
    hindiDesc: 'हिसार में एक अग्रणी राज्य-स्तरीय प्रौद्योगिकी और विज्ञान विश्वविद्यालय, जो कंप्यूटर इंजीनियरिंग, प्रिंटिंग और पेशेवर प्रबंधन डिग्री के लिए अत्यधिक लोकप्रिय है।',
    admissionStatus: 'Coming Soon',
    importantDates: 'Tech and professional courses admissions start via JEE Main and GJUST online test.',
    assistanceFee: '₹150 + Exam Fee'
  },
  {
    id: 'cdlu',
    name: 'Chaudhary Devi Lal University (CDLU)',
    hindiName: 'चौधरी देवी लाल विश्वविद्यालय, सिरसा',
    shortName: 'CDLU',
    type: 'state',
    location: 'Sirsa, Haryana',
    established: 2003,
    grade: 'B+ (NAAC)',
    website: 'https://www.cdlu.ac.in',
    admissionUrl: 'https://cdlu.digitaluniversity.ac/',
    courses: ['BA', 'B.Com', 'MA', 'M.Com', 'M.Sc', 'B.Ed', 'M.Ed', 'MBA', 'Law'],
    distanceAvailable: true,
    desc: 'Located in Sirsa, catering to the higher education needs of western Haryana. CDLU offers both regular and distance courses at highly affordable fee structures.',
    hindiDesc: 'सिरसा में स्थित, जो पश्चिमी हरियाणा के छात्रों की उच्च शिक्षा आवश्यकताओं को पूरा करता है। CDLU किफायती शुल्क संरचना पर नियमित और दूरस्थ पाठ्यक्रम प्रदान करता है।',
    admissionStatus: 'Open',
    importantDates: 'Online UG/PG registration active under Samarth portal guidelines.',
    assistanceFee: '₹100 + Registration Fee'
  },
  {
    id: 'crsu',
    name: 'Chaudhary Ranbir Singh University (CRSU)',
    hindiName: 'चौधरी रणबीर सिंह विश्वविद्यालय, जींद',
    shortName: 'CRSU',
    type: 'state',
    location: 'Jind, Haryana',
    established: 2014,
    grade: 'A (NAAC)',
    website: 'https://crsu.ac.in',
    admissionUrl: 'https://crsuadmission.samarth.edu.in/',
    courses: ['B.Ed', 'M.Ed', 'BPES', 'B.P.Ed', 'M.P.Ed', 'MBA', 'MCA', 'MA', 'M.Sc', 'Ph.D'],
    distanceAvailable: false,
    desc: 'Located in Jind, CRSU is highly famous in Haryana for Teacher Education (B.Ed/M.Ed) and Physical Education programs. It coordinates state-level B.Ed counselings frequently.',
    hindiDesc: 'जींद में स्थित, CRSU शिक्षक शिक्षा (B.Ed/M.Ed) और शारीरिक शिक्षा पाठ्यक्रमों के लिए हरियाणा में अत्यधिक प्रसिद्ध है। यह अक्सर राज्य-स्तरीय B.Ed काउंसलिंग का समन्वय करता है।',
    admissionStatus: 'Open',
    importantDates: 'B.Ed and general PG admissions are active around June-August. Check regular schedule.',
    assistanceFee: '₹100 + University Fee'
  },
  {
    id: 'cblu',
    name: 'Chaudhary Bansi Lal University (CBLU)',
    hindiName: 'चौधरी बंसी लाल विश्वविद्यालय, भिवानी',
    shortName: 'CBLU',
    type: 'state',
    location: 'Bhiwani, Haryana',
    established: 2014,
    grade: 'UGC Recognized',
    website: 'https://www.cblu.ac.in',
    admissionUrl: 'https://cblu.chassis.co.in/',
    courses: ['BA', 'B.Sc', 'B.Com', 'MA', 'M.Sc', 'M.Com', 'B.Pharmacy', 'B.P.Ed'],
    distanceAvailable: false,
    desc: 'Established by the Government of Haryana in Bhiwani, CBLU is a rapidly growing state university focusing on sports sciences, general commerce, and humanities degrees.',
    hindiDesc: 'भिवानी में हरियाणा सरकार द्वारा स्थापित, CBLU एक तेजी से बढ़ता हुआ राज्य विश्वविद्यालय है जो खेल विज्ञान, सामान्य वाणिज्य और मानविकी डिग्री पर केंद्रित है।',
    admissionStatus: 'Coming Soon',
    importantDates: 'Regular college admissions open through Centralized Haryana Admission Portal.',
    assistanceFee: '₹100 + Portal Fee'
  },
  {
    id: 'cuh',
    name: 'Central University of Haryana (CUH)',
    hindiName: 'हरियाणा केंद्रीय विश्वविद्यालय, महेंद्रगढ़',
    shortName: 'CUH',
    type: 'central',
    location: 'Jant-Pali, Mahendergarh, Haryana',
    established: 2009,
    grade: 'A (NAAC)',
    website: 'https://www.cuh.ac.in',
    admissionUrl: 'https://cuh.samarth.edu.in/',
    courses: ['B.Tech', 'B.Voc', 'M.Sc', 'M.A', 'MBA', 'M.Tech', 'Integrated B.Sc-M.Sc', 'Ph.D'],
    distanceAvailable: false,
    desc: 'A central government funded university offering top-tier infrastructural facilities, scientific laboratories, and admissions majorly through the nationwide CUET exam.',
    hindiDesc: 'एक केंद्र सरकार द्वारा वित्तपोषित विश्वविद्यालय, जो राष्ट्रव्यापी CUET परीक्षा के माध्यम से प्रवेश और शीर्ष स्तर की बुनियादी ढांचा सुविधाएं प्रदान करता है।',
    admissionStatus: 'Open',
    importantDates: 'CUET-UG and CUET-PG counseling process active.',
    assistanceFee: '₹150 + Counselling Fee'
  },
  {
    id: 'dcrust',
    name: 'Deenbandhu Chhotu Ram University of Science & Technology',
    hindiName: 'दीनबंधु छोटू राम विज्ञान एवं प्रौद्योगिकी विश्वविद्यालय, मुरथल',
    shortName: 'DCRUST',
    type: 'tech',
    location: 'Murthal (Sonepat), Haryana',
    established: 2006,
    grade: 'A (NAAC)',
    website: 'https://www.dcrustm.ac.in',
    admissionUrl: 'https://dcrustm.samarth.edu.in/',
    courses: ['B.Tech (CSE/ECE/Civil)', 'M.Tech', 'B.Arch', 'MBA', 'MCA', 'BBA', 'M.Sc'],
    distanceAvailable: false,
    desc: 'Situated in Murthal, Sonipat on Delhi-Ambala NH-44. Highly famous for Engineering (B.Tech) courses and architecture (B.Arch) with great campus placements.',
    hindiDesc: 'दिल्ली-अंबाला NH-44 पर मुरथल (सोनीपत) में स्थित। शानदार कैंपस प्लेसमेंट के साथ इंजीनियरिंग (B.Tech) और वास्तुकला (B.Arch) पाठ्यक्रमों के लिए बेहद प्रसिद्ध।',
    admissionStatus: 'Coming Soon',
    importantDates: 'B.Tech registration based on HSTES Haryana and JEE Main rank cutoffs.',
    assistanceFee: '₹150 + Admission Form Fee'
  },
  {
    id: 'igu',
    name: 'Indira Gandhi University (IGU)',
    hindiName: 'इंदिरा गांधी विश्वविद्यालय, मीरपुर',
    shortName: 'IGU',
    type: 'state',
    location: 'Meerpur, Rewari, Haryana',
    established: 2013,
    grade: 'B (NAAC)',
    website: 'https://www.igu.ac.in',
    admissionUrl: 'https://igu.chassis.co.in/',
    courses: ['BA', 'B.Sc', 'B.Com', 'MA', 'M.Sc', 'M.Com', 'MBA', 'MCA', 'B.Ed'],
    distanceAvailable: false,
    desc: 'Serves Southern Haryana (Rewari, Mahendergarh). Offers various vocational and traditional programs under modern state curriculum.',
    hindiDesc: 'दक्षिणी हरियाणा (रेवाड़ी, महेंद्रगढ़) के छात्रों के लिए स्थापित राज्य विश्वविद्यालय। विभिन्न पारंपरिक एवं व्यावसायिक पाठ्यक्रम प्रदान करता है।',
    admissionStatus: 'Coming Soon',
    importantDates: 'Admissions for standard postgraduate departments open from June.',
    assistanceFee: '₹100 + Portal Fee'
  },
  {
    id: 'ccshau',
    name: 'Chaudhary Charan Singh Haryana Agricultural University',
    hindiName: 'चौधरी चरण सिंह हरियाणा कृषि विश्वविद्यालय, हिसार',
    shortName: 'CCSHAU',
    type: 'agri-medical',
    location: 'Hisar, Haryana',
    established: 1970,
    grade: 'A (ICAR Approved)',
    website: 'https://hau.ac.in',
    admissionUrl: 'https://admissions.hau.ac.in/',
    courses: ['B.Sc (Hons) Agriculture', 'M.Sc Agriculture', 'B.Tech Agricultural Engineering', 'Ph.D'],
    distanceAvailable: false,
    desc: 'One of the biggest agricultural universities in Asia. Known worldwide for agricultural research, crop science education, and highly competitive entrance exams.',
    hindiDesc: 'एशिया के सबसे बड़े कृषि विश्वविद्यालयों में से एक। कृषि अनुसंधान, फसल विज्ञान शिक्षा और अत्यधिक प्रतिस्पर्धी प्रवेश परीक्षाओं के लिए दुनिया भर में प्रसिद्ध।',
    admissionStatus: 'Open',
    importantDates: 'Admissions open for 4-year & 6-year B.Sc Agriculture packages through HAU Entrance Test.',
    assistanceFee: '₹150 + Prospectus Fee'
  },
  {
    id: 'luvas',
    name: 'Lala Lajpat Rai University of Veterinary & Animal Sciences',
    hindiName: 'लाला लाजपत राय पशुचिकित्सा एवं पशुविज्ञान विश्वविद्यालय, हिसार',
    shortName: 'LUVAS',
    type: 'agri-medical',
    location: 'Hisar, Haryana',
    established: 2010,
    grade: 'VCI Recognized',
    website: 'https://www.luvas.edu.in',
    admissionUrl: 'https://luvas.edu.in/admissions.html',
    courses: ['B.V.Sc & A.H.', 'M.V.Sc', 'VLDD (Veterinary Diploma)', 'DVLT (Lab Tech Diploma)'],
    distanceAvailable: false,
    desc: 'A dedicated state university for animal veterinary studies and husbandry. Highly sought after for VLDD (2-year diploma) and B.V.Sc & A.H. degrees.',
    hindiDesc: 'पशु चिकित्सा अध्ययन और पशुपालन के लिए समर्पित राज्य विश्वविद्यालय। VLDD (2 वर्षीय डिप्लोमा) और B.V.Sc डिग्री के लिए छात्रों में विशेष क्रेज।',
    admissionStatus: 'Open',
    importantDates: 'VLDD diploma forms are processed during July-August via common entrance test.',
    assistanceFee: '₹150 + Application Fee'
  }
];

export interface PortalWebsite {
  id: string;
  name: string;
  hindiName: string;
  authority: string;
  purpose: string;
  hindiPurpose: string;
  officialUrl: string;
  status: 'Active' | 'Upcoming' | 'Closed';
  guideSteps: string[];
  documentsNeeded: string[];
  bgColor: string;
  accentColor: string;
}

export const PORTALS_LIST: PortalWebsite[] = [
  {
    id: 'dhe-haryana',
    name: 'DHE Haryana UG/PG College Admissions',
    hindiName: 'उच्चतर शिक्षा विभाग, हरियाणा (कॉलेज दाखिला)',
    authority: 'Directorate of Higher Education, Haryana',
    purpose: 'Centralized admission for BA, B.Sc, B.Com, MA, M.Sc in all Govt, Aided, and Self-Financing colleges of Haryana.',
    hindiPurpose: 'हरियाणा के सभी सरकारी, सहायता प्राप्त और स्व-वित्तपोषित कॉलेजों में स्नातक (UG) और स्नातकोत्तर (PG) कक्षाओं में ऑनलाइन दाखिले के लिए केंद्रीयकृत पोर्टल।',
    officialUrl: 'https://admissions.highereduhry.ac.in/',
    status: 'Active',
    bgColor: 'from-orange-500/10 to-amber-500/10 border-orange-200/50',
    accentColor: 'text-orange-600 bg-orange-50 border-orange-100',
    guideSteps: [
      'Registration on the official portal using Family ID (Parivar Pehchan Patra).',
      'Uploading passport photo, signature, matric/senior secondary marksheets.',
      'Entering weightage claims like Rural Area, NSS/NCC certificates, Haryana Board.',
      'Selecting preferred colleges and streams in preference order.',
      'Document verification by the state online panel.',
      'Release of Merit List based on percentages and category.'
    ],
    documentsNeeded: [
      'Family ID (PPP) with correct income verification',
      '10th & 12th Marksheets (Original scanned)',
      'Character Certificate from last school/college',
      'Domicile & Caste (SC/BC) Certificate (if applicable)',
      'Income Certificate (less than 6 months old for fee concession)'
    ]
  },
  {
    id: 'samarth-uni',
    name: 'Haryana Samarth Portal',
    hindiName: 'हरियाणा समर्थ समर्थ विश्वविद्यालय पोर्टल',
    authority: 'State Universities Unified System',
    purpose: 'Unified state university system for regular undergraduate and postgraduate admissions in multiple state universities (MDU, KUK, CDLU, CBLU, etc.).',
    hindiPurpose: 'विभिन्न राज्य विश्वविद्यालयों में नियमित स्नातक (UG) और स्नातकोत्तर (PG) प्रवेश के लिए एकीकृत राज्य विश्वविद्यालय प्रणाली पोर्टल।',
    officialUrl: 'https://crsuadmission.samarth.edu.in/',
    status: 'Active',
    bgColor: 'from-blue-500/10 to-indigo-500/10 border-blue-200/50',
    accentColor: 'text-blue-600 bg-blue-50 border-blue-100',
    guideSteps: [
      'Register on Samarth Haryana portal with basic academic details.',
      'Choose the university or multiple affiliated colleges and specific programs.',
      'Pay online registration fee and secure admission roll sequence.',
      'Attend counseling rounds if merit lists require physical matching.'
    ],
    documentsNeeded: [
      'Family ID (PPP) copy',
      'Graduation / 12th Pass certificate',
      'Aadhaar details & Active Phone number',
      'Income and Category Certificate (for reservation)'
    ]
  },
  {
    id: 'hstes-tech',
    name: 'HSTES Technical Counseling',
    hindiName: 'हरियाणा राज्य तकनीकी शिक्षा समिति (इंजीनियरिंग)',
    authority: 'Haryana State Technical Education Society',
    purpose: 'Counseling and seat allotment for B.Tech, B.Arch, MCA, MBA, and Diploma Engineering.',
    hindiPurpose: 'बी.टेक, बी.आर्क, एमसीए, एमबीए और डिप्लोमा इंजीनियरिंग में प्रवेश के लिए आधिकारिक काउंसलिंग और सीट आवंटन पोर्टल।',
    officialUrl: 'https://hstes.org.in/',
    status: 'Upcoming',
    bgColor: 'from-violet-500/10 to-indigo-500/10 border-violet-200/50',
    accentColor: 'text-violet-600 bg-violet-50 border-violet-100',
    guideSteps: [
      'Submission of online application with JEE Main / NATA score details.',
      'Payment of central counseling fee.',
      'Online Choice Filling of college branches (YMCA, DCRUST, UIET, private options).',
      'Announcement of mock allotment results.',
      'Final allotment letter download and online physical reporting to allotted college.'
    ],
    documentsNeeded: [
      'JEE Main Admit Card & Rank Card (Scorecard)',
      'HSTES Registration Receipt',
      '10th & 12th Marksheets',
      'Haryana Resident Certificate (Domicile)',
      'Caste & Income Certificate (for TFW - Tuition Fee Waiver seats)'
    ]
  },
  {
    id: 'scert-ded',
    name: 'SCERT D.El.Ed / JBT Portal',
    hindiName: 'हरियाणा जेबीटी / डी.एल.एड दाखिला',
    authority: 'SCERT Haryana & DITE',
    purpose: 'State-level selection for 2-year Diploma in Elementary Education (JBT/D.El.Ed) for teaching aspirants.',
    hindiPurpose: 'हरियाणा के सभी सरकारी (DIET) और स्व-वित्तपोषित संस्थानों में 2-वर्षीय प्रारंभिक शिक्षा डिप्लोमा (JBT/D.El.Ed) में प्रवेश के लिए काउंसलिंग।',
    officialUrl: 'https://dedharyana.org/',
    status: 'Active',
    bgColor: 'from-emerald-500/10 to-teal-500/10 border-emerald-200/50',
    accentColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    guideSteps: [
      'Filling basic qualification particulars based on 12th class percentage.',
      'Choice selection of DIETs (Govt) and Self-Financed private colleges across Haryana districts.',
      'Wait for district-wise counselling lists.',
      'Visiting specified allotted college with documents for physical counseling.'
    ],
    documentsNeeded: [
      '10th & 12th original marksheets (Minimum 50% required in 12th)',
      'Aadhaar card copy',
      'District preference order list',
      'Haryana Resident Certificate'
    ]
  },
  {
    id: 'pms-scholarship',
    name: 'Post Matric Scholarship Haryana',
    hindiName: 'हरियाणा पोस्ट मैट्रिक छात्रवृत्ति पोर्टल',
    authority: 'Higher Education Department, Haryana',
    purpose: 'Online reimbursement and scholarship forms for SC, BC, and minority students studying in colleges.',
    hindiPurpose: 'महाविद्यालयों और विश्वविद्यालयों में पढ़ने वाले अनुसूचित जाति (SC), पिछड़ा वर्ग (BC) और अल्पसंख्यक छात्रों के लिए ऑनलाइन छात्रवृत्ति आवेदन।',
    officialUrl: 'https://hrypms.highereduhry.ac.in/',
    status: 'Active',
    bgColor: 'from-purple-500/10 to-pink-500/10 border-purple-200/50',
    accentColor: 'text-purple-600 bg-purple-50 border-purple-100',
    guideSteps: [
      'Verification of student credentials via Family ID (PPP).',
      'Entering College Name, Roll Number, Course & Year.',
      'Uploading Fee receipt, Aadhaar mapped bank account copy, and Undertaking.',
      'College-level verification of physical attendance and documents.',
      'Direct Benefit Transfer (DBT) of scholarship into student bank account.'
    ],
    documentsNeeded: [
      'Family ID (must contain SC/BC category and verified income)',
      'Current College Admission Fee Slip & ID Card',
      'Aadhaar Mapped Bank Account Passbook copy',
      'Last Exam Pass Marksheet',
      'BPL Card / Income Certificate copy'
    ]
  },
  {
    id: 'bseh-board',
    name: 'BSEH Haryana Board Portal',
    hindiName: 'हरियाणा विद्यालय शिक्षा बोर्ड (HBSE) पोर्टल',
    authority: 'Board of School Education Haryana, Bhiwani',
    purpose: 'Applications for Secondary/Sr. Secondary Re-appear, Compartment, Improvement, and Open Schooling (HOS).',
    hindiPurpose: '10वीं और 12वीं कक्षा के लिए री-अपीयर, कंपार्टमेंट, अंक सुधार और हरियाणा ओपन स्कूल (HOS) के ऑनलाइन फॉर्म और परिणाम।',
    officialUrl: 'https://bseh.org.in/',
    status: 'Active',
    bgColor: 'from-rose-500/10 to-red-500/10 border-rose-200/50',
    accentColor: 'text-rose-600 bg-rose-50 border-rose-100',
    guideSteps: [
      'Select student class, roll number, and exam year from BSEH archives.',
      'Pick required subjects for re-appear or improvement evaluation.',
      'Upload recent photograph with printed name and date of snapshot.',
      'Pay standard BSEH board registration fee online.',
      'Obtain roll number and prepare for regular/open exams held in March/October.'
    ],
    documentsNeeded: [
      'Last BSEH Class 10/12 original failed/compartment marksheet copy',
      'Passport size photo with Candidate Name & current date printed below',
      'Aadhaar Card copy'
    ]
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All Universities (सभी)', count: UNIVERSITIES.length, icon: Building2 },
  { id: 'state', name: 'State Universities (राजकीय)', count: UNIVERSITIES.filter(u => u.type === 'state').length, icon: Layers },
  { id: 'central', name: 'Central University (केंद्रीय)', count: UNIVERSITIES.filter(u => u.type === 'central').length, icon: Award },
  { id: 'tech', name: 'Science & Tech (तकनीकी)', count: UNIVERSITIES.filter(u => u.type === 'tech').length, icon: Briefcase },
  { id: 'agri-medical', name: 'Agri & Veterinary (कृषि)', count: UNIVERSITIES.filter(u => u.type === 'agri-medical').length, icon: GraduationCap },
  { id: 'distance', name: 'Distance Learning (दूरस्थ शिक्षा)', count: UNIVERSITIES.filter(u => u.distanceAvailable).length, icon: BookOpen }
];

interface UniversityPortalProps {
  onBackToHome: () => void;
  openContactModal: (service?: string) => void;
}

export default function UniversityPortal({ onBackToHome, openContactModal }: UniversityPortalProps) {
  const [activeTab, setActiveTab] = useState<'universities' | 'portals'>('universities');
  const [selectedPortalId, setSelectedPortalId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter logic
  const filteredUniversities = useMemo(() => {
    return UNIVERSITIES.filter(uni => {
      const matchesCategory = selectedCategory === 'all' || 
        (selectedCategory === 'distance' ? uni.distanceAvailable : uni.type === selectedCategory);
      
      const matchesSearch = 
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.hindiName.includes(searchQuery) ||
        uni.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.courses.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const filteredPortals = useMemo(() => {
    return PORTALS_LIST.filter(portal => {
      const matchesSearch = 
        portal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        portal.hindiName.includes(searchQuery) ||
        portal.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
        portal.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        portal.hindiPurpose.includes(searchQuery);
      return matchesSearch;
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back and small helper banner */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <button 
            onClick={onBackToHome}
            className="self-start inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-full shadow-sm border border-slate-200 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600 transition-transform group-hover:-translate-x-1" />
            Back to Home (मुख्य पृष्ठ)
          </button>
          
          <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-100/80 px-4 py-1.5 rounded-2xl text-blue-800 font-black text-xs uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Haryana Higher Education Assistance Desk (हरियाणा उच्च शिक्षा सहायता)
          </div>
        </div>

        {/* Hero Banner Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-8 md:p-12 mb-10 shadow-xl border border-blue-950">
          <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/2/23/Kurukshetra_University_Logo.png')] bg-no-repeat bg-right bg-contain mix-blend-color-dodge pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/15 border border-blue-500/30 rounded-full text-xs font-bold text-blue-300 uppercase tracking-wider mb-4">
              <GraduationCap className="w-4 h-4 text-blue-400 animate-bounce" /> UGC-Approved University Portals
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Haryana College & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">University Admission Hub</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Find complete information, official admission link connections, and regular/distance learning courses for major state & central universities in Haryana. <strong className="text-white">Rakhi Internet</strong> handles your full registration, document resizing, form payment, and counselling updates seamlessly.
            </p>
          </div>
          
          <div className="absolute right-12 bottom-0 top-0 hidden lg:flex items-center justify-center opacity-15 pointer-events-none">
            <Building2 className="w-52 h-52 text-blue-400" />
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs max-w-xl mb-8">
          <button
            onClick={() => { setActiveTab('universities'); setSelectedPortalId(null); }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'universities' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <Building2 className="w-4 h-4 text-blue-500" />
            Universities Directory
          </button>
          <button
            onClick={() => { setActiveTab('portals'); setSelectedPortalId(null); }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'portals' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
            Govt Admission Portals
          </button>
        </div>

        {/* Search and Category Filters */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 mb-10">
          <div className="flex flex-col lg:flex-row gap-5 items-stretch lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-grow max-w-2xl">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4.5 text-slate-400 pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </span>
              <input 
                type="text" 
                placeholder={activeTab === 'universities' 
                  ? "Search by University name, courses, location (e.g. Kurukshetra, B.Ed, HAU)..." 
                  : "Search by Government portal name, authority, or purpose (e.g. DHE, SCERT, PMS)..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white text-sm font-bold text-slate-800 rounded-2xl py-3.5 pl-12 pr-4 transition-all focus:outline-none placeholder:text-slate-400 placeholder:font-medium"
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

            {/* Quick Helper Alert */}
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-2xl p-3.5 max-w-md">
              <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed font-semibold">
                <strong>Admission Assistance:</strong> क्या आपको फॉर्म भरने, फोटो रीसाइज़िंग या ऑनलाइन भुगतान में समस्या आ रही है? हमारी टीम आपके घर बैठे सभी यूनिवर्सिटी फॉर्म भर सकती है।
              </div>
            </div>
          </div>

          {/* Categorization tabs */}
          {activeTab === 'universities' && (
            <div className="flex overflow-x-auto gap-2.5 pb-2 mt-6 scrollbar-thin scrollbar-thumb-slate-200">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4.5 py-3 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer ${isSelected ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200/75 border border-slate-200/40 text-slate-600'}`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {cat.name}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ml-1 ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Grid Content */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Universities / Portals Directory (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. UNIVERSITIES TAB */}
            {activeTab === 'universities' && (
              <>
                <div className="flex justify-between items-center px-1">
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Haryana Universities ({filteredUniversities.length})
                  </h2>
                  {selectedCategory !== 'all' && (
                    <button onClick={() => setSelectedCategory('all')} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
                      View All (सभी देखें)
                    </button>
                  )}
                </div>

                <AnimatePresence mode="popLayout">
                  {filteredUniversities.length > 0 ? (
                    filteredUniversities.map((uni) => (
                      <motion.div
                        key={uni.id}
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
                          if (uni.admissionUrl) {
                            window.open(uni.admissionUrl, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        className={`bg-white rounded-3xl border border-slate-200/60 p-6 md:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:shadow-lg hover:border-slate-300 transition-all group relative overflow-hidden ${uni.admissionUrl ? 'cursor-pointer' : ''}`}
                      >
                        {/* Background faint card tag */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none -z-10" />

                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                          <div>
                            {/* Tags */}
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full">
                                {uni.type.replace('-', ' ')} university
                              </span>
                              <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <Award className="w-3 h-3 text-indigo-500" /> NAAC {uni.grade}
                              </span>
                              {uni.distanceAvailable && (
                                <span className="bg-teal-50 text-teal-700 border border-teal-100 text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full">
                                  Distance CDOE Available
                                </span>
                              )}
                            </div>

                            <h3 className="text-lg md:text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                              {uni.name}
                            </h3>
                            <p className="text-xs text-blue-600 font-extrabold mb-3">{uni.hindiName}</p>
                          </div>

                          {/* Admission Status Badge */}
                          <div className="self-start">
                            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black tracking-wide border ${
                              uni.admissionStatus === 'Open' 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                : uni.admissionStatus === 'Coming Soon'
                                ? 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse'
                                : 'bg-rose-50 border-rose-200 text-rose-700'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${
                                uni.admissionStatus === 'Open' ? 'bg-emerald-500 animate-ping' : uni.admissionStatus === 'Coming Soon' ? 'bg-amber-500' : 'bg-rose-500'
                              }`}></span>
                              Admission {uni.admissionStatus}
                            </span>
                          </div>
                        </div>

                        {/* Desc text */}
                        <p className="text-sm text-slate-600 leading-relaxed mb-4 max-w-3xl">
                          {uni.desc}
                        </p>
                        <div className="bg-slate-50 border-l-4 border-blue-500 p-3.5 rounded-r-xl text-xs text-slate-600 italic leading-relaxed mb-5">
                          {uni.hindiDesc}
                        </div>

                        {/* Key features of uni */}
                        <div className="grid sm:grid-cols-2 gap-4 pb-5 mb-5 border-b border-slate-100 text-xs">
                          <div className="space-y-2">
                            <span className="block text-[10px] text-slate-400 font-black uppercase tracking-wider">Popular Offered Courses</span>
                            <div className="flex flex-wrap gap-1.5">
                              {uni.courses.map((course, i) => (
                                <span key={i} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/40 font-bold transition-all">
                                  {course}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="block text-[10px] text-slate-400 font-black uppercase tracking-wider">Admission Schedule Information</span>
                            <p className="text-slate-600 font-semibold leading-relaxed">
                              {uni.importantDates || 'Contact our help desk for detailed prospectus criteria.'}
                            </p>
                          </div>
                        </div>

                        {/* Action Panel and Official Links */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {uni.location}</span>
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Estd. {uni.established}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> Assis. Fee: {uni.assistanceFee}</span>
                          </div>

                          <div className="flex items-center gap-2.5 self-stretch sm:self-auto w-full sm:w-auto">
                            <a
                              href={uni.admissionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3.5 px-6 rounded-xl transition-all cursor-pointer shadow-xs active:scale-98 text-center"
                            >
                              Official Admission Portal <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-xs">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
                        <Search className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-800 mb-1">No University found matching search term</h4>
                      <p className="text-slate-500 text-sm max-w-sm">Try typing Kurukshetra, MDU, GJU, HAU, B.Ed or choose a different categories tab from above.</p>
                    </div>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* 2. GOVT PORTALS LIST TAB (NOT SELECTED YET) */}
            {activeTab === 'portals' && !selectedPortalId && (
              <>
                <div className="flex justify-between items-center px-1">
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
                    Haryana Government Admission Portals ({filteredPortals.length})
                  </h2>
                </div>

                <AnimatePresence mode="popLayout">
                  {filteredPortals.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                      {filteredPortals.map((portal) => (
                        <motion.div
                          key={portal.id}
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          onClick={() => { setSelectedPortalId(portal.id); window.scrollTo({ top: 350, behavior: 'smooth' }); }}
                          className={`bg-gradient-to-br ${portal.bgColor} rounded-3xl border hover:border-blue-300 p-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)] hover:shadow-md transition-all group relative overflow-hidden cursor-pointer flex flex-col justify-between h-[230px]`}
                        >
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wide border ${portal.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${portal.status === 'Active' ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
                                {portal.status}
                              </span>
                              <span className="text-[10px] font-extrabold text-slate-400">{portal.authority}</span>
                            </div>
                            <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                              {portal.name}
                            </h3>
                            <p className="text-[11px] text-blue-600 font-extrabold mb-3 line-clamp-1">{portal.hindiName}</p>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                              {portal.purpose}
                            </p>
                          </div>
                          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Explore Guidelines</span>
                            <span className="text-xs font-black text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              Explore <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-xs">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
                        <Search className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-800 mb-1">No Official Portal found matching search term</h4>
                      <p className="text-slate-500 text-sm max-w-sm">Try searching DHE, SCERT, Samarth, PMS or BSEH.</p>
                    </div>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* 3. DETAILED SUB-PAGE PORTAL VIEW */}
            {activeTab === 'portals' && selectedPortalId && (() => {
              const portal = PORTALS_LIST.find(p => p.id === selectedPortalId);
              if (!portal) return null;
              return (
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="bg-white rounded-3xl border border-slate-200/60 p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.01)] space-y-6"
                >
                  {/* Detail view header back control */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <button
                      onClick={() => setSelectedPortalId(null)}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-150 hover:bg-slate-200/80 text-slate-850 font-black text-xs rounded-full transition-all cursor-pointer group"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-blue-600 transition-transform group-hover:-translate-x-0.5" />
                      Back to Portals List (पोर्टल सूची)
                    </button>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{portal.authority}</span>
                  </div>

                  {/* Styled Portal Card Hero */}
                  <div 
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
                      if (portal.officialUrl) {
                        window.open(portal.officialUrl, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className={`p-6 rounded-3xl bg-gradient-to-br ${portal.bgColor} border flex flex-col justify-between relative overflow-hidden ${portal.officialUrl ? 'cursor-pointer hover:border-slate-350 hover:shadow-xs transition-all' : ''}`}
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex flex-wrap items-center gap-2.5 mb-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[9px] font-black tracking-wide border ${portal.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                          ● Status: {portal.status}
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-1">{portal.name}</h2>
                      <p className="text-xs text-blue-600 font-extrabold mb-4">{portal.hindiName}</p>
                      <p className="text-xs md:text-sm text-slate-605 leading-relaxed max-w-2xl font-semibold">{portal.purpose}</p>
                    </div>
                  </div>

                  {/* Hindi & English purpose details */}
                  <div className="bg-blue-50/50 border border-blue-100/50 p-4.5 rounded-2xl text-xs text-slate-700 space-y-2 leading-relaxed">
                    <div className="flex gap-2 items-start font-black text-blue-900">
                      <Info className="w-4.5 h-4.5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>दाखिला / फॉर्म भरने की आवश्यक जानकारी:</span>
                    </div>
                    <p className="italic font-bold text-slate-600 pl-6.5">{portal.hindiPurpose}</p>
                  </div>

                  {/* Grid of steps and checklist */}
                  <div className="grid md:grid-cols-2 gap-6 pt-2">
                    {/* Step Guide */}
                    <div className="space-y-3.5">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">★</span>
                        Step-by-Step Submission Process
                      </h3>
                      <ol className="space-y-3 pl-1">
                        {portal.guideSteps.map((step, idx) => (
                          <li key={idx} className="flex gap-2.5 text-xs text-slate-600 font-semibold">
                            <span className="font-bold text-blue-600 flex-shrink-0 bg-blue-50 w-5 h-5 rounded-full flex items-center justify-center border border-blue-100 text-[10px]">{idx + 1}</span>
                            <span className="leading-normal">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Required Documents */}
                    <div className="space-y-3.5">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">✓</span>
                        Required Documents Checklist
                      </h3>
                      <ul className="space-y-3 pl-1">
                        {portal.documentsNeeded.map((doc, idx) => (
                          <li key={idx} className="flex gap-2.5 text-xs text-slate-600 font-semibold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span className="leading-normal">{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Form Submission Action Banner */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4 justify-between">
                    <div className="text-xs text-slate-500 font-bold leading-relaxed">
                      क्या आप घर बैठे फॉर्म भरना चाहते हैं? हमारी टीम कूरियर/CSC सपोर्ट के माध्यम से सीधे फॉर्म सबमिट करेगी।
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <a
                        href={portal.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-black text-slate-900 bg-slate-100 hover:bg-slate-200 py-3.5 px-5.5 rounded-xl transition-all cursor-pointer text-center border border-slate-200"
                      >
                        Open Official Link <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => openContactModal(`Fill Form for ${portal.name}`)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3.5 px-5.5 rounded-xl transition-all cursor-pointer text-center shadow-md active:scale-98"
                      >
                        Apply with Rakhi Internet <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })()}

          </div>

          {/* RIGHT: Document/Assistance Checklist & Enquiry Form (4 Cols) */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            
            {/* Admission Process Checklist */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <h3 className="text-base font-black text-white uppercase tracking-widest flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Required Documents Checklist
              </h3>
              <p className="text-slate-300 text-xs leading-normal mb-5">
                Before visiting Rakhi Internet for submission, make sure you carry clear copies of these documents:
              </p>

              <div className="space-y-3 text-xs font-semibold text-slate-200">
                <div className="flex gap-2.5 p-2.5 bg-slate-800/40 rounded-xl border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>10th & 12th original marksheets copy</span>
                </div>
                <div className="flex gap-2.5 p-2.5 bg-slate-800/40 rounded-xl border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Family ID (Parivar Pehchan Patra) - mandatory for state universities</span>
                </div>
                <div className="flex gap-2.5 p-2.5 bg-slate-800/40 rounded-xl border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Aadhaar Card copy & mobile link details</span>
                </div>
                <div className="flex gap-2.5 p-2.5 bg-slate-800/40 rounded-xl border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Character Certificate & Migration (if from other board)</span>
                </div>
                <div className="flex gap-2.5 p-2.5 bg-slate-800/40 rounded-xl border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Caste Certificate (SC/BC) & Income Certificate for scholarships</span>
                </div>
              </div>

              <div className="mt-5 p-3 bg-blue-950/40 border border-blue-900 rounded-xl text-[10px] text-blue-300 flex gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Our in-house CSC tools resize your photos, sign, and PDFs instantly offline during application submission.</span>
              </div>
            </div>



            {/* Quick Contact Panel */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-3xl p-6 border border-blue-100 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200/50">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Direct Admission Helpline</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Fast Offline Form Submission</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                You can directly visit or call our branches at <strong className="text-blue-700">Narnaund, Jind, & Uchana</strong> for prompt application filing, counseling choice filling, and fees payment receipts.
              </p>
              <button 
                onClick={() => openContactModal('Direct University Admission Helpline')}
                className="w-full bg-white hover:bg-slate-50 border border-blue-100 text-blue-700 font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
              >
                Call Support Center
              </button>
            </div>

          </div>

        </div>

        {/* Admission Support FAQ FAQ FAQ */}
        <div className="mt-16 bg-white rounded-3xl border border-slate-200/60 p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.01)]">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <HelpCircle className="w-4.5 h-4.5 text-blue-600" /> Haryana University Admissions FAQ (महत्वपूर्ण सवाल-जवाब)
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-600">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs block mb-1">Q: What is the Samarth Haryana Portal?</span>
              <p className="font-medium">
                A: The State Govt of Haryana uses the unified Samarth Portal for centralized admissions in almost all State Universities and Government/Aided Colleges. Rakhi Internet is expert in handling the unified registrations, merit-list tracking, and counselling.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs block mb-1">Q: क्या कुरुक्षेत्र यूनिवर्सिटी (KUK) से दूरस्थ शिक्षा (Distance Education) मान्य है?</span>
              <p className="font-semibold">
                A: हाँ, कुरुक्षेत्र यूनिवर्सिटी (KUK CDOE) और महर्षि दयानंद यूनिवर्सिटी (MDU) के दूरस्थ पाठ्यक्रम UGC और DEB द्वारा 100% स्वीकृत और सरकारी नौकरियों के लिए पूरी तरह मान्य हैं। हम इनके सीधे प्रवेश फॉर्म भरते हैं।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs block mb-1">Q: How can we check our admit cards, roll numbers or results?</span>
              <p className="font-medium">
                A: When you register, you get a student login ID. Our center helps you check and download admit cards, download physical marksheets, fill reappearance/exam forms, and submit scholarship requests.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs block mb-1">Q: B.Ed / D.El.Ed (JBT) में एडमिशन का क्या प्रोसेस है?</span>
              <p className="font-semibold">
                A: हरियाणा में B.Ed (CRSU, KUK, MDU) और D.El.Ed में प्रवेश मेरिट या राज्य-स्तरीय काउन्सिलिंग द्वारा होते हैं। कॉलेज चॉइस फिलिंग में मार्गदर्शन और फॉर्म भरने के लिए आप हमारे केंद्र पर आवश्यक दस्तावेज़ों के साथ संपर्क कर सकते हैं।
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
