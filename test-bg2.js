import { removeBackground } from '@imgly/background-removal';
import fs from 'fs';

async function test() {
  try {
    const config = {
        publicPath: "https://unpkg.com/@imgly/background-removal-data@1.4.5/dist/"
    };
    const blob = await removeBackground('https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=300&q=80', config);
    console.log("Success:", blob.size);
  } catch (e) {
    console.error("Failed:", e);
  }
}
test();
