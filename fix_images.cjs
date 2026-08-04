const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const target = `const developerImage = "/nn.png";
const manojImage = "/manoj.png";
const manishImage = "/manish.png";
const sonuImage = "/sonu.png";
const ashishImage = "/Ashish.png";

const pankajImage = "/pankaj.png";`;

const replacement = `const developerImage = "https://ui-avatars.com/api/?name=Nitesh+Verma&background=0D8ABC&color=fff&size=256&bold=true";
const manojImage = "https://ui-avatars.com/api/?name=Manoj+Kharab&background=1D4ED8&color=fff&size=256&bold=true";
const manishImage = "https://ui-avatars.com/api/?name=Manish+Sheoran&background=4F46E5&color=fff&size=256&bold=true";
const sonuImage = "https://ui-avatars.com/api/?name=Sonu+Sheoran&background=7C3AED&color=fff&size=256&bold=true";
const ashishImage = "https://ui-avatars.com/api/?name=Ashish+Dhankar&background=DB2777&color=fff&size=256&bold=true";

const pankajImage = "https://ui-avatars.com/api/?name=Pankaj+Pawar&background=E11D48&color=fff&size=256&bold=true";`;

app = app.replace(target, replacement);

fs.writeFileSync('src/App.tsx', app);
console.log("Replaced missing images with UI Avatars");
