/** ISO 3166-1 alpha-2 country code for the UK. Never `uk`. */
export const UK_COUNTRY_CODE = 'gb';

export const UK_LANGUAGE = 'en';

/**
 * NewsData.io's `country=gb` alone is unreliable for UK relevance — verified
 * live: a business-scoped request came back with an Oklahoma wildfire story
 * and a Nigeria Hajj-allocation story, both tagged `country: ["united
 * kingdom"]`. NewsData.io's country tag reflects the *publisher's*
 * registered country, not the article's subject — the same lesson the News
 * API integration already learned (see git history), just on a different
 * provider. An approved UK publisher `domain=` allowlist (NewsData's own
 * short-slug format, confirmed live: `domain=bbc` works, `bbc.co.uk`
 * doesn't) is the actual UK-relevance enforcement; `country=gb` stays on as
 * a cheap secondary signal.
 *
 * Capped at 5 — NewsData.io rejects more than 5 values in `domain` with a
 * 422 `UnsupportedQueryLength` (confirmed live), unlike News API's `domains`
 * allowlist which had no such limit.
 */
export const UK_NEWS_DOMAINS = ['bbc', 'theguardian', 'skynews', 'telegraph', 'independent'];
