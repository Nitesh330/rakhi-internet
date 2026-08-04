/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
// @ts-ignore
import creatorImage from "./assets/ai-removebg-preview.png";
const developerImage = "/nn.png";
const manojImage = "/images/manoj.png";
const manishImage = "/images/manish.png";
const sonuImage = "/images/sonu.png";
const ashishImage = "/images/Ashish.png";

const pankajImage = "/images/pankaj.png";
import React, { useState, useEffect, useRef } from "react";
import {
  Moon,
  Sun,
  UserCog,
  Home,
  Music,
  Truck,
  BookOpen,
  Monitor,
  Sparkles,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Plane,
  Mail,
  ChevronDown,
  Search,
  Calculator,
  Package,
  Clock,
  ExternalLink,
  ShieldCheck,
  DollarSign,
  Globe,
  Briefcase,
  Users,
  Award,
  MessageSquare,
  Heart,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Facebook,
  Keyboard,
  Printer,
  Bot,
  Scissors,
  Shirt,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ChatPortal from "./components/ChatPortal";

import ContactModal from "./components/ContactModal";
import PdfTools from "./components/PdfTools";
import CourierTrackWidget from "./components/CourierTrackWidget";
import CourierRatesWidget from "./components/CourierRatesWidget";
import CscPortal from "./components/CscPortal";
import CourierPortal from "./components/CourierPortal";
import UniversityPortal from "./components/UniversityPortal";
import TypingCenter from "./components/TypingCenter";
import PrintService from "./components/PrintService";
import AdminDashboard from "./components/AdminDashboard";
import PhotoTools from "./components/PhotoTools";
import ImageResizer from "./components/ImageResizer";
import LatestLinksModal from "./components/LatestLinksModal";
// @ts-ignore
import heroBg from "./assets/images/rakhi_internet_shop_bg_1783157086957.jpg";




const HERO_SLIDES = [
  {
    id: "ai",
    badge: "",
    title: "",
    hindiTitle: "",
    subtitle: "",
    image: heroBg,
    video: "",
    badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    accentText: "text-purple-400",
    btnBg: "bg-purple-600 hover:bg-purple-700 shadow-purple-600/30",
    type: "ai",
  },
  {
    id: "csc",
    badge: "CSC Digital Seva (सीएससी ऑनलाइन सेवाएं)",
    title: "Your Complete Digital & CSC\nService Solution",
    hindiTitle: "राखी इंटरनेट - डिजिटल सेवा केंद्र",
    subtitle:
      "Apply for Aadhaar, PAN card, Government Schemes, utility bill payments, and all official registrations instantly with professional support.",
    image: heroBg,
    badgeBg: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    accentText: "text-orange-400",
    btnBg: "bg-orange-600 hover:bg-orange-700 shadow-orange-600/30",
    type: "csc",
  },
  {
    id: "university",
    badge: "Admissions & Counseling (यूनिवर्सिटी दाखिला केंद्र)",
    title: "Haryana University\nAdmissions Counseling",
    hindiTitle: "विश्वविद्यालय दाखिला एवं काउंसलिंग हब",
    subtitle:
      "Official admission support for Kurukshetra (KUK), MDU, GJU, HAU, CDLU, B.Ed and Distance CDOE courses. Secure your future with expert guidance.",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1600&auto=format&fit=crop",
    badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    accentText: "text-blue-400",
    btnBg: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/30",
    type: "university",
  },
  {
    id: "courier",
    badge: "International Shipping (अंतर्राष्ट्रीय कूरियर सेवा)",
    title: "Global Parcel & International\nCourier Service",
    hindiTitle: "सुपरफास्ट एक्सप्रेस कूरियर डिलीवरी",
    subtitle:
      "Ship products, documents, and domestic packages worldwide at the lowest rates. Guaranteed delivery with door-to-door online live tracking.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop",
    badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    accentText: "text-cyan-400",
    btnBg: "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/30",
    type: "courier",
  },
];

const BRANCH_EXPERTS = [
  {
    name: "Pankaj Pawar",
    role: "Admission & Courier Counselor",
    branch: "Jind Branch",
    whatsapp: "918053504080",
    image: pankajImage,
    specialty: "Distance Education Admissions Counseling",
    themeColor: "indigo",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-100/80",
    gradient: "from-indigo-500 via-blue-500 to-cyan-500",
    ringColor: "ring-indigo-100",
  },
  {
    name: "Ashish Dhankar",
    role: "CSC Work Specialist",
    branch: "Jind Branch",
    whatsapp: "918683030747",
    image: ashishImage,
    specialty: "Digital Records & Bulk Form Processing",
    themeColor: "cyan",
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-100/80",
    gradient: "from-cyan-400 via-teal-500 to-sky-500",
    ringColor: "ring-cyan-100",
  },
  {
    name: "Manish Sheoran",
    role: "Branch Manager & IT Head",
    branch: "Narnaund Branch",
    whatsapp: "919896073011",
    image: manishImage,
    specialty: "CSC Portals & Digital Registrations Expert",
    themeColor: "blue",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-100/80",
    gradient: "from-blue-500 via-indigo-500 to-indigo-600",
    ringColor: "ring-blue-100",
  },
  {
    name: "Sonu Sheoran",
    role: "Senior Counselor",
    branch: "Narnaund Branch",
    whatsapp: "918059970904",
    image: sonuImage,
    specialty: "University Admissions & KUK/MDU Expert",
    themeColor: "purple",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-100/80",
    gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
    ringColor: "ring-purple-100",
  },
  {
    name: "Aman Sheokand",
    role: "3rd branch head",
    branch: "Uchana Branch",
    whatsapp: "919053251092",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    specialty: "International Courier & DHL/FedEx Expert",
    themeColor: "emerald",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100/80",
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    ringColor: "ring-emerald-100",
  },
  {
    name: "Manoj Kharab",
    role: "Operations Expert / संचालन विशेषज्ञ",
    branch: "Narnaund Branch",
    image: manojImage,
    specialty: "E-Governance Services & Courier Operations",
    themeColor: "rose",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-100/80",
    gradient: "from-rose-500 via-pink-500 to-red-500",
    ringColor: "ring-rose-100",
  },
];

export default function App() {
  const robotConstraintsRef = useRef(null);
  const isDraggingRef = useRef(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileCourierOpen, setMobileCourierOpen] = useState(false);
  const [mobileContactOpen, setMobileContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [pdfToolsModalOpen, setPdfToolsModalOpen] = useState(false);
  const [photoToolsModalOpen, setPhotoToolsModalOpen] = useState(false);
  const [imageResizerModalOpen, setImageResizerModalOpen] = useState(false);
  const [photoToolActiveTab, setPhotoToolActiveTab] = useState<
    "bg-remover" | "clothes-changer"
  >("bg-remover");
  const [selectedService, setSelectedService] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("narnaund");
  const [courierTrackModalOpen, setCourierTrackModalOpen] = useState(false);
  const [courierRatesModalOpen, setCourierRatesModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<
    | "home"
    | "csc-portal"
    | "courier-portal"
    | "university-portal"
    | "typing-center"
    | "print-service"
    | "chat-portal"
    | "admin"
  >("home");
  const [courierPortalTab, setCourierPortalTab] = useState<
    "track" | "calculator"
  >("track");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAiTooltip, setShowAiTooltip] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    setVideoFailed(false);
  }, [currentSlide]);
  const [latestLinksOpen, setLatestLinksOpen] = useState(false);
  const [latestJobs, setLatestJobs] = useState<
    { title: string; link: string; pubDate: string; source: string }[]
  >([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  useEffect(() => {
    if (latestLinksOpen && latestJobs.length === 0) {
      setIsLoadingJobs(true);
      fetch("/api/latest-jobs")
        .then((res) => res.json())
        .then((data) => setLatestJobs(data))
        .catch(console.error)
        .finally(() => setIsLoadingJobs(false));
    }
  }, [latestLinksOpen]);

  useEffect(() => {
    // Show AI tooltip after 2.5 seconds
    const showTimer = setTimeout(() => {
      setShowAiTooltip(true);
    }, 2500);

    // Automatically hide the tooltip after 5 seconds of being shown (7.5 seconds total)
    const hideTimer = setTimeout(() => {
      setShowAiTooltip(false);
    }, 7500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // 1. Back button handling on mobile screens: intercept popstate to close modals/sub-views
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      let handled = false;

      if (contactModalOpen) {
        setContactModalOpen(false);
        handled = true;
      } else if (pdfToolsModalOpen) {
        setPdfToolsModalOpen(false);
        handled = true;
      } else if (imageResizerModalOpen) {
        setImageResizerModalOpen(false);
        handled = true;
      } else if (photoToolsModalOpen) {
        setPhotoToolsModalOpen(false);
        handled = true;
      } else if (courierTrackModalOpen) {
        setCourierTrackModalOpen(false);
        handled = true;
      } else if (courierRatesModalOpen) {
        setCourierRatesModalOpen(false);
        handled = true;
      } else if (mobileMenuOpen) {
        setMobileMenuOpen(false);
        handled = true;
      } else if (currentView !== "home") {
        setCurrentView("home");
        handled = true;
      }

      if (handled) {
        // Push state back to keep the history "cushion" so the next back press is also intercepted if needed
        window.history.pushState({ appIntercept: true }, "");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [
    contactModalOpen,
    pdfToolsModalOpen,
    photoToolsModalOpen,
    imageResizerModalOpen,
    courierTrackModalOpen,
    courierRatesModalOpen,
    mobileMenuOpen,
    currentView,
  ]);

  // 2. Synchronize active state with history: push dummy state when active, pop state when closing
  useEffect(() => {
    const isActive =
      contactModalOpen ||
      pdfToolsModalOpen ||
      photoToolsModalOpen ||
      imageResizerModalOpen ||
      courierTrackModalOpen ||
      courierRatesModalOpen ||
      mobileMenuOpen ||
      currentView !== "home";

    if (isActive) {
      if (!window.history.state || !window.history.state.appIntercept) {
        window.history.pushState({ appIntercept: true }, "");
      }
    } else {
      if (window.history.state && window.history.state.appIntercept) {
        window.history.back();
      }
    }
  }, [
    contactModalOpen,
    pdfToolsModalOpen,
    photoToolsModalOpen,
    imageResizerModalOpen,
    courierTrackModalOpen,
    courierRatesModalOpen,
    mobileMenuOpen,
    currentView,
  ]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSliderHovered || currentView !== "home") return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isSliderHovered, currentView, currentSlide]);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (currentView !== "home") {
      setCurrentView("home");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const openContactModal = (service = "", branch = "jind") => {
    setSelectedService(service);
    setSelectedBranch(branch);
    setContactModalOpen(true);
    setMobileMenuOpen(false);
    setCourierTrackModalOpen(false);
    setCourierRatesModalOpen(false);
    setPdfToolsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-gray-900 selection:bg-blue-100">
      {/* 1. Navigation Bar */}
      {currentView !== "chat-portal" && (
        <nav
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || mobileMenuOpen ? "bg-white/95 backdrop-blur-xl border-b border-gray-200 py-3 shadow-sm" : "bg-transparent py-5"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div
                className="flex items-center gap-3 cursor-pointer group/logo"
                onClick={() => {
                  setCurrentView("home");
                  window.scrollTo(0, 0);
                }}
              >
                <div className="relative w-11 h-11 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden group-hover/logo:shadow-blue-500/30 border border-white/20 transition-all duration-500 group-hover/logo:-translate-y-0.5">
                  <div className="absolute -right-4 -top-4 w-10 h-10 bg-blue-500 rounded-full blur-xl opacity-60 group-hover/logo:scale-150 transition-all duration-700"></div>
                  <div className="absolute -left-4 -bottom-4 w-10 h-10 bg-indigo-500 rounded-full blur-xl opacity-60 group-hover/logo:scale-150 transition-all duration-700"></div>

                  {/* Background Icon Graphic */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.15] mix-blend-plus-lighter">
                    <Globe className="w-8 h-8 rotate-12 group-hover/logo:rotate-[60deg] transition-transform duration-1000 ease-out" />
                  </div>

                  {/* Text */}
                  <span className="relative z-10 tracking-tighter flex items-center group-hover/logo:scale-105 transition-transform duration-300">
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                      R
                    </span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-blue-300 to-cyan-200 -ml-0.5">
                      I
                    </span>
                  </span>
                </div>
                <div>
                  <h1
                    className={`text-xl font-extrabold tracking-tight leading-none mb-0.5 transition-colors ${scrolled ? "text-slate-900" : "text-white drop-shadow-md"}`}
                  >
                    Rakhi Internet
                  </h1>
                  <p
                    className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${scrolled ? "text-blue-600" : "text-blue-200 drop-shadow-sm"}`}
                  >
                    One-Stop Solution
                  </p>
                </div>
              </div>

              {/* Desktop Nav & Contact */}
              <div className="hidden md:flex items-center gap-8">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-full transition-colors ${scrolled ? "text-gray-600 hover:bg-gray-100" : "text-gray-200 hover:bg-white/10"}`}
                  aria-label="Toggle Dark Mode"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setCurrentView("home");
                    window.scrollTo(0, 0);
                  }}
                  className={`font-medium transition-colors text-sm ${scrolled ? "text-gray-900 hover:text-blue-600" : "text-white hover:text-blue-200"}`}
                >
                  Home
                </button>
                <div className="relative group" style={{ perspective: "1200px" }}>
                  <button
                    className={`font-medium transition-colors text-sm flex items-center gap-1 py-2 ${scrolled ? "text-gray-600 hover:text-blue-600" : "text-gray-200 hover:text-white"}`}
                  >
                    Services{" "}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 flex flex-col py-2 z-50 origin-top-[50%] [-webkit-transform:rotateX(-25deg)_translateY(-15px)_scale(0.9)] group-hover:[-webkit-transform:rotateX(0deg)_translateY(0)_scale(1)] pointer-events-none group-hover:pointer-events-auto ease-[cubic-bezier(0.25,1.5,0.5,1)]">
                    <button
                      onClick={() => scrollTo("services")}
                      className="text-left px-4 py-2.5 text-xs text-gray-700 transition-all duration-300 hover:bg-blue-50/80 hover:text-blue-700 hover:scale-105 hover:translate-x-2 hover:-rotate-1 hover:shadow-md hover:z-10 relative rounded-lg mx-1"
                    >
                      CSC Services & Admissions
                    </button>
                    <button
                      onClick={() => setPdfToolsModalOpen(true)}
                      className="text-left px-4 py-2.5 text-xs text-gray-700 transition-all duration-300 hover:bg-blue-50/80 hover:text-blue-700 hover:scale-105 hover:translate-x-2 hover:-rotate-1 hover:shadow-md hover:z-10 relative rounded-lg mx-1"
                    >
                      CSC All-Type PDF Tools
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView("typing-center");
                        window.scrollTo(0, 0);
                      }}
                      className="text-left px-4 py-2.5 text-xs text-gray-700 transition-all duration-300 hover:bg-emerald-50/80 hover:text-emerald-700 hover:scale-105 hover:translate-x-2 hover:-rotate-1 hover:shadow-md hover:z-10 relative rounded-lg mx-1"
                    >
                      Hindi/English Typing Center
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView("print-service");
                        window.scrollTo(0, 0);
                      }}
                      className="text-left px-4 py-2.5 text-xs text-gray-700 transition-all duration-300 hover:bg-purple-50/80 hover:text-purple-700 hover:scale-105 hover:translate-x-2 hover:-rotate-1 hover:shadow-md hover:z-10 relative rounded-lg mx-1"
                    >
                      Document Print Service
                    </button>
                    <div className="h-px bg-gray-100 my-1 mx-2"></div>
                    <button
                      onClick={() => {
                        setPhotoToolActiveTab("bg-remover");
                        setPhotoToolsModalOpen(true);
                      }}
                      className="text-left px-4 py-2.5 text-xs text-gray-700 transition-all duration-300 hover:bg-blue-50/80 hover:text-blue-700 hover:scale-105 hover:translate-x-2 hover:-rotate-1 hover:shadow-md hover:z-10 relative flex items-center gap-2 rounded-lg mx-1"
                    >
                      <Scissors className="w-3.5 h-3.5" /> Photo Background
                      Remover
                    </button>
                    <div className="h-px bg-gray-100 my-1 mx-2"></div>
                    <button
                      onClick={() => {
                        setImageResizerModalOpen(true);
                      }}
                      className="text-left px-4 py-2.5 text-xs text-gray-700 transition-all duration-300 hover:bg-blue-50/80 hover:text-blue-700 hover:scale-105 hover:translate-x-2 hover:-rotate-1 hover:shadow-md hover:z-10 relative flex items-center gap-2 rounded-lg mx-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Image Resizer
                    </button>

                  </div>
                </div>
                <div className="relative group" style={{ perspective: "1200px" }}>
                  <button
                    className={`font-medium transition-colors text-sm flex items-center gap-1 py-2 ${scrolled ? "text-gray-600 hover:text-blue-600" : "text-gray-200 hover:text-white"}`}
                  >
                    Courier{" "}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl border border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 flex flex-col py-2 z-50 origin-top-[50%] [-webkit-transform:rotateX(-25deg)_translateY(-15px)_scale(0.9)] group-hover:[-webkit-transform:rotateX(0deg)_translateY(0)_scale(1)] pointer-events-none group-hover:pointer-events-auto ease-[cubic-bezier(0.25,1.5,0.5,1)]">
                    <button
                      onClick={() => scrollTo("courier")}
                      className="text-left px-4 py-2.5 text-sm text-gray-700 transition-all duration-300 hover:bg-blue-50/80 hover:text-blue-700 hover:scale-105 hover:translate-x-2 hover:-rotate-1 hover:shadow-md hover:z-10 relative rounded-lg mx-1"
                    >
                      About Courier
                    </button>
                    <button
                      onClick={() => {
                        setCourierPortalTab("track");
                        setCurrentView("courier-portal");
                        window.scrollTo(0, 0);
                      }}
                      className="text-left px-4 py-2.5 text-sm text-gray-700 transition-all duration-300 hover:bg-blue-50/80 hover:text-blue-700 hover:scale-105 hover:translate-x-2 hover:-rotate-1 hover:shadow-md hover:z-10 relative rounded-lg mx-1"
                    >
                      Courier Track
                    </button>

                  </div>
                </div>
                <button
                  onClick={() => setLatestLinksOpen(true)}
                  className={`font-medium transition-colors text-sm ${scrolled ? "text-gray-600 hover:text-blue-600" : "text-gray-200 hover:text-white"}`}
                >
                  Latest Links
                </button>

                <div className="relative group" style={{ perspective: "1200px" }}>
                  <button
                    className={`px-5 py-2.5 rounded-full font-black text-sm transition-all shadow-md ml-2 flex items-center gap-1.5 cursor-pointer ${scrolled ? "bg-black text-white hover:bg-slate-800" : "bg-white text-gray-950 hover:bg-slate-100"}`}
                  >
                    Contact Us{" "}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 flex flex-col p-3.5 z-50 origin-[calc(100%-40px)_top] [-webkit-transform:rotateX(-25deg)_rotateY(10deg)_translateY(-15px)_scale(0.9)] group-hover:[-webkit-transform:rotateX(0deg)_rotateY(0deg)_translateY(0)_scale(1)] pointer-events-none group-hover:pointer-events-auto ease-[cubic-bezier(0.25,1.5,0.5,1)]">
                    <div className="px-2.5 pb-2.5 mb-2 border-b border-slate-100 text-left">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">
                        Contact Desk
                      </span>
                      <p className="text-xs text-slate-800 font-extrabold">
                        Choose Your Nearest Branch
                      </p>
                    </div>

                    <button onClick={() => openContactModal("", "jind")}
                      className="w-full flex items-center gap-3 text-left p-2.5 rounded-xl hover:bg-purple-50/50 transition-colors group/item cursor-pointer"
                    >
                      <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover/item:bg-purple-600 group-hover/item:text-white transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-slate-800 group-hover/item:text-purple-600 transition-colors">
                          Jind Branch
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">
                          BHIWANI BYPASS, MAIN CHOWK, JIND, HARYANA 126102
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover/item:text-purple-500 group-hover/item:translate-x-1 transition-all" />
                    </button>

                    <button onClick={() => openContactModal("", "narnaund")}
                      className="w-full flex items-center gap-3 text-left p-2.5 rounded-xl hover:bg-blue-50/50 transition-colors group/item cursor-pointer mt-1"
                    >
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-slate-800 group-hover/item:text-blue-600 transition-colors">
                          Narnaund Branch
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">
                          BUS STAND, FRONT OF POLICE STATION, OLD, NARNAUND, HARYANA 125039
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover/item:text-blue-500 group-hover/item:translate-x-1 transition-all" />
                    </button>

                    <button onClick={() => openContactModal("", "uchana")}
                      className="w-full flex items-center gap-3 text-left p-2.5 rounded-xl hover:bg-emerald-50/50 transition-colors group/item cursor-pointer mt-1"
                    >
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-slate-800 group-hover/item:text-emerald-600 transition-colors">
                          Uchana Branch
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">
                          MAIN MARKET RAILWAY ROAD UCHANA
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover/item:text-emerald-500 group-hover/item:translate-x-1 transition-all" />
                    </button>

                    <div className="h-px bg-slate-100 my-2" />

                    <button
                      onClick={() => openContactModal()}
                      className="w-full text-center py-2 text-[11px] font-black text-blue-600 hover:text-blue-700 hover:bg-blue-50/30 rounded-xl transition-all cursor-pointer"
                    >
                      General Enquiry (सामान्य पूछताछ)
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Nav Toggle */}
              <div className="md:hidden flex items-center gap-2">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${scrolled || mobileMenuOpen ? "text-slate-600 hover:bg-slate-100" : "text-gray-200 hover:bg-white/10"}`}
                  aria-label="Toggle Dark Mode"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`p-2.5 -mr-2 rounded-xl transition-all cursor-pointer ${scrolled || mobileMenuOpen ? "text-slate-800 hover:bg-slate-100" : "text-white hover:bg-white/10"}`}
                  aria-label="Toggle Menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Dropdown with smooth slide-down animation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, rotateX: -45, y: -40, scale: 0.9, transformOrigin: "top" }}
                animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
                exit={{ opacity: 0, rotateX: -30, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                style={{ perspective: "1000px" }}
                className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200/80 shadow-2xl overflow-hidden z-50 flex flex-col max-h-[82vh]"
              >
                <div className="overflow-y-auto px-4 py-5 space-y-3.5 flex-1 scrollbar-thin">
                  {/* Home Option */}
                  <button
                    onClick={() => {
                      setCurrentView("home");
                      setMobileMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-2xl transition-all cursor-pointer text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Home className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block leading-none mb-0.5">
                          Main Dashboard
                        </span>
                        <span className="text-sm font-black text-slate-800">
                          Home Screen (मुख्य पृष्ठ)
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* 1. Services Accordion Option */}
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-2xl transition-all cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                          <Monitor className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-orange-600 font-extrabold uppercase tracking-wider block leading-none mb-0.5">
                            Online Portals & Hubs
                          </span>
                          <span className="text-sm font-black text-slate-800">
                            Services (सेवाएं)
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${mobileServicesOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {mobileServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, rotateX: -20, transformOrigin: "top" }}
                          animate={{ opacity: 1, height: "auto", rotateX: 0 }}
                          exit={{ opacity: 0, height: 0, rotateX: -10 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          style={{ perspective: "800px" }}
                          className="pl-2 pr-1 py-1 space-y-2 border-l-2 border-orange-500/30 ml-4.5 mt-1"
                        >
                          {/* CSC Services Section on main page */}
                          <button
                            onClick={() => {
                              scrollTo("services");
                              setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 p-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block leading-none mb-0.5">
                                Homepage Scroll
                              </span>
                              <span className="text-xs font-black text-slate-700">
                                CSC All Services (सेवाएं सूची)
                              </span>
                            </div>
                          </button>

                          {/* All Type PDF Tools */}
                          <button
                            onClick={() => {
                              setPdfToolsModalOpen(true);
                              setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 p-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                              <Calculator className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block leading-none mb-0.5">
                                PDF Tools
                              </span>
                              <span className="text-xs font-black text-slate-700">
                                CSC PDF Utilities (उपयोगी टूल्स)
                              </span>
                            </div>
                          </button>

                          {/* Typing Services */}
                          <button
                            onClick={() => {
                              setCurrentView("typing-center");
                              setMobileMenuOpen(false);
                              window.scrollTo(0, 0);
                            }}
                            className="w-full flex items-center gap-2.5 p-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              <Keyboard className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[9px] text-emerald-600 font-extrabold uppercase tracking-wider block leading-none mb-0.5">
                                Typing Center
                              </span>
                              <span className="text-xs font-black text-slate-700">
                                Hindi/English Typing
                              </span>
                            </div>
                          </button>

                          {/* Document Print Service */}
                          <button
                            onClick={() => {
                              setCurrentView("print-service");
                              setMobileMenuOpen(false);
                              window.scrollTo(0, 0);
                            }}
                            className="w-full flex items-center gap-2.5 p-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                              <Printer className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[9px] text-purple-600 font-extrabold uppercase tracking-wider block leading-none mb-0.5">
                                Printing
                              </span>
                              <span className="text-xs font-black text-slate-700">
                                Document Print Service
                              </span>
                            </div>
                          </button>

                          <div className="h-px bg-slate-100 my-1 mx-2"></div>

                          {/* Photo Background Remover */}
                          <button
                            onClick={() => {
                              setPhotoToolActiveTab("bg-remover");
                              setPhotoToolsModalOpen(true);
                              setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 p-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                              <Scissors className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[9px] text-blue-600 font-extrabold uppercase tracking-wider block leading-none mb-0.5">
                                AI Tools
                              </span>
                              <span className="text-xs font-black text-slate-700">
                                Background Remover
                              </span>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              setImageResizerModalOpen(true);
                              setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 p-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[9px] text-indigo-600 font-extrabold uppercase tracking-wider block leading-none mb-0.5">
                                AI Tools
                              </span>
                              <span className="text-xs font-black text-slate-700">
                                Image Resizer
                              </span>
                            </div>
                          </button>


                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 2. Courier Accordion */}
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setMobileCourierOpen(!mobileCourierOpen)}
                      className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-2xl transition-all cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center flex-shrink-0">
                          <Package className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-cyan-600 font-extrabold uppercase tracking-wider block leading-none mb-0.5">
                            International Shipping
                          </span>
                          <span className="text-sm font-black text-slate-800">
                            Courier (कूरियर)
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${mobileCourierOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {mobileCourierOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, rotateX: -20, transformOrigin: "top" }}
                          animate={{ opacity: 1, height: "auto", rotateX: 0 }}
                          exit={{ opacity: 0, height: 0, rotateX: -10 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          style={{ perspective: "800px" }}
                          className="pl-2 pr-1 py-1 space-y-2 border-l-2 border-cyan-500/30 ml-4.5 mt-1"
                        >
                          <button
                            onClick={() => {
                              scrollTo("courier");
                              setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 p-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                              <Package className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block leading-none mb-0.5">
                                Homepage Scroll
                              </span>
                              <span className="text-xs font-black text-slate-700">
                                About Courier
                              </span>
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              setCourierPortalTab("track");
                              setCurrentView("courier-portal");
                              setMobileMenuOpen(false);
                              window.scrollTo(0, 0);
                            }}
                            className="w-full flex items-center gap-2.5 p-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center">
                              <Search className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[9px] text-cyan-600 font-extrabold uppercase tracking-wider block leading-none mb-0.5">
                                Live Tracking
                              </span>
                              <span className="text-xs font-black text-slate-800">
                                Courier Track (पार्सल ट्रैक करें)
                              </span>
                            </div>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 3. Contact Us Accordion */}
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setMobileContactOpen(!mobileContactOpen)}
                      className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-2xl transition-all cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-wider block leading-none mb-0.5">
                            Helpdesk & Support
                          </span>
                          <span className="text-sm font-black text-slate-800">
                            Contact Us (संपर्क करें)
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${mobileContactOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {mobileContactOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, rotateX: -20, transformOrigin: "top" }}
                          animate={{ opacity: 1, height: "auto", rotateX: 0 }}
                          exit={{ opacity: 0, height: 0, rotateX: -10 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          style={{ perspective: "800px" }}
                          className="pl-2 pr-1 py-1 space-y-2 border-l-2 border-blue-500/30 ml-4.5 mt-1"
                        >
                          <button
                            onClick={() => {
                              openContactModal("", "jind");
                              setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 p-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block leading-none mb-0.5">
                                BHIWANI BYPASS, MAIN CHOWK, JIND, HARYANA 126102
                              </span>
                              <span className="text-xs font-black text-slate-700">
                                Jind Branch
                              </span>
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              openContactModal("", "narnaund");
                              setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 p-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block leading-none mb-0.5">
                                BUS STAND, FRONT OF POLICE STATION, OLD, NARNAUND, HARYANA 125039
                              </span>
                              <span className="text-xs font-black text-slate-700">
                                Narnaund Branch
                              </span>
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              openContactModal("", "uchana");
                              setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 p-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block leading-none mb-0.5">
                                MAIN MARKET RAILWAY ROAD UCHANA
                              </span>
                              <span className="text-xs font-black text-slate-700">
                                Uchana Branch
                              </span>
                            </div>
                          </button>
                          <div className="h-px bg-slate-100 my-1 mx-2" />
                          <button
                            onClick={() => {
                              openContactModal();
                              setMobileMenuOpen(false);
                            }}
                            className="w-full text-center py-2 text-[11px] font-black text-blue-600 hover:text-blue-700 hover:bg-blue-50/30 rounded-xl transition-all cursor-pointer"
                          >
                            General Enquiry (सामान्य पूछताछ)
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      )}

      {currentView === "chat-portal" ? (
        <ChatPortal
          onBack={() => {
            setCurrentView("home");
            window.scrollTo(0, 0);
          }}
        />
      ) : currentView === "csc-portal" ? (
        <CscPortal
          onBackToHome={() => {
            setCurrentView("home");
            window.scrollTo(0, 0);
          }}
          openContactModal={openContactModal}
        />
      ) : currentView === "courier-portal" ? (
        <CourierPortal
          onBackToHome={() => {
            setCurrentView("home");
            window.scrollTo(0, 0);
          }}
          openContactModal={openContactModal}
          initialTab={courierPortalTab}
        />
      ) : currentView === "university-portal" ? (
        <UniversityPortal
          onBackToHome={() => {
            setCurrentView("home");
            window.scrollTo(0, 0);
          }}
          openContactModal={openContactModal}
        />
      ) : currentView === "typing-center" ? (
        <TypingCenter
          onBack={() => {
            setCurrentView("home");
            window.scrollTo(0, 0);
          }}
        />
      ) : currentView === "print-service" ? (
        <PrintService
          onBack={() => {
            setCurrentView("home");
            window.scrollTo(0, 0);
          }}
        />
      ) : currentView === "admin" ? (
        <AdminDashboard
          onBack={() => {
            setCurrentView("home");
            window.scrollTo(0, 0);
          }}
        />
      ) : (
        <>
          {/* 2. Hero Section (Premium Image Slide Gallery) */}
          <div
            className="relative w-full overflow-hidden bg-slate-950"
            onMouseEnter={() => setIsSliderHovered(true)}
            onMouseLeave={() => setIsSliderHovered(false)}
          >
            {/* Background Images with AnimatePresence */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
              <AnimatePresence mode="popLayout">
                {HERO_SLIDES[currentSlide].video ? (
                  <motion.video
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 0.65, scale: 1.02 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                    src={HERO_SLIDES[currentSlide].video}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 0.65, scale: 1.02 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${HERO_SLIDES[currentSlide].image})`,
                    }}
                  />
                )}
              </AnimatePresence>
              {/* Vignette / Overlay Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/50" />
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-950/30 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-950/30 to-transparent" />
            </div>

            {/* Content Wrapper */}
            <section
              id="home"
              className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[500px] md:min-h-[620px] z-10 text-center"
            >


              {/* Manual Left/Right Arrows - Hidden on small mobile, visible & elegant on larger viewports */}
              <button
                onClick={() =>
                  setCurrentSlide(
                    (prev) =>
                      (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
                  )
                }
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-slate-900/40 hover:bg-slate-900/80 hover:scale-105 active:scale-95 text-white border border-white/10 backdrop-blur-md transition-all cursor-pointer group z-20"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() =>
                  setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
                }
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-slate-900/40 hover:bg-slate-900/80 hover:scale-105 active:scale-95 text-white border border-white/10 backdrop-blur-md transition-all cursor-pointer group z-20"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Slide Content */}
              <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center mt-10 md:mt-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center w-full"
                  >
                    {/* Badge */}
                    {HERO_SLIDES[currentSlide].badge && (
                    <div
                      className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border mb-6 sm:mb-8 backdrop-blur-md shadow-lg ${HERO_SLIDES[currentSlide].badgeBg}`}
                    >
                      <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                      <span className="text-xs sm:text-sm font-black tracking-[0.15em] uppercase">
                        {HERO_SLIDES[currentSlide].badge}
                      </span>
                    </div>
                    )}

                    {/* Titles */}
                    {HERO_SLIDES[currentSlide].title && (
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-3 sm:mb-4 drop-shadow-lg">
                      {HERO_SLIDES[currentSlide].title.split('\n').map((line, i) => (
                        <span key={i} className="block">{line}</span>
                      ))}
                    </h2>
                    )}
                    {HERO_SLIDES[currentSlide].hindiTitle && (
                    <h3
                      className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 drop-shadow-md ${HERO_SLIDES[currentSlide].accentText}`}
                    >
                      {HERO_SLIDES[currentSlide].hindiTitle}
                    </h3>
                    )}

                    {/* Subtitle */}
                    {HERO_SLIDES[currentSlide].subtitle && (
                    <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 sm:mb-10 max-w-2xl leading-relaxed drop-shadow">
                      {HERO_SLIDES[currentSlide].subtitle}
                    </p>
                    )}

                    {/* Context-Specific Action Buttons */}
                    {HERO_SLIDES[currentSlide].type !== "ai" && (
                      <div className="flex flex-wrap justify-center gap-3 mb-6 w-full" style={{ perspective: "1000px" }}>
                        {[
                          { name: "Jind", map: "https://maps.google.com/?q=Bhiwani+Bypass,+main+chowk,+Jind,+Haryana+126102" },
                          { name: "Narnaund", map: "https://maps.google.com/?q=Bus+Stand,+Front+of+Police+Station,+Old,+Narnaund,+Haryana+125039" },
                          { name: "Uchana", map: "https://maps.google.com/?q=Railway+Station+Uchana+Haryana" }
                        ].map((loc, idx) => (
                          <motion.div
                            key={loc.name}
                            initial={{ opacity: 0, rotateX: 90, z: -50 }}
                            animate={{ opacity: 1, rotateX: 0, z: 0 }}
                            transition={{ 
                              duration: 0.8, 
                              delay: idx * 0.2, 
                              type: "spring",
                              bounce: 0.5
                            }}
                            whileHover={{ 
                              rotateY: 15, 
                              rotateX: -10, 
                              scale: 1.1, 
                              z: 20 
                            }}
                            onClick={() => window.open(loc.map, '_blank')}
                            className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-black uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.2)] cursor-pointer hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] hover:border-cyan-400/60 transition-colors"
                            style={{ transformStyle: "preserve-3d" }}
                          >
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                            {loc.name}
                          </motion.div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                      {HERO_SLIDES[currentSlide].type === "courier" ? (
                        <>

                            <button
                              onClick={() => {
                                setCourierPortalTab("track");
                                setCurrentView("courier-portal");
                                window.scrollTo(0, 0);
                              }}
                              className="px-8 py-4 rounded-full font-bold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 backdrop-blur-md transition-all transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                              Track Shipment <Truck className="w-5 h-5 text-amber-400 fill-amber-400/20 animate-drive-truck" />
                            </button>
                        </>
                      ) : HERO_SLIDES[currentSlide].type === "university" ? (
                        <>
                          <button
                            onClick={() => {
                              setCurrentView("university-portal");
                              window.scrollTo(0, 0);
                            }}
                            className={`px-8 py-4 rounded-full font-bold text-white transition-all transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-2 w-full sm:w-auto ${HERO_SLIDES[currentSlide].btnBg}`}
                          >
                            Admissions Hub <BookOpen className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setCurrentView("university-portal");
                              window.scrollTo(0, 0);
                            }}
                            className="px-8 py-4 rounded-full font-bold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 backdrop-blur-md transition-all transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-2 w-full sm:w-auto"
                          >
                            Get Counseling <Phone className="w-5 h-5" />
                          </button>
                        </>
                      ) : HERO_SLIDES[currentSlide].type === "csc" ? (
                        <>
                          <button
                            onClick={() => {
                              setCurrentView("csc-portal");
                              window.scrollTo(0, 0);
                            }}
                            className={`px-8 py-4 rounded-full font-bold text-white transition-all transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-2 w-full sm:w-auto ${HERO_SLIDES[currentSlide].btnBg}`}
                          >
                            Open CSC Portal <Monitor className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setCurrentView("csc-portal");
                              window.scrollTo(0, 0);
                            }}
                            className="px-8 py-4 rounded-full font-bold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 backdrop-blur-md transition-all transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-2 w-full sm:w-auto"
                          >
                            All Services <ArrowRight className="w-5 h-5" />
                          </button>
                        </>
                      ) : HERO_SLIDES[currentSlide].type !== "ai" && (
                        <button
                          onClick={() => {
                            setCurrentView("csc-portal");
                            window.scrollTo(0, 0);
                          }}
                          className={`px-8 py-4 rounded-full font-bold text-white transition-all transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-2 w-full sm:w-auto ${HERO_SLIDES[currentSlide].btnBg}`}
                        >
                          Explore Services <ArrowRight className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Indicators / Progress Dot Trackers */}
              <div className="absolute bottom-5 left-0 right-0 flex justify-center items-center gap-2 z-20">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(idx)}
                    className="group relative py-2 focus:outline-none cursor-pointer"
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    {/* Visual Dot Bar Container */}
                    <div
                      className="h-1.5 rounded-full bg-white/25 transition-all duration-300 overflow-hidden relative"
                      style={{ width: currentSlide === idx ? "40px" : "8px" }}
                    >
                      {/* Active Slide Timer Line Progress */}
                      {currentSlide === idx && (
                        <motion.div
                          key={`${currentSlide}-${isSliderHovered}`}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{
                            duration: isSliderHovered ? 999999 : 6,
                            ease: "linear",
                          }}
                          className="absolute inset-y-0 left-0 bg-blue-500 h-full"
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* 3. Content Explain (Services) */}
          <section
            id="services"
            className="py-20 bg-white border-y border-gray-100"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* CSC Services */}
              <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 lg:mb-32">
                <div
                  onClick={() => {
                    setCurrentView("csc-portal");
                    window.scrollTo(0, 0);
                  }}
                  className="order-2 md:order-1 relative h-[350px] md:h-[420px] w-full rounded-[2.5rem] bg-gradient-to-br from-orange-100 to-red-50 p-6 overflow-hidden border border-orange-200 shadow-[0_10px_35px_rgba(234,179,8,0.15)] hover:shadow-[0_20px_50px_rgba(249,115,22,0.3)] group cursor-pointer hover:border-orange-400 hover:scale-[1.03] hover:-translate-y-3 active:scale-95 transition-all duration-500 ease-out"
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "radial-gradient(#f97316 2px, transparent 2px)",
                      backgroundSize: "30px 30px",
                    }}
                  ></div>
                  {/* Floating Cards */}
                  <div className="absolute top-8 left-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 animate-float transition-transform group-hover:scale-105">
                    <Monitor className="w-10 h-10 text-orange-500 mb-2" />
                    <div className="w-20 h-2 bg-gray-200 rounded-full mb-1"></div>
                    <div className="w-12 h-2 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="absolute bottom-12 right-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 animate-float [animation-delay:1.5s] transition-transform group-hover:scale-105">
                    <div className="flex gap-2 items-center mb-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="w-16 h-3 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="w-24 h-2 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-orange-400 to-red-400 rounded-full blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 transform group-hover:-translate-y-2 transition-transform duration-500">
                    <h3 className="text-5xl font-black text-orange-900 drop-shadow-sm tracking-tighter">
                      CSC
                    </h3>
                    <p className="text-orange-700 font-bold tracking-[0.3em] mt-1 text-sm bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
                      CENTER
                    </p>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center text-xs font-black tracking-widest text-orange-700/80 uppercase">
                    Click to open Portal
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                    Digital Services
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                    Comprehensive CSC Services
                  </h3>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    A one-stop solution for all your online form filling,
                    government registrations, bill payments, and documentation
                    needs. We provide a user-friendly and efficient experience
                    for all digital tasks.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {[
                      "Online Forms & Applications",
                      "PAN Card & Passport",
                      "Aadhaar Print & Update",
                      "Bill Payments & Insurance",
                    ].map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-1 bg-orange-100 rounded-full p-1">
                          <CheckCircle2 className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="font-medium text-gray-800">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setCurrentView("csc-portal");
                        window.scrollTo(0, 0);
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-full transition-colors text-sm flex items-center gap-2 shadow-lg shadow-orange-600/20 cursor-pointer"
                    >
                      Open CSC Seva Portal <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openContactModal("CSC Services")}
                      className="bg-orange-50 hover:bg-orange-100 text-orange-800 font-semibold px-5 py-3 rounded-full transition-colors text-sm flex items-center gap-2 cursor-pointer border border-orange-100"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>

              {/* University Admissions */}
              <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 lg:mb-32">
                <div>
                  <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                    Education
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                    University Admissions
                  </h3>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Take the next step in your career. We assist with distance
                    education admissions and regular college enrollments for
                    various universities, ensuring 100% valid and UGC approved
                    degrees.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {[
                      "Distance Education (BA, MA)",
                      "UGC Approved Degrees",
                      "College Admission Forms",
                      "Scholarship Assistance",
                    ].map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-1 bg-blue-100 rounded-full p-1">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-800">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setCurrentView("university-portal");
                        window.scrollTo(0, 0);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full transition-colors text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
                    >
                      Explore Haryana Universities{" "}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openContactModal("University Admission")}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold px-5 py-3 rounded-full transition-colors text-sm flex items-center gap-2 cursor-pointer border border-blue-100"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setCurrentView("university-portal");
                    window.scrollTo(0, 0);
                  }}
                  className="relative h-[350px] md:h-[420px] w-full rounded-[2.5rem] bg-gradient-to-br from-blue-100 to-cyan-50 p-6 overflow-hidden border border-blue-200 shadow-[0_10px_35px_rgba(59,130,246,0.15)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.3)] group cursor-pointer hover:border-blue-400 hover:scale-[1.03] hover:-translate-y-3 active:scale-95 transition-all duration-500 ease-out"
                >
                  <div className="absolute -right-12 -top-12 w-64 h-64 border-[40px] border-blue-100/50 rounded-full"></div>
                  <div className="absolute -left-12 -bottom-12 w-56 h-56 border-[30px] border-cyan-100/50 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[260px] z-10">
                    <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-[0_20px_40px_rgba(37,99,235,0.15)] border border-white/60 transform -rotate-6 transition-transform group-hover:rotate-0 duration-500 relative z-20">
                      <BookOpen className="w-14 h-14 text-blue-600 mb-4" />
                      <h3 className="text-2xl font-black text-blue-900 mb-1 leading-tight">
                        University
                        <br />
                        Admissions
                      </h3>
                      <p className="text-blue-600 font-bold text-xs uppercase tracking-wider mt-2">
                        Open Now
                      </p>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl transform rotate-3 transition-transform group-hover:rotate-6 duration-500 z-10 shadow-lg"></div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-blue-400 to-cyan-400 rounded-full blur-[60px] opacity-30"></div>
                  <div className="absolute bottom-4 left-0 right-0 text-center text-xs font-black tracking-widest text-blue-700/80 uppercase">
                    Click to open Portal
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="courier"
            className="py-20 bg-white border-b border-gray-100 scroll-mt-20"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header of Courier Section */}
              <div className="text-center max-w-3xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs tracking-wider uppercase mb-3 border border-emerald-100 shadow-xs">
                  <Truck className="w-3.5 h-3.5" /> Rakhi International
                  Logistics
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
                  Rakhi International Courier
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Fast, reliable, and secure shipping services worldwide. We
                  ensure your parcels reach their destination safely and on
                  time, anywhere across the globe at very affordable rates.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div>
                  <div className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                    Logistics
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                    Worldwide Air Cargo & Parcel Express
                  </h3>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    Fast, reliable, and secure shipping services worldwide. We
                    ensure your parcels reach their destination safely and on
                    time, anywhere across the globe at very affordable rates.
                  </p>
                  <p className="text-red-600 font-bold mb-8 text-lg bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl inline-block">
                    नोट: घर बैठे बिल्कुल सस्ते दाम पर विदेश में सामान भेजने के
                    लिए संपर्क करें।
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {[
                      "Global Reach (UK, USA, CA, AU)",
                      "Express Delivery Options",
                      "Secure Packaging",
                      "Affordable Pricing",
                    ].map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-1 bg-emerald-100 rounded-full p-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="font-medium text-gray-800">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => openContactModal("International Courier")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                    >
                      Ship Now <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setCourierPortalTab("track");
                        setCurrentView("courier-portal");
                        window.scrollTo(0, 0);
                      }}
                      className="bg-white hover:bg-gray-50 text-emerald-800 border border-emerald-200 font-semibold px-5 py-3 rounded-full transition-colors text-sm flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Search className="w-4 h-4" /> Track Package
                    </button>

                  </div>
                </div>

                <div
                  onClick={() => {
                    setCurrentView("courier-portal");
                    window.scrollTo(0, 0);
                  }}
                  className="relative h-[350px] md:h-[420px] w-full rounded-[2.5rem] bg-gradient-to-br from-emerald-50 to-teal-100 p-6 overflow-hidden border border-emerald-200 shadow-[0_10px_35px_rgba(16,185,129,0.15)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)] group cursor-pointer hover:border-emerald-400 hover:scale-[1.03] hover:-translate-y-3 active:scale-95 transition-all duration-500 ease-out"
                >
                  {/* Background Globe Animation */}
                  <div className="absolute inset-0 z-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-cover opacity-10 mix-blend-multiply pointer-events-none"></div>
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <svg
                      viewBox="0 0 1000 500"
                      className="w-full h-full"
                      preserveAspectRatio="xMidYMid slice"
                    >
                      <defs>
                        <linearGradient
                          id="route-gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#10b981"
                            stopOpacity="0.1"
                          />
                          <stop
                            offset="100%"
                            stopColor="#10b981"
                            stopOpacity="0.8"
                          />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur
                            stdDeviation="3"
                            result="coloredBlur"
                          />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      {/* India Origin */}
                      <circle
                        cx="700"
                        cy="220"
                        r="4"
                        fill="#10b981"
                        filter="url(#glow)"
                      />
                      <circle
                        cx="700"
                        cy="220"
                        r="12"
                        fill="#10b981"
                        opacity="0.3"
                        className="animate-ping"
                        style={{ animationDuration: "2s" }}
                      />
                      {/* Destinations */}
                      <circle cx="850" cy="380" r="3" fill="#10b981" />{" "}
                      {/* Australia */}
                      <circle cx="200" cy="110" r="3" fill="#10b981" />{" "}
                      {/* Canada */}
                      <circle cx="480" cy="140" r="3" fill="#10b981" />{" "}
                      {/* UK */}
                      <circle cx="220" cy="180" r="3" fill="#10b981" />{" "}
                      {/* US */}
                      {/* Paths */}
                      <path
                        id="route-aus"
                        d="M 700 220 Q 800 280 850 380"
                        fill="none"
                        stroke="url(#route-gradient)"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        className="opacity-60"
                      />
                      <path
                        id="route-can"
                        d="M 700 220 Q 450 0 200 110"
                        fill="none"
                        stroke="url(#route-gradient)"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        className="opacity-60"
                      />
                      <path
                        id="route-uk"
                        d="M 700 220 Q 590 100 480 140"
                        fill="none"
                        stroke="url(#route-gradient)"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        className="opacity-60"
                      />
                      <path
                        id="route-us"
                        d="M 700 220 Q 450 50 220 180"
                        fill="none"
                        stroke="url(#route-gradient)"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        className="opacity-60"
                      />
                      {/* Planes */}
                      <g>
                        <animateMotion
                          dur="6s"
                          repeatCount="indefinite"
                          rotate="auto"
                        >
                          <mpath href="#route-aus" />
                        </animateMotion>
                        <g transform="rotate(90)">
                          <image
                            href="https://upload.wikimedia.org/wikipedia/commons/6/6d/Boeing_307_Stratocruiser_icon_silver.png"
                            x="-15"
                            y="-15"
                            width="30"
                            height="30"
                            style={{
                              filter:
                                "contrast(1.2) brightness(1.1) sepia(0.3) hue-rotate(-10deg) drop-shadow(0 0 5px rgba(234,179,8,0.6))",
                            }}
                          />
                        </g>
                      </g>
                      <g>
                        <animateMotion
                          dur="8s"
                          repeatCount="indefinite"
                          begin="1s"
                          rotate="auto"
                        >
                          <mpath href="#route-can" />
                        </animateMotion>
                        <g transform="rotate(90)">
                          <image
                            href="https://upload.wikimedia.org/wikipedia/commons/6/6d/Boeing_307_Stratocruiser_icon_silver.png"
                            x="-12"
                            y="-12"
                            width="24"
                            height="24"
                            style={{
                              filter:
                                "contrast(1.2) brightness(1.1) sepia(0.3) hue-rotate(-10deg) drop-shadow(0 0 5px rgba(234,179,8,0.6))",
                            }}
                          />
                        </g>
                      </g>
                      <g>
                        <animateMotion
                          dur="7s"
                          repeatCount="indefinite"
                          begin="2s"
                          rotate="auto"
                        >
                          <mpath href="#route-uk" />
                        </animateMotion>
                        <g transform="rotate(90)">
                          <image
                            href="https://upload.wikimedia.org/wikipedia/commons/6/6d/Boeing_307_Stratocruiser_icon_silver.png"
                            x="-14"
                            y="-14"
                            width="28"
                            height="28"
                            style={{
                              filter:
                                "contrast(1.2) brightness(1.1) sepia(0.3) hue-rotate(-10deg) drop-shadow(0 0 5px rgba(234,179,8,0.6))",
                            }}
                          />
                        </g>
                      </g>
                      <g>
                        <animateMotion
                          dur="9s"
                          repeatCount="indefinite"
                          begin="3s"
                          rotate="auto"
                        >
                          <mpath href="#route-us" />
                        </animateMotion>
                        <g transform="rotate(90)">
                          <image
                            href="https://upload.wikimedia.org/wikipedia/commons/6/6d/Boeing_307_Stratocruiser_icon_silver.png"
                            x="-16"
                            y="-16"
                            width="32"
                            height="32"
                            style={{
                              filter:
                                "contrast(1.2) brightness(1.1) sepia(0.3) hue-rotate(-10deg) drop-shadow(0 0 5px rgba(234,179,8,0.6))",
                            }}
                          />
                        </g>
                      </g>
                    </svg>
                  </div>

                  <div
                    className="absolute bottom-12 left-8 md:left-12 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-emerald-100 z-20 animate-float"
                    style={{ animationDelay: "1.5s" }}
                  >
                    <div className="flex gap-4 mb-3 border-b border-gray-100 pb-3">
                      {["🇦🇺", "🇨🇦", "🇬🇧", "🇺🇸"].map((flag, idx) => (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-gray-50 border border-gray-100"
                        >
                          <span className="text-xl leading-none">{flag}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </div>
                      <span className="text-[13px] font-black text-gray-800 tracking-widest uppercase">
                        Global Delivery
                      </span>
                    </div>
                  </div>

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-emerald-400 to-teal-500 w-64 h-64 rounded-full blur-[80px] opacity-40 animate-blob mix-blend-multiply pointer-events-none"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Important Links Section */}
          <section
            id="links"
            className="py-20 bg-gray-50 border-t border-gray-100"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                  Important Links
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  Quick access to the latest government jobs, university
                  admissions, and scholarship portals.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Job Links */}
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 overflow-hidden flex flex-col h-[500px]">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-200" />
                      Govt. Jobs & Forms
                    </h3>
                  </div>
                  <div className="p-6 flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-3 bg-gray-50/50">
                    {[
                      {
                        name: "Harayana Kosal Rojgar Nigam (HKRN)",
                        url: "https://hkrnl.itiharyana.gov.in/",
                      },
                      {
                        name: "Staff Selection Commission (SSC)",
                        url: "https://ssc.gov.in/",
                      },
                      {
                        name: "Railway Recruitment Board (RRB)",
                        url: "https://indianrailways.gov.in/",
                      },
                      {
                        name: "India Post (GDS)",
                        url: "https://indiapostgdsonline.gov.in/",
                      },
                      {
                        name: "Indo Tibetan Border Police Force (ITBP)",
                        url: "https://recruitment.itbpolice.nic.in/",
                      },
                      {
                        name: "Border Security Force (BSF)",
                        url: "https://rectt.bsf.gov.in/",
                      },
                      {
                        name: "Haryana Staff Selection Commission (HSSC)",
                        url: "https://hssc.gov.in/",
                      },
                      {
                        name: "UPSC Civil Services Examination",
                        url: "https://upsc.gov.in/",
                      },
                      {
                        name: "Indian Army Agniveer Recruitment",
                        url: "https://joinindianarmy.nic.in/",
                      },
                      {
                        name: "Delhi Police Recruitment",
                        url: "https://delhipolice.gov.in/recruitments",
                      },
                    ].map((item, idx) => (
                      <a
                        key={idx}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-gray-200 rounded-xl py-3.5 px-4 flex items-center text-left hover:bg-blue-50 hover:border-blue-200 hover:shadow-md transition-all group"
                      >
                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0 text-sm font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-gray-700 font-semibold text-[15px] group-hover:text-blue-700 transition-colors line-clamp-1">
                          {item.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Scholarship & Admission Links */}
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 overflow-hidden flex flex-col h-[500px]">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-red-100" />
                      Admission & Scholarship
                    </h3>
                  </div>
                  <div className="p-6 flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-3 bg-gray-50/50">
                    {[
                      {
                        name: "Haryana College Admission Portal",
                        url: "https://admissions.highereduhry.ac.in/",
                      },
                      {
                        name: "National Scholarship Portal",
                        url: "https://scholarships.gov.in/",
                      },
                      {
                        name: "Har Chhatravratti Scholarship Portal",
                        url: "https://harchhatravratti.highereduhry.ac.in/",
                      },
                      {
                        name: "Distance Education (DDE KUK)",
                        url: "https://ddekuk.ac.in/",
                      },
                      {
                        name: "MDU Rohtak Result/Admission",
                        url: "https://mdu.ac.in/",
                      },
                      {
                        name: "PM Special Scholarship Scheme",
                        url: "https://www.aicte-india.org/bureaus/jk",
                      },
                      {
                        name: "IGNOU Admission Portal",
                        url: "https://www.ignou.ac.in/",
                      },
                      {
                        name: "Ambedkar Medhavi Chhattar Yojna",
                        url: "https://saralharyana.gov.in/",
                      },
                      {
                        name: "Haryana Saral Portal",
                        url: "https://saralharyana.gov.in/",
                      },
                      {
                        name: "Family ID (Parivar Pehchan Patra)",
                        url: "https://meraparivar.haryana.gov.in/",
                      },
                      {
                        name: "Haryana Board of School Education",
                        url: "https://bseh.org.in/",
                      },
                    ].map((item, idx) => (
                      <a
                        key={idx}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-gray-200 rounded-xl py-3.5 px-4 flex items-center text-left hover:bg-orange-50 hover:border-orange-200 hover:shadow-md transition-all group"
                      >
                        <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3 group-hover:bg-orange-500 group-hover:text-white transition-colors flex-shrink-0 text-sm font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-gray-700 font-semibold text-[15px] group-hover:text-orange-700 transition-colors line-clamp-1">
                          {item.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Our Branch Members Section */}
          <section className="py-20 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 border-t border-b border-slate-100 overflow-hidden relative">
            {/* Soft decorative background glows */}
            <div className="absolute top-1/4 left-0 w-80 h-80 bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-indigo-400/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-100/60 text-blue-700 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4">
                  <Users className="w-3.5 h-3.5 text-blue-500 animate-pulse" />{" "}
                  Core Team Members
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase mb-4">
                  Meet Our Branch Experts
                </h2>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">
                  Dedicated, certified digital service specialists across
                  Jind, Narnaund, and Uchana branches, committed to offering
                  lightning-fast assistance.
                </p>
              </div>

              {/* Members Sliding Container */}
              <div className="relative group/slider px-2">
                {/* Horizontal Scroll Track */}
                <div
                  className="flex gap-8 pb-12 pt-8 px-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                  id="members-track"
                  style={{ perspective: "1500px" }}
                >
                  {[...BRANCH_EXPERTS, ...BRANCH_EXPERTS].map((member, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, rotateX: -60, rotateY: 20, scale: 0.8, y: 100, z: -200 }}
                      whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, scale: 1, y: 0, z: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      whileHover={{ 
                        scale: 1.08,
                        rotateY: -12,
                        rotateX: 8,
                        y: -15,
                        z: 60,
                        boxShadow: "20px 30px 60px -15px rgba(59, 130, 246, 0.35)"
                      }}
                      transition={{ 
                        type: "spring",
                        stiffness: 120,
                        damping: 14,
                        mass: 1.1,
                        delay: (idx % 4) * 0.1
                      }}
                      style={{ transformStyle: "preserve-3d" }}
                      className="w-[290px] sm:w-[330px] flex-shrink-0 snap-center bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_35px_rgba(59,130,246,0.1)] flex flex-col justify-between overflow-hidden relative group/card"
                    >
                      {/* Premium Top colored banner card header */}
                      <div
                        className={`h-24 w-full bg-gradient-to-br ${member.gradient} relative overflow-hidden flex items-center justify-center`}
                      >
                        {/* Glass sheen reflection */}
                        <div className="absolute inset-0 bg-white/20 opacity-30 transform -skew-x-12 translate-x-[-150%] group-hover/card:translate-x-[200%] transition-transform duration-[1200ms] ease-out" />
                      </div>

                      {/* Inner Content block */}
                      <div className="px-6 pb-6 pt-0 flex flex-col items-center text-center relative z-10">
                        {/* User Avatar overlapping the banner */}
                        <div className="relative -mt-12 mb-4">
                          {/* Circle aura glow */}
                          <div
                            className={`absolute -inset-1.5 rounded-full bg-gradient-to-tr ${member.gradient} opacity-20 group-hover/card:opacity-100 transition-all duration-700 pointer-events-none blur-[3px]`}
                          />

                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-[4px] border-white shadow-xl relative group-hover/card:scale-105 transition-transform duration-500 z-10 bg-white flex items-center justify-center">
                            <img
                              src={member.image}
                              alt={member.name}
                              className={`transition-transform duration-700 group-hover/card:scale-110 ${member.name === "Ashish Dhankar" ? "w-[180%] h-[180%] max-w-none object-contain" : "w-full h-full object-cover"}`}
                            />
                          </div>

                          {/* Interactive Pulse online indicator */}
                          <span className="absolute bottom-1 right-1 w-4.5 h-4.5 bg-emerald-500 border-[3px] border-white rounded-full z-20 shadow-md">
                            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                          </span>
                        </div>

                        {/* Branch Location Badge */}
                        <div
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-3 border ${member.badgeColor} shadow-sm`}
                        >
                          <MapPin className="w-3.5 h-3.5" /> {member.branch}
                        </div>

                        {/* Member Details */}
                        <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight group-hover/card:text-blue-600 transition-colors">
                          {member.name}
                        </h3>

                        <p className="text-xs text-blue-600 font-extrabold mb-4 uppercase tracking-widest">
                          {member.role}
                        </p>
                      </div>

                      {/* Elegant Call to action footer buttons */}
                      <div className="px-6 pb-6 pt-4 border-t border-slate-100 bg-slate-50/30 flex items-center gap-2.5 relative z-10">
                        <button
                          onClick={() =>
                            openContactModal(
                              `Inquiry with ${member.name} (${member.branch})`,
                            )
                          }
                          className="flex-1 bg-white hover:bg-slate-900 hover:text-white text-slate-700 font-black py-3 px-3 rounded-2xl text-[11px] border border-slate-200/80 hover:border-slate-900 shadow-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Consulting
                        </button>
                        <a
                          href={`https://wa.me/${member.whatsapp}?text=Hello%20${encodeURIComponent(member.name)},%20I%20have%20an%20inquiry%20regarding%20services%20at%20${encodeURIComponent(member.branch)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-3.5 rounded-2xl text-[11px] shadow-lg shadow-emerald-600/10 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1 active:scale-95 hover:shadow-xl"
                        >
                          <Phone className="w-3.5 h-3.5" /> WhatsApp
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Premium Scroll Controls with hover transparency */}
                <button
                  onClick={() => {
                    const track = document.getElementById("members-track");
                    if (track)
                      track.scrollBy({ left: -340, behavior: "smooth" });
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white hover:bg-slate-900 text-slate-700 hover:text-white shadow-lg shadow-slate-900/5 border border-slate-100 flex items-center justify-center transition-all duration-300 cursor-pointer z-10 opacity-0 group-hover/slider:opacity-100 hidden md:flex active:scale-95 hover:scale-105"
                  aria-label="Previous Team Members"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    const track = document.getElementById("members-track");
                    if (track)
                      track.scrollBy({ left: 340, behavior: "smooth" });
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-11 h-11 rounded-full bg-white hover:bg-slate-900 text-slate-700 hover:text-white shadow-lg shadow-slate-900/5 border border-slate-100 flex items-center justify-center transition-all duration-300 cursor-pointer z-10 opacity-0 group-hover/slider:opacity-100 hidden md:flex active:scale-95 hover:scale-105"
                  aria-label="Next Team Members"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Mobile indicator dots */}
                <div className="flex justify-center gap-1.5 mt-4 md:hidden">
                  {[0, 1, 2, 3, 4, 5].map((dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => {
                        const track = document.getElementById("members-track");
                        if (track) {
                          track.scrollTo({
                            left: dotIdx * (track.scrollWidth / 6),
                            behavior: "smooth",
                          });
                        }
                      }}
                      className="w-2 h-2 rounded-full bg-slate-300 focus:bg-blue-600 focus:w-4 transition-all duration-300"
                      aria-label={`Scroll to member ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 4. Creator Section */}
          <section
            id="creator"
            className="py-12 sm:py-24 bg-gradient-to-b from-slate-50 to-white border-t border-slate-100"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest mb-4 border border-blue-100">
                  <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                  Founder & Chief Architect
                </div>
                <h2 
                  className="text-4xl sm:text-5xl md:text-6xl font-black text-blue-600 uppercase mb-4 sm:mb-5 tracking-tight"
                  style={{ textShadow: "1px 1px 0 #1e40af, 2px 2px 0 #1e3a8a, 3px 3px 0 #172554, 4px 4px 0 #0f172a, 5px 5px 10px rgba(0,0,0,0.4)" }}
                >
                  Meet The Developer
                </h2>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                  Connect, collaborate, and grow with the creator of Haryana's
                  premier digital services and university admissions ecosystem.
                </p>
              </div>

              <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                {/* LEFT: Premium Creator Profile Card (7 Cols) */}
                <div className="lg:col-span-7 bg-white rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 border border-slate-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden group">
                  {/* Abstract decorative graphic elements */}
                  <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-gradient-to-br from-blue-400/5 to-indigo-500/5 rounded-full blur-[80px] pointer-events-none -translate-y-1/3 translate-x-1/3" />
                  <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-slate-100/50 rounded-full border border-slate-200/20 pointer-events-none" />

                  <div className="relative z-10 space-y-5 sm:space-y-8">
                    {/* Profile Avatar and Basic Info */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                      <div className="relative flex-shrink-0">
                        <div className="w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] relative">
                          <img
                            src={developerImage}
                            alt="Nitesh Verma"
                            className="w-full h-full object-cover object-top scale-[1.15] group-hover:scale-[1.25] transition-transform duration-700"
                          />
                          {/* Active Status Ring */}
                          <div
                            className="absolute bottom-2.5 right-2.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-md animate-pulse"
                            title="Available for Collaboration"
                          />
                        </div>
                      </div>

                      <div className="text-center sm:text-left space-y-1 sm:space-y-2">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-100 text-slate-800 text-[9px] sm:text-[10px] font-black uppercase tracking-wider border border-slate-200">
                          <Award className="w-3.5 h-3.5 text-blue-600" /> UI/UX
                          & Cloud Specialist
                        </div>
                        <h3 className="text-xl sm:text-2xl md:text-3.5xl font-black text-slate-900 tracking-tight">
                          Nitesh Verma
                        </h3>
                        <p className="text-xs sm:text-sm text-blue-600 font-extrabold flex items-center justify-center sm:justify-start gap-1.5">
                          <span>Lead Software Engineer & Entrepreneur</span>
                        </p>
                      </div>
                    </div>

                    {/* Profile Bio */}
                    <div className="space-y-2.5 sm:space-y-3">
                      <p className="text-slate-655 text-xs sm:text-sm md:text-[15px] leading-relaxed font-semibold text-center sm:text-left">
                        "Leveraging modern web technologies and clean
                        architecture to bridge the digital divide. My mission is
                        to build beautiful, lighting-fast tools that empower
                        students, cyber cafes, and businesses in Haryana."
                      </p>
                    </div>
                  </div>

                  {/* Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-5 mt-5 sm:pt-8 sm:mt-8 border-t border-slate-100 relative z-10 text-center sm:text-left">
                    {[
                      { value: "10,000+", label: "Happy Clients" },
                      { value: "3+ Years", label: "Ecosystem Exp" },
                      { value: "3 Active", label: "Tech Hubs" },
                    ].map((stat, idx) => (
                      <div key={idx} className="space-y-0.5 sm:space-y-1">
                        <div className="text-base sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                          {stat.value}
                        </div>
                        <div className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: Partner & Build Collaboration Panel (5 Cols) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden shadow-xl shadow-slate-900/10">
                  {/* Aesthetic light streak */}
                  <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 space-y-4 sm:space-y-6">
                    <div className="text-center sm:text-left">
                      <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
                        Grow Together (साथ जुड़ें)
                      </span>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black mt-2 sm:mt-3">
                        Let's Partner & Build!
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed mt-1.5 sm:mt-2 font-medium">
                        Are you a student, developer, cyber cafe operator, or
                        local school administrator? Here is how we can
                        collaborate to unlock premium value:
                      </p>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      {/* Custom Software & Consulting */}
                      <div className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-white/8 transition-all group/item">
                        <div className="flex gap-3 items-start">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold flex-shrink-0">
                            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                              Custom Web & Software Dev
                            </h4>
                            <p className="text-[10px] sm:text-[11px] text-slate-300 leading-normal">
                              Need a high-conversion digital portal, school
                              management software, or specialized retail
                              database? Hire Nitesh for pixel-perfect bespoke
                              tech.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Collaboration Calls to Action */}
                  <div className="relative z-10 pt-5 mt-5 sm:pt-8 sm:mt-8 border-t border-white/10 space-y-3.5">
                    <p className="text-[9px] sm:text-[10px] text-slate-400 text-center font-bold uppercase tracking-wider">
                      Contact Nitesh Verma directly for inquiries
                    </p>

                    <div className="grid sm:grid-cols-2 gap-2.5">
                      <button
                        onClick={() =>
                          openContactModal("Partner & Collaboration")
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/10 transition-all active:scale-98"
                      >
                        <MessageSquare className="w-4 h-4 text-blue-200" />{" "}
                        Apply Partner
                      </button>
                      <a
                        href="https://wa.me/9138660006?text=Hello%20Nitesh,%20I%20want%20to%20collaborate%20with%20Rakhi%20Internet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/10 transition-all active:scale-98 text-center"
                      >
                        <Phone className="w-4 h-4 text-emerald-200" /> WhatsApp
                        Founder
                      </a>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-slate-400 pt-1 font-semibold">
                      <a
                        href="mailto:nitesh@rakhiinternet.com"
                        className="hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />{" "}
                        nitesh@rakhiinternet.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 5. Footer */}
      {currentView !== "chat-portal" && (
        <footer
          id="footer"
          className="bg-[#111] text-gray-300 py-16 border-t border-gray-800"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-12">
              {/* Brand */}
              <div>
                <h3
                  className="text-white text-2xl font-extrabold tracking-tight mb-4 flex items-center gap-2 group/footer-logo cursor-pointer"
                  onClick={() => {
                    setCurrentView("home");
                    window.scrollTo(0, 0);
                  }}
                >
                  <div className="relative w-8 h-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-[0_4px_15px_rgb(0,0,0,0.3)] overflow-hidden group-hover/footer-logo:shadow-blue-500/30 border border-white/20 transition-all duration-500 group-hover/footer-logo:-translate-y-0.5">
                    <div className="absolute -right-2 -top-2 w-5 h-5 bg-blue-500 rounded-full blur-sm opacity-60 group-hover/footer-logo:scale-150 transition-transform duration-700"></div>
                    <div className="absolute -left-2 -bottom-2 w-5 h-5 bg-indigo-500 rounded-full blur-sm opacity-60 group-hover/footer-logo:scale-150 transition-transform duration-700"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.15] mix-blend-plus-lighter">
                      <Globe className="w-6 h-6 rotate-12 group-hover/footer-logo:rotate-[60deg] transition-transform duration-1000 ease-out" />
                    </div>
                    <span className="relative z-10 tracking-tighter flex items-center group-hover/footer-logo:scale-105 transition-transform duration-300">
                      <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                        R
                      </span>
                      <span className="bg-clip-text text-transparent bg-gradient-to-b from-blue-300 to-cyan-200 -ml-[0.5px]">
                        I
                      </span>
                    </span>
                  </div>
                  Rakhi Internet
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Your reliable partner for CSC services, University Admissions,
                  and International Courier shipping.
                </p>
                <div className="flex gap-4">
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/919999999999?text=Hello%20Rakhi%20Internet,%20I%20have%20an%20inquiry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 text-gray-300 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all transform hover:scale-110 duration-300 cursor-pointer flex-shrink-0"
                    title="WhatsApp Us"
                  >
                    <Phone className="w-5 h-5" />
                  </a>

                  {/* WhatsApp Channel */}
                  <a
                    href="https://whatsapp.com/channel/your-channel-id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 text-gray-300 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all transform hover:scale-110 duration-300 cursor-pointer flex-shrink-0"
                    title="WhatsApp Channel"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 text-gray-300 flex items-center justify-center hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white transition-all transform hover:scale-110 duration-300 cursor-pointer"
                    title="Follow on Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 text-gray-300 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all transform hover:scale-110 duration-300 cursor-pointer"
                    title="Follow on Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">
                  Services
                </h4>
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => scrollTo("services")}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-left"
                    >
                      <span>🖥️</span> CSC Online Services
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollTo("services")}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-left"
                    >
                      <span>🎓</span> University Admissions
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollTo("courier")}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-left"
                    >
                      <span>✈️</span> International Courier
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setPhotoToolActiveTab("bg-remover");
                        setPhotoToolsModalOpen(true);
                      }}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-left"
                    >
                      <Scissors className="w-4 h-4" /> Background Remover
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() => {
                        setImageResizerModalOpen(true);
                      }}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-left"
                    >
                      <Sparkles className="w-4 h-4" /> Image Resizer
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() => openContactModal("Bhaichara DJ Sound")}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-left"
                    >
                      <Music className="w-3.5 h-3.5 text-blue-400" /> Bhaichara
                      DJ Sound
                    </button>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">
                  Our Branches
                </h4>
                <ul className="space-y-4">
                  <li>
                    <div className="flex items-start justify-between gap-2 group/loc p-2 -ml-2 rounded-xl hover:bg-white/5 transition-all">
                      <button onClick={() => window.open("https://maps.google.com/?q=Bhiwani+Bypass,+main+chowk,+Jind,+Haryana+126102", "_blank")}
                        className="flex items-start gap-3 text-left cursor-pointer flex-1"
                      >
                        <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5 group-hover/loc:scale-110 transition-transform" />
                        <div>
                          <span className="font-bold text-sm text-gray-200 group-hover/loc:text-blue-400 transition-colors block">
                            Jind Branch
                          </span>
                          <span className="text-xs text-gray-400 group-hover/loc:text-gray-300 transition-colors block">
                            Bhiwani Bypass, main chowk, Jind, Haryana 126102
                          </span>
                        </div>
                      </button>
                      <a
                        href="https://maps.google.com/?q=Bhiwani+Bypass,+main+chowk,+Jind,+Haryana+126102"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-blue-600 transition-all flex items-center gap-1 text-[11px] font-semibold flex-shrink-0 cursor-pointer"
                        title="Open in Google Maps"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Map</span>
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-start justify-between gap-2 group/loc p-2 -ml-2 rounded-xl hover:bg-white/5 transition-all">
                      <button onClick={() => window.open("https://maps.google.com/?q=Bus+Stand,+Front+of+Police+Station,+Old,+Narnaund,+Haryana+125039", "_blank")}
                        className="flex items-start gap-3 text-left cursor-pointer flex-1"
                      >
                        <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5 group-hover/loc:scale-110 transition-transform" />
                        <div>
                          <span className="font-bold text-sm text-gray-200 group-hover/loc:text-blue-400 transition-colors block">
                            Narnaund Branch
                          </span>
                          <span className="text-xs text-gray-400 group-hover/loc:text-gray-300 transition-colors block">
                            Bus Stand, Front of Police Station, Old, Narnaund, Haryana 125039
                          </span>
                        </div>
                      </button>
                      <a
                        href="https://maps.google.com/?q=Bus+Stand,+Front+of+Police+Station,+Old,+Narnaund,+Haryana+125039"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-blue-600 transition-all flex items-center gap-1 text-[11px] font-semibold flex-shrink-0 cursor-pointer"
                        title="Open in Google Maps"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Map</span>
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-start justify-between gap-2 group/loc p-2 -ml-2 rounded-xl hover:bg-white/5 transition-all">
                      <button onClick={() => window.open("https://maps.google.com/?q=main+market+railway+road+uchana", "_blank")}
                        className="flex items-start gap-3 text-left cursor-pointer flex-1"
                      >
                        <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5 group-hover/loc:scale-110 transition-transform" />
                        <div>
                          <span className="font-bold text-sm text-gray-200 group-hover/loc:text-blue-400 transition-colors block">
                            Uchana Branch
                          </span>
                          <span className="text-xs text-gray-400 group-hover/loc:text-gray-300 transition-colors block">
                            main market railway road uchana
                          </span>
                        </div>
                      </button>
                      <a
                        href="https://maps.google.com/?q=main+market+railway+road+uchana"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-blue-600 transition-all flex items-center gap-1 text-[11px] font-semibold flex-shrink-0 cursor-pointer"
                        title="Open in Google Maps"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Map</span>
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
              <p>
                © {new Date().getFullYear()} Rakhi Internet. All Rights
                Reserved.
              </p>
              <button
                onClick={() => {
                  setCurrentView("admin");
                  window.scrollTo(0, 0);
                }}
                className="text-gray-600 hover:text-white transition-colors flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-green-500"></span>{" "}
                Branch Admin Portal
              </button>
            </div>
          </div>
        </footer>
      )}

      {currentView !== "chat-portal" && (
        <div className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-[999999] pointer-events-none flex flex-col items-end justify-end">
          <motion.div
            className="pointer-events-auto select-none flex flex-col items-end justify-end"
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            drag
            dragMomentum={false}
            onDragStart={() => isDraggingRef.current = true}
            onDragEnd={() => { setTimeout(() => isDraggingRef.current = false, 150) }}
          >
            {/* AI Greeting Tooltip */}
            <AnimatePresence>
              {showAiTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.8, x: 10 }}
                  animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    mass: 0.8,
                  }}
                  className="mb-4 mr-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-64 relative origin-bottom-right pointer-events-auto"
                >
                  <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-b border-r border-slate-100 transform rotate-45"></div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <img
                          src={creatorImage}
                          alt="AI"
                          className="w-full h-full object-contain drop-shadow-md pointer-events-none"
                        />
                      </div>
                      <span className="text-xs font-black text-slate-800 tracking-wide uppercase">
                        Rakhi AI Assistant
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAiTooltip(false);
                      }}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    Welcome to Rakhi Internet! 👋 I can help you with CSC
                    services, courier tracking, and more. What are you looking
                    for today?
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="flex items-center justify-center cursor-pointer origin-bottom"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                if (isDraggingRef.current) return;
                setCurrentView("chat-portal");
                setShowAiTooltip(false);
                window.scrollTo(0, 0);
              }}
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center z-10 drop-shadow-2xl">
                <img
                  src={creatorImage}
                  alt="AI Bot"
                  draggable="false"
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        defaultService={selectedService}
        defaultBranch={selectedBranch}
      />
      <AnimatePresence>
        {pdfToolsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setPdfToolsModalOpen(false)}
                className="absolute top-6 right-6 z-50 p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="overflow-y-auto flex-1">
                <PdfTools />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {photoToolsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setPhotoToolsModalOpen(false)}
                className="absolute top-6 right-6 z-50 p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="overflow-y-auto flex-1 mt-16">
                <PhotoTools initialTab={photoToolActiveTab} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {imageResizerModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto" style={{ perspective: "1500px" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateX: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transform-gpu"
              style={{ transformStyle: "preserve-3d" }}
            >
              <button
                onClick={() => setImageResizerModalOpen(false)}
                className="absolute top-6 right-6 z-50 p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors cursor-pointer transform-gpu"
                style={{ transform: "translateZ(50px)" }}
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="overflow-y-auto flex-1">
                <ImageResizer />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Courier Track Modal */}
      <AnimatePresence>
        {courierTrackModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setCourierTrackModalOpen(false)}
                className="absolute top-6 right-6 z-50 p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="overflow-y-auto flex-1 p-6 md:p-10">
                <CourierTrackWidget />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Courier Rates Modal */}
      <AnimatePresence>
        {courierRatesModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setCourierRatesModalOpen(false)}
                className="absolute top-6 right-6 z-50 p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="overflow-y-auto flex-1 p-6 md:p-10">
                <CourierRatesWidget openContactModal={openContactModal} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <LatestLinksModal
        isOpen={latestLinksOpen}
        onClose={() => setLatestLinksOpen(false)}
        jobs={latestJobs}
        isLoading={isLoadingJobs}
      />
    </div>
  );
}
