import { newsApiRequest } from './newsApiClient.js';
import { UK_COUNTRY_CODE, UK_LANGUAGE } from '../../config/ukNewsSources.js';

/** `GET /v2/top-headlines/sources` — cached for hours by the service layer,
 * not re-fetched per request. */
export function getSources({ category } = {}) {
  const params = { country: UK_COUNTRY_CODE, language: UK_LANGUAGE };
  if (category) params.category = category;
  return newsApiRequest('top-headlines/sources', params);
}
