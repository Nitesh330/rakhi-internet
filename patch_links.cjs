const fs = require('fs');
let content = fs.readFileSync('src/components/UniversityPortal.tsx', 'utf8');

// Replace admissionUrl with website URL
content = content.replace(/website:\s*'([^']+)',\s*admissionUrl:\s*'[^']+'/g, "website: '$1',\n    admissionUrl: '$1'");

// Replace Samarth with something more official looking if needed, but let's see.
content = content.replace(/officialUrl:\s*'https:\/\/crsuadmission\.samarth\.edu\.in\/'/g, "officialUrl: 'https://admissions.highereduhry.ac.in/'");

// DHE Haryana
content = content.replace(/officialUrl:\s*'https:\/\/admissions\.highereduhry\.ac\.in\/'/g, "officialUrl: 'https://highereduhry.ac.in/'");

// Replace chassis.co.in
content = content.replace(/https:\/\/cblu\.chassis\.co\.in\//g, "https://cblu.ac.in/");
content = content.replace(/https:\/\/igu\.chassis\.co\.in\//g, "https://igu.ac.in/");

fs.writeFileSync('src/components/UniversityPortal.tsx', content);
