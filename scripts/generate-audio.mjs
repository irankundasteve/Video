import fs from 'fs';
import path from 'path';
import * as googleTTS from 'google-tts-api';
import axios from 'axios';

const SCRIPT_SECTIONS = [
  { name: 'scene1', text: "What if one app could make you money every single day, even while you sleep? No boss, no clients, just code." },
  { name: 'scene2', text: "You build. You design. You publish. And then, nothing happens. Zero downloads. Zero users. Zero income." },
  { name: 'scene3', text: "The problem is not your code. It’s your strategy. Apps that don’t solve problems, don’t survive." },
  { name: 'scene4', text: "Here’s the system. Find a real problem. Build a simple solution. Charge for the outcome." },
  { name: 'scene5', text: "A voice recorder is not enough. But a recorder that turns lectures into notes? That solves something real." },
  { name: 'scene6', text: "Value creates demand. Demand creates revenue." },
  { name: 'scene7', text: "Stop building randomly. Start building what people need." }
];

async function downloadAudio(url, dest) {
  const response = await axios({ url, method: 'GET', responseType: 'stream' });
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(dest);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function main() {
  const dir = 'public/audio';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  console.log("Generating Production Voice-Overs...");
  for (const section of SCRIPT_SECTIONS) {
    const results = googleTTS.getAllAudioUrls(section.text, { lang: 'en', slow: false, host: 'https://translate.google.com' });
    const dest = path.join(dir, `${section.name}.mp3`);
    await downloadAudio(results[0].url, dest);
    console.log(`Generated: ${section.name}`);
  }
}

main().catch(console.error);
