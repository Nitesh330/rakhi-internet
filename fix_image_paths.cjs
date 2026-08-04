const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const target = `const developerImage = "/nn.png";
const manojImage = "/manoj.png";
const manishImage = "/manish.png";
const sonuImage = "/sonu.png";
const ashishImage = "/Ashish.png";

const pankajImage = "/pankaj.png";`;

const replacement = `const developerImage = "/nn.png";
const manojImage = "/images/manoj.png";
const manishImage = "/images/manish.png";
const sonuImage = "/images/sonu.png";
const ashishImage = "/images/Ashish.png";

const pankajImage = "/images/pankaj.png";`;

app = app.replace(target, replacement);

fs.writeFileSync('src/App.tsx', app);
console.log("Updated paths to /images/...");
