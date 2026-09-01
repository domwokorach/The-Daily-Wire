import { palette } from '@/theme/palette';

/** Editorial placeholder shown when an article has no image, or its image
 * fails to load. Shared between the news normalizer (`image: null`)
 * and `ResponsiveImage` (a broken/hotlink-blocked `<img>`). */
const PAPER_COLOR = palette.background!.paper!;
const ACCENT_COLOR = (palette.primary as { main: string }).main;
const MUTED_TEXT_COLOR = palette.text!.secondary!;

export const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">' +
      `<rect width="1200" height="675" fill="${PAPER_COLOR}"/>` +
      `<g fill="none" stroke="${ACCENT_COLOR}" stroke-width="4" opacity="0.55">` +
      '<circle cx="600" cy="300" r="64"/>' +
      '<path d="M568 300h64M600 268v64"/>' +
      '</g>' +
      `<text x="600" y="410" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="${MUTED_TEXT_COLOR}">Image unavailable</text>` +
      '</svg>',
  );
