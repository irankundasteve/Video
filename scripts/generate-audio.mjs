import fs from 'fs';
import path from 'path';
import * as googleTTS from 'google-tts-api';
import axios from 'axios';

const SCRIPT_SECTIONS = [
  { name: 'scene1', text: "What if money itself was broken? Not slowly. Not eventually. Right now. And what if one thing, one protocol, was already fixing it?" },
  { name: 'scene2', text: "Every government on Earth can print more of their currency. More money printed means your money buys less. That's called inflation. And it never stops. In the last 4 years alone, the U.S. printed 40 percent of all dollars ever made." },
  { name: 'scene3', text: "Bitcoin was built to be different. It's decentralized, no government, no bank, no CEO controls it. It runs on math. On code. On consensus. And its supply? Fixed. Forever. 21 million. Not one more." },
  { name: 'scene4', text: "Think about gold. Humans trusted it for 5,000 years. Why? Because no one could make more of it. Bitcoin is that, but digital. Verifiable. Portable. Instant. You can send a billion dollars worth, in 10 minutes, to anyone on Earth." },
  { name: 'scene5', text: "This isn't a fringe idea anymore. El Salvador made it legal tender. BlackRock, Fidelity, the world's biggest asset managers, now hold it. Over 400 million people worldwide own Bitcoin." },
  { name: 'scene6', text: "But let's be real. Bitcoin is volatile. It dropped 80 percent in 2022. It's not for everyone. It requires patience, research, and conviction. No one can promise you returns. No one." },
  { name: 'scene7', text: "But the question isn't whether Bitcoin will survive. The question is whether you'll understand it before everyone else does. The shift has already started." }
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

  console.log("Generating Bitcoin Script Voice-Overs...");
  for (const section of SCRIPT_SECTIONS) {
    const results = googleTTS.getAllAudioUrls(section.text, { lang: 'en', slow: false, host: 'https://translate.google.com' });
    const dest = path.join(dir, `${section.name}.mp3`);
    await downloadAudio(results[0].url, dest);
    console.log(`Generated: ${section.name}`);
  }
}

main().catch(console.error);
