const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /<button\s+onClick=\{\(\) => openContactModal\("", "jind"\)\}/g,
  '<button onClick={() => window.open("https://maps.google.com/?q=Govt+College+Jind+Haryana", "_blank")}'
);

content = content.replace(
  /<button\s+onClick=\{\(\) => openContactModal\("", "narnaund"\)\}/g,
  '<button onClick={() => window.open("https://maps.google.com/?q=Old+Bus+Stand+Narnaund", "_blank")}'
);

content = content.replace(
  /<button\s+onClick=\{\(\) => openContactModal\("", "uchana"\)\}/g,
  '<button onClick={() => window.open("https://maps.google.com/?q=Railway+Station+Uchana+Haryana", "_blank")}'
);

fs.writeFileSync('src/App.tsx', content);
