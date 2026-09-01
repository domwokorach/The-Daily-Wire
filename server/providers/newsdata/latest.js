import { UK_COUNTRY_CODE, UK_LANGUAGE, UK_NEWS_DOMAINS } from '../../config/ukNewsSources.js';
import { fetchLatest } from './newsDataClient.js';

const UK_DOMAINS_PARAM = UK_NEWS_DOMAINS.join(',');

// NewsData.io's own category vocabulary matches News API's for the four
// sections that have a real category on both providers; politics/world are
// native categories here (they weren't on News API, which is what the old
// keyword-query workaround existed for).
const APP_SECTION_TO_NEWSDATA_CATEGORY = {
  politics: 'politics',
  world: 'world',
  business: 'business',
  health: 'health',
  tech: 'technology',
  sport: 'sports',
};

/**
 * The UK country/latest-headlines feed. `category` here is already
 * News-API-shaped vocabulary from the client (see
 * `src/features/news/constants/newsSections.ts`) — `general` omits the
 * category param entirely (NewsData's broadest pool), matching how the
 * homepage's general feed worked before.
 */
export async function fetchHeadlines({ category, q, pageSize, apiKey }) {
  const params = {
    country: UK_COUNTRY_CODE,
    language: UK_LANGUAGE,
    domain: UK_DOMAINS_PARAM,
    size: pageSize,
    q,
  };
  // NewsData.io uses the same category vocabulary as News API for these
  // (business/health/technology/sports) — passed straight through.
  if (category && category !== 'general') params.category = category;
  return fetchLatest(params, apiKey);
}

/**
 * Article discovery/search. `section` is the app's own section vocabulary
 * (politics/world/business/health/tech/sport) and maps straight to
 * NewsData's native category — no query-string workaround needed for
 * politics/world any more. `page`, when given, is the opaque `nextPage`
 * cursor token from a previous response, never a page number.
 */
export async function fetchSearch({ q, section, timeframe, page, pageSize, apiKey }) {
  const params = {
    country: UK_COUNTRY_CODE,
    language: UK_LANGUAGE,
    domain: UK_DOMAINS_PARAM,
    size: pageSize,
    q,
    timeframe,
    page,
  };
  if (section) params.category = APP_SECTION_TO_NEWSDATA_CATEGORY[section];
  return fetchLatest(params, apiKey);
}
