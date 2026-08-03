const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /className="pointer-events-auto select-none flex flex-col items-end justify-end"\n\s*initial=\{\{ opacity: 0, y: 50, scale: 0\.5 \}\}\n\s*animate=\{\{ opacity: 1, y: 0, scale: 1 \}\}\n\s*transition=\{\{ type: "spring", stiffness: 260, damping: 20 \}\}/,
  `className="pointer-events-auto select-none flex flex-col items-end justify-end"
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            drag
            dragMomentum={false}`
);

fs.writeFileSync('src/App.tsx', content);
