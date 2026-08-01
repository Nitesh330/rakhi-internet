import React, { useState, useRef } from "react";
import { Upload, Download, RefreshCw, X, Image as ImageIcon, Sliders, Maximize, HardDrive, File as FileIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const ImageResizer = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0, bytes: 0 });
  const [targetWidth, setTargetWidth] = useState(800);
  const [targetHeight, setTargetHeight] = useState(600);
  
  // New: target file size in KB
  const [targetKB, setTargetKB] = useState<number | ''>('');
  
  const [quality, setQuality] = useState(80);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height, bytes: file.size });
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        setTargetKB(Math.round(file.size / 1024));
        setSelectedImage(url);
        setResultImage(null);
        setResultBytes(0);
      };
      img.src = url;
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value) || 0;
    setTargetWidth(width);
    if (maintainRatio && originalSize.width > 0) {
      setTargetHeight(Math.round((width * originalSize.height) / originalSize.width));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value) || 0;
    setTargetHeight(height);
    if (maintainRatio && originalSize.height > 0) {
      setTargetWidth(Math.round((height * originalSize.width) / originalSize.height));
    }
  };

  const compressToTargetSize = async (imgUrl: string, targetKBSize: number, width: number, height: number): Promise<{dataUrl: string, size: number}> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      const img = new Image();
      img.onload = () => {
        // First try adjusting quality without changing dimensions
        let minQ = 0.01;
        let maxQ = 1.0;
        let currentQ = 0.8;
        let bestDataUrl = "";
        let bestSizeDiff = Infinity;
        let bestSize = 0;
        
        let targetBytes = targetKBSize * 1024;
        
        // Binary search for best quality
        for (let i = 0; i < 7; i++) {
          canvas.width = width;
          canvas.height = height;
          ctx?.clearRect(0, 0, width, height);
          ctx?.drawImage(img, 0, 0, width, height);
          
          let dataUrl = canvas.toDataURL("image/jpeg", currentQ);
          let base64str = dataUrl.split(',')[1];
          let decodedLen = atob(base64str).length;
          
          let diff = Math.abs(decodedLen - targetBytes);
          if (diff < bestSizeDiff) {
            bestSizeDiff = diff;
            bestDataUrl = dataUrl;
            bestSize = decodedLen;
          }
          
          if (decodedLen > targetBytes) {
            maxQ = currentQ;
          } else {
            minQ = currentQ;
          }
          currentQ = (minQ + maxQ) / 2;
        }

        // If even lowest quality is too big, start scaling down dimensions
        if (bestSize > targetBytes * 1.15) {
          let scaleMin = 0.1;
          let scaleMax = 1.0;
          let currentScale = 0.5;
          
          for (let i = 0; i < 7; i++) {
            let testWidth = Math.max(1, Math.round(width * currentScale));
            let testHeight = Math.max(1, Math.round(height * currentScale));
            
            canvas.width = testWidth;
            canvas.height = testHeight;
            ctx?.clearRect(0, 0, testWidth, testHeight);
            ctx?.drawImage(img, 0, 0, testWidth, testHeight);
            
            let dataUrl = canvas.toDataURL("image/jpeg", 0.1); // Use low quality when scaling down for aggressive compression
            let base64str = dataUrl.split(',')[1];
            let decodedLen = atob(base64str).length;
            
            let diff = Math.abs(decodedLen - targetBytes);
            if (diff < bestSizeDiff) {
              bestSizeDiff = diff;
              bestDataUrl = dataUrl;
              bestSize = decodedLen;
            }
            
            if (decodedLen > targetBytes) {
              scaleMax = currentScale;
            } else {
              scaleMin = currentScale;
            }
            currentScale = (scaleMin + scaleMax) / 2;
          }
        }
        
        resolve({ dataUrl: bestDataUrl, size: bestSize });
      };
      img.src = imgUrl;
    });
  };

  const handleResize = () => {
    if (!selectedImage) return;
    setIsProcessing(true);

    setTimeout(async () => {
      let finalDataUrl = "";
      let finalSize = 0;

      if (targetKB !== '') {
        // Try to hit specific KB size
        const result = await compressToTargetSize(selectedImage, Number(targetKB), targetWidth, targetHeight);
        finalDataUrl = result.dataUrl;
        finalSize = result.size;
      } else {
        // Standard resize based on quality slider
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        const img = new Image();
        await new Promise<void>((resolve) => {
          img.onload = () => {
            ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);
            finalDataUrl = canvas.toDataURL("image/jpeg", quality / 100);
            const base64str = finalDataUrl.split(',')[1];
            finalSize = atob(base64str).length;
            resolve();
          };
          img.src = selectedImage;
        });
      }

      setResultImage(finalDataUrl);
      setResultBytes(finalSize);
      setIsProcessing(false);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 bg-slate-50 min-h-[80vh] overflow-hidden" style={{ perspective: "1500px" }}>
      <motion.div 
        className="w-full max-w-5xl"
        initial={{ rotateX: 15, rotateY: -15, opacity: 0, z: -300 }}
        animate={{ rotateX: 0, rotateY: 0, opacity: 1, z: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div 
          className="bg-white rounded-[2rem] p-6 md:p-10 shadow-2xl relative"
          style={{ transformStyle: "preserve-3d" }}
          whileHover={{ rotateX: 1, rotateY: -1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {/* 3D Floating background elements */}
          <motion.div 
            className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"
            animate={{ z: [50, 150, 50], scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -bottom-12 -left-12 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"
            animate={{ z: [50, 200, 50], scale: [1, 1.3, 1] }}
            transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          />

          <div className="text-center mb-10 transform-gpu" style={{ transform: "translateZ(40px)" }}>
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 mb-4 shadow-lg shadow-indigo-200"
              animate={{ rotateY: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Maximize className="w-8 h-8" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent inline-block drop-shadow-sm pb-1">
              3D Image Resizer
            </h2>
            <p className="text-slate-500 mt-3 font-medium text-lg">Change dimensions and compress file size instantly.</p>
          </div>

          <AnimatePresence mode="wait">
            {!selectedImage ? (
              <motion.div 
                key="upload"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="border-4 border-dashed border-indigo-100 rounded-[2rem] p-12 md:p-24 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group transform-gpu relative overflow-hidden"
                style={{ transform: "translateZ(50px)" }}
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.02, translateZ: 60 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative z-10">
                  <motion.div 
                    className="w-28 h-28 bg-white shadow-2xl rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Upload className="w-12 h-12 text-indigo-500" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-700">Drag & Drop or Click</h3>
                  <p className="text-slate-500 mt-3 font-medium">Supports JPG, PNG, WEBP</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="editor"
                initial={{ opacity: 0, rotateX: 90 }}
                animate={{ opacity: 1, rotateX: 0 }}
                className="grid md:grid-cols-[1.2fr_1fr] gap-8"
              >
                {/* Image Preview Area */}
                <motion.div 
                  className="space-y-4 transform-gpu flex flex-col"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <div className="bg-slate-100 rounded-3xl p-4 flex-1 flex flex-col border border-slate-200 shadow-inner min-h-[300px] relative overflow-hidden group">
                    
                    <div className="flex-1 flex items-center justify-center relative z-10">
                      <motion.img 
                        src={resultImage || selectedImage} 
                        alt="Preview" 
                        className="max-w-full max-h-[400px] object-contain drop-shadow-2xl rounded-xl"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={resultImage ? "result" : "original"}
                        transition={{ type: "spring", stiffness: 200 }}
                      />
                    </div>
                    
                    {/* Size Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
                      <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg">
                        <ImageIcon className="w-3.5 h-3.5" /> 
                        {resultImage ? targetWidth + 'x' + targetHeight : originalSize.width + 'x' + originalSize.height}
                      </div>
                      <div className={`backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg ${resultImage ? 'bg-emerald-500/80' : 'bg-black/60'}`}>
                        <HardDrive className="w-3.5 h-3.5" /> 
                        {resultImage ? formatBytes(resultBytes) : formatBytes(originalSize.bytes)}
                      </div>
                    </div>

                    {isProcessing && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center z-30"
                      >
                        <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ rotate: { repeat: Infinity, duration: 1, ease: "linear" }, scale: { repeat: Infinity, duration: 1 } }}>
                          <RefreshCw className="w-12 h-12 text-indigo-600 mb-4" />
                        </motion.div>
                        <p className="font-bold text-indigo-600 text-lg animate-pulse">Processing Image...</p>
                      </motion.div>
                    )}
                  </div>

                  <button 
                    onClick={() => {
                      setSelectedImage(null);
                      setResultImage(null);
                      setResultBytes(0);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="w-full py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-100 hover:border-slate-300 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <X className="w-4 h-4" /> Choose Different Image
                  </button>
                </motion.div>

                {/* Controls Area */}
                <motion.div 
                  className="space-y-6 transform-gpu"
                  style={{ transform: "translateZ(50px)" }}
                >
                  <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-[100px] pointer-events-none"></div>
                    
                    <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-indigo-600" /> Adjustments
                    </h3>
                    
                    <div className="space-y-6 relative z-10">
                      
                      {/* Target File Size Input */}
                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                        <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <FileIcon className="w-3.5 h-3.5" /> Target File Size (KB)
                        </label>
                        <input 
                          type="number" 
                          placeholder="e.g. 50"
                          value={targetKB}
                          onChange={(e) => setTargetKB(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-white border-2 border-indigo-200 rounded-xl px-4 py-3 text-indigo-700 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm placeholder-indigo-300"
                        />
                        <p className="text-[10px] font-bold text-indigo-400 mt-2">
                          Enter desired size in KB. Will auto-adjust quality & size.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Width (px)</label>
                          <input 
                            type="number" 
                            value={targetWidth}
                            onChange={handleWidthChange}
                            className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:border-indigo-300"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Height (px)</label>
                          <input 
                            type="number" 
                            value={targetHeight}
                            onChange={handleHeightChange}
                            className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:border-indigo-300"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer group bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            checked={maintainRatio}
                            onChange={(e) => setMaintainRatio(e.target.checked)}
                            className="peer appearance-none w-6 h-6 rounded-md border-2 border-slate-300 checked:bg-indigo-600 checked:border-indigo-600 transition-colors cursor-pointer"
                          />
                          <div className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">Maintain Aspect Ratio</span>
                      </label>

                      {targetKB === '' && (
                        <div className="pt-2">
                          <div className="flex justify-between items-end mb-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Quality (if no target size)</label>
                            <span className="text-xs font-black text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md">{quality}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="1" 
                            max="100" 
                            value={quality}
                            onChange={(e) => setQuality(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                          <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
                            <span>Smaller File</span>
                            <span>Better Quality</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {!resultImage ? (
                    <motion.button
                      onClick={handleResize}
                      disabled={isProcessing}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-black text-lg shadow-[0_10px_30px_-10px_rgba(99,102,241,0.6)] flex items-center justify-center gap-3 hover:shadow-[0_15px_40px_-10px_rgba(99,102,241,0.8)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                      whileHover={{ scale: 1.03, translateZ: 20 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      <RefreshCw className="w-5 h-5 relative z-10 group-hover:rotate-180 transition-transform duration-500" /> 
                      <span className="relative z-10">Apply Changes</span>
                    </motion.button>
                  ) : (
                    <motion.a
                      href={resultImage}
                      download="resized-image.jpg"
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg shadow-[0_10px_30px_-10px_rgba(16,185,129,0.6)] flex items-center justify-center gap-3 hover:shadow-[0_15px_40px_-10px_rgba(16,185,129,0.8)] transition-all group relative overflow-hidden block text-center"
                      whileHover={{ scale: 1.03, translateZ: 20 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      <Download className="w-5 h-5 inline-block -mt-1 group-hover:-translate-y-1 transition-transform" /> 
                      <span className="relative z-10">Download Image</span>
                    </motion.a>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ImageResizer;
