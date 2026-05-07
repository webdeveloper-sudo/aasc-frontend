/**
 * Universal image URL resolver for AASC website.
 * Handles bundled assets, full URLs, and backend temp files.
 */
export function resolveImageUrl(img: string | undefined | null): string {
  if (!img) return "";

  // CASE 1 — Full URL or Data URL (already resolved)
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:")) {
    return img;
  }

  // CASE 2 — Bundled asset or public path (starts with / or contains /assets/)
  // Vite production builds use /assets/ filename-hash.webp
  if (img.startsWith("/") || img.includes("/assets/")) {
    return img;
  }

  // CASE 3 — Backend Asset (filename only or relative path)
  // Get base URL without the /api suffix if present
  const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const baseUrl = rawApiUrl.replace(/\/api$/, "");
  
  // If it's a temp file or a direct filename from the database
  return `${baseUrl}/assets/images/temp/${img}`;
}
