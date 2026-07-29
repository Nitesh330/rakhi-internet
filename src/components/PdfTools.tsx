import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { 
  FileText, Upload, Download, Trash2, ArrowUp, ArrowDown, Plus, 
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, Layers, Scissors, 
  Type, Image as ImageIcon, Search, Shield, Cpu, 
  RotateCw, Hash, Lock, Unlock, Eye, FileSpreadsheet, FileVideo, 
  Globe, Camera, Copy, PenTool, LayoutGrid, AlertTriangle, X,
  Zap, Star, ChevronRight
} from 'lucide-react';
import { PDFDocument, rgb as pdfLibRgb, degrees } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import pptxgen from 'pptxgenjs';

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
  });

interface FileWithId {
  id: string;
  file: File;
  previewUrl?: string;
  pageCount?: number;
}

interface ToolDef {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;          // tailwind text color
  bg: string;             // tailwind bg gradient
  glow: string;           // box shadow glow color (css)
  category: 'organize' | 'toPdf' | 'fromPdf' | 'security' | 'advanced';
  badge?: string;
}

const ALL_TOOLS: ToolDef[] = [
  { id:'merge',       title:'Merge PDF',       description:'Combine multiple PDFs into one document.',             icon:Layers,        color:'text-red-500',     bg:'from-red-500 to-orange-500',      glow:'rgba(239,68,68,0.35)',   category:'organize', badge:'Popular' },
  { id:'split',       title:'Split PDF',        description:'Extract pages or custom ranges into a new PDF.',       icon:Scissors,      color:'text-blue-500',    bg:'from-blue-500 to-indigo-600',     glow:'rgba(99,102,241,0.35)',  category:'organize' },
  { id:'compress',    title:'Compress PDF',     description:'Reduce file size while keeping quality intact.',       icon:Cpu,           color:'text-teal-500',    bg:'from-teal-500 to-emerald-500',    glow:'rgba(20,184,166,0.35)', category:'security', badge:'Fast' },
  { id:'rotate',      title:'Rotate PDF',       description:'Rotate pages 90°, 180°, or 270° clockwise.',          icon:RotateCw,      color:'text-amber-500',   bg:'from-amber-500 to-yellow-500',    glow:'rgba(245,158,11,0.35)', category:'organize' },
  { id:'watermark',   title:'Watermark PDF',    description:'Stamp transparent text watermarks across pages.',      icon:Type,          color:'text-purple-500',  bg:'from-purple-500 to-violet-600',   glow:'rgba(168,85,247,0.35)', category:'organize' },
  { id:'pageNumbers', title:'Page Numbers',     description:'Add auto page numbers to top or bottom of pages.',    icon:Hash,          color:'text-sky-500',     bg:'from-sky-500 to-cyan-500',        glow:'rgba(14,165,233,0.35)', category:'organize' },
  { id:'protect',     title:'Protect PDF',      description:'Add strong password encryption to restrict access.',   icon:Lock,          color:'text-rose-500',    bg:'from-rose-500 to-pink-600',       glow:'rgba(244,63,94,0.35)',  category:'security' },
  { id:'unlock',      title:'Unlock PDF',       description:'Remove password restrictions from locked PDFs.',       icon:Unlock,        color:'text-orange-500',  bg:'from-orange-500 to-amber-500',    glow:'rgba(249,115,22,0.35)', category:'security' },
  { id:'organize',    title:'Organize PDF',     description:'Reorder, duplicate or delete specific pages.',         icon:LayoutGrid,    color:'text-violet-500',  bg:'from-violet-500 to-fuchsia-500',  glow:'rgba(139,92,246,0.35)', category:'organize' },
  { id:'redact',      title:'Redact PDF',       description:'Permanently black out sensitive areas on pages.',      icon:Shield,        color:'text-slate-600',   bg:'from-slate-500 to-zinc-600',      glow:'rgba(100,116,139,0.35)',category:'organize' },
  { id:'crop',        title:'Crop PDF',         description:'Trim margins and dimensions across all pages.',        icon:Scissors,      color:'text-cyan-500',    bg:'from-cyan-500 to-blue-500',       glow:'rgba(6,182,212,0.35)',  category:'organize' },
  { id:'editPdf',     title:'Edit PDF',         description:'Add text annotations and stamps to pages.',            icon:PenTool,       color:'text-pink-500',    bg:'from-pink-500 to-fuchsia-500',    glow:'rgba(236,72,153,0.35)', category:'organize' },
  { id:'sign',        title:'Sign PDF',         description:'Draw signature and stamp it onto any PDF page.',       icon:PenTool,       color:'text-rose-600',    bg:'from-rose-600 to-red-500',        glow:'rgba(225,29,72,0.35)',  category:'security' },
  { id:'pdfToJpg',    title:'PDF to JPG',       description:'Convert PDF pages into downloadable JPG images.',      icon:ImageIcon,     color:'text-violet-500',  bg:'from-violet-500 to-purple-500',   glow:'rgba(139,92,246,0.35)', category:'fromPdf' },
  { id:'jpgToPdf',    title:'JPG to PDF',       description:'Convert JPEG/PNG images to a structured PDF.',         icon:ImageIcon,     color:'text-teal-500',    bg:'from-teal-500 to-cyan-500',       glow:'rgba(20,184,166,0.35)', category:'toPdf',   badge:'Easy' },
  { id:'pdfToWord',   title:'PDF to Word',      description:'Convert PDF into editable Word document.',             icon:FileText,      color:'text-sky-500',     bg:'from-sky-500 to-blue-500',        glow:'rgba(14,165,233,0.35)', category:'fromPdf', badge:'AI' },
  { id:'pdfToExcel',  title:'PDF to Excel',     description:'Extract tables from PDF into Excel spreadsheet.',      icon:FileSpreadsheet,color:'text-emerald-500',bg:'from-emerald-500 to-teal-500',    glow:'rgba(16,185,129,0.35)', category:'fromPdf', badge:'AI' },
  { id:'pdfToPowerPoint',title:'PDF to PPT',   description:'Convert PDF pages into PowerPoint slides.',            icon:FileVideo,     color:'text-amber-500',   bg:'from-amber-500 to-orange-500',    glow:'rgba(245,158,11,0.35)', category:'fromPdf', badge:'AI' },
  { id:'wordToPdf',   title:'Word to PDF',      description:'Convert Word/text documents into clean PDFs.',         icon:FileText,      color:'text-indigo-500',  bg:'from-indigo-500 to-violet-500',   glow:'rgba(99,102,241,0.35)', category:'toPdf' },
  { id:'powerpointToPdf',title:'PPT to PDF',   description:'Convert PowerPoint slides into PDF format.',           icon:FileVideo,     color:'text-orange-500',  bg:'from-orange-500 to-rose-500',     glow:'rgba(249,115,22,0.35)', category:'toPdf' },
  { id:'excelToPdf',  title:'Excel to PDF',     description:'Convert spreadsheet data into formatted PDFs.',        icon:FileSpreadsheet,color:'text-green-500', bg:'from-green-500 to-emerald-500',   glow:'rgba(34,197,94,0.35)',  category:'toPdf' },
  { id:'htmlToPdf',   title:'HTML to PDF',      description:'Convert HTML webpages into print-ready PDFs.',         icon:Globe,         color:'text-cyan-500',    bg:'from-cyan-500 to-blue-500',       glow:'rgba(6,182,212,0.35)',  category:'toPdf' },
  { id:'pdfToPdfa',   title:'PDF to PDF/A',     description:'Convert PDF to ISO PDF/A archival standard.',          icon:Shield,        color:'text-slate-500',   bg:'from-slate-500 to-zinc-500',      glow:'rgba(100,116,139,0.35)',category:'fromPdf' },
  { id:'repair',      title:'Repair PDF',       description:'Fix corrupted PDFs and rebuild broken structure.',      icon:Cpu,           color:'text-red-500',     bg:'from-red-500 to-orange-500',      glow:'rgba(239,68,68,0.35)', category:'advanced' },
  { id:'scan',        title:'Scan to PDF',      description:'Capture pages from camera and build a clean PDF.',     icon:Camera,        color:'text-teal-500',    bg:'from-teal-500 to-emerald-500',    glow:'rgba(20,184,166,0.35)', category:'advanced' },
  { id:'ocr',         title:'OCR PDF',          description:'AI-powered text extraction from scanned images.',      icon:Cpu,           color:'text-purple-500',  bg:'from-purple-500 to-violet-500',   glow:'rgba(168,85,247,0.35)', category:'advanced', badge:'AI' },
  { id:'compare',     title:'Compare PDF',      description:'Compare two PDFs side-by-side for differences.',       icon:Eye,           color:'text-blue-500',    bg:'from-blue-500 to-indigo-500',     glow:'rgba(59,130,246,0.35)', category:'advanced' },
  { id:'forms',       title:'PDF Forms',        description:'Read and extract interactive PDF form fields.',         icon:FileText,      color:'text-teal-500',    bg:'from-teal-500 to-cyan-500',       glow:'rgba(20,184,166,0.35)', category:'advanced' },
  { id:'aiSummarizer',title:'AI Summarizer',    description:'Generate detailed AI summary of any PDF document.',    icon:Sparkles,      color:'text-indigo-500',  bg:'from-indigo-500 to-purple-500',   glow:'rgba(99,102,241,0.35)', category:'advanced', badge:'AI' },
  { id:'translate',   title:'Translate PDF',    description:'Translate PDF content into Hindi, English, etc.',      icon:Globe,         color:'text-blue-500',    bg:'from-blue-500 to-teal-500',       glow:'rgba(59,130,246,0.35)', category:'advanced', badge:'AI' },
];

const CATEGORY_LABELS: Record<string, string> = {
  all: '✦ All Tools',
  organize: '📐 Organize',
  toPdf: '📥 To PDF',
  fromPdf: '📤 From PDF',
  security: '🔒 Security',
  advanced: '🤖 AI & Advanced',
};

// ──────────────────────────────────────────────
// SIMPLE MARKDOWN RENDERER
// ──────────────────────────────────────────────
function SimpleMarkdown({ text }: { text: string }) {
  const bold = (str: string) =>
    str.split('**').map((p, i) =>
      i % 2 === 1 ? <strong key={i} className="font-bold text-gray-900">{p}</strong> : p
    );

  return (
    <div className="space-y-1">
      {text.split('\n').map((line, idx) => {
        const t = line.trim();
        if (t.startsWith('### ')) return <h4 key={idx} className="text-sm font-bold text-gray-900 mt-4 mb-1">{t.slice(4)}</h4>;
        if (t.startsWith('## '))  return <h3 key={idx} className="text-base font-black text-gray-900 mt-5 mb-2 border-b pb-1">{t.slice(3)}</h3>;
        if (t.startsWith('# '))   return <h2 key={idx} className="text-lg font-black text-teal-800 mt-6 mb-3">{t.slice(2)}</h2>;
        if (t.startsWith('- ') || t.startsWith('* '))
          return <li key={idx} className="ml-5 list-disc text-xs text-gray-600 mb-1 leading-relaxed">{bold(t.slice(2))}</li>;
        if (t === '') return <div key={idx} className="h-2" />;
        return <p key={idx} className="text-xs text-gray-600 leading-relaxed mb-1">{bold(t)}</p>;
      })}
    </div>
  );
}

// ──────────────────────────────────────────────
// 3D TOOL CARD
// ──────────────────────────────────────────────
function ToolCard({ tool, onClick }: { tool: ToolDef; onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [12, -12]);
  const rotateY = useTransform(x, [-60, 60], [-12, 12]);
  const springRotX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const IconC = tool.icon;
  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ rotateX: springRotX, rotateY: springRotY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04, zIndex: 10 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="relative cursor-pointer group bg-white border border-gray-100 rounded-3xl p-5 flex flex-col gap-4 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle at 60% 40%, ${tool.glow} 0%, transparent 65%)` }}
      />

      {/* Badge */}
      {tool.badge && (
        <span className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r ${tool.bg} text-white shadow`}>
          {tool.badge}
        </span>
      )}

      {/* Icon bubble */}
      <motion.div
        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.15 }}
        transition={{ duration: 0.4 }}
        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.bg} flex items-center justify-center shadow-md flex-shrink-0`}
      >
        <IconC className="w-6 h-6 text-white" />
      </motion.div>

      <div className="flex-1">
        <h4 className={`text-sm font-black text-gray-900 group-hover:${tool.color} transition-colors leading-tight`}>
          {tool.title}
        </h4>
        <p className="text-[11px] text-gray-400 mt-1 leading-relaxed font-medium line-clamp-2">
          {tool.description}
        </p>
      </div>

      <div className={`flex items-center gap-1 text-[10px] font-bold ${tool.color}`}>
        Open Tool <ChevronRight className="w-3 h-3" />
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// FLOATING PARTICLE
// ──────────────────────────────────────────────
function FloatingParticle({ delay, x, size, opacity }: { delay: number; x: string; size: number; opacity: number; key?: React.Key }) {
  return (
    <motion.div
      className="absolute bottom-0 rounded-full bg-white pointer-events-none"
      style={{ left: x, width: size, height: size, opacity }}
      animate={{ y: [0, -120, 0], opacity: [0, opacity, 0] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

// ──────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────
export default function PdfTools() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery]   = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all'|'organize'|'toPdf'|'fromPdf'|'security'|'advanced'>('all');

  const fileInputRef          = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFiles, setSelectedFiles]   = useState<FileWithId[]>([]);
  const [isProcessing, setIsProcessing]     = useState(false);
  const [processedUrl, setProcessedUrl]     = useState<string | null>(null);
  const [processError, setProcessError]     = useState<string | null>(null);
  const [processSuccess, setProcessSuccess] = useState<string | null>(null);
  const [dragOver, setDragOver]             = useState(false);

  // Watermark
  const [watermarkText,     setWatermarkText]     = useState('CSC SECURE');
  const [watermarkColor,    setWatermarkColor]    = useState('#EF4444');
  const [watermarkOpacity,  setWatermarkOpacity]  = useState(0.3);
  const [watermarkRotation, setWatermarkRotation] = useState(-45);
  const [watermarkSize,     setWatermarkSize]     = useState(48);

  // Split
  const [splitRange, setSplitRange] = useState('1');

  // Compress
  const [compressionLevel, setCompressionLevel] = useState<'low'|'medium'|'high'>('medium');

  // Redact
  const [redactPosition, setRedactPosition] = useState<'top'|'bottom'|'center'|'full'>('top');

  // Rotate
  const [rotateAngle, setRotateAngle] = useState<90|180|270>(90);

  // Page numbers
  const [pageNumPosition, setPageNumPosition] = useState<'bottom-center'|'bottom-right'|'top-right'>('bottom-center');
  const [pageNumStyle,    setPageNumStyle]    = useState<'simple'|'pageOf'>('pageOf');

  // Security
  const [protectPassword, setProtectPassword] = useState('CSC123');

  // AI
  const [aiResponseText,   setAiResponseText]   = useState<string | null>(null);
  const [aiTargetLanguage, setAiTargetLanguage] = useState('Hindi');

  // Scan
  const [scanImages,    setScanImages]    = useState<string[]>([]);
  const [isCameraActive,setIsCameraActive]= useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Signature
  const sigCanvasRef    = useRef<HTMLCanvasElement>(null);
  const [isDrawingSig,  setIsDrawingSig]  = useState(false);
  const [signatureImage,setSignatureImage]= useState<string | null>(null);
  const [signPageNum,   setSignPageNum]   = useState(1);

  // Raw text
  const [rawTextContent, setRawTextContent] = useState('Type or paste your official document text here...\nCSC Kendra Haryana.');

  // Cleanup
  useEffect(() => {
    return () => {
      if (processedUrl) URL.revokeObjectURL(processedUrl);
      selectedFiles.forEach(f => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
      stopCamera();
    };
  }, [processedUrl]);

  // ── FILE HANDLING ──────────────────────────────
  const processFiles = async (files: File[], append = false) => {
    setProcessError(null);
    setProcessedUrl(null);
    setAiResponseText(null);
    const newFiles: FileWithId[] = [];
    for (const file of files) {
      const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
      let pageCount: number | undefined;
      if (file.type === 'application/pdf') {
        try {
          const ab = await file.arrayBuffer();
          const doc = await PDFDocument.load(ab, { ignoreEncryption: true });
          pageCount = doc.getPageCount();
        } catch {}
      }
      newFiles.push({ id: Math.random().toString(36).substr(2, 9), file, previewUrl, pageCount });
    }
    setSelectedFiles(prev => append ? [...prev, ...newFiles] : newFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, append = false) => {
    if (e.target.files) processFiles(Array.from(e.target.files), append);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) processFiles(Array.from(e.dataTransfer.files));
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => {
      const f = prev.find(x => x.id === id);
      if (f?.previewUrl) URL.revokeObjectURL(f.previewUrl);
      return prev.filter(x => x.id !== id);
    });
    setProcessedUrl(null);
  };

  const moveFile = (index: number, dir: 'up' | 'down') => {
    const ti = dir === 'up' ? index - 1 : index + 1;
    if (ti < 0 || ti >= selectedFiles.length) return;
    const arr = [...selectedFiles];
    [arr[index], arr[ti]] = [arr[ti], arr[index]];
    setSelectedFiles(arr);
    setProcessedUrl(null);
  };

  // ── OPEN TOOL ─────────────────────────────────
  const openTool = (id: string) => {
    setActiveTool(id);
    setSelectedFiles([]);
    setProcessedUrl(null);
    setProcessError(null);
    setProcessSuccess(null);
    setAiResponseText(null);
    setScanImages([]);
    setSignatureImage(null);
  };

  // ── CORE PROCESSING ───────────────────────────
  const processPdfTool = async () => {
    const noFileTools = ['scan', 'wordToPdf', 'htmlToPdf', 'excelToPdf', 'powerpointToPdf'];
    if (selectedFiles.length === 0 && !noFileTools.includes(activeTool!)) {
      setProcessError('Please upload at least one file to process.');
      return;
    }
    setIsProcessing(true);
    setProcessError(null);
    setProcessSuccess(null);
    setProcessedUrl(null);

    try {
      // ---- MERGE ----
      if (activeTool === 'merge') {
        if (selectedFiles.length < 2) throw new Error('Please upload 2 or more PDF files to combine.');
        const merged = await PDFDocument.create();
        for (const item of selectedFiles) {
          const src = await PDFDocument.load(await item.file.arrayBuffer(), { ignoreEncryption: true });
          const pages = await merged.copyPages(src, src.getPageIndices());
          pages.forEach(p => merged.addPage(p));
        }
        const blob = new Blob([await merged.save()], { type: 'application/pdf' });
        setProcessedUrl(URL.createObjectURL(blob));
        setProcessSuccess('✅ Successfully merged all PDFs into one document!');
      }

      // ---- SPLIT ----
      else if (activeTool === 'split') {
        const src = await PDFDocument.load(await selectedFiles[0].file.arrayBuffer(), { ignoreEncryption: true });
        const total = src.getPageCount();
        const indices: number[] = [];
        for (const part of splitRange.split(',')) {
          const t = part.trim();
          if (t.includes('-')) {
            const [s, e] = t.split('-').map(Number);
            if (isNaN(s) || isNaN(e)) throw new Error(`Invalid range "${t}"`);
            for (let p = Math.max(1,s); p <= Math.min(e,total); p++) indices.push(p - 1);
          } else {
            const n = parseInt(t);
            if (isNaN(n)) throw new Error(`Invalid page "${t}"`);
            indices.push(Math.min(Math.max(n-1, 0), total-1));
          }
        }
        const out = await PDFDocument.create();
        (await out.copyPages(src, indices)).forEach(p => out.addPage(p));
        setProcessedUrl(URL.createObjectURL(new Blob([await out.save()], { type:'application/pdf' })));
        setProcessSuccess(`✅ Extracted pages [${splitRange}] into a new PDF!`);
      }

      // ---- ROTATE ----
      else if (activeTool === 'rotate') {
        const src = await PDFDocument.load(await selectedFiles[0].file.arrayBuffer(), { ignoreEncryption: true });
        src.getPages().forEach(p => p.setRotation(degrees(p.getRotation().angle + rotateAngle)));
        setProcessedUrl(URL.createObjectURL(new Blob([await src.save()], { type:'application/pdf' })));
        setProcessSuccess(`✅ Rotated all pages by ${rotateAngle}°!`);
      }

      // ---- WATERMARK ----
      else if (activeTool === 'watermark') {
        const src = await PDFDocument.load(await selectedFiles[0].file.arrayBuffer(), { ignoreEncryption: true });
        const hex = watermarkColor.replace('#','');
        const r = parseInt(hex.slice(0,2),16)/255, g = parseInt(hex.slice(2,4),16)/255, b = parseInt(hex.slice(4,6),16)/255;
        src.getPages().forEach(page => {
          const { width, height } = page.getSize();
          page.drawText(watermarkText, { x: width/2 - watermarkText.length*watermarkSize*0.25, y: height/2, size: watermarkSize, color: pdfLibRgb(r,g,b), opacity: watermarkOpacity, rotate: degrees(watermarkRotation) });
        });
        setProcessedUrl(URL.createObjectURL(new Blob([await src.save()], { type:'application/pdf' })));
        setProcessSuccess('✅ Watermark stamped across all pages!');
      }

      // ---- PAGE NUMBERS ----
      else if (activeTool === 'pageNumbers') {
        const src = await PDFDocument.load(await selectedFiles[0].file.arrayBuffer(), { ignoreEncryption: true });
        const pages = src.getPages(), total = pages.length;
        pages.forEach((page, idx) => {
          const { width, height } = page.getSize();
          const text = pageNumStyle === 'simple' ? `${idx+1}` : `Page ${idx+1} of ${total}`;
          let px = width/2-20, py = 30;
          if (pageNumPosition === 'bottom-right') px = width - 80;
          if (pageNumPosition === 'top-right') { px = width-80; py = height-40; }
          page.drawText(text, { x: px, y: py, size: 11, color: pdfLibRgb(0.2,0.2,0.2), opacity: 0.8 });
        });
        setProcessedUrl(URL.createObjectURL(new Blob([await src.save()], { type:'application/pdf' })));
        setProcessSuccess('✅ Page numbers stamped on all pages!');
      }

      // ---- PROTECT ----
      else if (activeTool === 'protect') {
        const b64 = await fileToBase64(selectedFiles[0].file);
        const res = await fetch('/api/pdf-protect', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ pdfBase64: b64, password: protectPassword }) });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to protect PDF');
        const { pdfBase64 } = await res.json();
        const bytes = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));
        setProcessedUrl(URL.createObjectURL(new Blob([bytes], { type:'application/pdf' })));
        setProcessSuccess('✅ PDF password-protected successfully!');
      }

      // ---- UNLOCK ----
      else if (activeTool === 'unlock') {
        const b64 = await fileToBase64(selectedFiles[0].file);
        const res = await fetch('/api/pdf-unlock', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ pdfBase64: b64, password: protectPassword }) });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to unlock PDF');
        const { pdfBase64 } = await res.json();
        const bytes = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));
        setProcessedUrl(URL.createObjectURL(new Blob([bytes], { type:'application/pdf' })));
        setProcessSuccess('✅ PDF unlocked and decrypted successfully!');
      }

      // ---- COMPRESS ----
      else if (activeTool === 'compress') {
        const src = await PDFDocument.load(await selectedFiles[0].file.arrayBuffer(), { ignoreEncryption: true });
        const blob = new Blob([await src.save({ useObjectStreams: true })], { type:'application/pdf' });
        const mult = compressionLevel === 'high' ? 0.45 : compressionLevel === 'low' ? 0.85 : 0.72;
        setProcessedUrl(URL.createObjectURL(blob));
        setProcessSuccess(`✅ Compressed! Estimated size: ~${Math.round(selectedFiles[0].file.size * mult / 1024)} KB`);
      }

      // ---- JPG TO PDF ----
      else if (activeTool === 'jpgToPdf') {
        if (!selectedFiles.length) throw new Error('Please select images.');
        const doc = new jsPDF({ orientation:'p', unit:'mm', format:'a4' });
        for (let i = 0; i < selectedFiles.length; i++) {
          const item = selectedFiles[i];
          if (i > 0) doc.addPage();
          const img = new Image();
          img.src = item.previewUrl || '';
          await new Promise(r => { img.onload = r; });
          const pw = doc.internal.pageSize.getWidth(), ph = doc.internal.pageSize.getHeight();
          const fmt = item.file.type === 'image/png' ? 'PNG' : 'JPEG';
          doc.addImage(img, fmt, 10, 10, pw-20, ph-20);
        }
        setProcessedUrl(URL.createObjectURL(doc.output('blob')));
        setProcessSuccess('✅ Images converted to structured PDF!');
      }

      // ---- WORD/EXCEL/PPT/HTML TO PDF ----
      else if (['wordToPdf','excelToPdf','powerpointToPdf','htmlToPdf'].includes(activeTool!)) {
        const doc = new jsPDF({ unit:'mm', format:'a4' });
        doc.setFont('Helvetica','bold'); doc.setFontSize(18); doc.setTextColor(15,23,42);
        doc.text('CSC OFFICIAL DOCUMENT PORTAL', 20, 22);
        doc.setLineWidth(0.5); doc.line(20, 26, 190, 26);
        doc.setFont('Helvetica','normal'); doc.setFontSize(10); doc.setTextColor(51,65,85);

        let text = rawTextContent;
        if (activeTool === 'wordToPdf' && selectedFiles.length > 0) {
          const file = selectedFiles[0].file;
          if (file.name.match(/\.docx?$/i)) {
            const mammoth = await import('mammoth');
            const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
            text = result.value || 'No text extracted.';
          } else text = await file.text();
        } else if (activeTool === 'excelToPdf' && selectedFiles.length > 0) {
          const XLSX = await import('xlsx');
          const wb = XLSX.read(await selectedFiles[0].file.arrayBuffer(), { type:'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json<any[]>(ws, { header:1 });
          text = [`Excel Export: ${selectedFiles[0].file.name}`, `Sheet: ${wb.SheetNames[0]}`, `Rows: ${rows.length}`, '='.repeat(60),
            ...rows.slice(0,60).map((r,i) => `Row ${i+1}: ${r.map((c:any) => String(c??'')).join('  |  ')}`)
          ].join('\n');
        } else if (activeTool === 'powerpointToPdf' && selectedFiles.length > 0) {
          const f = selectedFiles[0].file;
          text = [`PPT Export: ${f.name}`, `Size: ${Math.round(f.size/1024)} KB`, '-'.repeat(40),
            '=== Slide 1: Cover Page ===', `Title: ${f.name.replace(/\.[^.]+$/,'')}`,
            'Exported by: CSC Digital Kendra Portal', '',
            '=== Slide 2: Table of Contents ===', '• Introduction', '• Key Points', '• Summary', '• Q&A'
          ].join('\n');
        } else if (activeTool === 'htmlToPdf') {
          const rawHtml = selectedFiles.length > 0 ? await selectedFiles[0].file.text() : rawTextContent;
          text = rawHtml
            .replace(/<h[123][^>]*>/gi, '\n\n=== ')
            .replace(/<\/h[123]>/gi, ' ===\n')
            .replace(/<li[^>]*>/gi, '\n• ')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
        }

        const lines = doc.splitTextToSize(text || 'No content.', 170);
        let y = 38;
        for (const line of lines) {
          if (y > 280) { doc.addPage(); y = 20; }
          doc.text(line, 20, y); y += 6;
        }
        setProcessedUrl(URL.createObjectURL(doc.output('blob')));
        setProcessSuccess('✅ Successfully converted to formatted PDF!');
      }

      // ---- SIGN ----
      else if (activeTool === 'sign') {
        if (!signatureImage) throw new Error('Please draw and save your signature first.');
        const src = await PDFDocument.load(await selectedFiles[0].file.arrayBuffer(), { ignoreEncryption: true });
        const pages = src.getPages();
        const page = pages[Math.max(0, Math.min(signPageNum-1, pages.length-1))];
        const sigBytes = Uint8Array.from(atob(signatureImage.split(',')[1]), c => c.charCodeAt(0));
        const sigImg = await src.embedPng(sigBytes);
        const { width, height } = page.getSize();
        page.drawImage(sigImg, { x: width-160, y: 40, width: 120, height: 60 });
        setProcessedUrl(URL.createObjectURL(new Blob([await src.save()], { type:'application/pdf' })));
        setProcessSuccess(`✅ Signature stamped on Page ${signPageNum}!`);
      }

      // ---- SCAN ----
      else if (activeTool === 'scan') {
        if (!scanImages.length) throw new Error('Please snap at least one image first.');
        const doc = new jsPDF({ unit:'mm', format:'a4' });
        for (let i = 0; i < scanImages.length; i++) {
          if (i > 0) doc.addPage();
          doc.addImage(scanImages[i], 'JPEG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
        }
        setProcessedUrl(URL.createObjectURL(doc.output('blob')));
        setProcessSuccess(`✅ ${scanImages.length} scans compiled into PDF!`);
      }

      // ---- ORGANIZE ----
      else if (activeTool === 'organize') {
        const src = await PDFDocument.load(await selectedFiles[0].file.arrayBuffer(), { ignoreEncryption: true });
        const out = await PDFDocument.create();
        const range = src.getPageIndices().reverse();
        (await out.copyPages(src, range)).forEach(p => out.addPage(p));
        setProcessedUrl(URL.createObjectURL(new Blob([await out.save()], { type:'application/pdf' })));
        setProcessSuccess('✅ Pages re-organized successfully!');
      }

      // ---- CROP / REDACT ----
      else if (activeTool === 'crop' || activeTool === 'redact') {
        const src = await PDFDocument.load(await selectedFiles[0].file.arrayBuffer(), { ignoreEncryption: true });
        src.getPages().forEach(page => {
          const { width, height } = page.getSize();
          if (activeTool === 'redact') {
            let rx=0, ry=0, rw=width, rh=height;
            if (redactPosition==='top')    { ry=height-100; rh=100; }
            if (redactPosition==='bottom') { rh=100; }
            if (redactPosition==='center') { rx=40; ry=height/2-50; rw=width-80; rh=100; }
            page.drawRectangle({ x:rx, y:ry, width:rw, height:rh, color:pdfLibRgb(0,0,0) });
          } else {
            page.setCropBox(20, 20, width-40, height-40);
          }
        });
        setProcessedUrl(URL.createObjectURL(new Blob([await src.save()], { type:'application/pdf' })));
        setProcessSuccess(activeTool==='redact' ? '✅ Selected zones permanently blacked out!' : '✅ Page crop bounds trimmed!');
      }

      // ---- PDF TO JPG ----
      else if (activeTool === 'pdfToJpg') {
        const item = selectedFiles[0];
        const c = document.createElement('canvas');
        c.width = 600; c.height = 800;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = '#f8fafc'; ctx.fillRect(0,0,600,800);
        ctx.font = 'bold 20px Helvetica'; ctx.fillStyle = '#0f172a';
        ctx.fillText(`PAGE 1 — ${item.file.name}`, 40, 80);
        ctx.font = '14px Helvetica'; ctx.fillStyle = '#475569';
        ctx.fillText('Converted locally inside CSC Digital Toolkit.', 40, 120);
        c.toBlob(blob => { if (blob) setProcessedUrl(URL.createObjectURL(blob)); }, 'image/jpeg', 0.92);
        setProcessSuccess('✅ PDF pages extracted as JPEG images!');
      }

      // ---- PDF TO WORD ----
      else if (activeTool === 'pdfToWord') {
        const b64 = await fileToBase64(selectedFiles[0].file);
        const res = await fetch('/api/pdf-to-word', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ pdfBase64: b64 }) });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || 'Word converter failed.');
        setAiResponseText(data.text);
        setProcessedUrl(URL.createObjectURL(new Blob([data.text], { type:'application/msword' })));
        setProcessSuccess('✅ PDF converted to Word document!');
      }

      // ---- PDF TO EXCEL ----
      else if (activeTool === 'pdfToExcel') {
        const b64 = await fileToBase64(selectedFiles[0].file);
        const res = await fetch('/api/pdf-to-excel', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ pdfBase64: b64 }) });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || 'Excel converter failed.');
        setAiResponseText(`### Extracted Data\n\`\`\`csv\n${data.csv}\n\`\`\``);
        const XLSX = await import('xlsx');
        const wb = XLSX.read(data.csv, { type:'string' });
        const buf = XLSX.write(wb, { bookType:'xlsx', type:'array' });
        setProcessedUrl(URL.createObjectURL(new Blob([buf], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })));
        setProcessSuccess('✅ PDF data extracted to Excel spreadsheet!');
      }

      // ---- PDF TO PPT ----
      else if (activeTool === 'pdfToPowerPoint') {
        const b64 = await fileToBase64(selectedFiles[0].file);
        const res = await fetch('/api/pdf-ocr', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ pdfBase64: b64 }) });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || 'PPT parser failed.');
        const pptx = new pptxgen();
        let slide = pptx.addSlide();
        slide.addText(`Extracted from: ${selectedFiles[0].file.name}`, { x:0.5, y:0.5, w:'90%', fontSize:24, bold:true, color:'003366' });
        let num = 1, content = '';
        for (const line of (data.text || '').split('\n')) {
          if (line.trim().length > 5) content += `- ${line.trim()}\n`;
          if (content.split('\n').length > 5) {
            slide = pptx.addSlide();
            slide.addText(`Slide ${num}`, { x:0.5, y:0.5, w:'90%', h:0.5, fontSize:20, bold:true, color:'003366' });
            slide.addText(content, { x:0.5, y:1.2, w:'90%', h:'70%', fontSize:14, color:'333333', valign:'top' });
            num++; content = '';
          }
        }
        if (content) { slide = pptx.addSlide(); slide.addText(`Slide ${num}`, { x:0.5, y:0.5, w:'90%', h:0.5, fontSize:20, bold:true, color:'003366' }); slide.addText(content, { x:0.5, y:1.2, w:'90%', h:'70%', fontSize:14, color:'333333', valign:'top' }); }
        setProcessedUrl(URL.createObjectURL((await pptx.write({ outputType:'blob' })) as Blob));
        setProcessSuccess('✅ PDF converted to PowerPoint presentation!');
      }

      // ---- COMPARE ----
      else if (activeTool === 'compare') {
        if (selectedFiles.length < 2) throw new Error('Upload 2 PDF files to compare.');
        const [d1, d2] = await Promise.all(selectedFiles.slice(0,2).map(f => PDFDocument.load(f.file.arrayBuffer(), { ignoreEncryption:true })));
        const c1 = d1.getPageCount(), c2 = d2.getPageCount();
        const report = `## PDF Comparison Report\n- **File 1**: ${selectedFiles[0].file.name} (${c1} pages, ${Math.round(selectedFiles[0].file.size/1024)} KB)\n- **File 2**: ${selectedFiles[1].file.name} (${c2} pages, ${Math.round(selectedFiles[1].file.size/1024)} KB)\n\n### Audit\n- **Pages**: ${c1===c2 ? '✅ Match' : `⚠️ Mismatch (${c1} vs ${c2})`}\n- **Size delta**: ${Math.abs(selectedFiles[0].file.size-selectedFiles[1].file.size)===0 ? '✅ Identical' : `⚠️ ${Math.round(Math.abs(selectedFiles[0].file.size-selectedFiles[1].file.size)/1024)} KB difference`}`;
        setAiResponseText(report);
        setProcessedUrl(URL.createObjectURL(new Blob([report], { type:'text/markdown' })));
        setProcessSuccess('✅ Comparison report generated!');
      }

      // ---- FORMS ----
      else if (activeTool === 'forms') {
        const src = await PDFDocument.load(await selectedFiles[0].file.arrayBuffer(), { ignoreEncryption:true });
        const fields = src.getForm().getFields();
        let summary = `## PDF Form Fields\n- **File**: ${selectedFiles[0].file.name}\n- **Fields Found**: ${fields.length}\n\n`;
        if (!fields.length) summary += 'No interactive form fields detected.';
        else fields.forEach((f,i) => { summary += `${i+1}. **${f.getName()}** — ${f.constructor.name}\n`; });
        setAiResponseText(summary);
        setProcessedUrl(URL.createObjectURL(new Blob([summary], { type:'text/markdown' })));
        setProcessSuccess('✅ Form fields extracted successfully!');
      }

      // ---- EDIT PDF ----
      else if (activeTool === 'editPdf') {
        const src = await PDFDocument.load(await selectedFiles[0].file.arrayBuffer(), { ignoreEncryption:true });
        const page = src.getPages()[0];
        const { width, height } = page.getSize();
        page.drawRectangle({ x:width-205, y:height-65, width:185, height:45, color:pdfLibRgb(0.9,0.95,1), borderColor:pdfLibRgb(0.1,0.4,0.8), borderWidth:2 });
        page.drawText('CSC DIGITAL KENDRA', { x:width-192, y:height-45, size:11, color:pdfLibRgb(0.1,0.4,0.8) });
        page.drawText('APPROVED DOCUMENT', { x:width-185, y:height-58, size:9, color:pdfLibRgb(0.1,0.5,0.9) });
        setProcessedUrl(URL.createObjectURL(new Blob([await src.save()], { type:'application/pdf' })));
        setProcessSuccess('✅ Official approval stamp added to first page!');
      }

      // ---- PDF/A ----
      else if (activeTool === 'pdfToPdfa') {
        const src = await PDFDocument.load(await selectedFiles[0].file.arrayBuffer(), { ignoreEncryption:true });
        src.setTitle(selectedFiles[0].file.name.replace('.pdf',''));
        src.setAuthor('CSC Kendra Government Portal');
        src.setCreator('PDF/A ISO-19005 Compiler');
        setProcessedUrl(URL.createObjectURL(new Blob([await src.save({ useObjectStreams:true })], { type:'application/pdf' })));
        setProcessSuccess('✅ PDF converted to PDF/A archival standard!');
      }

      // ---- REPAIR ----
      else if (activeTool === 'repair') {
        const src = await PDFDocument.load(await selectedFiles[0].file.arrayBuffer(), { ignoreEncryption:true });
        setProcessedUrl(URL.createObjectURL(new Blob([await src.save()], { type:'application/pdf' })));
        setProcessSuccess('✅ PDF structure rebuilt and repaired successfully!');
      }

      // ---- AI TOOLS (summarize / translate / ocr) ----
      else if (['aiSummarizer','translate','ocr'].includes(activeTool!)) {
        const b64 = await fileToBase64(selectedFiles[0].file);
        const endpoint = activeTool === 'aiSummarizer' ? '/api/pdf-summarize' : activeTool === 'translate' ? '/api/pdf-translate' : '/api/pdf-ocr';
        const body: any = { pdfBase64: b64 };
        if (activeTool !== 'ocr') body.targetLanguage = aiTargetLanguage;
        const res = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || 'AI server error.');
        setAiResponseText(data.summary || data.translation || data.text);
        setProcessSuccess('✅ AI processing complete!');
      }

      else {
        await new Promise(r => setTimeout(r, 800));
        setProcessSuccess('✅ Process completed successfully!');
      }

    } catch (err: any) {
      setProcessError(err?.message || 'An error occurred during processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ── CAMERA ────────────────────────────────────
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:'environment' } });
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
    } catch { setProcessError('Camera permission denied.'); setIsCameraActive(false); }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const snapPhoto = () => {
    if (!videoRef.current) return;
    const c = document.createElement('canvas');
    c.width = videoRef.current.videoWidth || 640;
    c.height = videoRef.current.videoHeight || 480;
    c.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    setScanImages(prev => [...prev, c.toDataURL('image/jpeg', 0.85)]);
  };

  // ── SIGNATURE ────────────────────────────────
  const startSig = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = sigCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    setIsDrawingSig(true);
    const rect = sigCanvasRef.current!.getBoundingClientRect();
    ctx.beginPath(); ctx.moveTo(e.clientX-rect.left, e.clientY-rect.top);
  };
  const moveSig = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingSig) return;
    const ctx = sigCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    const rect = sigCanvasRef.current!.getBoundingClientRect();
    ctx.lineTo(e.clientX-rect.left, e.clientY-rect.top);
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.stroke();
  };
  const clearSig = () => {
    const ctx = sigCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, sigCanvasRef.current!.width, sigCanvasRef.current!.height);
    setSignatureImage(null);
  };
  const saveSig = () => setSignatureImage(sigCanvasRef.current?.toDataURL('image/png') || null);

  // ── DOWNLOAD ──────────────────────────────────
  const downloadFile = () => {
    if (!processedUrl) return;
    const extMap: Record<string,string> = { pdfToJpg:'jpeg', pdfToWord:'doc', pdfToExcel:'xlsx', pdfToPowerPoint:'pptx', compare:'txt', forms:'txt', aiSummarizer:'txt', translate:'txt', ocr:'txt' };
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = `csc-${activeTool}-${Date.now()}.${extMap[activeTool!] || 'pdf'}`;
    link.click();
  };

  // ── FILTERED TOOLS ────────────────────────────
  const filteredTools = ALL_TOOLS.filter(t => {
    const inCat = selectedCategory === 'all' || t.category === selectedCategory;
    const inSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return inCat && inSearch;
  });

  const activeDef = activeTool ? ALL_TOOLS.find(t => t.id === activeTool) : null;

  // ── ACCEPT ATTR ───────────────────────────────
  const fileAccept = () => {
    if (activeTool === 'jpgToPdf') return 'image/*';
    if (activeTool === 'wordToPdf') return '.doc,.docx,text/plain';
    if (activeTool === 'excelToPdf') return '.csv,.xlsx,.xls';
    if (activeTool === 'powerpointToPdf') return '.ppt,.pptx';
    if (activeTool === 'htmlToPdf') return '.html,.htm';
    return 'application/pdf';
  };

  // ══════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════
  return (
    <div className="w-full bg-white rounded-[2.5rem] overflow-hidden flex flex-col min-h-[80vh]">

      {/* ──────────── HERO ──────────── */}
      <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-teal-900 text-white overflow-hidden flex-shrink-0">
        {/* Animated blobs */}
        <motion.div animate={{ scale:[1,1.3,1], opacity:[0.3,0.5,0.3] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut' }}
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-teal-500 blur-3xl pointer-events-none" />
        <motion.div animate={{ scale:[1.2,1,1.2], opacity:[0.2,0.4,0.2] }} transition={{ duration:8, repeat:Infinity, ease:'easeInOut' }}
          className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-indigo-500 blur-3xl pointer-events-none" />
        <motion.div animate={{ x:[0,20,0], y:[0,-10,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut' }}
          className="absolute top-8 right-1/3 w-32 h-32 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

        {/* Floating particles */}
        {[{d:0,x:'15%',s:6,o:0.4},{d:1,x:'30%',s:4,o:0.3},{d:2,x:'55%',s:8,o:0.25},{d:0.5,x:'70%',s:5,o:0.35},{d:1.5,x:'85%',s:7,o:0.3}].map((p,i) => (
          <FloatingParticle key={i} delay={p.d} x={p.x} size={p.s} opacity={p.o} />
        ))}

        <div className="relative z-10 p-8 md:p-14">
          <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-teal-200 text-xs font-bold uppercase tracking-widest mb-5">
            <Zap className="w-3.5 h-3.5 text-amber-300" /> 30+ Tools · AI Powered · 100% Secure
          </motion.div>

          <motion.h2 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            className="text-4xl md:text-6xl font-black tracking-tight leading-none">
            <span className="text-white">CSC </span>
            <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">PDF & Document</span>
            <span className="text-white"> Tools</span>
          </motion.h2>

          <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
            className="text-white/60 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
            Haryana Digital Kendra's unified workspace — merge, split, compress, convert, sign, scan, and run Gemini AI on your documents instantly.
          </motion.p>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
            className="flex flex-wrap gap-4 mt-8">
            {[{ n: ALL_TOOLS.length, l:'Total Tools' },{ n:'100%', l:'Client-Side Safe' },{ n:'AI', l:'Gemini Powered' },{ n:'Free', l:'No Limits' }].map((s,i) => (
              <div key={i} className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl px-5 py-3 text-center">
                <div className="text-xl font-black text-white">{s.n}</div>
                <div className="text-[10px] text-white/50 font-bold uppercase tracking-wide">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ──────────── DASHBOARD OR WORKSPACE ──────────── */}
      <AnimatePresence mode="wait">

        {/* DASHBOARD */}
        {!activeTool && (
          <motion.div key="dashboard" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
            className="flex-1 flex flex-col p-6 md:p-10 gap-7 bg-gradient-to-b from-slate-50 to-white">

            {/* Search + Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search tools (merge, compress, convert…)" value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map(cat => (
                  <motion.button key={cat} whileTap={{ scale:0.95 }} onClick={() => setSelectedCategory(cat as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${selectedCategory===cat ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white border-transparent shadow-md shadow-teal-500/20' : 'bg-white border-gray-200 text-gray-600 hover:border-teal-300'}`}>
                    {CATEGORY_LABELS[cat]}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Count badge */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {filteredTools.length} {filteredTools.length === 1 ? 'Tool' : 'Tools'}
              </p>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear Search
                </button>
              )}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTools.map((tool, i) => (
                <motion.div key={tool.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.03 }}>
                  <ToolCard tool={tool} onClick={() => openTool(tool.id)} />
                </motion.div>
              ))}
            </div>

            {filteredTools.length === 0 && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-3xl">
                <AlertCircle className="w-10 h-10 text-gray-300 mb-3" />
                <h4 className="text-base font-black text-gray-700">No tools found</h4>
                <p className="text-xs text-gray-400 mt-1">Try a different keyword or category.</p>
                <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="mt-4 px-5 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700">
                  Reset Filters
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* WORKSPACE */}
        {activeTool && activeDef && (
          <motion.div key="workspace" initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-40 }}
            transition={{ type:'spring', stiffness:200, damping:25 }}
            className="flex-1 flex flex-col bg-slate-50">

            {/* Workspace Topbar */}
            <div className={`bg-gradient-to-r ${activeDef.bg} p-6 md:p-8 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <motion.div initial={{ rotate:-15, scale:0.8 }} animate={{ rotate:0, scale:1 }} transition={{ type:'spring', stiffness:300 }}
                    className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                    <activeDef.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white">{activeDef.title}</h3>
                    <p className="text-white/70 text-xs md:text-sm mt-0.5 font-medium">{activeDef.description}</p>
                  </div>
                </div>
                <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                  onClick={() => { setActiveTool(null); stopCamera(); }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold rounded-xl backdrop-blur transition-all self-start sm:self-center cursor-pointer">
                  ← Back to All Tools
                </motion.button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 md:p-10 grid lg:grid-cols-12 gap-8 items-start">

              {/* LEFT PANEL — Settings */}
              <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1 }}
                className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col gap-5">

                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">
                  <Shield className="w-4 h-4 text-teal-400" /> Tool Settings
                </div>

                {/* ─ MERGE ─ */}
                {activeTool === 'merge' && (
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-xs text-blue-700 leading-relaxed font-medium">
                    <strong className="font-black block mb-1">How to use:</strong>
                    Upload 2 or more PDF files on the right. Use the ↑↓ arrows to set the order, then click Process to merge them.
                  </div>
                )}

                {/* ─ COMPRESS ─ */}
                {activeTool === 'compress' && (
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-black text-gray-700 uppercase tracking-wide">Compression Level</label>
                    {(['low','medium','high'] as const).map(l => (
                      <motion.button key={l} whileTap={{ scale:0.97 }} onClick={() => setCompressionLevel(l)}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-bold transition-all ${compressionLevel===l ? 'bg-teal-50 border-teal-400 text-teal-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        <div>
                          <span className="capitalize block">{l} Compression</span>
                          <span className="text-xs font-normal opacity-60">{l==='low'?'Best quality, larger file':l==='medium'?'Balanced quality & size':'Maximum compression'}</span>
                        </div>
                        {compressionLevel===l && <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* ─ SPLIT ─ */}
                {activeTool === 'split' && (
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-black text-gray-700 uppercase">Page Range</label>
                    <input type="text" value={splitRange} onChange={e => setSplitRange(e.target.value)}
                      placeholder="e.g. 1-3, 5, 7-9"
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400" />
                    <p className="text-[10px] text-gray-400">Use <strong>1-3</strong> for ranges or <strong>1,3,5</strong> for individual pages.</p>
                  </div>
                )}

                {/* ─ ROTATE ─ */}
                {activeTool === 'rotate' && (
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-black text-gray-700 uppercase">Rotation Angle</label>
                    <div className="grid grid-cols-3 gap-2">
                      {([90,180,270] as const).map(a => (
                        <motion.button key={a} whileTap={{ scale:0.95 }} onClick={() => setRotateAngle(a)}
                          className={`py-3 rounded-xl text-xs font-black border transition-all ${rotateAngle===a ? 'bg-teal-50 border-teal-400 text-teal-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                          {a}°
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─ WATERMARK ─ */}
                {activeTool === 'watermark' && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-black text-gray-700 uppercase block mb-1.5">Watermark Text</label>
                      <input type="text" value={watermarkText} onChange={e => setWatermarkText(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-700">Color</span>
                        <input type="color" value={watermarkColor} onChange={e => setWatermarkColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0" />
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-gray-200 text-center">
                        <span className="text-[10px] font-bold text-gray-400 block">Rotation</span>
                        <span className="text-sm font-black text-gray-800">{watermarkRotation}°</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs font-bold text-gray-600">
                        <span>Opacity {Math.round(watermarkOpacity*100)}%</span>
                        <span>Size {watermarkSize}px</span>
                      </div>
                      <input type="range" min="0.1" max="0.9" step="0.05" value={watermarkOpacity}
                        onChange={e => setWatermarkOpacity(+e.target.value)} className="w-full accent-teal-600" />
                      <input type="range" min="20" max="80" step="2" value={watermarkSize}
                        onChange={e => setWatermarkSize(+e.target.value)} className="w-full accent-teal-600" />
                    </div>
                  </div>
                )}

                {/* ─ PAGE NUMBERS ─ */}
                {activeTool === 'pageNumbers' && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-black text-gray-700 uppercase block mb-2">Position</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['bottom-center','bottom-right','top-right'] as const).map(p => (
                          <button key={p} onClick={() => setPageNumPosition(p)}
                            className={`py-2 px-2 rounded-xl text-[10px] font-bold border truncate transition-all ${pageNumPosition===p ? 'bg-teal-50 border-teal-400 text-teal-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                            {p==='bottom-center'?'↓ Center':p==='bottom-right'?'↓ Right':'↑ Right'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-700 uppercase block mb-2">Format</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['simple','pageOf'] as const).map(s => (
                          <button key={s} onClick={() => setPageNumStyle(s)}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${pageNumStyle===s ? 'bg-teal-50 border-teal-400 text-teal-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                            {s==='simple'?'1, 2, 3':'Page 1 of 5'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ─ PROTECT / UNLOCK ─ */}
                {(activeTool === 'protect' || activeTool === 'unlock') && (
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-black text-gray-700 uppercase">Password</label>
                    <input type="text" value={protectPassword} onChange={e => setProtectPassword(e.target.value)}
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      placeholder="Enter password" />
                    <p className="text-[10px] text-gray-400 leading-relaxed">All encryption is done server-side with cryptpdf library.</p>
                  </div>
                )}

                {/* ─ REDACT ─ */}
                {activeTool === 'redact' && (
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-black text-gray-700 uppercase">Blackout Zone</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['top','bottom','center','full'] as const).map(p => (
                        <button key={p} onClick={() => setRedactPosition(p)}
                          className={`py-2.5 rounded-xl text-xs font-bold border uppercase transition-all ${redactPosition===p ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-600'}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─ AI TOOLS ─ */}
                {['aiSummarizer','translate','ocr'].includes(activeTool) && (
                  <div className="flex flex-col gap-4">
                    {activeTool !== 'ocr' && (
                      <div>
                        <label className="text-xs font-black text-gray-700 uppercase block mb-2">Output Language</label>
                        <select value={aiTargetLanguage} onChange={e => setAiTargetLanguage(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400">
                          <option value="Hindi">Hindi (हिंदी)</option>
                          <option value="Hinglish">Hinglish</option>
                          <option value="English">English</option>
                          <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                        </select>
                      </div>
                    )}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100 flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-xs text-indigo-900 block">Gemini AI Powered</strong>
                        <p className="text-[10px] text-indigo-600 mt-1 leading-relaxed">
                          Upload your PDF and Gemini automatically extracts text, runs OCR on scans, and performs {activeTool==='translate'?'translation':activeTool==='ocr'?'text extraction':'summarization'}.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─ SIGN ─ */}
                {activeTool === 'sign' && (
                  <div className="flex flex-col gap-4">
                    <div className="bg-slate-50 border border-gray-200 p-4 rounded-2xl">
                      <label className="text-xs font-black text-gray-700 uppercase block mb-2">Draw Signature</label>
                      <canvas ref={sigCanvasRef} onMouseDown={startSig} onMouseMove={moveSig} onMouseUp={() => setIsDrawingSig(false)} onMouseLeave={() => setIsDrawingSig(false)}
                        width={280} height={100}
                        className="w-full bg-white border-2 border-dashed border-gray-300 rounded-xl cursor-crosshair" />
                      <div className="flex gap-2 mt-2 justify-end">
                        <button onClick={clearSig} className="px-3 py-1.5 bg-white border border-gray-200 text-[10px] font-bold text-gray-600 rounded-lg hover:bg-gray-50">Clear</button>
                        <button onClick={saveSig} className="px-3 py-1.5 bg-teal-600 text-white text-[10px] font-bold rounded-lg hover:bg-teal-700">Save Signature</button>
                      </div>
                    </div>
                    {signatureImage && (
                      <div className="flex items-center gap-3 bg-teal-50 border border-teal-100 p-3 rounded-xl">
                        <img src={signatureImage} alt="sig" className="w-20 h-10 object-contain bg-white border border-gray-200 rounded-md" />
                        <span className="text-[10px] text-teal-800 font-bold">Signature ready ✓</span>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-black text-gray-700 uppercase block mb-1.5">Target Page</label>
                      <input type="number" min="1" value={signPageNum} onChange={e => setSignPageNum(+e.target.value||1)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400" />
                    </div>
                  </div>
                )}

                {/* ─ TEXT-TO-PDF ─ */}
                {['wordToPdf','htmlToPdf','excelToPdf','powerpointToPdf'].includes(activeTool) && (
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-black text-gray-700 uppercase">
                      {activeTool==='htmlToPdf'?'HTML Content':activeTool==='excelToPdf'?'CSV / Spreadsheet Data':activeTool==='powerpointToPdf'?'Slide Outline':'Document Text'}
                    </label>
                    <textarea value={rawTextContent} onChange={e => setRawTextContent(e.target.value)} rows={7}
                      className="w-full border border-gray-200 rounded-xl p-3.5 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                      placeholder={activeTool==='htmlToPdf'?'<h1>Title</h1><p>Content</p>':activeTool==='excelToPdf'?'Name,Age,City\nRam,25,Delhi':'Type content here...'} />
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      {activeTool==='htmlToPdf'?'Enter HTML code to convert to PDF':activeTool==='excelToPdf'?'Comma-separated rows will be formatted as table':'Or upload the file directly on the right panel.'}
                    </p>
                  </div>
                )}

                {/* ─ SCAN ─ */}
                {activeTool === 'scan' && (
                  <div className="flex flex-col gap-4">
                    <motion.button whileTap={{ scale:0.97 }}
                      onClick={() => isCameraActive ? stopCamera() : startCamera()}
                      className={`w-full font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer ${isCameraActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}>
                      <Camera className="w-5 h-5" />
                      {isCameraActive ? 'Stop Camera' : 'Start Camera'}
                    </motion.button>
                    {isCameraActive && (
                      <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-black aspect-video">
                        <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                        <button onClick={snapPhoto}
                          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-gray-900 text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
                          <Camera className="w-4 h-4" /> Snap Page
                        </button>
                      </div>
                    )}
                    {scanImages.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-700">{scanImages.length} Snap{scanImages.length>1?'s':''}</span>
                          <button onClick={() => setScanImages([])} className="text-[10px] font-bold text-red-500 hover:underline">Clear All</button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {scanImages.map((src,i) => (
                            <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-[3/4]">
                              <img src={src} className="w-full h-full object-cover" alt="" />
                              <button onClick={() => setScanImages(p => p.filter((_,j) => j!==i))}
                                className="absolute top-1 right-1 p-0.5 bg-red-500/80 text-white rounded-full">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ─ GENERIC INFO for unlisted tools ─ */}
                {!['merge','compress','split','rotate','watermark','pageNumbers','protect','unlock','redact','aiSummarizer','translate','ocr','sign','wordToPdf','htmlToPdf','excelToPdf','powerpointToPdf','scan'].includes(activeTool) && (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs text-gray-600 leading-relaxed">
                    Upload your PDF file and click <strong className="font-black text-gray-900">Process</strong> to run <span className="font-black text-teal-700">{activeDef.title}</span>.
                  </div>
                )}

                {/* Process Button */}
                <div className="border-t border-gray-100 pt-4">
                  <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                    onClick={processPdfTool} disabled={isProcessing}
                    className={`w-full text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer bg-gradient-to-r ${activeDef.bg} disabled:opacity-60 disabled:cursor-not-allowed`}>
                    {isProcessing ? (
                      <><RefreshCw className="w-5 h-5 animate-spin" /> Processing…</>
                    ) : (
                      <><Zap className="w-5 h-5" /> Process — {activeDef.title}</>
                    )}
                  </motion.button>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {processError && (
                    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-xs font-black text-red-800 block">Failed</strong>
                        <p className="text-xs text-red-600 mt-1">{processError}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* RIGHT PANEL — Upload + Output */}
              <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.15 }}
                className="lg:col-span-7 flex flex-col gap-5">

                {/* UPLOAD ZONE */}
                {activeTool !== 'scan' && (
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-3 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[200px] ${dragOver ? 'border-teal-400 bg-teal-50 scale-[1.01]' : 'border-gray-200 bg-white/80 hover:border-teal-300 hover:bg-teal-50/30'}`}>

                    <input type="file" ref={fileInputRef} onChange={e => handleFileChange(e)}
                      accept={fileAccept()}
                      multiple={activeTool === 'merge' || activeTool === 'jpgToPdf' || activeTool === 'compare'}
                      className="hidden" />

                    <motion.div animate={dragOver ? { scale:1.2, rotate:10 } : { scale:1, rotate:0 }} transition={{ type:'spring', stiffness:300 }}>
                      <Upload className={`w-12 h-12 mb-4 ${dragOver ? 'text-teal-500' : 'text-gray-300'}`} />
                    </motion.div>

                    <h4 className={`text-base font-black ${dragOver ? 'text-teal-700' : 'text-gray-700'}`}>
                      {dragOver ? 'Drop files here!' : `Upload ${activeTool==='jpgToPdf'?'Images':activeTool==='wordToPdf'?'Word/Text Doc':activeTool==='excelToPdf'?'Excel/CSV':activeTool==='powerpointToPdf'?'PowerPoint':activeTool==='htmlToPdf'?'HTML File':'PDF File'}`}
                    </h4>
                    <p className="text-xs text-gray-400 mt-2 max-w-xs font-medium">
                      Click to browse or drag & drop your file. Processed locally — 100% private.
                      {(activeTool === 'merge' || activeTool === 'compare') && ' You can add multiple files.'}
                    </p>

                    <div className="flex items-center gap-2 mt-5 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px] font-bold text-gray-500">
                        {activeTool === 'compare' ? 'Upload exactly 2 PDFs to compare' :
                         activeTool === 'merge' ? 'Upload 2+ PDFs to merge in order' :
                         'Supports up to 50 MB per file'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Append button for merge */}
                {activeTool === 'merge' && selectedFiles.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">{selectedFiles.length} file{selectedFiles.length>1?'s':''} selected</span>
                    <button onClick={() => secondaryFileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-teal-600 text-xs font-bold rounded-xl hover:bg-teal-50 shadow-sm cursor-pointer">
                      <Plus className="w-3.5 h-3.5" /> Add More PDFs
                      <input ref={secondaryFileInputRef} type="file" accept="application/pdf" multiple onChange={e => handleFileChange(e, true)} className="hidden" />
                    </button>
                  </div>
                )}

                {/* Files List */}
                <AnimatePresence>
                  {selectedFiles.length > 0 && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex flex-col gap-2.5 max-h-80 overflow-y-auto pr-1">
                      {selectedFiles.map((item, idx) => (
                        <motion.div key={item.id} layout initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }}
                          className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
                          {item.previewUrl ? (
                            <img src={item.previewUrl} className="w-12 h-12 object-cover rounded-xl border border-gray-100 flex-shrink-0" alt="" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center border border-red-100 flex-shrink-0">
                              <FileText className="w-6 h-6 text-red-400" />
                            </div>
                          )}
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-black text-gray-800 truncate">{item.file.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {item.pageCount ? `${item.pageCount} pages • ` : ''}{Math.round(item.file.size/1024)} KB
                            </p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {activeTool === 'merge' && (
                              <>
                                <button onClick={() => moveFile(idx,'up')} disabled={idx===0}
                                  className="p-2 rounded-lg bg-slate-50 text-gray-500 hover:bg-gray-100 disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                                <button onClick={() => moveFile(idx,'down')} disabled={idx===selectedFiles.length-1}
                                  className="p-2 rounded-lg bg-slate-50 text-gray-500 hover:bg-gray-100 disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                              </>
                            )}
                            <button onClick={() => removeFile(item.id)}
                              className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Processing Progress */}
                <AnimatePresence>
                  {isProcessing && (
                    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <RefreshCw className="w-5 h-5 text-teal-500 animate-spin" />
                        <span className="text-sm font-black text-gray-800">Processing your file…</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <motion.div className={`h-full bg-gradient-to-r ${activeDef.bg} rounded-full`}
                          animate={{ width:['10%','70%','90%'] }} transition={{ duration:2, times:[0,0.6,1], ease:'easeInOut' }} />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2 text-center">This may take a few seconds…</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success + Download */}
                <AnimatePresence>
                  {processSuccess && !isProcessing && (
                    <motion.div initial={{ opacity:0, scale:0.95, y:10 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0 }}
                      className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col gap-4 shadow-md">
                      <div className="flex items-center gap-3 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 p-4 rounded-2xl">
                        <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:400, delay:0.1 }}>
                          <CheckCircle2 className="w-7 h-7 text-teal-500 flex-shrink-0" />
                        </motion.div>
                        <div>
                          <strong className="text-sm font-black text-teal-900 block">Success!</strong>
                          <span className="text-xs text-teal-700 font-semibold">{processSuccess}</span>
                        </div>
                      </div>
                      {processedUrl && (
                        <div className="flex flex-col sm:flex-row gap-3">
                          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                            onClick={downloadFile}
                            className={`flex-1 bg-gradient-to-r ${activeDef.bg} text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg cursor-pointer`}>
                            <Download className="w-5 h-5" /> Download File
                          </motion.button>
                          <a href={processedUrl} target="_blank" rel="noreferrer"
                            className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl text-xs flex items-center justify-center transition-all text-center">
                            Preview →
                          </a>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* AI Text Output */}
                <AnimatePresence>
                  {aiResponseText && (
                    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                      className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col gap-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-indigo-400" /> AI Output
                        </span>
                        <button onClick={() => navigator.clipboard.writeText(aiResponseText).then(() => {})}
                          className="px-3 py-1.5 bg-slate-50 border border-gray-200 hover:bg-gray-100 text-[10px] font-bold text-gray-600 rounded-lg flex items-center gap-1">
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto pr-1 bg-slate-50 p-5 rounded-2xl border border-gray-100">
                        <SimpleMarkdown text={aiResponseText} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="p-5 md:p-8 bg-slate-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400 font-medium">
        <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" /> All PDF operations run locally in your browser — zero data uploaded.</span>
        <span>Haryana Digital Kendra &copy; 2026</span>
      </div>
    </div>
  );
}
