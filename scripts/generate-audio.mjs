import fs from 'fs';
import path from 'path';
import * as googleTTS from 'google-tts-api';
import axios from 'axios';

const SCRIPT_SECTIONS = [
  { name: 'scene1', text: "What powers your smartphone, calms a racing mind, and was born in the very first minutes of the universe? The answer is lithium – element number three, the lightest metal on the periodic table, and one of the most quietly transformative substances in our lives." },
  { name: 'scene2', text: "Lithium is a soft, silvery-white metal so light it floats on water – but don’t try that at home; it’ll fizz violently and burst into flames. It’s never found pure in nature because it’s just too reactive. Instead, we coax it out of underground brine pools and hard rock minerals like spodumene. Its name comes from the Greek word lithos, meaning stone, a nod to its discovery in a Swedish iron mine back in 1817." },
  { name: 'scene3', text: "Now, to understand why lithium is so special, you need to look at its atoms. Lithium atoms desperately want to lose an electron. That eagerness makes them electrochemical superstars. Harness that in a battery, and you get one of the most energy-dense, lightweight rechargeable storage systems ever created – the lithium-ion battery. These batteries power everything from your earbuds to electric cars and even help stabilise entire power grids. Their ability to pack huge energy into small, lightweight packages is what made the portable electronics revolution possible." },
  { name: 'scene4', text: "But lithium’s talents don’t stop at energy. In medicine, lithium carbonate is a proven mood stabiliser, a lifeline for many people living with bipolar disorder. For over 70 years, this simple salt has helped reduce the extreme highs and crushing lows of the condition, and we still don’t fully understand all the mechanisms that make it work. It’s one of those beautiful reminders that a basic element can have profound effects on the human brain." },
  { name: 'scene5', text: "Beyond batteries and brains, lithium pops up in surprising places: heat-resistant glass, high-performance lubricating greases, aircraft alloys, and even in the production of tritium for nuclear fusion. But here’s the truly mind-bending part: almost all the lithium in existence today was created during the first three minutes after the Big Bang. Unlike most other elements, which are forged deep inside stars, lithium nuclei were born in that primordial fireball. Some extra lithium comes from cosmic rays smashing into heavier atoms in space, but the bulk is an ancient relic from the dawn of time." },
  { name: 'scene6', text: "Today, lithium is more in demand than ever. The global push for electric vehicles and renewable energy storage means we need a lot of it. But mining and extracting lithium comes with serious challenges: high water consumption, environmental damage in fragile ecosystems, and geopolitical supply tensions. That’s why scientists are racing to improve battery recycling and develop new extraction methods that are gentler on the planet." },
  { name: 'scene7', text: "So, the next time you swipe on your phone, or see an EV glide silently by, remember the tiny atom making it all possible. Lithium: lightweight, hyper-reactive, cosmically ancient, and absolutely essential to both our modern world and the clean energy future we’re trying to build. From the birth of the universe to the beat of a mental health treatment, lithium quietly connects the very large to the very small, the cosmic to the personal. That’s what makes it more than just another metal – it’s a story worth telling." }
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

  console.log("Generating Lithium Script Voice-Overs...");
  for (const section of SCRIPT_SECTIONS) {
    // google-tts-api getAllAudioUrls handles long text
    const results = googleTTS.getAllAudioUrls(section.text, { lang: 'en', slow: false, host: 'https://translate.google.com' });
    const dest = path.join(dir, `${section.name}.mp3`);
    
    // For this implementation, we take the first URL. For full production, merging would be better.
    await downloadAudio(results[0].url, dest);
    console.log(`Generated: ${section.name}`);
  }
}

main().catch(console.error);
