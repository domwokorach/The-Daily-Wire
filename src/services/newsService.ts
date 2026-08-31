import type { Article } from '@/data/mockArticles';
import { cachedGet, type QueryParams } from './apiClient';
import { normalizeArticle, type RawNewsApiArticle } from '@/utils/normalizeArticle';
import { rememberArticles, getRememberedArticle } from '@/utils/articleStore';
import {
  NEWS_ENDPOINT,
  NEWS_CATEGORY_MAP,
  NEWS_CATEGORY_QUERY,
  NEWS_DEFAULTS,
  type ArticleCategory,
} from '@/config/news';
import { APP_CONFIG } from '@/constants/config';

export type { ArticleCategory } from '@/config/news';

interface NewsApiEnvelope {
  status: string;
  totalResults: number;
  articles: RawNewsApiArticle[];
}

// `country`/`domains`/`language` are intentionally absent here — this
// platform is UK-only and that policy is enforced entirely server-side, not
// requested by the client.
export interface NewsQueryOptions {
  page?: number;
  pageSize?: number;
  sources?: string;
}

export interface NewsResult {
  articles: Article[];
  totalResults: number;
  page: number;
  pageSize: number;
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

async function fetchNews(params: QueryParams, category?: ArticleCategory): Promise<NewsResult> {
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || APP_CONFIG.defaultPageSize;

  const response = await cachedGet<NewsApiEnvelope>(NEWS_ENDPOINT, params, NEWS_DEFAULTS.cacheTtlMs);

  const articles = dedupeById(
    response.articles
      .map((raw) => normalizeArticle(raw, category))
      .filter((article): article is Article => Boolean(article)),
  );

  rememberArticles(articles);

  return {
    articles,
    totalResults: response.totalResults ?? articles.length,
    page,
    pageSize,
    hasMore: page * pageSize < (response.totalResults ?? 0),
  };
}

/** General UK top headlines — used for the homepage's lead/top/latest pool. */
export function getArticles(options: NewsQueryOptions = {}): Promise<Article[]> {
  return fetchNews({
    page: options.page,
    pageSize: options.pageSize ?? APP_CONFIG.defaultPageSize,
  }).then((result) => result.articles);
}

export function getCategoryNews(
  category: ArticleCategory,
  options: NewsQueryOptions = {},
): Promise<NewsResult> {
  const supplementalQuery = NEWS_CATEGORY_QUERY[category];

  if (supplementalQuery) {
    // No native News API category fits (e.g. politics/world) — search by
    // title instead of filtering the generic `general` category, which is
    // far noisier. The server restricts this to approved UK domains.
    return fetchNews(
      {
        qInTitle: supplementalQuery,
        page: options.page,
        pageSize: options.pageSize ?? APP_CONFIG.defaultPageSize,
        sources: options.sources,
      },
      category,
    );
  }

  return fetchNews(
    {
      category: NEWS_CATEGORY_MAP[category],
      page: options.page,
      pageSize: options.pageSize ?? APP_CONFIG.defaultPageSize,
      sources: options.sources,
    },
    category,
  );
}

export function getArticlesByCategory(
  category: ArticleCategory,
  options: NewsQueryOptions = {},
): Promise<Article[]> {
  return getCategoryNews(category, options).then((result) => result.articles);
}

export function searchNews(query: string, options: NewsQueryOptions = {}): Promise<NewsResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return Promise.resolve({
      articles: [],
      totalResults: 0,
      page: options.page ?? 1,
      pageSize: options.pageSize ?? APP_CONFIG.defaultPageSize,
      hasMore: false,
    });
  }

  return fetchNews({
    q: trimmed,
    page: options.page,
    pageSize: options.pageSize ?? APP_CONFIG.defaultPageSize,
    sources: options.sources,
  });
}

export async function getBreakingNews(): Promise<Article[]> {
  const result = await fetchNews({ pageSize: 10 });

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
 * The News API has no article-detail endpoint, so this resolves from
 * articles already seen this session (list views, search, etc).
 */
export function getArticleBySlug(id: string): Promise<Article | undefined> {
  return Promise.resolve(getRememberedArticle(id));
}
