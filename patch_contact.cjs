const fs = require('fs');
let content = fs.readFileSync('src/components/ContactModal.tsx', 'utf8');

content = content.replace(
  /https:\/\/maps\.google\.com\/\?q=Govt\+College\+Jind\+Haryana/g,
  'https://maps.google.com/?q=Bhiwani+Road+Bypass+Jind'
);

fs.writeFileSync('src/components/ContactModal.tsx', content);
