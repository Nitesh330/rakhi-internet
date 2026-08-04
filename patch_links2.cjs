const fs = require('fs');
let content = fs.readFileSync('src/components/UniversityPortal.tsx', 'utf8');

// For the first officialUrl (DHE Haryana)
let parts = content.split("officialUrl: 'https://highereduhry.ac.in/'");
if(parts.length === 3) {
   content = parts[0] + "officialUrl: 'https://admissions.highereduhry.ac.in/'" + parts[1] + "officialUrl: 'https://admissions.highereduhry.ac.in/'" + parts[2];
}

fs.writeFileSync('src/components/UniversityPortal.tsx', content);
