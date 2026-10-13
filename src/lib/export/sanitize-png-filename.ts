/**
 * Generates a clean, sanitized PNG filename following the pattern:
 * portfolio-[slug]-[template].png
 * Only contains lowercase alphanumeric characters, dashes, and underscores.
 */
export function sanitizePngFilename(
  slug?: string | null,
  templateId?: string | null
): string {
  const cleanSlug = (slug || 'user')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'portfolio';

  const cleanTemplate = (templateId || 'minimalist')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'minimalist';

  return `portfolio-${cleanSlug}-${cleanTemplate}.png`;
}
