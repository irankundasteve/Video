import fs from 'fs';
import path from 'path';

async function main() {
    const dir = 'public/images';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    console.log("No external images required for this project structure.");
}

main().catch(console.error);
