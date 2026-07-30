import React, { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Download, Scissors, Shirt, RefreshCw, Trash2, Palette, Check, Sliders, ImagePlus, CheckCircle, FileImageIcon, Eye, Undo, Redo, RotateCw, FlipHorizontal, FlipVertical, Eraser, Move } from 'lucide-react';
import { motion } from 'motion/react';
import { removeBackground } from '@imgly/background-removal';

let activeRemovalPromise: Promise<void> = Promise.resolve();

const queuedRemoveBackground = async (image: string | URL | Blob, config?: any): Promise<Blob> => {
  const currentPromise = activeRemovalPromise;
  let resolveCurrent: () => void = () => {};
  activeRemovalPromise = new Promise<void>((resolve) => {
    resolveCurrent = resolve;
  });

  try {
    await currentPromise;
  } catch (e) {
    // Ignore previous session failures
  }

  try {
    const result = await removeBackground(image, {
      ...config,
      publicPath: 'https://cdn.jsdelivr.net/npm/@imgly/background-removal-data@1.7.0/dist/'
    });
    return result;
  } finally {
    resolveCurrent();
  }
};

interface PhotoToolsProps {
  initialTab: 'bg-remover' | 'clothes-changer';
}

const CLOTHES_OPTIONS = [
  { 
    id: 'suit', 
    name: 'Executive Suit', 
    url: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 'shirt', 
    name: 'Cotton Shirt', 
    url: 'https://images.unsplash.com/photo-1620012253295-c05518e993be?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 'tshirt', 
    name: 'Casual T-Shirt', 
    url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 'dress', 
    name: 'Evening Gown', 
    url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 'coat', 
    name: 'Wool Trench', 
    url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 'jeans', 
    name: 'Denim Jacket', 
    url: 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&w=600&q=80' 
  },
];

const CLOTH_OFFSETS: Record<string, { yOffset: number, scaleMult: number, stretchMult: number }> = {
  'suit': { yOffset: 6, scaleMult: 1.15, stretchMult: 1.15 },
  'shirt': { yOffset: 4, scaleMult: 1.1, stretchMult: 1.0 },
  'tshirt': { yOffset: 3, scaleMult: 1.05, stretchMult: 0.9 },
  'dress': { yOffset: 12, scaleMult: 1.2, stretchMult: 1.6 },
  'coat': { yOffset: 8, scaleMult: 1.25, stretchMult: 1.3 },
  'jeans': { yOffset: 4, scaleMult: 1.1, stretchMult: 0.95 }
};

const PRESET_BG_COLORS = [
  { id: 'white', name: 'White', value: '#FFFFFF' },
  { id: 'black', name: 'Studio Black', value: '#0F172A' },
  { id: 'lightgray', name: 'Warm Gray', value: '#F1F5F9' },
  { id: 'blue', name: 'Studio Blue', value: '#2563EB' },
  { id: 'green', name: 'Ecology Green', value: '#10B981' },
  { id: 'red', name: 'Crimson Red', value: '#EF4444' },
  { id: 'yellow', name: 'Amber Yellow', value: '#F59E0B' },
  { id: 'purple', name: 'Vibrant Violet', value: '#8B5CF6' },
  { id: 'pink', name: 'Rose Pink', value: '#EC4899' },
];

const PRESET_BG_IMAGES = [
  { id: 'office', name: 'Modern Office', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80' },
  { id: 'studio', name: 'Studio Gradient', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80' },
  { id: 'outdoor', name: 'Nature Forest', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80' },
  { id: 'neon', name: 'Cyber Neon', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80' },
  { id: 'abstract', name: 'Abstract Pastel', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=600&q=80' }
];

const PhotoTools: React.FC<PhotoToolsProps> = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState<'bg-remover' | 'clothes-changer'>(initialTab);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [transparentResult, setTransparentResult] = useState<string | null>(null);
  
  // Real-time progress reporting state
  const [progressPct, setProgressPct] = useState<number | null>(null);
  const [progressStatus, setProgressStatus] = useState<string>('');
  
  // Backdrop Options
  const [backdropType, setBackdropType] = useState<'transparent' | 'color' | 'image'>('transparent');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [selectedBgImage, setSelectedBgImage] = useState<string>(PRESET_BG_IMAGES[0].url);
  const [customBgImage, setCustomBgImage] = useState<string | null>(null);

  // Subject Composition Alignment & Rotation
  const [subjectScale, setSubjectScale] = useState(1.0);
  const [subjectX, setSubjectX] = useState(0); // Offset in %
  const [subjectY, setSubjectY] = useState(0); // Offset in %
  const [subjectRotation, setSubjectRotation] = useState(0); // degrees
  const [isFlippedH, setIsFlippedH] = useState(false);
  const [isFlippedV, setIsFlippedV] = useState(false);

  // Sub-navigation: 'composite' (Arrange) or 'edit' (Manual Erase)
  const [activeToolMode, setActiveToolMode] = useState<'composite' | 'edit'>('composite');
  const [editTool, setEditTool] = useState<'auto' | 'magic' | 'brush'>('magic');
  
  // Brush configurations
  const [brushMode, setBrushMode] = useState<'erase' | 'restore'>('erase');
  const [brushSize, setBrushSize] = useState(25);
  const [tolerance, setTolerance] = useState(30);
  const [brushPos, setBrushPos] = useState<{x: number, y: number} | null>(null);
  const [imgDimensions, setImgDimensions] = useState({ width: 400, height: 400 });

  // Canvas drawing ref and history states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPointRef = useRef<{x: number, y: number} | null>(null);
  const originalImgRef = useRef<HTMLImageElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Dragging Subject on Canvas in Composite Mode
  const [isDraggingSubject, setIsDraggingSubject] = useState(false);
  const dragStartRef = useRef<{x: number, y: number, subX: number, subY: number} | null>(null);

  // Clothes changer state
  const [selectedCloth, setSelectedCloth] = useState(CLOTHES_OPTIONS[0]);
  const [clothScale, setClothScale] = useState(1);
  const [clothX, setClothX] = useState(50);
  const [clothY, setClothY] = useState(50);
  const [clothRotation, setClothRotation] = useState(0); // degrees
  const [isDraggingCloth, setIsDraggingCloth] = useState(false);
  const clothDragStartRef = useRef<{x: number, y: number, clothX: number, clothY: number} | null>(null);

  // Photorealistic dynamic isolation states & fine-tuning states
  const [isolatedClothes, setIsolatedClothes] = useState<Record<string, string>>({});
  const [isolatingClothId, setIsolatingClothId] = useState<string | null>(null);
  const [customClothes, setCustomClothes] = useState<{ id: string, name: string, url: string, isolatedUrl: string }[]>([]);
  const customClothInputRef = useRef<HTMLInputElement | null>(null);

  const [clothStretch, setClothStretch] = useState(1.0);
  const [clothFlipH, setClothFlipH] = useState(false);
  const [clothBrightness, setClothBrightness] = useState(100);
  const [clothContrast, setClothContrast] = useState(100);
  const [clothSaturate, setClothSaturate] = useState(100);
  const [clothHue, setClothHue] = useState(0);

  // AI Automatic body detection and alignment state
  const [detectingBody, setDetectingBody] = useState(false);
  const [baseBodyBounds, setBaseBodyBounds] = useState<{ x: number, y: number, scale: number, stretch: number } | null>(null);

  const getClothImage = (id: string): string => {
    if (isolatedClothes[id]) {
      return isolatedClothes[id];
    }
    const custom = customClothes.find(c => c.id === id);
    if (custom) {
      return custom.isolatedUrl || custom.url;
    }
    const option = CLOTHES_OPTIONS.find(c => c.id === id);
    return option ? option.url : '';
  };

  const handleCustomClothUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const url = event.target?.result as string;
        const newId = `custom-${Date.now()}`;
        const newCloth = {
          id: newId,
          name: file.name.replace(/\.[^/.]+$/, "").substring(0, 15) || 'My Outfit',
          url: url,
          isolatedUrl: ''
        };
        
        setCustomClothes(prev => [...prev, newCloth]);
        setSelectedCloth(newCloth);
        setResultImage(null);
        
        setIsolatingClothId(newId);
        try {
          const blob = await queuedRemoveBackground(url, {
            model: 'isnet_quint8',
            device: 'gpu'
          });
          const isolatedUrl = URL.createObjectURL(blob);
          setIsolatedClothes(prev => ({ ...prev, [newId]: isolatedUrl }));
          setCustomClothes(prev => prev.map(c => c.id === newId ? { ...c, isolatedUrl } : c));
        } catch (err) {
          console.error("Custom clothing isolation failed:", err);
          setIsolatedClothes(prev => ({ ...prev, [newId]: url }));
        } finally {
          setIsolatingClothId(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-isolation hook
  useEffect(() => {
    if (activeTab === 'clothes-changer') {
      const cloth = selectedCloth;
      if (cloth && !isolatedClothes[cloth.id]) {
        setIsolatingClothId(cloth.id);
        queuedRemoveBackground(cloth.url, {
          model: 'isnet_quint8',
          device: 'gpu'
        }).then((blob) => {
          const url = URL.createObjectURL(blob);
          setIsolatedClothes(prev => ({ ...prev, [cloth.id]: url }));
        }).catch((err) => {
          console.error("AI cloth isolation failed, falling back:", err);
          setIsolatedClothes(prev => ({ ...prev, [cloth.id]: cloth.url }));
        }).finally(() => {
          setIsolatingClothId(null);
        });
      }
    }
  }, [selectedCloth, activeTab]);

  // AI-powered automatic body detection on image selection
  useEffect(() => {
    if (selectedImage && activeTab === 'clothes-changer') {
      setDetectingBody(true);
      setBaseBodyBounds(null);
      fetch('/api/detect-body-bounds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: selectedImage })
      })
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.x === 'number') {
          const baseline = {
            x: data.x,
            y: data.y,
            scale: data.scale,
            stretch: data.stretch || 1.0
          };
          setBaseBodyBounds(baseline);
        }
      })
      .catch(err => {
        console.error("AI body detection failed:", err);
      })
      .finally(() => {
        setDetectingBody(false);
      });
    }
  }, [selectedImage, activeTab]);

  // Apply clothing fitting whenever cloth or base bounds change
  const applyClothFitting = (clothId: string, baseline: { x: number, y: number, scale: number, stretch: number }) => {
    const offset = CLOTH_OFFSETS[clothId] || { yOffset: 4, scaleMult: 1.1, stretchMult: 1.0 };
    setClothX(Math.round(baseline.x));
    const calculatedY = baseline.y + (offset.yOffset * baseline.scale);
    setClothY(Math.round(Math.max(0, Math.min(100, calculatedY))));
    setClothScale(Number((baseline.scale * offset.scaleMult).toFixed(2)));
    setClothStretch(Number((baseline.stretch * offset.stretchMult).toFixed(2)));
  };

  // Trigger fitting updates
  useEffect(() => {
    if (activeTab === 'clothes-changer' && baseBodyBounds && selectedCloth) {
      applyClothFitting(selectedCloth.id, baseBodyBounds);
    }
  }, [selectedCloth, baseBodyBounds, activeTab]);

  // Load selected image state history
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setSelectedImage(url);
        setTransparentResult(url);
        setResultImage(null);
        setHistory([url]);
        setHistoryIndex(0);
        
        // Reset positioning
        setSubjectScale(1.0);
        setSubjectX(0);
        setSubjectY(0);
        setSubjectRotation(0);
        setIsFlippedH(false);
        setIsFlippedV(false);
        setActiveToolMode('composite');
        
        // Load original Image object for brush restore
        const img = new Image();
        img.src = url;
        img.onload = () => {
          originalImgRef.current = img;
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomBgImage(event.target?.result as string);
        setBackdropType('image');
      };
      reader.readAsDataURL(file);
    }
  };

  // Undo / Redo logic
  const saveToHistory = (newUrl: string) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newUrl);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setTransparentResult(newUrl);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setTransparentResult(history[prevIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setTransparentResult(history[nextIdx]);
    }
  };

  // Run AI Background isolation (with resilient user-friendly local fallback)
  const runAutoAIBackgroundRemoval = async () => {
    if (!selectedImage) return;
    setProcessing(true);
    setProgressPct(0);
    setProgressStatus('Initializing AI engine...');
    
    try {
      const blob = await queuedRemoveBackground(selectedImage, {
        model: 'isnet_quint8',
        device: 'gpu',
        progress: (status, current, total) => {
          const pct = Math.round((current / total) * 100);
          setProgressPct(pct);
          if (status.includes('fetch')) {
            setProgressStatus(`Downloading on-device AI model... ${pct}%`);
          } else {
            setProgressStatus(`Isolating background... ${pct}%`);
          }
        }
      });
      const url = URL.createObjectURL(blob);
      
      // QUALITY PRESERVATION & ENHANCEMENT FLOW:
      // Load both original and extracted images to perform a high-res mask overlay,
      // ensuring 100% original pixel density is preserved without any downscaling.
      const extractedImg = new Image();
      extractedImg.src = url;
      await new Promise((resolve) => { extractedImg.onload = resolve; });

      const origImg = new Image();
      origImg.src = selectedImage;
      await new Promise((resolve) => { origImg.onload = resolve; });

      const canvas = document.createElement('canvas');
      canvas.width = origImg.width;
      canvas.height = origImg.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Step 1: Draw high-res original image in full resolution
        ctx.drawImage(origImg, 0, 0);
        
        // Step 2: Use destination-in to apply the transparency mask from the AI output
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(extractedImg, 0, 0, origImg.width, origImg.height);
        ctx.globalCompositeOperation = 'source-over';
        
        // Step 3: Enhance quality slightly (vibrancy, crispness, contrast) for a professional finish
        try {
          ctx.filter = 'contrast(1.02) saturate(1.03) brightness(1.01)';
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            tempCtx.drawImage(canvas, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(tempCanvas, 0, 0);
          }
          ctx.filter = 'none';
        } catch (filterErr) {
          console.warn("Canvas filter not supported on this browser:", filterErr);
        }

        const highResUrl = canvas.toDataURL('image/png', 1.0);
        saveToHistory(highResUrl);
      } else {
        saveToHistory(url);
      }
    } catch (err: any) {
      console.error("AI removal failed:", err);
      alert(
        "Auto AI background removal was blocked by browser sandbox or failed to load. " +
        "No worries! You can use our lightning-fast '🎯 Magic Color Eraser' or '🖌️ Manual Brush Eraser' below to instantly clear the background!"
      );
      setEditTool('magic');
    } finally {
      setProcessing(false);
      setProgressPct(null);
    }
  };

  // Interactive coordinate mapping for canvas
  const getCanvasCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, 
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };

  // Magic Color Erase (Global Chroma Key Keying)
  const performMagicErase = (startX: number, startY: number) => {
    if (!transparentResult) return;
    const img = new Image();
    img.src = transparentResult;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const pxX = Math.floor(startX);
      const pxY = Math.floor(startY);
      if (pxX < 0 || pxX >= canvas.width || pxY < 0 || pxY >= canvas.height) return;
      
      const idx = (pxY * canvas.width + pxX) * 4;
      const targetR = data[idx];
      const targetG = data[idx + 1];
      const targetB = data[idx + 2];
      const targetA = data[idx + 3];
      
      if (targetA === 0) return; // already transparent

      const tolSq = tolerance * tolerance * 3;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i+3] > 0) {
          const dR = data[i] - targetR;
          const dG = data[i+1] - targetG;
          const dB = data[i+2] - targetB;
          if (dR*dR + dG*dG + dB*dB <= tolSq) {
            data[i+3] = 0;
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
      saveToHistory(canvas.toDataURL('image/png'));
    };
  };

  // Brush paint Erase / Restore
  const drawBrushStroke = (
    p1: {x: number, y: number}, 
    p2: {x: number, y: number}, 
    ctx: CanvasRenderingContext2D, 
    originalImg: HTMLImageElement | null
  ) => {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;

    if (brushMode === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    } else if (originalImg) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = ctx.canvas.width;
      tempCanvas.height = ctx.canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.lineCap = 'round';
        tempCtx.lineJoin = 'round';
        tempCtx.lineWidth = brushSize;
        tempCtx.strokeStyle = 'black';
        tempCtx.beginPath();
        tempCtx.moveTo(p1.x, p1.y);
        tempCtx.lineTo(p2.x, p2.y);
        tempCtx.stroke();
        
        tempCtx.globalCompositeOperation = 'source-in';
        tempCtx.drawImage(originalImg, 0, 0);
        
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(tempCanvas, 0, 0);
      }
    }
    ctx.restore();
  };

  // Canvas drawing event handlers
  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const coords = getCanvasCoords(e, canvas);
    if (!coords) return;
    
    setIsDrawing(true);
    lastPointRef.current = coords;
    
    if (editTool === 'magic') {
      performMagicErase(coords.x, coords.y);
      setIsDrawing(false);
    }
  };

  const handleMoveDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!isDrawing || editTool !== 'brush' || !lastPointRef.current || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const coords = getCanvasCoords(e, canvas);
    if (!coords) return;
    
    drawBrushStroke(lastPointRef.current, coords, ctx, originalImgRef.current);
    lastPointRef.current = coords;
  };

  const handleEndDraw = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      lastPointRef.current = null;
      const dataUrl = canvasRef.current.toDataURL('image/png');
      saveToHistory(dataUrl);
    }
  };

  // Track hover coordinate for brush outline
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setBrushPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleCanvasMouseLeave = () => {
    setBrushPos(null);
  };

  // Synchronize on-screen canvas graphics
  useEffect(() => {
    if (activeTab === 'bg-remover' && activeToolMode === 'edit' && canvasRef.current && transparentResult) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const img = new Image();
      img.src = transparentResult;
      img.onload = () => {
        if (canvas.width !== img.width || canvas.height !== img.height) {
          canvas.width = img.width;
          canvas.height = img.height;
        }
        setImgDimensions({ width: img.width, height: img.height });
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    }
  }, [transparentResult, activeToolMode, activeTab]);

  // Touch & Mouse Dragging Subject in Composite Mode
  const handleSubjectDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (activeToolMode !== 'composite') return;
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    setIsDraggingSubject(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      subX: subjectX,
      subY: subjectY
    };
  };

  const handleSubjectDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingSubject || !dragStartRef.current || !previewContainerRef.current) return;
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const rect = previewContainerRef.current.getBoundingClientRect();
    const diffX = clientX - dragStartRef.current.x;
    const diffY = clientY - dragStartRef.current.y;
    
    const pctX = (diffX / rect.width) * 100;
    const pctY = (diffY / rect.height) * 100;
    setSubjectX(Math.min(100, Math.max(-100, dragStartRef.current.subX + pctX)));
    setSubjectY(Math.min(100, Math.max(-100, dragStartRef.current.subY + pctY)));
  };

  const handleSubjectDragEnd = () => {
    setIsDraggingSubject(false);
    dragStartRef.current = null;
  };

  // Touch & Mouse Dragging Cloth in Outfit Changer Mode
  const handleClothDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (activeTab !== 'clothes-changer' || resultImage) return;
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    setIsDraggingCloth(true);
    clothDragStartRef.current = {
      x: clientX,
      y: clientY,
      clothX: clothX,
      clothY: clothY
    };
  };

  const handleClothDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingCloth || !clothDragStartRef.current || !previewContainerRef.current) return;
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const rect = previewContainerRef.current.getBoundingClientRect();
    const diffX = clientX - clothDragStartRef.current.x;
    const diffY = clientY - clothDragStartRef.current.y;
    
    const pctX = (diffX / rect.width) * 100;
    const pctY = (diffY / rect.height) * 100;
    setClothX(Math.min(100, Math.max(0, clothDragStartRef.current.clothX + pctX)));
    setClothY(Math.min(100, Math.max(0, clothDragStartRef.current.clothY + pctY)));
  };

  const handleClothDragEnd = () => {
    setIsDraggingCloth(false);
    clothDragStartRef.current = null;
  };

  // Helper to generate beautiful transparent SVG vectors for professional outfit overlays
  const getClothSvgDataUrl = (id: string): string => {
    let svgContent = '';
    if (id === 'suit') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="120" height="140">
          <defs>
            <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#1e293b"/>
              <stop offset="50%" stop-color="#0f172a"/>
              <stop offset="100%" stop-color="#020617"/>
            </linearGradient>
            <linearGradient id="tieGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ef4444"/>
              <stop offset="100%" stop-color="#991b1b"/>
            </linearGradient>
            <linearGradient id="lapelGradL" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#334155"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>
            <linearGradient id="lapelGradR" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#334155"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>
            <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-opacity="0.3"/>
            </filter>
          </defs>
          <path d="M 20,40 C 20,40 32,32 60,32 C 88,32 100,40 100,40 L 105,120 C 105,125 95,135 60,135 C 25,135 15,125 15,120 Z" fill="url(#suitGrad)" />
          <path d="M 45,32 L 60,82 L 75,32 Z" fill="#ffffff" />
          <path d="M 45,32 L 60,42 L 53,32 Z" fill="#e2e8f0" />
          <path d="M 75,32 L 60,42 L 67,32 Z" fill="#e2e8f0" />
          <path d="M 56,42 L 64,42 L 67,90 L 60,105 L 53,90 Z" fill="url(#tieGrad)" />
          <path d="M 55,42 L 65,42 L 60,50 Z" fill="#b91c1c" />
          <line x1="56" y1="52" x2="64" y2="48" stroke="#fecdd3" stroke-width="1.5" opacity="0.6" />
          <line x1="57" y1="64" x2="65" y2="60" stroke="#fecdd3" stroke-width="1.5" opacity="0.6" />
          <line x1="58" y1="76" x2="66" y2="72" stroke="#fecdd3" stroke-width="1.5" opacity="0.6" />
          <line x1="59" y1="88" x2="67" y2="84" stroke="#fecdd3" stroke-width="1.5" opacity="0.6" />
          <path d="M 20,40 L 60,85 L 53,85 L 30,55 L 23,58 Z" fill="url(#lapelGradL)" stroke="#1e293b" stroke-width="0.5" filter="url(#dropShadow)" />
          <path d="M 100,40 L 60,85 L 67,85 L 90,55 L 97,58 Z" fill="url(#lapelGradR)" stroke="#1e293b" stroke-width="0.5" filter="url(#dropShadow)" />
          <path d="M 32,32 L 48,36 L 45,46 Z" fill="#0f172a" />
          <path d="M 88,32 L 72,36 L 75,46 Z" fill="#0f172a" />
          <path d="M 30,58 L 38,54 L 39,58 Z" fill="#f43f5e" />
          <path d="M 34,57 L 42,52 L 43,57 Z" fill="#f43f5e" />
          <rect x="29" y="58" width="16" height="2.5" fill="#e11d48" rx="0.5" />
          <path d="M 25,80 Q 45,95 60,85" fill="none" stroke="#020617" stroke-width="1.5" opacity="0.4" />
          <path d="M 95,80 Q 75,95 60,85" fill="none" stroke="#020617" stroke-width="1.5" opacity="0.4" />
          <ellipse cx="28" cy="48" rx="1.5" ry="0.5" fill="#facc15" transform="rotate(-15 28 48)" />
          <circle cx="26" cy="47" r="1" fill="#ef4444" />
          <circle cx="57" cy="98" r="2.5" fill="#334155" stroke="#0f172a" stroke-width="0.5" />
          <circle cx="57" cy="112" r="2.5" fill="#334155" stroke="#0f172a" stroke-width="0.5" />
        </svg>
      `;
    } else if (id === 'shirt') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="120" height="140">
          <defs>
            <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#f0f9ff"/>
              <stop offset="40%" stop-color="#e0f2fe"/>
              <stop offset="100%" stop-color="#bae6fd"/>
            </linearGradient>
            <linearGradient id="collarGradL" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#e0f2fe"/>
              <stop offset="100%" stop-color="#7dd3fc"/>
            </linearGradient>
            <linearGradient id="collarGradR" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#e0f2fe"/>
              <stop offset="100%" stop-color="#7dd3fc"/>
            </linearGradient>
          </defs>
          <path d="M 22,35 C 22,35 34,25 60,25 C 86,25 98,35 98,35 L 102,125 C 102,128 92,132 60,132 C 28,132 18,128 18,125 Z" fill="url(#shirtGrad)" />
          <path d="M 22,35 L 10,65 L 18,68 L 26,48 Z" fill="#bae6fd" opacity="0.8" />
          <path d="M 98,35 L 110,65 L 102,68 L 94,48 Z" fill="#bae6fd" opacity="0.8" />
          <rect x="56" y="25" width="8" height="107" fill="#7dd3fc" opacity="0.6" />
          <line x1="56" y1="25" x2="56" y2="132" stroke="#38bdf8" stroke-width="0.5" />
          <line x1="64" y1="25" x2="64" y2="132" stroke="#38bdf8" stroke-width="0.5" />
          <circle cx="60" cy="50" r="2" fill="#ffffff" stroke="#93c5fd" stroke-width="0.8" />
          <circle cx="60" cy="70" r="2" fill="#ffffff" stroke="#93c5fd" stroke-width="0.8" />
          <circle cx="60" cy="90" r="2" fill="#ffffff" stroke="#93c5fd" stroke-width="0.8" />
          <circle cx="60" cy="110" r="2" fill="#ffffff" stroke="#93c5fd" stroke-width="0.8" />
          <path d="M 38,25 L 60,45 L 53,25 Z" fill="url(#collarGradL)" stroke="#38bdf8" stroke-width="0.8" />
          <path d="M 82,25 L 60,45 L 67,25 Z" fill="url(#collarGradR)" stroke="#38bdf8" stroke-width="0.8" />
          <path d="M 28,52 L 42,52 L 42,66 Q 35,70 28,66 Z" fill="#bae6fd" stroke="#7dd3fc" stroke-width="0.8" />
          <line x1="28" y1="54" x2="42" y2="54" stroke="#38bdf8" stroke-width="0.8" />
          <path d="M 30,85 Q 45,90 54,82" fill="none" stroke="#7dd3fc" stroke-width="1" opacity="0.4" />
          <path d="M 90,85 Q 75,90 66,82" fill="none" stroke="#7dd3fc" stroke-width="1" opacity="0.4" />
        </svg>
      `;
    } else if (id === 'tshirt') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="120" height="140">
          <defs>
            <linearGradient id="tshirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#475569"/>
              <stop offset="60%" stop-color="#334155"/>
              <stop offset="100%" stop-color="#1e293b"/>
            </linearGradient>
            <linearGradient id="sleeveGradL" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#64748b"/>
              <stop offset="100%" stop-color="#334155"/>
            </linearGradient>
            <linearGradient id="sleeveGradR" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#64748b"/>
              <stop offset="100%" stop-color="#334155"/>
            </linearGradient>
          </defs>
          <path d="M 30,22 L 5,38 L 14,58 L 35,46 Z" fill="url(#sleeveGradL)" />
          <path d="M 90,22 L 115,38 L 106,58 L 85,46 Z" fill="url(#sleeveGradR)" />
          <path d="M 30,22 C 30,22 45,15 60,15 C 75,15 90,22 90,22 L 95,122 C 95,125 80,128 60,128 C 40,128 25,125 25,122 Z" fill="url(#tshirtGrad)" />
          <path d="M 46,19 C 46,19 60,29 74,19 Q 70,24 60,24 Q 50,24 46,19 Z" fill="#1e293b" stroke="#475569" stroke-width="0.8" />
          <path d="M 44,17 C 44,17 60,29 76,17" fill="none" stroke="#64748b" stroke-width="1.5" />
          <circle cx="60" cy="52" r="14" fill="#0ea5e9" opacity="0.15" />
          <path d="M 48,52 L 60,38 L 72,52 L 60,66 Z" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.6" />
          <circle cx="60" cy="52" r="4" fill="#38bdf8" opacity="0.7" />
          <path d="M 28,68 C 35,72 45,68 50,72" fill="none" stroke="#0f172a" stroke-width="1.2" opacity="0.35" />
          <path d="M 92,68 C 85,72 75,68 70,72" fill="none" stroke="#0f172a" stroke-width="1.2" opacity="0.35" />
          <path d="M 32,102 C 45,106 75,106 88,102" fill="none" stroke="#0f172a" stroke-width="1" opacity="0.3" />
        </svg>
      `;
    } else if (id === 'dress') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="120" height="140">
          <defs>
            <linearGradient id="dressSatin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#be123c"/>
              <stop offset="40%" stop-color="#9f1239"/>
              <stop offset="70%" stop-color="#881337"/>
              <stop offset="100%" stop-color="#4c0519"/>
            </linearGradient>
            <linearGradient id="goldSash" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ca8a04"/>
              <stop offset="50%" stop-color="#facc15"/>
              <stop offset="100%" stop-color="#eab308"/>
            </linearGradient>
          </defs>
          <path d="M 36,25 L 44,52 L 76,52 L 84,25 L 72,25 C 68,36 52,36 48,25 Z" fill="url(#dressSatin)" stroke="#4c0519" stroke-width="0.5" />
          <path d="M 36,25 Q 24,30 20,38 Q 30,42 38,32 Z" fill="#9f1239" />
          <path d="M 84,25 Q 96,30 100,38 Q 90,42 82,32 Z" fill="#9f1239" />
          <path d="M 43,52 L 77,52 L 75,59 L 45,59 Z" fill="url(#goldSash)" />
          <rect x="54" y="50" width="12" height="11" fill="#fef08a" stroke="#854d0e" stroke-width="1" rx="1.5" />
          <rect x="57" y="53" width="6" height="5" fill="#ca8a04" rx="0.5" />
          <path d="M 45,59 L 15,134 L 105,134 L 75,59 Z" fill="url(#dressSatin)" />
          <path d="M 48,59 C 40,88 30,112 24,134" fill="none" stroke="#4c0519" stroke-width="1.8" opacity="0.6" />
          <path d="M 54,59 C 50,88 44,112 40,134" fill="none" stroke="#4c0519" stroke-width="1.5" opacity="0.6" />
          <path d="M 60,59 C 60,88 60,112 60,134" fill="none" stroke="#4c0519" stroke-width="1.5" opacity="0.6" />
          <path d="M 66,59 C 70,88 76,112 80,134" fill="none" stroke="#4c0519" stroke-width="1.5" opacity="0.6" />
          <path d="M 72,59 C 80,88 90,112 96,134" fill="none" stroke="#4c0519" stroke-width="1.8" opacity="0.6" />
          <path d="M 15,134 Q 20,131 25,134 Q 30,131 35,134 Q 40,131 45,134 Q 50,131 55,134 Q 60,131 65,134 Q 70,131 75,134 Q 80,131 85,134 Q 90,131 95,134 Q 100,131 105,134" fill="none" stroke="#fda4af" stroke-width="1" opacity="0.7" />
        </svg>
      `;
    } else if (id === 'coat') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="120" height="140">
          <defs>
            <linearGradient id="camelWool" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#d97706"/>
              <stop offset="50%" stop-color="#b45309"/>
              <stop offset="100%" stop-color="#78350f"/>
            </linearGradient>
            <linearGradient id="tortieButton" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#7c2d12"/>
              <stop offset="100%" stop-color="#1c1917"/>
            </linearGradient>
          </defs>
          <path d="M 24,28 C 24,28 34,18 60,18 C 86,18 96,28 96,28 L 102,126 C 102,129 90,133 60,133 C 30,133 18,129 18,126 Z" fill="url(#camelWool)" />
          <path d="M 24,28 L 48,18 L 56,58 L 32,68 Z" fill="#a16207" stroke="#78350f" stroke-width="0.5" />
          <path d="M 96,28 L 72,18 L 64,58 L 88,68 Z" fill="#a16207" stroke="#78350f" stroke-width="0.5" />
          <path d="M 38,18 L 50,30 L 62,18 Z" fill="#451a03" />
          <circle cx="44" cy="52" r="3.5" fill="url(#tortieButton)" stroke="#451a03" stroke-width="0.5" />
          <circle cx="44" cy="72" r="3.5" fill="url(#tortieButton)" stroke="#451a03" stroke-width="0.5" />
          <circle cx="44" cy="92" r="3.5" fill="url(#tortieButton)" stroke="#451a03" stroke-width="0.5" />
          <circle cx="76" cy="52" r="3.5" fill="url(#tortieButton)" stroke="#451a03" stroke-width="0.5" />
          <circle cx="76" cy="72" r="3.5" fill="url(#tortieButton)" stroke="#451a03" stroke-width="0.5" />
          <circle cx="76" cy="92" r="3.5" fill="url(#tortieButton)" stroke="#451a03" stroke-width="0.5" />
          <rect x="25" y="80" width="70" height="7.5" fill="#78350f" rx="1.5" />
          <rect x="54" y="77" width="12" height="13.5" fill="#fbbf24" stroke="#d97706" stroke-width="1" rx="1" />
          <rect x="57" y="81" width="6" height="5.5" fill="#451a03" />
          <path d="M 28,98 L 42,98 L 40,105 L 29,105 Z" fill="#78350f" />
          <path d="M 92,98 L 78,98 L 80,105 L 91,105 Z" fill="#78350f" />
        </svg>
      `;
    } else if (id === 'jeans') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="120" height="140">
          <defs>
            <linearGradient id="denimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#1d4ed8"/>
              <stop offset="50%" stop-color="#1e40af"/>
              <stop offset="100%" stop-color="#1e3a8a"/>
            </linearGradient>
            <radialGradient id="whisker" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <path d="M 25,18 L 95,18 L 91,28 L 29,28 Z" fill="#1e40af" stroke="#1d4ed8" stroke-width="0.5" />
          <circle cx="60" cy="23" r="3" fill="#f59e0b" stroke="#b45309" stroke-width="0.8" />
          <circle cx="60" cy="23" r="1" fill="#78350f" />
          <path d="M 29,28 L 91,28 L 95,58 L 25,58 Z" fill="url(#denimGrad)" />
          <path d="M 25,58 L 15,132 L 43,132 L 53,70 L 57,70 L 62,132 L 98,132 L 95,58 Z" fill="url(#denimGrad)" />
          <ellipse cx="38" cy="48" rx="10" ry="6" fill="url(#whisker)" />
          <ellipse cx="82" cy="48" rx="10" ry="6" fill="url(#whisker)" />
          <ellipse cx="32" cy="78" rx="8" ry="16" fill="url(#whisker)" />
          <ellipse cx="88" cy="78" rx="8" ry="16" fill="url(#whisker)" />
          <path d="M 32,28 C 40,40 48,28 48,28" fill="none" stroke="#d97706" stroke-width="1" stroke-dasharray="2,2.5" />
          <path d="M 88,28 C 80,40 72,28 72,28" fill="none" stroke="#d97706" stroke-width="1" stroke-dasharray="2,2.5" />
          <path d="M 56,28 L 56,48 C 56,53 64,53 64,48" fill="none" stroke="#d97706" stroke-width="1" stroke-dasharray="2,2" />
          <path d="M 25,58 L 12,132" fill="none" stroke="#1d4ed8" stroke-width="1.5" />
          <path d="M 95,58 L 98,132" fill="none" stroke="#1d4ed8" stroke-width="1.5" />
          <circle cx="30" cy="30" r="1.2" fill="#f59e0b" />
          <circle cx="90" cy="30" r="1.2" fill="#f59e0b" />
        </svg>
      `;
    }
    
    const encoded = encodeURIComponent(svgContent.trim());
    return `data:image/svg+xml;utf8,${encoded}`;
  };

  // Compile High-Resolution download file matching coordinate transforms
  const compileFinalCanvas = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!transparentResult) return reject("No cutout found");
      const subjectImg = new Image();
      subjectImg.src = transparentResult;
      subjectImg.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = subjectImg.width;
        canvas.height = subjectImg.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject("Canvas failure");

        // Clear or Solid background
        if (backdropType === 'transparent') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawSubjectOnCanvas(ctx, subjectImg, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/png'));
        } else if (backdropType === 'color') {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          drawSubjectOnCanvas(ctx, subjectImg, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/png'));
        } else if (backdropType === 'image') {
          const bgImg = new Image();
          bgImg.crossOrigin = "anonymous";
          bgImg.src = customBgImage || selectedBgImage;
          bgImg.onload = () => {
            const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
            const x = (canvas.width / 2) - (bgImg.width / 2) * scale;
            const y = (canvas.height / 2) - (bgImg.height / 2) * scale;
            ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);
            drawSubjectOnCanvas(ctx, subjectImg, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/png'));
          };
          bgImg.onerror = () => {
            ctx.fillStyle = '#F1F5F9';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawSubjectOnCanvas(ctx, subjectImg, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/png'));
          };
        }
      };
      subjectImg.onerror = reject;
    });
  };

  const drawSubjectOnCanvas = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) => {
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(isFlippedH ? -1 : 1, isFlippedV ? -1 : 1);
    ctx.translate((subjectX / 100) * w, (subjectY / 100) * h);
    ctx.rotate((subjectRotation * Math.PI) / 180);
    const sw = w * subjectScale;
    const sh = h * subjectScale;
    ctx.drawImage(img, -sw / 2, -sh / 2, sw, sh);
    ctx.restore();
  };

  const handleDownloadArtwork = async () => {
    try {
      setProcessing(true);
      const dataUrl = await compileFinalCanvas();
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `rakhi_internet_cutout_${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Error generating image.");
    } finally {
      setProcessing(false);
    }
  };

  // Perform Outfit change
  const processClothesChanger = async () => {
    if (!selectedImage) return;
    setProcessing(true);
    try {
      const img = new Image();
      img.src = selectedImage;
      await new Promise((resolve) => { img.onload = resolve; });
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        // Load clothing realistic photo
        const clothImg = new Image();
        clothImg.crossOrigin = 'anonymous';
        clothImg.src = getClothImage(selectedCloth.id);
        await new Promise((resolve, reject) => {
          clothImg.onload = resolve;
          clothImg.onerror = reject;
        });

        // Compute proportional size
        const baseSize = Math.min(canvas.width, canvas.height) * 0.55;
        const w = baseSize * clothScale;
        const h = baseSize * clothScale * clothStretch;

        ctx.save();
        ctx.translate((clothX / 100) * canvas.width, (clothY / 100) * canvas.height);
        ctx.rotate((clothRotation * Math.PI) / 180);
        
        if (clothFlipH) {
          ctx.scale(-1, 1);
        }

        // Apply visual adjustments to the fabric using Canvas filters
        try {
          ctx.filter = `brightness(${clothBrightness}%) contrast(${clothContrast}%) saturate(${clothSaturate}%) hue-rotate(${clothHue}deg)`;
        } catch (e) {
          console.warn("Canvas filter not supported:", e);
        }

        // Apply professional clothing shadow
        ctx.shadowColor = "rgba(0,0,0,0.35)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        ctx.drawImage(clothImg, -w / 2, -h / 2, w, h);
        ctx.restore();

        setResultImage(canvas.toDataURL('image/png', 1.0));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to merge clothing overlay.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col bg-slate-50/50">
      {/* Interactive Toolbar Header */}
      <div className="bg-white border-b border-slate-150 px-4 py-3 flex items-center justify-between gap-4 shadow-xs">
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => {
              setActiveTab('bg-remover');
              setSelectedImage(null);
              setResultImage(null);
              setTransparentResult(null);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'bg-remover' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-600'}`}
          >
            <Scissors className="w-3.5 h-3.5" /> Background Remover
          </button>
          <button
            onClick={() => {
              setActiveTab('clothes-changer');
              setSelectedImage(null);
              setResultImage(null);
              setTransparentResult(null);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'clothes-changer' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-600'}`}
          >
            <Shirt className="w-3.5 h-3.5" /> AI Outfit Changer
          </button>
        </div>
        
        {selectedImage && (
          <button
            onClick={() => {
              setSelectedImage(null);
              setResultImage(null);
              setTransparentResult(null);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-bold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" /> <span>Reset Image</span>
          </button>
        )}
      </div>

      <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          
          <div className="text-center mb-6">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${activeTab === 'bg-remover' ? 'bg-teal-50 text-teal-600' : 'bg-purple-50 text-purple-600'}`}>
              {activeTab === 'bg-remover' ? 'Professional Isolation Suite' : 'AI Fitting Suite'}
            </span>
            <h2 className="text-xl md:text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
              {activeTab === 'bg-remover' ? 'Smart Background Remover' : 'AI Clothes Changer'}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {activeTab === 'bg-remover' 
                ? 'Erase solid, complex, or studio backgrounds. Layer your cutout on color palettes or scenic views.' 
                : 'Select clothes template and place it on your photo with coordinate controls.'}
            </p>
          </div>

          {!selectedImage ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto bg-white rounded-2xl shadow-md border border-slate-200/60 p-5 text-center"
            >
              <div className="border-2 border-dashed border-slate-200 hover:border-slate-350 rounded-xl p-6 md:p-8 transition-all bg-slate-50/50 hover:bg-white group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${activeTab === 'bg-remover' ? 'bg-teal-50 text-teal-600' : 'bg-purple-50 text-purple-600'}`}>
                    <Upload className="w-5 h-5 animate-bounce" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 mb-0.5">Upload picture</h3>
                  <p className="text-[10px] text-slate-400 mb-4">Supports JPEG, PNG (Up to 5MB)</p>
                  <div className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs transition-transform active:scale-95 ${activeTab === 'bg-remover' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
                    Choose File
                  </div>
                </label>
              </div>
            </motion.div>
          ) : (
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
            >
              <div className="grid md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                
                {/* PREVIEW COMPONENT AREA */}
                <div className="md:col-span-7 p-4 md:p-6 bg-slate-50/50 flex flex-col gap-4 justify-center">
                  
                  {/* Mode Selector for Background Remover only */}
                  {activeTab === 'bg-remover' && (
                    <div className="flex bg-slate-200/70 p-1 rounded-xl w-fit mx-auto shadow-inner">
                      <button
                        type="button"
                        onClick={() => setActiveToolMode('composite')}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 ${activeToolMode === 'composite' ? 'bg-white text-teal-600 shadow-xs' : 'text-slate-600'}`}
                      >
                        <Move className="w-3.5 h-3.5" /> 🎨 Arrange Backdrop
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveToolMode('edit')}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 ${activeToolMode === 'edit' ? 'bg-white text-teal-600 shadow-xs' : 'text-slate-600'}`}
                      >
                        <Scissors className="w-3.5 h-3.5" /> ✂️ Cutout & Erase
                      </button>
                    </div>
                  )}

                  {/* DISPLAY PORT */}
                  <div className="w-full flex items-center justify-center">
                    
                    {/* Mode 1: ARRANGE COMPOSITION MODE */}
                    {activeTab === 'bg-remover' && activeToolMode === 'composite' && (
                      <div 
                        ref={previewContainerRef}
                        onMouseDown={handleSubjectDragStart}
                        onMouseMove={handleSubjectDragMove}
                        onMouseUp={handleSubjectDragEnd}
                        onMouseLeave={handleSubjectDragEnd}
                        onTouchStart={handleSubjectDragStart}
                        onTouchMove={handleSubjectDragMove}
                        onTouchEnd={handleSubjectDragEnd}
                        className={`w-full max-w-[400px] aspect-square relative overflow-hidden rounded-2xl border border-slate-200 select-none cursor-move shadow-inner ${backdropType === 'transparent' ? 'bg-[url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWNgYGAQIYAJwoz/4QUZKMAoGIWjYBSAAH97ASm6Z0EAAAAASUVORK5CYII=")] bg-repeat' : ''}`}
                        style={backdropType === 'color' ? { backgroundColor: bgColor } : {}}
                      >
                        {processing && progressPct !== null ? (
                          // RIGHT-TO-LEFT SCANNING SWEEP TRANSITION OVERLAY
                          <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWNgYGAQIYAJwoz/4QUZKMAoGIWjYBSAAH97ASm6Z0EAAAAASUVORK5CYII=')] bg-repeat flex items-center justify-center overflow-hidden">
                            {/* Original Image (revealed left-to-right as laser moves right-to-left) */}
                            <img 
                              src={selectedImage} 
                              alt="scanning original" 
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none animate-reveal-original" 
                            />
                            {/* Checkerboard/Silhouette (revealed right-to-left behind scanline) */}
                            <div className="absolute inset-0 bg-transparent flex items-center justify-center animate-reveal-transparent">
                              <img 
                                src={selectedImage} 
                                alt="scanning transparent" 
                                className="w-full h-full object-contain pointer-events-none opacity-20 filter grayscale blur-[1px]" 
                              />
                            </div>
                            {/* Sweeping Laser Line (Right to Left) */}
                            <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-teal-400 to-emerald-400 shadow-[0_0_12px_rgba(34,211,238,1),0_0_25px_rgba(20,184,166,0.8)] animate-scan-line" />
                          </div>
                        ) : (
                          <>
                            {/* Background Image Layer */}
                            {backdropType === 'image' && (
                              <img 
                                src={customBgImage || selectedBgImage} 
                                alt="background" 
                                className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
                              />
                            )}

                            {/* Drag-and-scale Subject Layer */}
                            {transparentResult && (
                              <img 
                                src={transparentResult} 
                                alt="Subject Cutout" 
                                className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-transform duration-75 origin-center"
                                style={{
                                  transform: `translate(${subjectX}%, ${subjectY}%) scale(${subjectScale}) rotate(${subjectRotation}deg) scaleX(${isFlippedH ? -1 : 1}) scaleY(${isFlippedV ? -1 : 1})`
                                }}
                              />
                            )}
                          </>
                        )}

                        {/* Simple floating drag helper */}
                        {!processing && (
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full text-[9px] font-bold text-white flex items-center gap-1 pointer-events-none">
                            <Move className="w-2.5 h-2.5" /> Drag photo to reposition
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mode 2: ERASING & CUTTING CANVAS MODE */}
                    {activeTab === 'bg-remover' && activeToolMode === 'edit' && (
                      <div className="flex flex-col items-center gap-3 w-full">
                        <div className="text-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            {editTool === 'magic' ? '🎯 Click a color to erase it' : '🖌️ Drag to erase details'}
                          </span>
                        </div>
                        
                        <div 
                          className="relative w-full max-w-[400px] border border-slate-200 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWNgYGAQIYAJwoz/4QUZKMAoGIWjYBSAAH97ASm6Z0EAAAAASUVORK5CYII=')] bg-repeat rounded-2xl overflow-hidden shadow-md"
                          style={{ aspectRatio: `${imgDimensions.width || 400} / ${imgDimensions.height || 400}` }}
                          onMouseMove={handleCanvasMouseMove}
                          onMouseLeave={handleCanvasMouseLeave}
                        >
                          <canvas
                            ref={canvasRef}
                            onMouseDown={handleStartDraw}
                            onMouseMove={handleMoveDraw}
                            onMouseUp={handleEndDraw}
                            onMouseLeave={handleEndDraw}
                            onTouchStart={handleStartDraw}
                            onTouchMove={handleMoveDraw}
                            onTouchEnd={handleEndDraw}
                            className="w-full h-full cursor-crosshair touch-none"
                          />

                          {/* Floating Brush Preview Tool */}
                          {brushPos && editTool === 'brush' && canvasRef.current && (
                            <div 
                              className="absolute rounded-full border-2 border-teal-500 bg-teal-500/15 pointer-events-none -translate-x-1/2 -translate-y-1/2 shadow-xs"
                              style={{
                                left: `${brushPos.x}px`,
                                top: `${brushPos.y}px`,
                                width: `${(brushSize * canvasRef.current.getBoundingClientRect().width) / canvasRef.current.width}px`,
                                height: `${(brushSize * canvasRef.current.getBoundingClientRect().width) / canvasRef.current.width}px`,
                              }}
                            />
                          )}

                          {/* Mode 2 Scan transition lock overlay */}
                          {processing && (
                            <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWNgYGAQIYAJwoz/4QUZKMAoGIWjYBSAAH97ASm6Z0EAAAAASUVORK5CYII=')] bg-repeat flex items-center justify-center overflow-hidden">
                              <img 
                                src={selectedImage} 
                                alt="scanning original" 
                                className="absolute inset-0 w-full h-full object-contain pointer-events-none animate-reveal-original" 
                              />
                              <div className="absolute inset-0 bg-transparent flex items-center justify-center animate-reveal-transparent">
                                <img 
                                  src={selectedImage} 
                                  alt="scanning transparent" 
                                  className="w-full h-full object-contain pointer-events-none opacity-20 filter grayscale blur-[1px]" 
                                />
                              </div>
                              <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-teal-400 to-emerald-400 shadow-[0_0_12px_rgba(34,211,238,1),0_0_25px_rgba(20,184,166,0.8)] animate-scan-line" />
                            </div>
                          )}
                        </div>

                        {/* Cutout Fast Action Undo Bar */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleUndo}
                            disabled={historyIndex <= 0}
                            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                            title="Undo Last Stroke"
                          >
                            <Undo className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleRedo}
                            disabled={historyIndex >= history.length - 1}
                            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                            title="Redo"
                          >
                            <Redo className="w-4 h-4" />
                          </button>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                            Steps: {historyIndex + 1}/{history.length}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Mode 3: OUTFIT CHANGER FRAME */}
                    {activeTab === 'clothes-changer' && (
                      <div className="flex flex-col items-center w-full">
                        <div 
                          ref={previewContainerRef}
                          onMouseDown={handleClothDragStart}
                          onMouseMove={handleClothDragMove}
                          onMouseUp={handleClothDragEnd}
                          onMouseLeave={handleClothDragEnd}
                          onTouchStart={handleClothDragStart}
                          onTouchMove={handleClothDragMove}
                          onTouchEnd={handleClothDragEnd}
                          className="w-full max-w-[400px] aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative flex items-center justify-center shadow-inner cursor-move select-none"
                        >
                          {resultImage ? (
                            <img src={resultImage} alt="Result" className="w-full h-full object-contain pointer-events-none" />
                          ) : (
                            <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
                              <img src={selectedImage} alt="Original" className="w-full h-full object-contain pointer-events-none" />
                              {!processing && !isolatingClothId && (
                                <div 
                                  className="absolute select-none pointer-events-none"
                                  style={{ 
                                    left: `${clothX}%`, 
                                    top: `${clothY}%`, 
                                    width: `${25 * clothScale}%`,
                                    height: `${30 * clothScale * clothStretch}%`,
                                    transform: `translate(-50%, -50%) rotate(${clothRotation}deg) scaleX(${clothFlipH ? -1 : 1})`,
                                    filter: `drop-shadow(0px 8px 16px rgba(0,0,0,0.35)) brightness(${clothBrightness}%) contrast(${clothContrast}%) saturate(${clothSaturate}%) hue-rotate(${clothHue}deg)`
                                  }}
                                >
                                  <img 
                                    src={getClothImage(selectedCloth.id)} 
                                    alt="clothing item"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          {isolatingClothId === selectedCloth.id && (
                            <div className="absolute inset-0 bg-purple-900/40 backdrop-blur-xs flex flex-col items-center justify-center p-4 z-10">
                              <RefreshCw className="w-8 h-8 text-white animate-spin mb-2" />
                              <span className="text-xs font-black text-white uppercase tracking-wider drop-shadow-sm">AI Fabric Isolation...</span>
                              <span className="text-[10px] text-purple-200 text-center mt-1">Preparing ultra-realistic garment texture</span>
                            </div>
                          )}

                          {processing && !isolatingClothId && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 z-10">
                              <Sparkles className="w-7 h-7 text-purple-600 animate-spin mb-1.5" />
                              <span className="text-xs font-bold text-purple-800">Dressing Model...</span>
                            </div>
                          )}

                          {detectingBody && (
                            <div className="absolute inset-0 bg-indigo-950/50 backdrop-blur-xs flex flex-col items-center justify-center p-4 z-10">
                              <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mb-2" />
                              <span className="text-xs font-black text-white uppercase tracking-wider drop-shadow-sm">AI Body Auto-Fitting...</span>
                              <span className="text-[10px] text-indigo-200 text-center mt-1">Analyzing person's pose and frame for perfect fit</span>
                            </div>
                          )}

                          {!resultImage && !isolatingClothId && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full text-[9px] font-bold text-white flex items-center gap-1 pointer-events-none">
                              <Move className="w-2.5 h-2.5" /> Drag outfit to position
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Processing Status Dialog */}
                  {processing && progressPct !== null && (
                    <div className="bg-teal-50 border border-teal-100 p-3 rounded-xl max-w-sm mx-auto w-full">
                      <span className="text-[10px] font-bold text-teal-800 block text-center uppercase tracking-wide leading-none">{progressStatus}</span>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-teal-600 h-full rounded-full transition-all duration-100" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                  )}

                </div>

                {/* EDITING CONTROL SIDE BAR */}
                <div className="md:col-span-5 p-5 flex flex-col justify-between bg-white">
                  
                  <div className="space-y-4">
                    
                    {/* STEP-BY-STEP GUIDED WIZARD PANELS */}
                    {activeTab === 'bg-remover' && (
                      <div className="mb-4">
                        {transparentResult === selectedImage ? (
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 p-4 rounded-2xl shadow-xs space-y-3">
                            <div className="flex items-start gap-2.5">
                              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold shrink-0">
                                1
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xs font-black text-amber-950">
                                  Next Step: Remove Background
                                </h4>
                                <p className="text-[10px] text-amber-800/90 mt-0.5 leading-relaxed">
                                  अभी फोटो का बैकग्राउंड नहीं हटा है। ऑटोमैटिक एआई बैकग्राउंड हटाने या ट्रांसपेरेंट कटआउट के लिए नीचे बटन पर क्लिक करें।
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={runAutoAIBackgroundRemoval}
                              disabled={processing}
                              className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[11px] font-black rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-white animate-bounce" />
                              {processing ? "Processing AI Cutout..." : "Auto AI Background Remover (शुरू करें)"}
                            </button>
                            <div className="text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveToolMode('edit');
                                  setEditTool('magic');
                                }}
                                className="text-[10px] font-bold text-amber-700 hover:underline inline-flex items-center gap-1"
                              >
                                🎯 Or use Magic Eraser / Manual Brush directly
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200/80 p-4 rounded-2xl shadow-xs space-y-3">
                            <div className="flex items-start gap-2.5">
                              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-bold shrink-0">
                                2
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xs font-black text-teal-950 flex items-center gap-1.5">
                                  Success! Background Removed 🎉
                                </h4>
                                <p className="text-[10px] text-teal-800/90 mt-0.5 leading-relaxed">
                                  बैकग्राउंड सफलतापूर्वक हट गया है! अब आप अपनी पसंद का बैकग्राउंड कलर या सीन चुनकर अपनी फोटो डाउनलोड करें।
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setBackdropType('transparent');
                                  setTimeout(() => handleDownloadArtwork(), 50);
                                }}
                                disabled={processing}
                                className="py-2 px-2.5 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-extrabold rounded-lg shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Download className="w-3 h-3" /> Get Transparent PNG
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (backdropType === 'transparent') {
                                    setBackdropType('color');
                                  }
                                  setTimeout(() => handleDownloadArtwork(), 50);
                                }}
                                disabled={processing}
                                className="py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold rounded-lg shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Download className="w-3 h-3" /> Download with BG
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'clothes-changer' && (
                      <div className="mb-4">
                        {!resultImage ? (
                          <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-200/80 p-4 rounded-2xl shadow-xs space-y-3">
                            <div className="flex items-start gap-2.5">
                              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs font-bold shrink-0">
                                1
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xs font-black text-purple-950">
                                  Next Step: Fit and Merge Outfit
                                </h4>
                                <p className="text-[10px] text-purple-800/90 mt-0.5 leading-relaxed">
                                  कपड़ों को अपनी फोटो पर ड्रैग और स्केल करके सेट करें, फिर नीचे दिए बटन से फाइनल फोटो में कपड़े मर्ज करें।
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={processClothesChanger}
                              disabled={processing}
                              className="w-full py-2.5 px-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white text-[11px] font-black rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                              {processing ? "Merging Outfit..." : "Merge Outfit Costume (पहनें और जोड़े)"}
                            </button>
                          </div>
                        ) : (
                          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200/80 p-4 rounded-2xl shadow-xs space-y-3">
                            <div className="flex items-start gap-2.5">
                              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold shrink-0">
                                2
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xs font-black text-indigo-950">
                                  Outfit Merged Successfully! 🎉
                                </h4>
                                <p className="text-[10px] text-indigo-800/90 mt-0.5 leading-relaxed">
                                  पहनावा जुड़ चूका है! फाइनल फोटो को अपनी गैलरी में सेव करने के लिए डाउनलोड करें।
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = resultImage;
                                  link.download = `rakhi_outfit_merged_${Date.now()}.png`;
                                  link.click();
                                }}
                                className="flex-1 py-2.5 px-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-[11px] font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" /> Download Fitting Photo
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setResultImage(null);
                                }}
                                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-xl transition-all cursor-pointer"
                              >
                                🔄 Re-adjust
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* SUB-SECTION 1: BACKDROP CONFIGS (Arrange Backdrop mode) */}
                    {activeTab === 'bg-remover' && activeToolMode === 'composite' && (
                      <div className="space-y-4">
                        
                        {/* 1. Placement Transformations */}
                        <div className="space-y-2 bg-slate-50/50 p-3 rounded-xl border border-slate-150">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wide flex items-center gap-1">
                            <Sliders className="w-3.5 h-3.5 text-slate-400" /> Size & Orientation
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setIsFlippedH(!isFlippedH)}
                              className={`flex items-center justify-center gap-1.5 py-1 px-2 border rounded-lg text-[10px] font-bold transition-all ${isFlippedH ? 'bg-teal-50 border-teal-500 text-teal-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                              <FlipHorizontal className="w-3.5 h-3.5" /> Flip Horiz.
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsFlippedV(!isFlippedV)}
                              className={`flex items-center justify-center gap-1.5 py-1 px-2 border rounded-lg text-[10px] font-bold transition-all ${isFlippedV ? 'bg-teal-50 border-teal-500 text-teal-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                              <FlipVertical className="w-3.5 h-3.5" /> Flip Vert.
                            </button>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <div>
                              <div className="flex justify-between text-[9px] font-extrabold text-slate-400">
                                <span>Subject Scale</span>
                                <span>{Math.round(subjectScale * 100)}%</span>
                              </div>
                              <input 
                                type="range" 
                                min="0.2" 
                                max="2.5" 
                                step="0.05" 
                                value={subjectScale} 
                                onChange={(e) => setSubjectScale(Number(e.target.value))}
                                className="w-full accent-teal-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-[9px] font-extrabold text-slate-400">
                                <span>Rotate Degree</span>
                                <span>{subjectRotation}°</span>
                              </div>
                              <input 
                                type="range" 
                                min="-180" 
                                max="180" 
                                value={subjectRotation} 
                                onChange={(e) => setSubjectRotation(Number(e.target.value))}
                                className="w-full accent-teal-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 2. Backdrop Mode Picker */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Backdrop Background:</span>
                          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                            <button
                              type="button"
                              onClick={() => setBackdropType('transparent')}
                              className={`py-1 text-[10px] font-bold rounded-lg transition-all ${backdropType === 'transparent' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600'}`}
                            >
                              Transparent
                            </button>
                            <button
                              type="button"
                              onClick={() => setBackdropType('color')}
                              className={`py-1 text-[10px] font-bold rounded-lg transition-all ${backdropType === 'color' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600'}`}
                            >
                              Solid Color
                            </button>
                            <button
                              type="button"
                              onClick={() => setBackdropType('image')}
                              className={`py-1 text-[10px] font-bold rounded-lg transition-all ${backdropType === 'image' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600'}`}
                            >
                              Scenic BG
                            </button>
                          </div>
                        </div>

                        {/* Backdrop options panels */}
                        {backdropType === 'transparent' && (
                          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                            <CheckCircle className="w-5 h-5 text-teal-500 mx-auto mb-1" />
                            <span className="text-[11px] font-bold text-slate-700 block">Transparent Isolated PNG</span>
                            <span className="text-[9px] text-slate-400 mt-0.5 block leading-tight">No backdrop. Perfect for official identity files, templates, or e-commerce products.</span>
                          </div>
                        )}

                        {backdropType === 'color' && (
                          <div className="space-y-2.5">
                            <div className="grid grid-cols-5 gap-1.5">
                              {PRESET_BG_COLORS.map(c => (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => {
                                    setBgColor(c.value);
                                    setShowCustomPicker(false);
                                  }}
                                  className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center relative ${bgColor === c.value ? 'border-teal-600 scale-105 shadow-sm ring-2 ring-teal-100' : 'border-slate-200 hover:scale-105'}`}
                                  style={{ backgroundColor: c.value }}
                                  title={c.name}
                                >
                                  {bgColor === c.value && <Check className="w-3 h-3 text-white mix-blend-difference" />}
                                </button>
                              ))}
                            </div>

                            <div className="pt-1.5 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={() => setShowCustomPicker(!showCustomPicker)}
                                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                              >
                                <span className="flex items-center gap-1">
                                  <Palette className="w-3.5 h-3.5 text-slate-400" /> Custom Palette Color
                                </span>
                                <div className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: bgColor }} />
                              </button>

                              {showCustomPicker && (
                                <div className="mt-2 p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                                  <input 
                                    type="color" 
                                    value={bgColor} 
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                                  />
                                  <div className="flex-1">
                                    <span className="text-[8px] font-black text-slate-400 block uppercase leading-none">HEX CODE</span>
                                    <span className="text-xs font-mono font-bold text-slate-700 uppercase leading-none">{bgColor}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {backdropType === 'image' && (
                          <div className="space-y-2">
                            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Scenic Presets:</span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {PRESET_BG_IMAGES.map(img => {
                                const isSelected = selectedBgImage === img.url && !customBgImage;
                                return (
                                  <button
                                    key={img.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedBgImage(img.url);
                                      setCustomBgImage(null);
                                    }}
                                    className={`group relative h-11 rounded-xl overflow-hidden border-2 transition-all text-left flex items-end p-1 ${isSelected ? 'border-teal-600 ring-2 ring-teal-100' : 'border-slate-200 hover:border-slate-350'}`}
                                  >
                                    <img src={img.url} alt={img.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    <div className="absolute inset-0 bg-black/40" />
                                    <span className="relative z-10 text-[9px] font-black text-white leading-none truncate w-full">{img.name}</span>
                                    {isSelected && (
                                      <div className="absolute top-1 right-1 bg-teal-600 text-white rounded-full p-0.5">
                                        <Check className="w-2.5 h-2.5" />
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                              <input 
                                type="file" 
                                accept="image/*" 
                                id="bg-image-upload" 
                                onChange={handleCustomBgUpload} 
                                className="hidden" 
                              />
                              <label 
                                htmlFor="bg-image-upload" 
                                className={`flex items-center justify-center gap-1.5 w-full py-2 border rounded-lg text-xs font-bold cursor-pointer transition-all ${customBgImage ? 'border-teal-500 bg-teal-50 text-teal-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                              >
                                <ImagePlus className="w-3.5 h-3.5" />
                                {customBgImage ? "Scenic backdrop Loaded" : "Upload Custom Photo Backdrop"}
                              </label>
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                    {/* SUB-SECTION 2: CUTOUT & ERASING WORKSPACE */}
                    {activeTab === 'bg-remover' && activeToolMode === 'edit' && (
                      <div className="space-y-4">
                        
                        {/* 1. Cutout Tool Selector */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide block">Cutout Eraser Tools:</span>
                          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                            <button
                              type="button"
                              onClick={runAutoAIBackgroundRemoval}
                              className="py-1.5 text-[9px] font-extrabold rounded-lg transition-all flex items-center justify-center gap-1 bg-white hover:bg-slate-50 text-teal-700 shadow-xs cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3 text-teal-500" /> AI Auto
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditTool('magic')}
                              className={`py-1.5 text-[9px] font-extrabold rounded-lg transition-all flex items-center justify-center gap-1 ${editTool === 'magic' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600'}`}
                            >
                              🎯 Magic Color
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditTool('brush')}
                              className={`py-1.5 text-[9px] font-extrabold rounded-lg transition-all flex items-center justify-center gap-1 ${editTool === 'brush' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600'}`}
                            >
                              🖌️ Brush Erase
                            </button>
                          </div>
                        </div>

                        {/* Tool Sliders */}
                        {editTool === 'magic' && (
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-2">
                            <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                              <span>Color Tolerance</span>
                              <span>{tolerance}</span>
                            </div>
                            <input 
                              type="range" 
                              min="5" 
                              max="120" 
                              value={tolerance} 
                              onChange={(e) => setTolerance(Number(e.target.value))}
                              className="w-full accent-teal-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-[9px] text-slate-400 leading-tight leading-relaxed">
                              Increase tolerance to erase wider ranges of similar colors. Tap on any solid area to make it transparent instantly!
                            </p>
                          </div>
                        )}

                        {editTool === 'brush' && (
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-3">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                                <span>Brush Thickness</span>
                                <span>{brushSize}px</span>
                              </div>
                              <input 
                                type="range" 
                                min="5" 
                                max="100" 
                                value={brushSize} 
                                onChange={(e) => setBrushSize(Number(e.target.value))}
                                className="w-full accent-teal-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>

                            <div className="space-y-1">
                              <span className="text-[9px] font-black text-slate-400 block uppercase">Brush Action Mode:</span>
                              <div className="grid grid-cols-2 gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setBrushMode('erase')}
                                  className={`py-1 px-2.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${brushMode === 'erase' ? 'bg-rose-50 border-rose-300 text-rose-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                  <Eraser className="w-3.5 h-3.5" /> Erase Pixels
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setBrushMode('restore')}
                                  className={`py-1 px-2.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${brushMode === 'restore' ? 'bg-teal-50 border-teal-300 text-teal-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                  <RefreshCw className="w-3.5 h-3.5" /> Restore Detail
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Save cutout callout */}
                        <div className="bg-slate-100 p-2.5 rounded-lg text-center">
                          <p className="text-[10px] font-semibold text-slate-600">Once cutout looks clean, click Arrange Backdrop below to place subject!</p>
                        </div>

                      </div>
                    )}

                    {/* SUB-SECTION 3: CLOTHES CHANGER */}
                    {activeTab === 'clothes-changer' && (
                      <div className="space-y-4">
                        
                        {/* 1. Clothes List */}
                        <div>
                          <span className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 tracking-wider">1. Select Outfit Type:</span>
                          <div className="grid grid-cols-3 gap-1.5">
                            {[...CLOTHES_OPTIONS, ...customClothes].map(c => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => {
                                  setSelectedCloth(c);
                                  setResultImage(null);
                                }}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer group ${selectedCloth.id === c.id ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold shadow-xs' : 'border-slate-250 bg-white text-slate-600 hover:border-purple-250 hover:bg-purple-50/20'}`}
                              >
                                <div className="w-12 h-12 flex items-center justify-center rounded-lg overflow-hidden bg-slate-50 border border-slate-100 p-0.5">
                                  <img 
                                    src={c.url} 
                                    alt={c.name} 
                                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" 
                                  />
                                </div>
                                <span className="text-[8px] uppercase tracking-wide truncate w-full text-center leading-none mt-1.5 font-medium">{c.name}</span>
                              </button>
                            ))}
                            
                            {/* Upload Custom Outfit Button */}
                            <button
                              type="button"
                              onClick={() => customClothInputRef.current?.click()}
                              className="flex flex-col items-center justify-center p-2 rounded-xl border border-dashed border-purple-300 bg-purple-50/30 text-purple-600 hover:border-purple-400 hover:bg-purple-50/60 transition-all cursor-pointer group"
                            >
                              <div className="w-12 h-12 flex flex-col items-center justify-center rounded-lg bg-white border border-slate-150 text-purple-500 group-hover:text-purple-600">
                                <ImagePlus className="w-5 h-5 animate-pulse" />
                              </div>
                              <span className="text-[8px] uppercase tracking-wide truncate w-full text-center leading-none mt-1.5 font-semibold">Custom Outfit</span>
                            </button>
                          </div>
                          
                          <input 
                            ref={customClothInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleCustomClothUpload}
                            className="hidden"
                          />
                        </div>

                        {/* 2. Position Controllers */}
                        {!resultImage && (
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-3">
                            <span className="text-[10px] font-black text-slate-500 uppercase block leading-none border-b border-slate-150 pb-1.5">2. Precision Fitting:</span>
                            
                            {/* Stretch & Scale row */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <div className="flex justify-between text-[9px] font-extrabold text-slate-400">
                                  <span>Outfit Size</span>
                                  <span>{Math.round(clothScale * 100)}%</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="0.4" 
                                  max="2.5" 
                                  step="0.05" 
                                  value={clothScale} 
                                  onChange={(e) => setClothScale(Number(e.target.value))}
                                  className="w-full accent-purple-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>

                              <div>
                                <div className="flex justify-between text-[9px] font-extrabold text-slate-400">
                                  <span>Aspect Stretch</span>
                                  <span>{Math.round(clothStretch * 100)}%</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="0.5" 
                                  max="2.0" 
                                  step="0.05" 
                                  value={clothStretch} 
                                  onChange={(e) => setClothStretch(Number(e.target.value))}
                                  className="w-full accent-purple-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                            </div>

                            {/* Position Fit (X, Y) row */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <div className="flex justify-between text-[9px] font-extrabold text-slate-400">
                                  <span>Horizontal Fit (X)</span>
                                  <span>{clothX}%</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  value={clothX} 
                                  onChange={(e) => setClothX(Number(e.target.value))}
                                  className="w-full accent-purple-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>

                              <div>
                                <div className="flex justify-between text-[9px] font-extrabold text-slate-400">
                                  <span>Vertical Fit (Y)</span>
                                  <span>{clothY}%</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  value={clothY} 
                                  onChange={(e) => setClothY(Number(e.target.value))}
                                  className="w-full accent-purple-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                            </div>

                            {/* Angle and Flip row */}
                            <div className="grid grid-cols-2 gap-2 items-center">
                              <div>
                                <div className="flex justify-between text-[9px] font-extrabold text-slate-400">
                                  <span>Tilt Angle</span>
                                  <span>{clothRotation}°</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="-180" 
                                  max="180" 
                                  step="1" 
                                  value={clothRotation} 
                                  onChange={(e) => setClothRotation(Number(e.target.value))}
                                  className="w-full accent-purple-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>

                              <div className="flex flex-col justify-end pt-1">
                                <button
                                  type="button"
                                  onClick={() => setClothFlipH(!clothFlipH)}
                                  className={`w-full py-1 px-2 border rounded-lg text-[9px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${clothFlipH ? 'bg-purple-50 text-purple-700 border-purple-400 font-black' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                >
                                  <FlipHorizontal className="w-3.5 h-3.5" /> Flip Horizontal
                                </button>
                              </div>
                            </div>

                            <span className="text-[10px] font-black text-slate-500 uppercase block leading-none border-b border-slate-150 pb-1.5 pt-1">3. Color & Lighting Fit:</span>

                            {/* Brightness & Contrast Fit row */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <div className="flex justify-between text-[9px] font-extrabold text-slate-400">
                                  <span>Brightness Fit</span>
                                  <span>{clothBrightness}%</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="50" 
                                  max="150" 
                                  value={clothBrightness} 
                                  onChange={(e) => setClothBrightness(Number(e.target.value))}
                                  className="w-full accent-purple-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>

                              <div>
                                <div className="flex justify-between text-[9px] font-extrabold text-slate-400">
                                  <span>Contrast Fit</span>
                                  <span>{clothContrast}%</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="50" 
                                  max="150" 
                                  value={clothContrast} 
                                  onChange={(e) => setClothContrast(Number(e.target.value))}
                                  className="w-full accent-purple-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                            </div>

                            {/* Saturation and Color Tint row */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <div className="flex justify-between text-[9px] font-extrabold text-slate-400">
                                  <span>Saturate Fit</span>
                                  <span>{clothSaturate}%</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="50" 
                                  max="150" 
                                  value={clothSaturate} 
                                  onChange={(e) => setClothSaturate(Number(e.target.value))}
                                  className="w-full accent-purple-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>

                              <div>
                                <div className="flex justify-between text-[9px] font-extrabold text-slate-400">
                                  <span>Fabric Color Tint</span>
                                  <span>{clothHue}°</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="360" 
                                  value={clothHue} 
                                  onChange={(e) => setClothHue(Number(e.target.value))}
                                  className="w-full accent-purple-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                            </div>

                          </div>
                        )}

                      </div>
                    )}

                  </div>

                  {/* BOTTOM ACTION BUTTONS */}
                  <div className="mt-6 space-y-2">
                    
                    {/* Arrange and placement buttons */}
                    {activeTab === 'bg-remover' && (
                      <div className="space-y-2">
                        {activeToolMode === 'edit' ? (
                          <button
                            type="button"
                            onClick={() => setActiveToolMode('composite')}
                            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs active:scale-98 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Move className="w-4 h-4" /> Save Cutout & Place
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleDownloadArtwork}
                            className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Download className="w-4 h-4" /> Download Artwork File
                          </button>
                        )}
                      </div>
                    )}

                    {activeTab === 'clothes-changer' && (
                      <div className="space-y-1.5">
                        {!resultImage ? (
                          <button
                            type="button"
                            onClick={processClothesChanger}
                            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs active:scale-98 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4" /> Merge Outfit Costume
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = resultImage;
                              link.download = `rakhi_outfit_merged_${Date.now()}.png`;
                              link.click();
                            }}
                            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Download className="w-4 h-4" /> Download Fitting Photo
                          </button>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setResultImage(null);
                        setTransparentResult(null);
                        setHistory([]);
                        setHistoryIndex(-1);
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Use Another Image
                    </button>

                  </div>

                </div>

              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PhotoTools;
