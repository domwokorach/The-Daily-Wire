/** ISO 3166-1 alpha-2 country code for the UK. Never `uk`. */
export const UK_COUNTRY_CODE = 'gb';

export const UK_LANGUAGE = 'en';

/**
 * Approved UK publisher domains — editorial policy layered on top of
 * NewsAPI's own `country=gb` filtering, which alone can surface stories
 * about the UK from non-UK publishers rather than UK-published content.
 * NewsAPI's `domains` param (full hostnames, no short-slug format) accepts
 * an arbitrary number of comma-separated values.
 */
export const UK_NEWS_DOMAINS = [
  'bbc.co.uk',
  'theguardian.com',
  'news.sky.com',
  'telegraph.co.uk',
  'independent.co.uk',
];
