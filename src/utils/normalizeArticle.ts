import { getCategoryByKey } from '@/data/categories';
import type { Article } from '@/data/mockArticles';
import type { ArticleCategory } from '@/config/news';

export interface RawNewsApiArticle {
  source?: { id?: string | null; name?: string | null } | null;
  author?: string | null;
  title?: string | null;
  description?: string | null;
  url?: string | null;
  urlToImage?: string | null;
  publishedAt?: string | null;
  content?: string | null;
}

const FALLBACK_IMAGE =
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

function hashId(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function toValidTimestamp(value?: string | null): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

let fallbackCounter = 0;

/** Converts a raw News API article into the app's internal Article model. */
export function normalizeArticle(
  raw: RawNewsApiArticle,
  category?: ArticleCategory,
): Article | undefined {
  const headline = raw.title?.trim();
  if (!headline || headline === '[Removed]') return undefined;

  const id = raw.url ? hashId(raw.url) : `article-${Date.now()}-${(fallbackCounter += 1)}`;
  const author = raw.author?.trim();
  const sourceName = raw.source?.name?.trim() || undefined;

  return {
    id,
    category,
    categoryLabel: category ? getCategoryByKey(category)?.label : undefined,
    headline,
    summary: raw.description?.trim() || undefined,
    image: raw.urlToImage?.trim() || FALLBACK_IMAGE,
    timestamp: toValidTimestamp(raw.publishedAt),
    author: author && author !== sourceName ? author : undefined,
    url: raw.url?.trim() || undefined,
    sourceName,
  };
}
