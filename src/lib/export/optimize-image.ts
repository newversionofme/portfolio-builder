/**
 * Optimizes and converts an image URL into a downscaled, compressed Base64 Data URI in the browser.
 * - Caps image dimensions to max width (~1280px) to prevent massive memory usage.
 * - Compresses to JPEG/WebP (quality 0.85).
 * - Provides graceful fallbacks if network or CORS errors occur, preventing export failures.
 */
export async function optimizeImageToDataUri(
  url?: string | null,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.85
): Promise<string | null> {
  if (!url || typeof window === 'undefined') return null;

  try {
    // 1. Fetch image as blob
    let blob: Blob | null = null;
    try {
      const res = await fetch(url, {
        cache: 'force-cache',
        mode: 'cors',
      });
      if (res.ok) {
        blob = await res.blob();
      }
    } catch {
      // Fetch failed (e.g. CORS), will attempt direct Image loading below
    }

    const objectUrl = blob ? URL.createObjectURL(blob) : url;

    // 2. Load into HTMLImageElement
    const img = await new Promise<HTMLImageElement | null>((resolve) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = () => {
        if (blob) URL.revokeObjectURL(objectUrl);
        resolve(null);
      };
      image.src = objectUrl;
    });

    if (blob) {
      URL.revokeObjectURL(objectUrl);
    }

    if (!img || img.naturalWidth === 0 || img.naturalHeight === 0) {
      console.warn('[optimizeImageToDataUri] Image failed to decode, using fallback');
      return null;
    }

    // 3. Calculate target dimensions (preserving aspect ratio)
    let targetWidth = img.naturalWidth;
    let targetHeight = img.naturalHeight;

    if (targetWidth > maxWidth || targetHeight > maxHeight) {
      const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
      targetWidth = Math.round(targetWidth * ratio);
      targetHeight = Math.round(targetHeight * ratio);
    }

    // 4. Draw to offscreen canvas
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    // Use better image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    // 5. Convert to compressed JPEG data URL
    try {
      const dataUri = canvas.toDataURL('image/jpeg', quality);
      return dataUri;
    } catch {
      // If canvas is tainted or toDataURL fails, return null
      return null;
    }
  } catch (err) {
    console.warn('[optimizeImageToDataUri] Unexpected error optimizing image:', err);
    return null;
  }
}
