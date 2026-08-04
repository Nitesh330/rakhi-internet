const fs = require('fs');

// 1. Update src/App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(
  '{ name: "Jind", map: "https://maps.google.com/?q=Civil+Hospital+Jind" }',
  '{ name: "Jind", map: "https://maps.google.com/?q=Bhiwani+Bypass,+main+chowk,+Jind,+Haryana+126102" }'
);
app = app.replace(
  '{ name: "Narnaund", map: "https://maps.google.com/?q=Old+Bus+Stand+Narnaund" }',
  '{ name: "Narnaund", map: "https://maps.google.com/?q=Bus+Stand,+Front+of+Police+Station,+Old,+Narnaund,+Haryana+125039" }'
);
fs.writeFileSync('src/App.tsx', app);

// 2. Update src/components/ContactModal.tsx
let contactModal = fs.readFileSync('src/components/ContactModal.tsx', 'utf8');
contactModal = contactModal.replace(
  "mapLink: 'https://maps.google.com/?q=Civil+Hospital+Jind'",
  "mapLink: 'https://maps.google.com/?q=Bhiwani+Bypass,+main+chowk,+Jind,+Haryana+126102'"
);
contactModal = contactModal.replace(
  "mapLink: 'https://maps.google.com/?q=Old+Bus+Stand+Narnaund'",
  "mapLink: 'https://maps.google.com/?q=Bus+Stand,+Front+of+Police+Station,+Old,+Narnaund,+Haryana+125039'"
);
// Also update the address text for Narnaund just in case, as requested "narnaund walli branch me ... ye walla address"
contactModal = contactModal.replace(
  "address: 'near by old bus stand narnaund'",
  "address: 'Bus Stand, Front of Police Station, Old, Narnaund, Haryana 125039'"
);

fs.writeFileSync('src/components/ContactModal.tsx', contactModal);

// 3. Update CscPortal.tsx address for Narnaund
let cscPortal = fs.readFileSync('src/components/CscPortal.tsx', 'utf8');
cscPortal = cscPortal.replace(
  "<span>near by old bus stand narnaund</span>",
  "<span>Bus Stand, Front of Police Station, Old, Narnaund, Haryana 125039</span>"
);
fs.writeFileSync('src/components/CscPortal.tsx', cscPortal);

console.log("Updated map links and Narnaund address");
