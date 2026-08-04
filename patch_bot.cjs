const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add isDraggingRef
app = app.replace(
  'const robotConstraintsRef = useRef(null);',
  'const robotConstraintsRef = useRef(null);\n  const isDraggingRef = useRef(false);'
);

// 2. Add onDragStart and onDragEnd to the dragged div
const oldDragDiv = `            drag
            dragMomentum={false}`;
const newDragDiv = `            drag
            dragMomentum={false}
            onDragStart={() => isDraggingRef.current = true}
            onDragEnd={() => { setTimeout(() => isDraggingRef.current = false, 150) }}`;
app = app.replace(oldDragDiv, newDragDiv);

// 3. Update onClick logic
const oldOnClick = `              onClick={() => {
                setCurrentView("chat-portal");
                setShowAiTooltip(false);
                window.scrollTo(0, 0);
              }}`;
const newOnClick = `              onClick={(e) => {
                if (isDraggingRef.current) return;
                setCurrentView("chat-portal");
                setShowAiTooltip(false);
                window.scrollTo(0, 0);
              }}`;
app = app.replace(oldOnClick, newOnClick);

fs.writeFileSync('src/App.tsx', app);
console.log("Patched chatbot drag logic");
