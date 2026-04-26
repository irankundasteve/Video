import fs from 'fs';
import path from 'path';
import axios from 'axios';

const IMAGES = [
    "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1280",
    "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?q=80&w=1280",
    "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=1280",
    "https://images.unsplash.com/photo-1501705388883-4ed8a543392c?q=80&w=1280",
    "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?q=80&w=1280",
    "https://images.unsplash.com/photo-1472393365320-dc77242e4501?q=80&w=1280",
    "https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?q=80&w=1280",
    "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?q=80&w=1280",
    "https://images.unsplash.com/photo-1547970810-248a21e70bf7?q=80&w=1280",
    "https://images.unsplash.com/photo-1500463959177-e0869687df2b?q=80&w=1280",
    "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=1280",
    "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=1280",
    "https://images.unsplash.com/photo-1516233501032-2ddf7f031dcb?q=80&w=1280",
    "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?q=80&w=1280",
    "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?q=80&w=1280",
    "https://images.unsplash.com/photo-1504173010664-32509aaefe92?q=80&w=1280",
    "https://images.unsplash.com/photo-1511967728238-d5063c9aa76a?q=80&w=1280",
    "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?q=80&w=1280",
    "https://images.unsplash.com/photo-1543946207-39bd91e70ca7?q=80&w=1280",
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1280"
];

const downloadImage = async (url, filepath) => {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });
        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filepath);
            response.data.pipe(writer);
            writer.on('error', reject);
            writer.on('finish', () => resolve(filepath));
        });
    } catch (e) {
        console.error(`Failed to download ${url}: ${e.message}`);
        return null;
    }
};

async function main() {
    const dir = 'public/images';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    
    console.log("Starting image downloads...");
    for (let i = 0; i < IMAGES.length; i++) {
        const dest = path.join(dir, `img_${i}.jpg`);
        await downloadImage(IMAGES[i], dest);
        console.log(`Downloaded ${i + 1}/${IMAGES.length}`);
    }
}

main().catch(console.error);
