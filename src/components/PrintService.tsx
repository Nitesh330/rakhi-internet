import React, { useState, useRef, useEffect } from 'react';
import { saveFile } from '../utils/db';
import { Printer, FileUp, File as FileIcon, CheckCircle2, X, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PDFDocument } from 'pdf-lib';

interface PrintServiceProps {
  onBack: () => void;
}

const WinButton = ({ children, className, ...props }: any) => (
  <button 
    className={`bg-gradient-to-b from-[#f2f2f2] to-[#e1e1e1] border border-[#707070] hover:border-[#3399ff] hover:from-[#eaf6fd] hover:to-[#d7effc] active:from-[#c4e5f6] active:to-[#98d1ef] active:border-[#2c628b] px-3 py-1 rounded-[3px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] focus:outline-none focus:ring-1 focus:ring-[#3399ff] focus:border-[#3399ff] text-[12px] text-black ${className}`}
    {...props}
  >
    {children}
  </button>
);

const WinSelect = ({ className, ...props }: any) => (
  <select className={`border border-[#7a7a7a] bg-white py-0.5 px-1 text-[12px] focus:outline-none focus:border-[#3399ff] ${className}`} {...props} />
);

export default function PrintService({ onBack }: PrintServiceProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);
  
  // Print Options
  const [colorMode, setColorMode] = useState<'bw' | 'color'>('bw');
  const [copies, setCopies] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);
  const [isCounting, setIsCounting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedBranch, setSelectedBranch] = useState('Narnaund');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setIsCounting(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            setPageCount(pdfDoc.getPageCount());
          } catch (error) {
            console.error("Error reading PDF page count", error);
            setPageCount(1); // Fallback
          } finally {
            setIsCounting(false);
          }
        };
        reader.readAsArrayBuffer(selectedFile);
      } else {
        setPageCount(1);
      }
    }
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setPrintSuccess(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      setPrintSuccess(false);
      setUploadProgress(0);
    }
  };

  const [printCode, setPrintCode] = useState('');

  const getPrinterName = (branch: string, color: string) => {
    const defaultPrinters: Record<string, Record<string, string>> = {
      Narnaund: { bw: 'Narnaund B&W Copier', color: 'Narnaund High-Speed Color Laser' },
      Jind: { bw: 'Jind Heavy Duty Printer', color: 'Jind Photo Printer (Color)' },
      Uchana: { bw: 'Uchana Standard Deskjet', color: 'Uchana Color Laser' }
    };
    
    return defaultPrinters[branch]?.[color] || `${branch} Default Printer`;
  };

  const getPrinterHwId = (branch: string, color: string) => {
    if (branch === 'Jind' && color === 'bw') {
      return '192.168.1.20';
    }
    const defaultHwIds: Record<string, string> = {
      Narnaund: '192.168.1.101',
      Jind: '192.168.2.101',
      Uchana: '192.168.3.101'
    };
    return defaultHwIds[branch] || 'Unknown IP';
  };

  const actualPrinter = getPrinterName(selectedBranch, colorMode);
  const actualHwId = getPrinterHwId(selectedBranch, colorMode);

  const handlePrint = async () => {
    if (!selectedFile) return;
    setIsPrinting(true);
    
    // Generate a unique code
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    setPrintCode(code);
    
    // Create job record
    const jobId = Math.random().toString(36).substr(2, 9);
    const newJob = {
      id: jobId,
      fileName: selectedFile.name,
      branch: selectedBranch,
      printer: actualPrinter,
      hwId: actualHwId,
      colorMode,
      copies,
      pageCount,
      cost: calculateTotal(),
      status: 'pending',
      timestamp: new Date().toISOString(),
      code: code
    };
    
    // Save to localStorage for Admin Dashboard
    await saveFile(jobId, selectedFile);
    const existingJobs = JSON.parse(localStorage.getItem('rakhi_print_jobs') || '[]');
    localStorage.setItem('rakhi_print_jobs', JSON.stringify([newJob, ...existingJobs]));
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Printing will be handled by Branch Admin
        
        setTimeout(() => {
          setIsPrinting(false);
          setPrintSuccess(true);
        }, 500);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 200);
  };

  const cancelSelection = () => {
    setSelectedFile(null);
    setPrintSuccess(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  
  const calculateTotal = () => {
    const pages = pageCount || 1;
    const baseCost = colorMode === 'color' ? 10 : 5;
    return pages * copies * baseCost;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 relative font-sans">
      <div className="max-w-4xl mx-auto px-4">
        <button 
          onClick={onBack}
          className="absolute top-24 left-4 md:left-8 p-2.5 bg-white shadow-sm border border-slate-200 text-slate-600 rounded-full hover:bg-slate-50 transition-colors z-10"
          title="Back to Home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 text-purple-600 rounded-2xl mb-4">
            <Printer className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Online Document Printing
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Upload your documents directly to our high-quality printers at Rakhi Internet. We support PDF, Word, Excel, Images, and more.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-3 sm:p-6 md:p-10 border border-slate-100 overflow-x-hidden">
          {!selectedFile ? (
            <motion.div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-10 md:p-16 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-purple-300 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
              />
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4"
              >
                <FileUp className="w-8 h-8" />
              </motion.div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Upload Document to Print</h3>
              <p className="text-slate-500 mb-6 max-w-sm">Drag and drop your file here, or click to browse from your device</p>
              
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors">
                Browse Files
              </button>
            </motion.div>
          ) : (
            <div className="mx-auto w-full flex justify-start md:justify-center overflow-x-auto overflow-y-hidden pb-4 md:pb-0 hide-scrollbar scroll-smooth">
              <AnimatePresence mode="wait">
                {!printSuccess ? (
                  <motion.div
                    key="printing-setup"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-start md:justify-center w-full min-w-[max-content] px-4 md:px-0"
                  >
                    {/* The Windows 7 Classic Dialog UI */}
                    <div className="w-[580px] min-w-[580px] bg-[#f0f0f0] rounded-t-sm shadow-2xl overflow-hidden font-sans select-none border border-[#1883d7] text-[#000] mx-auto scale-[0.8] md:scale-100 origin-top-left md:origin-top">
                      {/* Title bar */}
                      <div className="h-7 bg-gradient-to-b from-[#d9e8fb] via-[#b6d3f8] to-[#92bcf1] border-b border-[#1883d7] flex justify-between items-center px-2">
                        <div className="flex items-center gap-1.5">
                          <Printer className="w-3.5 h-3.5 text-blue-800" />
                          <span className="text-xs font-semibold text-black">Print</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="w-6 h-5 bg-gradient-to-b from-[#f8f9fa] to-[#e5e5e5] border border-[#a0a0a0] rounded-sm flex items-center justify-center hover:bg-blue-100 shadow-inner">
                            <span className="text-[10px] font-bold text-black">?</span>
                          </button>
                          <button onClick={cancelSelection} className="w-10 h-5 bg-[#c75050] hover:bg-[#e04343] border border-[#a02020] rounded-sm flex items-center justify-center text-white shadow-inner">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Body */}
                      <div className="p-2.5 text-[12px] bg-[#f0f0f0]">
                         {/* Printer */}
                         <fieldset className="border border-[#d5d5d5] rounded px-2 pb-2 relative pt-2 mb-2">
                            <legend className="absolute -top-2.5 left-2 bg-[#f0f0f0] px-1 text-black">Printer</legend>
                            <div className="flex justify-between items-start">
                               <div className="flex items-center gap-2">
                                  <span>Branch:</span>
                                  <WinSelect className="w-[280px]" value={selectedBranch} onChange={(e: any) => setSelectedBranch(e.target.value)}>
                                    <option value="Narnaund">Narnaund Branch</option>
                                    <option value="Jind">Jind Branch</option>
                                    <option value="Uchana">Uchana Branch</option>
                                  </WinSelect>
                               </div>
                               <WinButton>Properties</WinButton>
                            </div>
                            <div className="flex mt-1.5">
                               <div className="grid grid-cols-[55px_1fr] gap-x-1 gap-y-0.5 w-[380px] text-gray-700">
                                  <span>Printer:</span> <span className="font-semibold text-blue-700">{actualPrinter}</span>
                                  <span>Status:</span> <span>Ready (Auto-Selected)</span>
                                  <span>Where:</span> <span>{actualHwId}</span>
                                  <span>Comment:</span> <span></span>
                               </div>
                               <div className="flex flex-col gap-0.5 items-start pl-2 text-black w-full">
                                  <WinButton className="w-full mb-1">Find Printer...</WinButton>
                                  <label className="flex items-center gap-1"><input type="checkbox" className="border-gray-400" /> Print to file</label>
                                  <label className="flex items-center gap-1"><input type="checkbox" className="border-gray-400" /> Manual duplex</label>
                               </div>
                            </div>
                         </fieldset>

                         <div className="flex gap-2 mb-2">
                            {/* Page range */}
                            <fieldset className="border border-[#d5d5d5] rounded p-2 relative pt-3 flex-[1.2]">
                               <legend className="absolute -top-2.5 left-2 bg-[#f0f0f0] px-1 text-black">Page range</legend>
                               <div className="flex flex-col gap-1 text-black">
                                  <label className="flex items-center gap-1"><input type="radio" name="range" defaultChecked /> All</label>
                                  <div className="flex items-center gap-6 ml-4">
                                     <label className="flex items-center gap-1"><input type="radio" name="range" /> Current page</label>
                                     <label className="flex items-center gap-1 text-gray-400"><input type="radio" name="range" disabled /> Selection</label>
                                  </div>
                                  <div className="flex items-center gap-2 ml-4">
                                     <label className="flex items-center gap-1"><input type="radio" name="range" /> Pages:</label>
                                     <input type="text" className="border border-[#7a7a7a] w-28 px-1 py-0.5 focus:outline-none focus:border-[#3399ff]" />
                                  </div>
                                  <p className="text-gray-500 mt-1 leading-tight text-[11px] w-[260px] ml-4">
                                     Type page numbers and/or page ranges separated by commas counting from the start of the document or the section. For example, type 1, 3, 5-12 or p1s1, p1s2, p1s3-p8s3
                                  </p>
                               </div>
                            </fieldset>
                            
                            {/* Copies */}
                            <fieldset className="border border-[#d5d5d5] rounded p-2 relative pt-3 flex-1 text-black">
                               <legend className="absolute -top-2.5 left-2 bg-[#f0f0f0] px-1">Copies</legend>
                               <div className="flex items-center gap-2 mb-4">
                                  <span>Number of copies:</span>
                                  <input 
                                    type="number" 
                                    min="1" 
                                    value={copies}
                                    onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="border border-[#7a7a7a] w-12 px-1 py-0.5 focus:outline-none focus:border-[#3399ff]" 
                                  />
                               </div>
                               <div className="flex items-center gap-4">
                                  <div className="flex gap-1">
                                     <div className="relative w-5 h-7">
                                       <div className="absolute top-0 left-0 w-3 h-4 border border-gray-400 bg-white shadow-sm flex items-center justify-center text-[7px] z-10">1</div>
                                       <div className="absolute top-1 left-1 w-3 h-4 border border-gray-400 bg-white shadow-sm flex items-center justify-center text-[7px] z-20">2</div>
                                       <div className="absolute top-2 left-2 w-3 h-4 border border-gray-400 bg-white shadow-sm flex items-center justify-center text-[7px] z-30">3</div>
                                     </div>
                                     <div className="relative w-5 h-7">
                                       <div className="absolute top-0 left-0 w-3 h-4 border border-gray-400 bg-white shadow-sm flex items-center justify-center text-[7px] z-10">1</div>
                                       <div className="absolute top-1 left-1 w-3 h-4 border border-gray-400 bg-white shadow-sm flex items-center justify-center text-[7px] z-20">2</div>
                                       <div className="absolute top-2 left-2 w-3 h-4 border border-gray-400 bg-white shadow-sm flex items-center justify-center text-[7px] z-30">3</div>
                                     </div>
                                  </div>
                                  <label className="flex items-center gap-1"><input type="checkbox" defaultChecked className="border-gray-400" /> Collate</label>
                               </div>
                            </fieldset>
                         </div>

                         <div className="flex items-end gap-2 mb-2 text-black">
                            <div className="flex flex-col gap-1.5 flex-[1.2]">
                               <div className="flex items-center gap-2">
                                  <span className="w-16">Print what:</span>
                                  <WinSelect className="flex-1">
                                    <option>Document showing markup</option>
                                  </WinSelect>
                               </div>
                               <div className="flex items-center gap-2">
                                  <span className="w-16">Color:</span>
                                  <WinSelect 
                                    className="flex-1 font-semibold"
                                    value={colorMode}
                                    onChange={(e: any) => setColorMode(e.target.value)}
                                  >
                                    <option value="bw">Black & White (₹5/page)</option>
                                    <option value="color">Color (₹10/page)</option>
                                  </WinSelect>
                               </div>
                               <div className="flex items-center gap-2 mt-1">
                                  <span className="w-16">Print:</span>
                                  <WinSelect className="flex-1">
                                    <option>All pages in range</option>
                                  </WinSelect>
                               </div>
                            </div>
                            
                            <fieldset className="border border-[#d5d5d5] rounded p-2 relative pt-2 flex-1">
                               <legend className="absolute -top-2.5 left-2 bg-[#f0f0f0] px-1 text-black">Zoom</legend>
                               <div className="flex items-center justify-between mb-2">
                                  <span>Pages per sheet:</span>
                                  <WinSelect className="w-[100px]"><option>1 page</option></WinSelect>
                               </div>
                               <div className="flex items-center justify-between">
                                  <span>Scale to paper size:</span>
                                  <WinSelect className="w-[100px]"><option>No Scaling</option></WinSelect>
                               </div>
                            </fieldset>
                         </div>

                         {/* Bottom Buttons & Cost */}
                         <div className="flex justify-between items-center pt-2.5 border-t border-[#d5d5d5] mt-2 relative">
                            <div className="flex items-center gap-4">
                               <WinButton>Options...</WinButton>
                               
                               {/* Pricing Calculator Output */}
                               <div className="flex items-center gap-2 ml-4 bg-white border border-[#b2b2b2] px-2 py-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
                                  {isCounting ? (
                                    <motion.div 
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="flex items-center gap-2 text-blue-700"
                                    >
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> 
                                      <motion.span
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                      >
                                        Counting pages...
                                      </motion.span>
                                    </motion.div>
                                  ) : (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="flex items-center"
                                    >
                                      <div className="flex flex-col leading-tight pr-3 border-r border-[#ccc]">
                                        <span className="text-[10px] text-gray-500">Pages: <b>{pageCount}</b></span>
                                        <span className="text-[10px] text-gray-500">Copies: <b>{copies}</b></span>
                                      </div>
                                      <div className="text-[13px] font-bold text-green-700 pl-1 whitespace-nowrap">
                                        Total Cost: ₹{calculateTotal()}
                                      </div>
                                    </motion.div>
                                  )}
                               </div>
                            </div>
                                                        <div className="flex gap-2">
                               <WinButton
                                  className={`w-32 font-bold relative overflow-hidden ${isPrinting ? 'pointer-events-none' : ''}`}
                                  onClick={handlePrint}
                                 disabled={isPrinting || isCounting}
                               >
                                  {isPrinting && (
                                    <div 
                                      className="absolute left-0 top-0 bottom-0 bg-[#3399ff]/30 transition-all duration-200" 
                                      style={{ width: `${uploadProgress}%` }}
                                    />
                                  )}
                                  <span className="relative z-10 text-black">
                                    {isPrinting ? `Uploading ${Math.round(uploadProgress)}%` : 'Print'}
                                  </span>
                               </WinButton>
                               <WinButton className="w-20" onClick={cancelSelection} disabled={isPrinting}>Cancel</WinButton>
                            </div>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="printing-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 px-6 bg-white rounded-3xl shadow-lg border border-slate-100 max-w-lg mx-auto"
                  >
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Print Job Received!</h3>
                    <p className="text-slate-600 mb-6">
                      Your document <span className="font-semibold text-slate-800">{selectedFile.name}</span> has been securely sent to our branch.
                    </p>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 text-left space-y-3">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                        <span className="text-sm text-slate-500">Selected Branch</span>
                        <span className="text-sm font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">{selectedBranch} Branch</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                        <span className="text-sm text-slate-500">Target Printer</span>
                        <span className="text-sm font-semibold text-slate-800">{actualPrinter}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                        <span className="text-sm text-slate-500">Print Code / Token</span>
                        <span className="text-sm font-mono font-bold text-purple-600 tracking-wider">#{printCode}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-sm text-slate-500">Total Cost to Pay</span>
                        <span className="text-xl font-black text-slate-900">₹{calculateTotal()}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-500 mb-6">Please show your <span className="font-semibold">Print Code</span> at the {selectedBranch} counter to collect your documents.</p>
                    
                    <button 
                      onClick={cancelSelection}
                      className="w-full px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                    >
                      Print Another Document
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
