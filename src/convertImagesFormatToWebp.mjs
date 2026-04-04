import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

// Allow __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------------
// CONFIG
// ------------------------------------
const BASE_FOLDER = path.join(__dirname, ".");

const supportedExtensions = [".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".gif"];
// ------------------------------------

// Recursively collect all image file paths
const getAllImages = async (dir) => {
  const files = await fs.readdir(dir, { withFileTypes: true });
  let allFiles = [];

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      const nestedFiles = await getAllImages(fullPath);
      allFiles = allFiles.concat(nestedFiles);
    } else {
      if (supportedExtensions.includes(path.extname(file.name).toLowerCase())) {
        allFiles.push(fullPath);
      }
    }
  }
  return allFiles;
};

// Convert image to WebP
const convertToWebp = async (filePath) => {
  const webpPath = filePath.replace(path.extname(filePath), ".webp");

  try {
    await sharp(filePath).webp({ quality: 90 }).toFile(webpPath);
    console.log(`✔ Converted: ${filePath} → ${webpPath}`);
  } catch (err) {
    console.error(`✖ Failed to convert: ${filePath}`, err.message);
  }
};

// Main function
const processImages = async () => {
  console.log(`🔍 Scanning folder: ${BASE_FOLDER}`);

  const images = await getAllImages(BASE_FOLDER);

  console.log(`📸 Found ${images.length} images`);
  console.log("🚀 Converting to WebP...\n");

  for (const img of images) {
    await convertToWebp(img);
  }

  console.log("\n🎉 Done converting all images to WebP!");
};

processImages();
