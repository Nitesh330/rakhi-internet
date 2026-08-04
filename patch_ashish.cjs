const fs = require('fs');
const file = '/app/applet/src/App.tsx';
let content = fs.readFileSync(file, 'utf8');
const target = `<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-[4px] border-white shadow-xl relative group-hover/card:scale-105 transition-transform duration-500 z-10 bg-white">\n                            <img\n                              src={member.image}\n                              alt={member.name}\n                              className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"\n                            />\n                          </div>`;
const replacement = `<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-[4px] border-white shadow-xl relative group-hover/card:scale-105 transition-transform duration-500 z-10 bg-white flex items-center justify-center">\n                            <img\n                              src={member.image}\n                              alt={member.name}\n                              className={\`transition-transform duration-700 group-hover/card:scale-110 \${member.name === "Ashish Dhankar" ? "w-[180%] h-[180%] max-w-none object-contain" : "w-full h-full object-cover"}\`}\n                            />\n                          </div>`;
if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log("Patched successfully");
} else {
  console.log("Target not found");
}
