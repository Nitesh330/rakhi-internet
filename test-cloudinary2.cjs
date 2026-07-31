const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "hitesh",
  api_key: "278385952194617",
  api_secret: "8GLoLoLrPqLHrkrhfGUA_17r9p0"
});

async function run() {
  try {
    const res = await cloudinary.uploader.upload("https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=600&q=80", {
      background_removal: "cloudinary_ai"
    });
    console.log("Success:", res.secure_url);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
run();
