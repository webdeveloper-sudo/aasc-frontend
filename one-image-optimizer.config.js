/**
 * ONE IMAGE OPTIMIZER - Configuration File
 *
 * This file was auto-generated when you installed one-image-optimizer.
 *
 * INSTRUCTIONS:
 * 1. Set your ROOT_FOLDER path below (the folder containing your images)
 * 2. Run: npm run one-image-optimizer
 *
 * INDIVIDUAL COMMANDS:
 * - npm run compress       (compress images > 1MB)
 * - npm run webp           (convert all to webp)
 * - npm run empty-folders  (delete all files in folders)
 */

module.exports = {
  // 👇 CHANGE THIS to your images root folder path
  ROOT_FOLDER: "./src/assets/images",

  // Compression settings
  COMPRESS_THRESHOLD_MB: 1, // Compress images larger than this
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1080,
  WEBP_QUALITY: 80,
  JPEG_QUALITY: 75,

  // File extensions to process
  IMAGE_EXTENSIONS: [".jpg","JPG","PNG", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff"],
};
