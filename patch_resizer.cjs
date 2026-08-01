const fs = require('fs');
let content = fs.readFileSync('src/components/ImageResizer.tsx', 'utf8');

const newCompressFunc = `const compressToTargetSize = async (imgUrl: string, targetKBSize: number, width: number, height: number): Promise<{dataUrl: string, size: number}> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      const img = new Image();
      img.onload = () => {
        let targetBytes = targetKBSize * 1024;
        let bestDataUrl = "";
        let bestSizeDiff = Infinity;
        let bestSize = 0;
        
        // Strategy: Keep quality high (0.8) to prevent visual degradation.
        // Instead of dropping quality, we will scale down dimensions if needed.
        let minScale = 0.1;
        let maxScale = 1.0;
        let currentScale = 1.0;
        
        // We use image/webp for better compression at same quality, or fallback to high-quality jpeg
        const mimeType = "image/jpeg";
        const quality = 0.8; 

        // Binary search for the best scale that fits the target size
        for (let i = 0; i < 10; i++) {
          let testWidth = Math.max(1, Math.round(width * currentScale));
          let testHeight = Math.max(1, Math.round(height * currentScale));
          
          canvas.width = testWidth;
          canvas.height = testHeight;
          
          // Use high-quality smoothing
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.clearRect(0, 0, testWidth, testHeight);
            ctx.drawImage(img, 0, 0, testWidth, testHeight);
          }
          
          let dataUrl = canvas.toDataURL(mimeType, quality);
          let base64str = dataUrl.split(',')[1];
          let decodedLen = atob(base64str).length;
          
          let diff = Math.abs(decodedLen - targetBytes);
          if (diff < bestSizeDiff || decodedLen <= targetBytes) {
            // Keep the one closest to target, or the largest one that is under target
            bestSizeDiff = diff;
            bestDataUrl = dataUrl;
            bestSize = decodedLen;
          }
          
          if (decodedLen > targetBytes) {
            maxScale = currentScale; // File too big, shrink dimensions
          } else {
            minScale = currentScale; // File smaller than target, can afford larger dimensions
          }
          currentScale = (minScale + maxScale) / 2;
        }
        
        resolve({ dataUrl: bestDataUrl, size: bestSize });
      };
      img.src = imgUrl;
    });
  };`;

content = content.replace(/const compressToTargetSize = async.*?img\.src = imgUrl;\n    \}\);\n  \};/s, newCompressFunc);

fs.writeFileSync('src/components/ImageResizer.tsx', content);
