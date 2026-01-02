
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = path.join(__dirname, 'public', 'icon.png');
const outputDir = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
    console.log(`Generating icons from ${inputFile}...`);

    for (const size of sizes) {
        const fileName = `icon-${size}x${size}.png`;
        const outputPath = path.join(outputDir, fileName);

        try {
            await sharp(inputFile)
                .resize(size, size)
                .toFile(outputPath);
            console.log(`Generated ${fileName}`);
        } catch (error) {
            console.error(`Error generating ${fileName}:`, error);
        }
    }
    console.log('Done!');
}

generateIcons();
