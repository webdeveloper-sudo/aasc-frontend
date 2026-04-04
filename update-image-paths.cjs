const fs = require("fs");
const path = require("path");

// 🔧 Folders to process
const TARGET_DIR = path.join(__dirname, "src");

// 🔧 Regex to detect /assets/<file> or /assets/<subfolder>/<file>
const regex = /(['"`])([^"'`]*assets\/)(?!images\/)([^"'`]+)(['"`])/g;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Replace `/assets/...` with `/assets/images/...`
  const updatedContent = content.replace(regex, (match, quoteStart, assetsPath, fileRest, quoteEnd) => {
    return `${quoteStart}${assetsPath}images/${fileRest}${quoteEnd}`;
  });

  // Save only if changes occurred
  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, "utf8");
    console.log("✓ Updated:", filePath);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);

    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else {
      // Only modify text-based files
      if (/\.(js|jsx|ts|tsx|json|css|scss|html|md)$/.test(fullPath)) {
        processFile(fullPath);
      }
    }
  }
}

console.log("🔍 Updating image paths...");
walk(TARGET_DIR);
console.log("✨ Done!");
