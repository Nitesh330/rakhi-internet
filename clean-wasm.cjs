const fs = require('fs');
const path = require('path');
const distAssets = path.join(__dirname, 'dist', 'assets');
if (fs.existsSync(distAssets)) {
  const files = fs.readdirSync(distAssets);
  for (const file of files) {
    if (file.endsWith('.wasm')) {
      fs.unlinkSync(path.join(distAssets, file));
      console.log('Deleted', file);
    }
  }
}
