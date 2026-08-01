const fs = require('fs');
const content = fs.readFileSync('src/components/ImageResizer.tsx', 'utf8');
console.log(content.split('const compressToTargetSize')[1].substring(0, 3000));
