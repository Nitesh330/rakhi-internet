import React, { useState, useEffect } from 'react';
import { getFile, deleteFile } from '../utils/db';
import printJS from 'print-js';
import { Printer, CheckCircle2, Clock, FileText, Download, Trash2, ArrowLeft, Store, Settings, Network, Plus, Server, Activity, Terminal, ChevronDown, ChevronUp, Lock, ShieldCheck, Unlock, Eye, EyeOff, RefreshCw, Wifi, WifiOff, Check, Copy, Play, HelpCircle, Cpu, Zap, Send, Radio, Info, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  onBack: () => void;
}

interface PrinterConfig {
  id: string;
  branch: string;
  name: string;
  ip: string;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [activeTab, setActiveTab] = useState<'queue' | 'printers'>('queue');
  
  const [printers, setPrinters] = useState<PrinterConfig[]>([]);
  const [newPrinter, setNewPrinter] = useState({ branch: 'Narnaund', name: '', ip: '' });

  const PASSWORD_LENGTH = 8;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [agentStatus, setAgentStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [printingJobId, setPrintingJobId] = useState<string | null>(null);
  const [showAgentGuide, setShowAgentGuide] = useState(true);

  // Print Agent Enhanced States
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [agentSubTab, setAgentSubTab] = useState<'flow' | 'guide' | 'test' | 'troubleshoot'>('flow');
  const [testSignalStatus, setTestSignalStatus] = useState<'idle' | 'sending' | 'success' | 'failed'>('idle');
  const [testSignalMsg, setTestSignalMsg] = useState('');

  // Mouse coordinates for interactive 3D tilt
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  useEffect(() => {
    const loadJobs = () => {
      const stored = JSON.parse(localStorage.getItem('rakhi_print_jobs') || '[]');
      setJobs(stored);
    };
    loadJobs();
    const interval = setInterval(loadJobs, 2000);
    
    const storedPrinters = JSON.parse(localStorage.getItem('rakhi_printers_config') || '[]');
    if (storedPrinters.length === 0) {
      const defaults = [
        { id: '1', branch: 'Narnaund', name: 'HP LaserJet Pro M404n', ip: '192.168.1.100' },
        { id: '2', branch: 'Jind', name: 'Epson EcoTank L3250', ip: '192.168.1.105' },
        { id: '3', branch: 'Uchana', name: 'Canon LBP6030', ip: '192.168.1.110' }
      ];
      setPrinters(defaults);
      localStorage.setItem('rakhi_printers_config', JSON.stringify(defaults));
    } else {
      setPrinters(storedPrinters);
    }

    checkAgentStatus();
    const agentInterval = setInterval(checkAgentStatus, 4000);
    
    return () => {
      clearInterval(interval);
      clearInterval(agentInterval);
    };
  }, []);

  const checkAgentStatus = async () => {
    setIsPinging(true);
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('http://localhost:9123/status', { signal: controller.signal });
      clearTimeout(timeoutId);
      const endTime = Date.now();
      if (res.ok) {
        setAgentStatus('online');
        setPingLatency(endTime - startTime);
      } else {
        setAgentStatus('offline');
        setPingLatency(null);
      }
    } catch (e) {
      setAgentStatus('offline');
      setPingLatency(null);
    } finally {
      setIsPinging(false);
    }
  };

  const handleTestSignal = async () => {
    setTestSignalStatus('sending');
    setTestSignalMsg('Sending diagnostic signal to http://localhost:9123/status...');
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch('http://localhost:9123/status', { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await res.json();
      const latency = Date.now() - startTime;
      if (data.status === 'online') {
        setTestSignalStatus('success');
        setTestSignalMsg(`✅ Direct Agent online! Version: ${data.version || '1.0.0'} (${latency}ms ping response)`);
      } else {
        setTestSignalStatus('failed');
        setTestSignalMsg('⚠️ Connected, but agent returned non-online status.');
      }
    } catch (err) {
      setTestSignalStatus('failed');
      setTestSignalMsg('❌ Could not connect on port 9123. Make sure run-agent.bat is running on your shop PC.');
    }
  };

  const copyCommandToClipboard = () => {
    navigator.clipboard.writeText('node rakhi-print-agent.js');
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const savePrinters = (updated: PrinterConfig[]) => {
    setPrinters(updated);
    localStorage.setItem('rakhi_printers_config', JSON.stringify(updated));
  };

  const handleAddPrinter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrinter.name || !newPrinter.ip) return;
    const added = [...printers, { ...newPrinter, id: Date.now().toString() }];
    savePrinters(added);
    setNewPrinter({ branch: 'Narnaund', name: '', ip: '' });
  };

  const handleDeletePrinter = (id: string) => {
    savePrinters(printers.filter(p => p.id !== id));
  };

  const fileToBase64 = (file: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const executePrint = async (job: any) => {
    setPrintingJobId(job.id);
    try {
      const file = await getFile(job.id);
      
      const branchPrinters = printers.filter(p => p.branch === job.branch);
      const targetPrinter = branchPrinters.find(p => p.name === job.printer) || branchPrinters[0];
      
      const machineDetails = targetPrinter 
        ? `${targetPrinter.name} (IP: ${targetPrinter.ip})` 
        : (job.printer || 'Default Printer');

      if (!file) {
        alert("Document file not found in local database.");
        setPrintingJobId(null);
        return;
      }

      let sentViaAgent = false;
      try {
        const base64Data = await fileToBase64(file);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const agentRes = await fetch('http://localhost:9123/print', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: job.fileName,
            fileData: base64Data,
            printerIp: targetPrinter?.ip,
            printerName: targetPrinter?.name || job.printer
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (agentRes.ok) {
          const resData = await agentRes.json();
          if (resData.success) {
            sentViaAgent = true;
            alert(`✅ Print command sent directly to local printer!\n${resData.message || ''}`);
            completeJob(job.id);
          }
        }
      } catch (agentErr) {
        console.log("Local agent offline, falling back to browser dialog...", agentErr);
      }

      if (!sentViaAgent) {
        if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
          const fileUrl = URL.createObjectURL(file);
          printJS({
            printable: fileUrl,
            type: file.type === 'application/pdf' ? 'pdf' : 'image',
            documentTitle: job.fileName || 'Document',
            showModal: true,
            modalMessage: `Routing print job to ${job.branch} branch...\nConnecting to ${machineDetails}`,
            onPrintDialogClose: () => {
               completeJob(job.id);
               URL.revokeObjectURL(fileUrl);
            }
          });
        } else {
           const fileUrl = URL.createObjectURL(file);
           window.open(fileUrl, '_blank');
           completeJob(job.id);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to retrieve document.");
    } finally {
      setPrintingJobId(null);
    }
  };

  const completeJob = (id: string) => {
    const updated = jobs.map(j => j.id === id ? { ...j, status: 'completed' } : j);
    setJobs(updated);
    localStorage.setItem('rakhi_print_jobs', JSON.stringify(updated));
  };

  const deleteJob = async (id: string) => {
    const updated = jobs.filter(j => j.id !== id);
    setJobs(updated);
    localStorage.setItem('rakhi_print_jobs', JSON.stringify(updated));
    try {
       await deleteFile(id);
    } catch(e) {
       console.error("Failed to delete from db", e);
    }
  };

  const filteredJobs = selectedBranch === 'All' ? jobs : jobs.filter(j => j.branch === selectedBranch);

  const handleVerify = (valToVerify: string) => {
    if (isVerifying || isSuccess) return;
    setIsVerifying(true);
    setError('');

    setTimeout(() => {
      if (valToVerify === 'admin123') {
        setIsVerifying(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsAuthenticated(true);
          setError('');
        }, 900);
      } else {
        setIsVerifying(false);
        setError('Incorrect password. Please try again.');
      }
    }, 650);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleVerify(password);
  };

  if (!isAuthenticated) {
    return (
      <div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/60 to-indigo-100/50 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans"
        style={{ perspective: 1200 }}
      >
        {/* Soft Ambient Background Orbs */}
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            x: [-30, 30, -30],
            y: [-20, 20, -20] 
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-24 -left-24 w-[32rem] h-[32rem] bg-gradient-to-tr from-sky-300/40 via-blue-200/30 to-indigo-200/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div 
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.25, 1],
            x: [40, -40, 40],
            y: [30, -30, 30] 
          }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-24 -right-24 w-[34rem] h-[34rem] bg-gradient-to-br from-indigo-300/35 via-purple-200/30 to-blue-200/20 rounded-full blur-3xl pointer-events-none"
        />

        {/* Unique 3D Perspective Grid Plane */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden flex items-center justify-center"
          style={{ perspective: 1000 }}
        >
          <motion.div 
            animate={{
              rotateX: [65, 65],
              rotateZ: [0, 360],
              y: [100, 100]
            }}
            transition={{ rotateZ: { duration: 60, repeat: Infinity, ease: "linear" } }}
            className="w-[1200px] h-[1200px] rounded-full border border-blue-400/30 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"
            style={{ transformStyle: 'preserve-3d' }}
          />
        </div>

        {/* Unique Floating 3D Parallax Light Glass Objects */}
        <motion.div
          animate={{
            x: mousePos.x * -45,
            y: mousePos.y * -45,
            rotateX: mousePos.y * 25 + 20,
            rotateY: mousePos.x * -25 - 20,
            rotateZ: [0, 180, 360]
          }}
          transition={{
            rotateZ: { duration: 20, repeat: Infinity, ease: "linear" },
            x: { type: "spring", stiffness: 100, damping: 15 },
            y: { type: "spring", stiffness: 100, damping: 15 }
          }}
          className="absolute top-1/6 left-10 md:left-1/5 w-20 h-20 rounded-3xl border border-blue-300/80 bg-white/70 backdrop-blur-md shadow-[0_15px_35px_rgba(59,130,246,0.15)] pointer-events-none hidden sm:flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/40" style={{ transform: 'translateZ(15px)' }} />
        </motion.div>

        <motion.div
          animate={{
            x: mousePos.x * 55,
            y: mousePos.y * 55,
            rotateX: mousePos.y * -30 - 15,
            rotateY: mousePos.x * 30 + 15,
            rotateZ: [360, 0]
          }}
          transition={{
            rotateZ: { duration: 24, repeat: Infinity, ease: "linear" },
            x: { type: "spring", stiffness: 90, damping: 15 },
            y: { type: "spring", stiffness: 90, damping: 15 }
          }}
          className="absolute bottom-1/6 right-10 md:right-1/5 w-24 h-24 rounded-full border border-indigo-300/80 bg-white/70 backdrop-blur-md shadow-[0_15px_35px_rgba(99,102,241,0.15)] pointer-events-none hidden sm:flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-indigo-400/60" style={{ transform: 'translateZ(20px)' }} />
        </motion.div>

        {/* Back Button */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onBack}
          className="absolute top-8 left-4 md:left-8 p-3 bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 rounded-full border border-slate-200/80 backdrop-blur-md shadow-md transition-all z-20 hover:scale-105 cursor-pointer"
          title="Back to Home"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>

        {/* Unique 3D Futuristic Glass Terminal Entrance */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.65, rotateX: 45, rotateY: -20, y: 60 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            rotateX: mousePos.y * -18,
            rotateY: mousePos.x * 18,
            y: 0
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 160, 
            damping: 18, 
            mass: 0.9
          }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative bg-white/90 border border-white/90 p-8 md:p-10 rounded-3xl shadow-[0_25px_70px_-15px_rgba(30,58,138,0.18)] max-w-md w-full backdrop-blur-2xl group hover:border-blue-400/60 transition-all duration-300"
        >
          {/* Holographic Edge Highlight */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-400/30 via-indigo-400/30 to-purple-400/30 rounded-3xl blur-md -z-10 group-hover:opacity-100 opacity-60 transition-all duration-500" />

          {/* Floating 3D Badge with Dual Gyroscopic Orbital Rings */}
          <motion.div 
            initial={{ opacity: 0, scale: 0, rotateX: 90 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.15 }}
            className="flex justify-center mb-7 relative select-none" 
            style={{ transform: 'translateZ(50px)' }}
          >
            {/* Outer 3D Gyroscopic Orbit Ring 1 with Glowing Orbital Node */}
            <motion.div
              animate={{ rotateZ: [0, 360], rotateX: [70, 75, 70] }}
              transition={{ duration: isVerifying ? 3 : 9, repeat: Infinity, ease: "linear" }}
              className={`absolute w-32 h-32 border-2 border-dashed ${isSuccess ? 'border-emerald-400/70 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.25)]'} rounded-full pointer-events-none -top-6 transition-colors`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Orbital Light Node */}
              <motion.div 
                animate={{ scale: [0.8, 1.3, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 ${isSuccess ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]' : 'bg-blue-500 shadow-[0_0_10px_#3b82f6]'} rounded-full`}
              />
            </motion.div>

            {/* Outer 3D Gyroscopic Orbit Ring 2 with Counter-Rotation */}
            <motion.div
              animate={{ rotateZ: [360, 0], rotateY: [65, 70, 65] }}
              transition={{ duration: isVerifying ? 4 : 11, repeat: Infinity, ease: "linear" }}
              className={`absolute w-32 h-32 border ${isSuccess ? 'border-teal-300/80 shadow-[0_0_12px_rgba(20,184,166,0.3)]' : 'border-indigo-400/50 shadow-[0_0_12px_rgba(99,102,241,0.2)]'} rounded-full pointer-events-none -top-6 transition-colors`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Counter Orbital Light Node */}
              <motion.div 
                animate={{ scale: [1.2, 0.7, 1.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 ${isSuccess ? 'bg-teal-300 shadow-[0_0_8px_#5eead4]' : 'bg-indigo-400 shadow-[0_0_8px_#818cf8]'} rounded-full`}
              />
            </motion.div>

            {/* Main Realistic 3D Glass Badge */}
            <motion.div 
              animate={
                isSuccess
                  ? { rotateY: [0, 360], scale: [1, 1.18, 1], y: [0, -6, 0] }
                  : isVerifying
                  ? { scale: [1, 1.08, 1], rotateZ: [-3, 3, -3] }
                  : { rotateY: [0, 360], y: [-5, 5, -5] }
              }
              transition={
                isSuccess
                  ? { duration: 0.8, ease: "easeInOut" }
                  : isVerifying
                  ? { duration: 0.4, repeat: Infinity, ease: "easeInOut" }
                  : { rotateY: { duration: 16, repeat: Infinity, ease: "linear" }, y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } }
              }
              className={`relative w-20 h-20 ${
                isSuccess 
                  ? 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-green-500 shadow-[0_12px_30px_rgba(16,185,129,0.4)]' 
                  : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-[0_12px_30px_rgba(37,99,235,0.35)]'
              } p-0.5 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 overflow-hidden group/badge`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Specular Light Reflection Sweep on Badge Glass */}
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -skew-x-12 pointer-events-none"
              />

              <div className="w-full h-full bg-white/95 backdrop-blur-md rounded-[14px] flex items-center justify-center border border-white/80 shadow-inner relative overflow-hidden">
                {/* Glowing Laser Backlight on Success or Verifying */}
                {isVerifying && (
                  <motion.div 
                    animate={{ opacity: [0.3, 0.9, 0.3] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="absolute inset-0 bg-indigo-500/15 blur-sm"
                  />
                )}
                {isSuccess && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5], opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="absolute w-12 h-12 bg-emerald-400 rounded-full blur-md"
                  />
                )}

                {/* Mechanical Shackle Opening Animation */}
                {isSuccess ? (
                  <motion.div
                    initial={{ y: 5, rotate: 15, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, rotate: 0, opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    <Unlock className="w-9 h-9 text-emerald-600 drop-shadow-[0_4px_12px_rgba(16,185,129,0.45)]" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={isVerifying ? { y: [-1, 2, -1] } : {}}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  >
                    <Lock className="w-9 h-9 text-blue-600 drop-shadow-[0_4px_12px_rgba(37,99,235,0.4)]" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Title & Subtitle */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{ transform: 'translateZ(35px)' }}
          >
            <h2 className="text-3xl font-black text-center text-slate-900 mb-2 tracking-tight">
              Admin Access
            </h2>
            <p className="text-center text-slate-500 text-sm mb-6 leading-relaxed font-medium">
              Enter 8-character password to unlock administration dashboard.
            </p>
          </motion.div>

          {/* Form Entrance */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleLogin} 
            className="space-y-6" 
            style={{ transform: 'translateZ(25px)' }}
          >
            {/* Password Boxes Slot Container */}
            <div className="relative">
              <div className="flex justify-between items-center mb-2.5 px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Password Code ({password.length}/{PASSWORD_LENGTH})
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>

              {/* Box Slots Container */}
              <div 
                className="relative flex justify-between gap-1.5 sm:gap-2 my-2 py-1 select-none cursor-pointer"
                onClick={() => inputRef.current?.focus()}
              >
                {/* Hidden input overlay for universal typing & mobile keypad */}
                <input 
                  ref={inputRef}
                  type="password" 
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value.slice(0, PASSWORD_LENGTH);
                    setPassword(val);
                    setError('');
                    if (val.length === PASSWORD_LENGTH && !isVerifying && !isSuccess) {
                      handleVerify(val);
                    }
                  }}
                  maxLength={PASSWORD_LENGTH}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-30"
                  autoFocus
                  disabled={isVerifying || isSuccess}
                />

                {/* 8 Custom Interactive Animated Boxes */}
                {Array.from({ length: PASSWORD_LENGTH }).map((_, idx) => {
                  const char = password[idx] || '';
                  const isFilled = char !== '';
                  const isCurrent = idx === password.length;

                  return (
                    <motion.div
                      key={idx}
                      initial={false}
                      animate={
                        isSuccess
                          ? {
                              scale: [1, 1.28, 1],
                              y: [0, -18, 0],
                              rotateY: 360,
                              backgroundColor: 'rgba(209, 250, 229, 0.98)',
                              borderColor: 'rgba(16, 185, 129, 0.95)',
                              boxShadow: '0 10px 28px rgba(16, 185, 129, 0.45)',
                              transition: { delay: idx * 0.06, duration: 0.55, ease: "easeInOut" }
                            }
                          : isVerifying
                          ? {
                              y: [0, -12, 0],
                              rotateY: [0, 180, 360],
                              scale: [1, 1.15, 1],
                              borderColor: ['rgba(99, 102, 241, 0.5)', 'rgba(59, 130, 246, 0.95)', 'rgba(99, 102, 241, 0.5)'],
                              backgroundColor: 'rgba(238, 242, 255, 0.95)',
                              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                              transition: { delay: idx * 0.08, duration: 0.65, repeat: Infinity, repeatDelay: 0.2, ease: "easeInOut" }
                            }
                          : error
                          ? {
                              x: [-8, 8, -6, 6, -3, 3, 0],
                              borderColor: 'rgba(239, 68, 68, 0.85)',
                              backgroundColor: 'rgba(254, 226, 226, 0.7)',
                              boxShadow: '0 0 16px rgba(239, 68, 68, 0.3)',
                              transition: { duration: 0.45 }
                            }
                          : isFilled
                          ? {
                              scale: [1, 1.2, 1],
                              y: [0, -6, 0],
                              rotateY: [0, 180, 360],
                              borderColor: 'rgba(59, 130, 246, 0.95)',
                              backgroundColor: 'rgba(239, 246, 255, 0.98)',
                              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                              transition: { duration: 0.35, ease: "easeInOut" }
                            }
                          : isCurrent
                          ? {
                              scale: [1, 1.06, 1],
                              borderColor: 'rgba(99, 102, 241, 0.85)',
                              backgroundColor: 'rgba(255, 255, 255, 1)',
                              boxShadow: '0 0 16px rgba(99, 102, 241, 0.35)',
                              transition: { duration: 0.85, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                            }
                          : {
                              scale: 1,
                              y: 0,
                              rotateY: 0,
                              borderColor: 'rgba(226, 232, 240, 1)',
                              backgroundColor: 'rgba(248, 250, 252, 0.85)',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
                            }
                      }
                      className="w-9 h-12 sm:w-11 sm:h-14 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-lg sm:text-xl relative transition-all"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <AnimatePresence mode="wait">
                        {isFilled ? (
                          <motion.span
                            key={isSuccess ? 'success' : showPassword ? char : 'dot'}
                            initial={{ scale: 0, opacity: 0, rotateY: 90 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className={isSuccess ? 'text-emerald-600 font-extrabold text-xl' : 'text-blue-600'}
                          >
                            {isSuccess ? '✓' : showPassword ? char : '●'}
                          </motion.span>
                        ) : isCurrent ? (
                          <motion.div 
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="w-0.5 h-6 bg-indigo-600 rounded-full"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-300 font-sans font-medium">
                            {idx + 1}
                          </span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-red-600 text-xs font-semibold text-center bg-red-50 border border-red-200 py-2.5 px-3 rounded-lg shadow-sm"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button 
              whileHover={{ scale: isVerifying || isSuccess ? 1 : 1.025, translateY: isVerifying || isSuccess ? 0 : -2, translateZ: 12 }}
              whileTap={{ scale: isVerifying || isSuccess ? 1 : 0.975, translateY: isVerifying || isSuccess ? 0 : 1, translateZ: 0 }}
              type="submit"
              disabled={isVerifying || isSuccess}
              className={`relative w-full text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center gap-2.5 border border-white/25 overflow-hidden group cursor-pointer ${
                isSuccess
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 shadow-emerald-500/35 border-emerald-300/40'
                  : isVerifying
                  ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 shadow-blue-500/30'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-[0_10px_25px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.42)]'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Realistic Specular Light Sweep Animation across Button */}
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
                className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none z-10"
              />

              {/* Biometric Laser Scanner Line Animation during Verification */}
              {isVerifying && (
                <motion.div 
                  animate={{ left: ['0%', '95%', '0%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 bottom-0 w-3 bg-gradient-to-r from-cyan-400 via-white to-blue-400 shadow-[0_0_15px_#38bdf8] opacity-80 z-20 pointer-events-none"
                />
              )}

              {/* Success Ripple Effect */}
              {isSuccess && (
                <motion.div 
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: [0, 2.5], opacity: [0.8, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute w-20 h-20 bg-emerald-300/40 rounded-full blur-md z-0 pointer-events-none"
                />
              )}

              {/* Icon & Label with 3D Depth */}
              <div className="relative z-20 flex items-center justify-center gap-2.5" style={{ transform: 'translateZ(10px)' }}>
                {isSuccess ? (
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 18 }}
                  >
                    <ShieldCheck className="w-5 h-5 text-emerald-200 drop-shadow-[0_2px_8px_rgba(255,255,255,0.6)]" />
                  </motion.div>
                ) : isVerifying ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <ShieldCheck className="w-5 h-5 text-cyan-200" />
                  </motion.div>
                ) : (
                  <motion.div 
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ShieldCheck className="w-5 h-5 text-blue-100 group-hover:text-white transition-colors" />
                  </motion.div>
                )}

                <span className="tracking-wide text-sm font-extrabold drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                  {isSuccess
                    ? 'Access Granted! Opening...'
                    : isVerifying
                    ? 'Verifying Security Code...'
                    : 'Unlock Dashboard'}
                </span>
              </div>
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 relative font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <button 
          onClick={onBack}
          className="absolute top-24 left-4 md:left-8 p-2.5 bg-white shadow-sm border border-slate-200 text-slate-600 rounded-full hover:bg-slate-50 transition-colors z-10"
          title="Back to Home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Header Title & Status Badge */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 pl-12 md:pl-0">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Printer className="w-8 h-8 text-blue-600" />
              Branch Admin Portal
            </h1>
            <p className="text-slate-500 mt-1">Manage print queue and branch printer configurations.</p>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <Activity className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">Local Print Agent:</span>
            {agentStatus === 'online' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online ({pingLatency ? `${pingLatency}ms` : 'Active'})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Offline (Browser Fallback)
              </span>
            )}
            <button
              onClick={checkAgentStatus}
              disabled={isPinging}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-colors ml-1"
              title="Ping & Re-check Connection"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* ENHANCED LOCAL CLIENT PRINT AGENT CONTROL PANEL */}
        <div className="bg-slate-900 text-white rounded-2xl shadow-xl overflow-hidden p-6 border border-slate-800 mb-8 relative">
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 relative z-10">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Local Client Print Agent (For Direct Automatic Printing)
                </h2>
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Zero Dialog
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-1.5 max-w-2xl leading-relaxed">
                Runs on your shop counter PC (Port 9123). Automatically receives print requests from this portal and routes them straight to your network printer IP address with zero manual dialog boxes!
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
              <a 
                href="/rakhi-print-agent.js" 
                download="rakhi-print-agent.js"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-blue-500/20 active:scale-95"
              >
                <Download className="w-4 h-4" /> Agent (.js)
              </a>
              <a 
                href="/run-agent.bat" 
                download="run-agent.bat"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-emerald-500/20 active:scale-95"
              >
                <Download className="w-4 h-4" /> Launcher (.bat)
              </a>
              <button
                onClick={copyCommandToClipboard}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                title="Copy Terminal Command"
              >
                {copiedCommand ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                <span>{copiedCommand ? 'Copied!' : 'Copy CMD'}</span>
              </button>
              <button
                onClick={() => setShowAgentGuide(!showAgentGuide)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-700 flex items-center gap-1 transition-colors ml-auto lg:ml-0"
              >
                {showAgentGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>{showAgentGuide ? 'Hide Panel' : 'Agent Controls'}</span>
              </button>
            </div>
          </div>

          {showAgentGuide && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-5 border-t border-slate-800 relative z-10"
            >
              {/* Agent Sub-navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-5 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setAgentSubTab('flow')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    agentSubTab === 'flow' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" /> Working Workflow Flow
                </button>
                <button
                  onClick={() => setAgentSubTab('guide')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    agentSubTab === 'guide' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" /> Quick 3-Step Setup
                </button>
                <button
                  onClick={() => setAgentSubTab('test')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    agentSubTab === 'test' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" /> Live Diagnostic Signal Test
                </button>
                <button
                  onClick={() => setAgentSubTab('troubleshoot')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    agentSubTab === 'troubleshoot' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" /> Troubleshooting & FAQ
                </button>
              </div>

              {/* Sub-Tab 1: Architecture Workflow Diagram */}
              {agentSubTab === 'flow' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs relative">
                    <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/80 flex flex-col justify-between relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sky-400 text-[11px] uppercase tracking-wider">Node 1</span>
                        <div className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">Customer Order</h4>
                      <p className="text-slate-300 text-[11px]">Uploads PDF/Document on Web App with color & page choices.</p>
                      <div className="mt-3 pt-2 border-t border-slate-700/50 text-[10px] text-slate-400 font-mono">
                        Source: Cloud Sync Queue
                      </div>
                    </div>

                    <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/80 flex flex-col justify-between relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-indigo-400 text-[11px] uppercase tracking-wider">Node 2</span>
                        <div className="w-2 h-2 rounded-full bg-indigo-400" />
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">Admin Dashboard</h4>
                      <p className="text-slate-300 text-[11px]">Branch operator clicks "Print" button on queue item.</p>
                      <div className="mt-3 pt-2 border-t border-slate-700/50 text-[10px] text-slate-400 font-mono">
                        Action: 1-Click Dispatch
                      </div>
                    </div>

                    <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/80 flex flex-col justify-between relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider">Node 3</span>
                        <div className={`w-2 h-2 rounded-full ${agentStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">Local PC Agent</h4>
                      <p className="text-slate-300 text-[11px]">Node.js process on Port 9123 accepts payload base64 instantly.</p>
                      <div className="mt-3 pt-2 border-t border-slate-700/50 text-[10px] text-emerald-400 font-mono">
                        http://localhost:9123
                      </div>
                    </div>

                    <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/80 flex flex-col justify-between relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-purple-400 text-[11px] uppercase tracking-wider">Node 4</span>
                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">Shop Network Printer</h4>
                      <p className="text-slate-300 text-[11px]">Transmits raw print socket buffer to printer IP (Port 9100) or OS spooler.</p>
                      <div className="mt-3 pt-2 border-t border-slate-700/50 text-[10px] text-purple-300 font-mono">
                        RAW TCP Socket Stream
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <strong>Smooth Workflow Advantage:</strong> No print confirmation dialogs, zero paper setup delay, works directly over shop local Wi-Fi LAN!
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/50">
                      Average Speed: &lt; 0.8s
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Sub-Tab 2: Step by Step Setup Guide */}
              {agentSubTab === 'guide' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-black flex items-center justify-center text-xs border border-blue-500/30">1</span>
                          <span className="font-bold text-emerald-400 text-sm">Download Agent Files</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          Click the top buttons to download <code className="text-blue-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">rakhi-print-agent.js</code> and <code className="text-blue-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">run-agent.bat</code> into a single folder on your shop counter PC.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-700/50">
                        <span className="text-[11px] text-slate-400">Prerequisite: Node.js (installed once)</span>
                      </div>
                    </div>

                    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-xs border border-emerald-500/30">2</span>
                          <span className="font-bold text-emerald-400 text-sm">Double Click Launcher</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          Double click <code className="text-emerald-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">run-agent.bat</code> to boot up the agent service on Port 9123. The status indicator above will instantly switch to <strong className="text-emerald-400">Online</strong>.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-700/50">
                        <span className="text-[11px] text-slate-400">Port 9123 initialized</span>
                      </div>
                    </div>

                    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-black flex items-center justify-center text-xs border border-purple-500/30">3</span>
                          <span className="font-bold text-emerald-400 text-sm">Direct Automatic Printing</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          Whenever a customer request arrives, click <strong className="text-blue-400">Print</strong> in the queue. The job will transmit directly to the printer IP set in Configuration!
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-700/50">
                        <span className="text-[11px] text-emerald-400">Zero manual popup required</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-slate-400 font-mono">Alternative Terminal Command:</span>
                    <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-emerald-300">
                      <span>node rakhi-print-agent.js</span>
                      <button 
                        onClick={copyCommandToClipboard} 
                        className="text-slate-400 hover:text-white transition-colors"
                        title="Copy command"
                      >
                        {copiedCommand ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Sub-Tab 3: Diagnostic Signal Test */}
              {agentSubTab === 'test' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/50 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="font-bold text-white text-sm">Agent Health Probe & Diagnostic Signal</h4>
                        <p className="text-slate-300 text-xs">Test direct communication with local port http://localhost:9123/status</p>
                      </div>
                      <button
                        onClick={handleTestSignal}
                        disabled={testSignalStatus === 'sending'}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5" />
                        {testSignalStatus === 'sending' ? 'Pinging Agent...' : 'Send Test Signal'}
                      </button>
                    </div>

                    {testSignalMsg && (
                      <div className={`p-3 rounded-xl text-xs font-mono border ${
                        testSignalStatus === 'success' 
                          ? 'bg-emerald-950/80 border-emerald-800/60 text-emerald-300' 
                          : testSignalStatus === 'failed' 
                          ? 'bg-rose-950/80 border-rose-800/60 text-rose-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}>
                        {testSignalMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Local Endpoint</span>
                        <code className="text-sky-300 font-mono">http://localhost:9123</code>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Status Endpoint</span>
                        <code className="text-emerald-300 font-mono">/status (GET)</code>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Print Payload Endpoint</span>
                        <code className="text-purple-300 font-mono">/print (POST)</code>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Sub-Tab 4: Troubleshooting & FAQ */}
              {agentSubTab === 'troubleshoot' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs"
                >
                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/50">
                    <span className="font-bold text-amber-400 block mb-1">Issue: Agent status shows "Offline"</span>
                    <p className="text-slate-300 leading-relaxed">
                      Make sure <code className="text-blue-300 bg-slate-950 px-1 py-0.5 rounded">run-agent.bat</code> is double-clicked and open in a command prompt window on the shop computer. If offline, the web portal gracefully falls back to browser printing.
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/50">
                    <span className="font-bold text-amber-400 block mb-1">Issue: Node.js not recognized error</span>
                    <p className="text-slate-300 leading-relaxed">
                      Download and install Node.js (LTS version) from <a href="https://nodejs.org" target="_blank" rel="noreferrer" className="text-sky-400 underline hover:text-sky-300">nodejs.org</a> once on your shop PC, then restart <code className="text-emerald-300 bg-slate-950 px-1 py-0.5 rounded">run-agent.bat</code>.
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/50">
                    <span className="font-bold text-amber-400 block mb-1">Issue: Printer IP address changed</span>
                    <p className="text-slate-300 leading-relaxed">
                      If your shop Wi-Fi router assigns a new IP to your Epson/HP/Canon printer, switch to the <strong>Printer Configuration</strong> tab below and update the IP address to match!
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/50">
                    <span className="font-bold text-amber-400 block mb-1">Issue: Windows Firewall popup</span>
                    <p className="text-slate-300 leading-relaxed">
                      When launching for the first time, click "Allow access" for Private Networks on Windows Security prompt to let local browser requests communicate on Port 9123.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'queue' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Print Queue
            </div>
          </button>
          <button
            onClick={() => setActiveTab('printers')}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'printers' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              Printer Configuration
            </div>
          </button>
        </div>

        {activeTab === 'queue' ? (
          <>
            <div className="flex items-center gap-2 mb-6">
              <span className="font-semibold text-slate-700">Filter by Branch:</span>
              <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                {['All', 'Jind', 'Narnaund', 'Uchana'].map(branch => (
                  <button
                    key={branch}
                    onClick={() => setSelectedBranch(branch)}
                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${selectedBranch === branch ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    {branch}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                    <th className="p-4 font-semibold">Job ID / Code</th>
                    <th className="p-4 font-semibold">Document</th>
                    <th className="p-4 font-semibold">Details</th>
                    <th className="p-4 font-semibold">Branch / Printer</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredJobs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center py-10">
                            <CheckCircle2 className="w-12 h-12 text-slate-300 mb-3" />
                            <p className="text-lg font-medium text-slate-600">No print jobs in the queue.</p>
                            <p className="text-sm">Incoming requests will appear here instantly.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredJobs.map((job) => (
                        <motion.tr 
                          key={job.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors group"
                        >
                          <td className="p-4 align-top">
                            <div className="font-mono font-bold text-purple-600 tracking-wider bg-purple-50 inline-block px-2 py-1 rounded">#{job.code}</div>
                            <div className="text-xs text-slate-400 mt-1">{new Date(job.timestamp).toLocaleTimeString()}</div>
                          </td>
                          <td className="p-4 align-top">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-semibold text-slate-800 line-clamp-1 max-w-[200px]" title={job.fileName}>{job.fileName}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{job.colorMode === 'color' ? 'Color' : 'Black & White'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-top">
                            <div className="text-sm text-slate-700">
                              <span className="font-semibold">{job.pageCount}</span> Pages × <span className="font-semibold">{job.copies}</span> Copies
                            </div>
                            <div className="text-sm font-bold text-green-600 mt-0.5">₹{job.cost}</div>
                          </td>
                          <td className="p-4 align-top">
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold mb-1">
                              <Store className="w-3.5 h-3.5 text-slate-500" /> {job.branch}
                            </div>
                            <div className="text-xs text-slate-500 line-clamp-1">{job.printer}</div>
                          </td>
                          <td className="p-4 align-top">
                            {job.status === 'pending' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
                                <Clock className="w-3.5 h-3.5" /> Pending
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Printed
                              </span>
                            )}
                          </td>
                          <td className="p-4 align-top text-right">
                            <div className="flex items-center justify-end gap-2">
                              {job.status === 'pending' && (
                                <button 
                                  onClick={() => executePrint(job)}
                                  disabled={printingJobId === job.id}
                                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5 px-4"
                                  title="One-Click Direct Print to Printer"
                                >
                                  <Printer className="w-4 h-4" />
                                  <span className="text-xs font-bold">
                                    {printingJobId === job.id ? 'Printing...' : 'Print'}
                                  </span>
                                </button>
                              )}
                              <button 
                                onClick={() => deleteJob(job.id)}
                                className="p-2 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-lg transition-colors"
                                title="Delete Job"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Network Printer Registration */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-600" />
                Register New Network Printer
              </h2>
              <form onSubmit={handleAddPrinter} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Branch</label>
                  <select 
                    value={newPrinter.branch} 
                    onChange={(e) => setNewPrinter({...newPrinter, branch: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Narnaund">Narnaund</option>
                    <option value="Jind">Jind</option>
                    <option value="Uchana">Uchana</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Device Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Epson L3250"
                    value={newPrinter.name}
                    onChange={(e) => setNewPrinter({...newPrinter, name: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">IP Address / URI</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 192.168.1.100"
                    value={newPrinter.ip}
                    onChange={(e) => setNewPrinter({...newPrinter, ip: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Printer
                </button>
              </form>
            </div>

            {/* Configured Printers List */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                    <th className="p-4 font-semibold">Branch</th>
                    <th className="p-4 font-semibold">Device Name</th>
                    <th className="p-4 font-semibold">Network IP / Address</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {printers.map(printer => (
                    <tr key={printer.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold">
                          <Store className="w-3.5 h-3.5 text-slate-500" /> {printer.branch}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">{printer.name}</td>
                      <td className="p-4 font-mono text-sm text-blue-600 flex items-center gap-2">
                        <Server className="w-3.5 h-3.5" />
                        {printer.ip}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeletePrinter(printer.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {printers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">
                        No printers configured.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
