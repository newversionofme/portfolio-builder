/**
 * Sanitizes text for Helvetica / PDF core font compatibility in @react-pdf/renderer.
 * 
 * Helvetica and PDF-1.4 core fonts use WinAnsi / Latin-1 encoding (ISO-8859-1).
 * Unhandled characters (emojis, smart quotes, mathematical symbols, non-Latin scripts)
 * will cause glyph missing errors or unhandled character crashes.
 *
 * This utility:
 * 1. Preserves Latin-1 accented letters (e.g. é, ñ, ü, à, ç, etc.)
 * 2. Normalizes Unicode into canonical composition (NFC)
 * 3. Converts smart quotes and apostrophes to ASCII standard (' and ")
 * 4. Converts em-dash and en-dash to hyphen (-)
 * 5. Converts ellipsis to (...)
 * 6. Strips emojis, complex symbols, and unsupported scripts safely.
 */
export function sanitizePdfText(input?: string | null): string {
  if (!input) return '';

  return (
    input
      .normalize('NFC')
      // Typographic single quotes & apostrophes -> standard ASCII '
      .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
      // Typographic double quotes & guillemets -> standard ASCII "
      .replace(/[\u201C\u201D\u201E\u201F\u00AB\u00BB]/g, '"')
      // En-dash, em-dash, horizontal bar -> standard ASCII -
      .replace(/[\u2013\u2014\u2015]/g, '-')
      // Bullets & symbols -> dash
      .replace(/[\u2022\u25E6\u25AA\u25AB\u2043]/g, ' - ')
      // Horizontal ellipsis -> ...
      .replace(/\u2026/g, '...')
      // Non-breaking space -> regular space
      .replace(/\u00A0/g, ' ')
      // Retain:
      // - ASCII printable range (\x20-\x7E)
      // - Whitespace: \t, \r, \n
      // - Latin-1 Supplement range (\u00A0-\u00FF) which covers accented characters (é, ñ, ü, etc.)
      .replace(/[^\x20-\x7E\t\r\n\u00A0-\u00FF]/g, '')
  );
}

/**
 * Sanitizes download file names so they are safe across all OS filesystems (macOS, Linux, Windows).
 * Produces format: cv-[name]-[slug].pdf
 */
export function sanitizePdfFilename(fullName?: string | null, slug?: string | null): string {
  const cleanName = (fullName || 'user')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics for filename
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .trim();

  const cleanSlug = (slug || 'portfolio')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .trim();

  return `cv-${cleanName || 'user'}-${cleanSlug || 'portfolio'}.pdf`;
}
