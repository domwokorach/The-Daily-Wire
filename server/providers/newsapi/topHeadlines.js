import { newsApiRequest } from './newsApiClient.js';
import { UK_COUNTRY_CODE } from '../../config/ukNewsSources.js';
import { NEWS_DEFAULT_PAGE_SIZE } from '../../config/news.js';

/** `GET /v2/top-headlines` — UK headlines, optionally scoped to one of
 * NewsAPI's native categories (business/health/technology/sports/etc). */
export function getUKHeadlines({ category, query, page = 1, pageSize = NEWS_DEFAULT_PAGE_SIZE } = {}) {
  const params = {
    country: UK_COUNTRY_CODE,
    page: String(page),
    pageSize: String(pageSize),
  };

  if (category) params.category = category;
  if (query) params.q = query;

  return newsApiRequest('top-headlines', params);
}
