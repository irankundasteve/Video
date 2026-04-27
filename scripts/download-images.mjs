import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { execSync } from 'child_process';

const IMAGES = [
    "https://raw.githubusercontent.com/Remotion-Templates/bitcoin-video/main/public/bitcoin.png", // Bitcoin Coin (Mock URL)
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1280", // Gold Bar
    "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=1280", // Stars/Dots
    "https://images.unsplash.com/photo-1518458084722-67377ec76816?q=80&w=1280", // Money/Inflation
    "https://images.unsplash.com/photo-1523293836414-f04e803ca093?q=80&w=1280", // Government building
    "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=1280", // World map
    "https://images.unsplash.com/photo-1611974717482-5392e239b60e?q=80&w=1280", // Chart
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1280"  // Digital connection
];

const downloadImage = async (url, filepath, retries = 5) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios({
                url,
                method: 'GET',
                responseType: 'stream',
                timeout: 30000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            return new Promise((resolve, reject) => {
                const writer = fs.createWriteStream(filepath);
                response.data.pipe(writer);
                writer.on('error', reject);
                writer.on('finish', () => {
                    if (fs.statSync(filepath).size > 500) {
                        resolve(true);
                    } else {
                        reject(new Error("File too small"));
                    }
                });
            });
        } catch (e) {
            console.error(`Attempt ${i + 1} failed for ${url}: ${e.message}`);
            if (i === retries - 1) return false;
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    return false;
};

async function main() {
    const dir = 'public/images';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    console.log("Starting Bitcoin asset downloads...");
    for (let i = 0; i < IMAGES.length; i++) {
        const dest = path.join(dir, `btc_img_${i}.jpg`);
        const success = await downloadImage(IMAGES[i], dest);
        if (!success) {
            console.warn(`Creating fallback for image ${i}`);
            execSync(`ffmpeg -y -f lavfi -i "color=c=black:s=1280x720" -frames:v 1 -update 1 "${dest}"`);
        }
    }
}

main().catch(console.error);
