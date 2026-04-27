import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { execSync } from 'child_process';

const IMAGES = [
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1280", // Phone/Apps
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1280", // Money
    "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1280", // Coding night
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1280", // Graph/Stats
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1280", // Code screen
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1280", // UI/Business
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1280", // Team/Students
    "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=1280", // Payment/Success
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1280", // Solution/Tech
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1280", // Digital interface
    "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1280", // Minimal UI
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1280", // Wealth/Growth
    "https://images.unsplash.com/photo-1504868584819-f8e90526354a?q=80&w=1280", // Analytics
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1280", // Laptop/Work
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1280", // Binary/Global
    "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1280", // Office/Productivity
    "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1280", // Customer/User
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1280", // Collaboration
    "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1280", // Success/Check
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1280"  // Confident business
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
                    if (fs.statSync(filepath).size > 1000) {
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
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    
    console.log("Starting image downloads...");
    for (let i = 0; i < IMAGES.length; i++) {
        const dest = path.join(dir, `img_${i}.jpg`);
        const success = await downloadImage(IMAGES[i], dest);
        if (success) {
            console.log(`Downloaded ${i + 1}/${IMAGES.length}`);
        } else {
            execSync(`ffmpeg -y -f lavfi -i "color=c=gray:s=1280x720" -frames:v 1 "${dest}"`);
        }
    }
}

main().catch(console.error);
