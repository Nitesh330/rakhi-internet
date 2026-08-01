const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '<button onClick={() => window.open("https://maps.google.com/?q=Govt+College+Jind+Haryana", "_blank")}\n                      className="w-full flex items-center gap-3 text-left p-2.5 rounded-xl hover:bg-purple-50/50 transition-colors group/item cursor-pointer"',
  '<button onClick={() => openContactModal("", "jind")}\n                      className="w-full flex items-center gap-3 text-left p-2.5 rounded-xl hover:bg-purple-50/50 transition-colors group/item cursor-pointer"'
);

content = content.replace(
  '<button onClick={() => window.open("https://maps.google.com/?q=Old+Bus+Stand+Narnaund", "_blank")}\n                      className="w-full flex items-center gap-3 text-left p-2.5 rounded-xl hover:bg-blue-50/50 transition-colors group/item cursor-pointer mt-1"',
  '<button onClick={() => openContactModal("", "narnaund")}\n                      className="w-full flex items-center gap-3 text-left p-2.5 rounded-xl hover:bg-blue-50/50 transition-colors group/item cursor-pointer mt-1"'
);

content = content.replace(
  '<button onClick={() => window.open("https://maps.google.com/?q=Railway+Station+Uchana+Haryana", "_blank")}\n                      className="w-full flex items-center gap-3 text-left p-2.5 rounded-xl hover:bg-emerald-50/50 transition-colors group/item cursor-pointer mt-1"',
  '<button onClick={() => openContactModal("", "uchana")}\n                      className="w-full flex items-center gap-3 text-left p-2.5 rounded-xl hover:bg-emerald-50/50 transition-colors group/item cursor-pointer mt-1"'
);

fs.writeFileSync('src/App.tsx', content);
