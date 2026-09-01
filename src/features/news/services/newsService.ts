import type { Article } from '@/data/mockArticles';
import type { ArticleCategory } from '@/data/categories';
import { cachedGet, type QueryParams } from '@/services/apiClient';
import { normalizeArticle, type ServerArticle } from '../utils/normalizeArticle';
import { rememberArticles, getRememberedArticle } from '../utils/articleStore';
import { NEWS_CATEGORY_MAP } from '../constants/newsSections';
import { APP_CONFIG } from '@/config/appConfig';

const NEWS_ENDPOINT = `${APP_CONFIG.apiBaseUrl}/news`;
const NEWS_EVERYTHING_ENDPOINT = `${APP_CONFIG.apiBaseUrl}/news/everything`;

const NEWS_DEFAULTS = {
  cacheTtlMs: 10 * 60 * 1000,
  breakingWindowMs: 90 * 60 * 1000,
  breakingMax: 4,
} as const;

// The server already normalizes and dedupes every article (see
// `server/services/newsService.js`'s pipeline) — this is never a raw
// provider response. `nextPageToken` is NewsData.io's opaque `nextPage`
// cursor, passed straight through — never a page number.
interface NewsApiEnvelope {
  status: string;
  totalResults: number;
  articles: ServerArticle[];
  nextPageToken?: string;
}

// `country`/`language` are intentionally absent here — this platform is
// UK-only and that policy is enforced entirely server-side, not requested
// by the client.
export interface NewsQueryOptions {
  pageSize?: number;
}

export interface NewsResult {
  articles: Article[];
  totalResults: number;
  pageSize: number;
  nextPageToken?: string;
  hasMore: boolean;
}

function dedupeById(articles: Article[]): Article[] {
  const seen = new Set<string>();
  return articles.filter((article) => {
    if (seen.has(article.id)) return false;
    seen.add(article.id);
    return true;
  });
}

async function fetchFrom(endpoint: string, params: QueryParams): Promise<NewsResult> {
  const pageSize = Number(params.pageSize) || APP_CONFIG.defaultPageSize;

  const response = await cachedGet<NewsApiEnvelope>(endpoint, params, NEWS_DEFAULTS.cacheTtlMs);

  const articles = dedupeById(
    response.articles
      .map((raw) => normalizeArticle(raw))
      .filter((article): article is Article => Boolean(article)),
  );

  rememberArticles(articles);

  return {
    articles,
    totalResults: response.totalResults ?? articles.length,
    pageSize,
    nextPageToken: response.nextPageToken,
    hasMore: Boolean(response.nextPageToken),
  };
}

/** General UK top headlines — used for the homepage's lead/top/latest pool. */
export function getArticles(options: NewsQueryOptions = {}): Promise<Article[]> {
  return fetchFrom(NEWS_ENDPOINT, {
    pageSize: options.pageSize ?? APP_CONFIG.defaultPageSize,
  }).then((result) => result.articles);
}

/**
 * `top-headlines?country=gb&category=`. For business/health/tech/sport —
 * politics/world use `getSectionNews` (routed through NewsData.io's own
 * native category via `/api/news/everything`) instead.
 */
export function getArticlesByCategory(
  category: ArticleCategory,
  options: NewsQueryOptions = {},
): Promise<Article[]> {
  return fetchFrom(NEWS_ENDPOINT, {
    category: NEWS_CATEGORY_MAP[category],
    pageSize: options.pageSize ?? APP_CONFIG.defaultPageSize,
  }).then((result) => result.articles);
}

export interface EverythingQueryOptions extends NewsQueryOptions {
  section?: ArticleCategory;
  /** Opaque `nextPage` cursor token from a previous `NewsResult`, never a
   * page number. */
  page?: string;
}

/**
 * NewsData.io-backed article discovery — search plus `section` (which now
 * maps directly to a native NewsData.io category, including politics/world).
 * For real News-category feeds (business/health/tech/sport) use
 * `getArticlesByCategory`.
 */
export function getEverything(
  query: string | undefined,
  options: EverythingQueryOptions = {},
): Promise<NewsResult> {
  const trimmed = query?.trim();
  if (!trimmed && !options.section) {
    return Promise.resolve({
      articles: [],
      totalResults: 0,
      pageSize: options.pageSize ?? APP_CONFIG.defaultPageSize,
      hasMore: false,
    });
  }

  return fetchFrom(NEWS_EVERYTHING_ENDPOINT, {
    q: trimmed,
    section: options.section,
    page: options.page,
    pageSize: options.pageSize ?? APP_CONFIG.defaultPageSize,
  });
}

/** Politics/World — served via NewsData.io's native category, same as
 * every other section, just through the search endpoint. */
export function getSectionNews(
  section: ArticleCategory,
  options: NewsQueryOptions = {},
): Promise<NewsResult> {
  return getEverything(undefined, { ...options, section });
}

export function searchNews(query: string, options: EverythingQueryOptions = {}): Promise<NewsResult> {
  return getEverything(query, options);
}

export async function getBreakingNews(): Promise<Article[]> {
  const result = await fetchFrom(NEWS_ENDPOINT, { pageSize: 10 });

  if (result.articles.length === 0) return [];

  const now = Date.now();
  const recent = result.articles.filter((article) => {
    if (!article.timestamp) return false;
    return now - new Date(article.timestamp).getTime() <= NEWS_DEFAULTS.breakingWindowMs;
  });

  // Never label every recent headline as breaking — surface only the
  // freshest handful, falling back to the single latest story otherwise.
  const selected = (recent.length > 0 ? recent : result.articles.slice(0, 1)).slice(
    0,
    NEWS_DEFAULTS.breakingMax,
  );

  return selected.map((article, index) => ({ ...article, breaking: index === 0 }));
}

/**
 * NewsData.io has no article-detail endpoint, so this resolves from
 * articles already seen this session (list views, search, etc).
 */
export function getArticleBySlug(id: string): Promise<Article | undefined> {
  return Promise.resolve(getRememberedArticle(id));
}
