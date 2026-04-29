import fs from 'fs';
import path from 'path';
import * as googleTTS from 'google-tts-api';
import axios from 'axios';

const SCRIPT_SECTIONS = [
  { name: 'part1', text: "Imagine you're a baker, and you need a haircut." },
  { name: 'part2', text: "You offer the barber ten loaves of bread." },
  { name: 'part3', text: "But what if he doesn't want bread?" },
  { name: 'part4', text: "That's the problem with barter—" },
  { name: 'part5', text: "you both have to want what the other has, at the same time." },
  { name: 'part6', text: "Currency solves that." }
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

  console.log("Generating Kinetic Typography Voice-Overs...");
  for (const section of SCRIPT_SECTIONS) {
    const results = googleTTS.getAllAudioUrls(section.text, { lang: 'en', slow: false, host: 'https://translate.google.com' });
    const dest = path.join(dir, `${section.name}.mp3`);
    await downloadAudio(results[0].url, dest);
    console.log(`Generated: ${section.name}`);
  }
}

main().catch(console.error);
