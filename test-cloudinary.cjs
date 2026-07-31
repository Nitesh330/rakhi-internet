require("dotenv").config({ override: true });
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
  api_key: (process.env.CLOUDINARY_API_KEY || "").trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET || "").trim()
});

console.log("Config:", cloudinary.config());

async function run() {
  try {
    const res = await cloudinary.uploader.upload("https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=600&q=80", {
      background_removal: "cloudinary_ai"
    });
    console.log("Success:", res);
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
