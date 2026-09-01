import { newsApiRequest } from './newsApiClient.js';
import { NEWS_DEFAULT_PAGE_SIZE } from '../../config/news.js';

/**
 * `GET /v2/everything` — article discovery/search. Never issued with only
 * `language`/`sortBy`/etc — NewsAPI requires at least one of `q`, `sources`,
 * or `domains` to scope the request.
 */
export function getEverything({
  query,
  searchIn,
  sources,
  domains,
  excludeDomains,
  from,
  to,
  language = 'en',
  sortBy = 'publishedAt',
  page = 1,
  pageSize = NEWS_DEFAULT_PAGE_SIZE,
} = {}) {
  if (!query?.trim() && !sources && !domains) {
    const error = new Error('A query, sources, or domains filter is required.');
    error.code = 'parametersMissing';
    throw error;
  }

  const params = {
    language,
    sortBy,
    page: String(page),
    pageSize: String(pageSize),
  };

  if (query?.trim()) params.q = query.trim();
  if (searchIn) params.searchIn = searchIn;
  if (sources) params.sources = sources;
  if (domains) params.domains = domains;
  if (excludeDomains) params.excludeDomains = excludeDomains;
  if (from) params.from = from;
  if (to) params.to = to;

  return newsApiRequest('everything', params);
}
