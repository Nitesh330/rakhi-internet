const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/https:\/\/ignouadmission\.samarth\.edu\.in\//g, "https://www.ignou.ac.in/");

fs.writeFileSync('src/App.tsx', content);
