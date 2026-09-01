/** Editorial placeholder shown when an article has no image, or its image
 * fails to load. Shared between the news normalizer (`urlToImage: null`)
 * and `ImageWithSkeleton` (a broken/hotlink-blocked `<img>`). */
export const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">' +
      '<rect width="1200" height="675" fill="#101F3A"/>' +
      '<g fill="none" stroke="#C9A86A" stroke-width="4" opacity="0.55">' +
      '<circle cx="600" cy="300" r="64"/>' +
      '<path d="M568 300h64M600 268v64"/>' +
      '</g>' +
      '<text x="600" y="410" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#B8C2D1">Image unavailable</text>' +
      '</svg>',
  );
