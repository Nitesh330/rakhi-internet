const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const t = Date.now();

app = app.replace('const developerImage = "/nn.png";', \`const developerImage = "/nn.png?t=\${t}";\`);
app = app.replace('const manojImage = "/images/manoj.png";', \`const manojImage = "/images/manoj.png?t=\${t}";\`);
app = app.replace('const manishImage = "/images/manish.png";', \`const manishImage = "/images/manish.png?t=\${t}";\`);
app = app.replace('const sonuImage = "/images/sonu.png";', \`const sonuImage = "/images/sonu.png?t=\${t}";\`);
app = app.replace('const ashishImage = "/images/Ashish.png";', \`const ashishImage = "/images/Ashish.png?t=\${t}";\`);
app = app.replace('const pankajImage = "/images/pankaj.png";', \`const pankajImage = "/images/pankaj.png?t=\${t}";\`);

fs.writeFileSync('src/App.tsx', app);
console.log("Updated paths to bust cache...");
