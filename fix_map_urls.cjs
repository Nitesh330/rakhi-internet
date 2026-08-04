const fs = require('fs');

const filesToUpdate = ['src/App.tsx', 'src/components/ContactModal.tsx', 'src/components/CscPortal.tsx'];

for (const file of filesToUpdate) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Jind URLs
  content = content.replace(/https:\/\/maps\.google\.com\/\?q=Bhiwani\+Road\+jind\+bypass/g, "https://maps.google.com/?q=Bhiwani+Bypass,+main+chowk,+Jind,+Haryana+126102");
  content = content.replace(/https:\/\/maps\.google\.com\/\?q=Civil\+Hospital\+Jind/g, "https://maps.google.com/?q=Bhiwani+Bypass,+main+chowk,+Jind,+Haryana+126102");

  // Narnaund URLs
  content = content.replace(/https:\/\/maps\.google\.com\/\?q=near\+by\+old\+bus\+stand\+narnaund/g, "https://maps.google.com/?q=Bus+Stand,+Front+of+Police+Station,+Old,+Narnaund,+Haryana+125039");
  content = content.replace(/https:\/\/maps\.google\.com\/\?q=Old\+Bus\+Stand\+Narnaund/g, "https://maps.google.com/?q=Bus+Stand,+Front+of+Police+Station,+Old,+Narnaund,+Haryana+125039");

  fs.writeFileSync(file, content);
}

console.log("Fixed map URLs in all files");
