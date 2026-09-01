const STOPWORDS = new Set([
  'a', 'an', 'the', 'to', 'of', 'in', 'on', 'for', 'and', 'or', 'is', 'are',
  'as', 'at', 'by', 'with', 'from', 'its', 'it', 'this', 'that', 'be', 'has',
  'have', 'will', 'says', 'new',
]);

const SIMILARITY_THRESHOLD = 0.6;
const SIMILARITY_WINDOW_MS = 48 * 60 * 60 * 1000;

function canonicalUrl(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname}${parsed.pathname}`.replace(/\/+$/, '').toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

// Deliberately crude — just enough to fold "cuts"/"cut" and "rates"/"rate"
// together for similarity purposes, not real stemming.
function stem(word) {
  return word.length > 3 && word.endsWith('s') && !word.endsWith('ss') ? word.slice(0, -1) : word;
}

function titleTokens(title) {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOPWORDS.has(word))
      .map(stem),
  );
}

// Overlap coefficient (intersection / smaller set size), not Jaccard
// (intersection / union) — real headlines about the same story often carry
// different amounts of extra context ("...to boost UK economy" vs "...amid
// inflation fears"), which dilutes Jaccard's union-sized denominator even
// when the shared core is unmistakably the same story. Overlap coefficient
// asks "is the smaller headline's content contained in the other?" instead,
// which is the actual question for duplicate detection.
function titleSimilarity(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  return intersection / Math.min(a.size, b.size);
}

/**
 * Collapses near-identical coverage of the same story from different
 * publishers. Primary signal: canonical URL (protocol/query/trailing-slash
 * differences ignored). Secondary: title token-overlap similarity, but only
 * between articles published within `SIMILARITY_WINDOW_MS` of each other —
 * otherwise two unrelated stories that happen to share generic words (e.g.
 * "government", "announces") could get merged just for crossing the
 * threshold. Keeps the first (already ranked-by-recency-agnostic) occurrence.
 */
export function deduplicateArticles(articles) {
  const seenUrls = new Set();
  const kept = [];

  for (const article of articles) {
    const key = canonicalUrl(article.url);
    if (seenUrls.has(key)) continue;

    const tokens = titleTokens(article.title);
    const publishedAt = article.publishedAt ? Date.parse(article.publishedAt) : NaN;

    const isDuplicate = kept.some((existing) => {
      if (Number.isFinite(publishedAt) && existing._publishedAtMs !== undefined) {
        if (Math.abs(publishedAt - existing._publishedAtMs) > SIMILARITY_WINDOW_MS) return false;
      }
      return titleSimilarity(tokens, existing._titleTokens) >= SIMILARITY_THRESHOLD;
    });

    if (isDuplicate) continue;

    seenUrls.add(key);
    kept.push({ ...article, _titleTokens: tokens, _publishedAtMs: publishedAt });
  }

  return kept.map(({ _titleTokens, _publishedAtMs, ...article }) => article);
}
