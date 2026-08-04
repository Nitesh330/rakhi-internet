const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

// Replace exact cases of old Narnaund address
app = app.replace(/near by old bus stand narnaund/g, "Bus Stand, Front of Police Station, Old, Narnaund, Haryana 125039");
app = app.replace(/NEAR BY OLD BUS STAND NARNAUND/g, "BUS STAND, FRONT OF POLICE STATION, OLD, NARNAUND, HARYANA 125039");

fs.writeFileSync('src/App.tsx', app);
console.log("Updated App.tsx Narnaund address texts");
