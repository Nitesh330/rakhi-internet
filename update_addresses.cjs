const fs = require('fs');

const filesToUpdate = ['src/App.tsx', 'src/components/ContactModal.tsx', 'src/components/CscPortal.tsx'];

for (const file of filesToUpdate) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Jind
  content = content.replace(/Opposite Civil Hospital, Jind/g, "Bhiwani Road jind bypass");
  content = content.replace(/OPPOSITE CIVIL HOSPITAL/g, "BHIWANI ROAD JIND BYPASS");
  content = content.replace(/Civil\+Hospital\+Jind/g, "Bhiwani+Road+jind+bypass");

  // Narnaund
  content = content.replace(/Main Bazar, Near Bus Stand, Narnaund/g, "near by old bus stand narnaund");
  content = content.replace(/MAIN BAZAR, NEAR BUS STAND/g, "NEAR BY OLD BUS STAND NARNAUND");
  content = content.replace(/Old\+Bus\+Stand\+Narnaund/g, "near+by+old+bus+stand+narnaund");

  // Uchana
  content = content.replace(/Railway Station Road, Uchana/g, "main market railway road uchana");
  content = content.replace(/RAILWAY STATION ROAD/g, "MAIN MARKET RAILWAY ROAD UCHANA");
  content = content.replace(/Railway\+Station\+Uchana\+Haryana/g, "main+market+railway+road+uchana");

  fs.writeFileSync(file, content);
}
