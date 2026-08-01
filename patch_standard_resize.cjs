const fs = require('fs');
let content = fs.readFileSync('src/components/ImageResizer.tsx', 'utf8');

content = content.replace(
  /ctx\?\.drawImage\(img, 0, 0, targetWidth, targetHeight\);/,
  `if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
            }`
);

fs.writeFileSync('src/components/ImageResizer.tsx', content);
