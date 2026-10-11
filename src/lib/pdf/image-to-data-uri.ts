/**
 * Converts a remote or relative image URL into a Base64 data URI in the browser.
 * If fetching or reading fails, returns null gracefully without throwing,
 * ensuring PDF generation proceeds without interruption.
 */
export async function imageToDataUri(url?: string | null): Promise<string | null> {
  if (!url || typeof window === 'undefined') return null;

  try {
    const res = await fetch(url, {
      cache: 'force-cache',
      mode: 'cors',
    });

    if (!res.ok) {
      console.warn(`[imageToDataUri] Remote image responded with status ${res.status}`);
      return null;
    }

    const blob = await res.blob();
    return new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          resolve(null);
        }
      };
      reader.onerror = () => {
        console.warn('[imageToDataUri] FileReader failed to read blob');
        resolve(null);
      };
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn('[imageToDataUri] Error converting image to data URI:', err);
    return null;
  }
}
