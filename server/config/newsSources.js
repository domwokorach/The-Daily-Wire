// Centralised UK content policy for the News API integration.
//
// News API's curated `sources` registry only tags a handful of outlets as
// `country: "gb"` (BBC, Independent, TalkSport, FourFourTwo, ...) — most
// major UK publishers (Guardian, Telegraph, Times, Sky News, Daily Mail,
// FT, ...) aren't in that registry at all. The `/v2/everything` endpoint
// also has no `country` parameter. So UK-only coverage for search-style
// requests is enforced with a domain allowlist instead, per News API's
// own recommended pattern for this case.

/** ISO 3166-1 alpha-2 country code News API expects for the UK. Never `uk`. */
export const UK_COUNTRY_CODE = 'gb';

export const UK_LANGUAGE = 'en';

/**
 * Approved UK publisher domains for `/v2/everything?domains=...`.
 *
 * Kept deliberately short: in practice News API's free tier gets visibly
 * less reliable — `totalResults > 0` with an empty `articles` array — as
 * this list (and the query alongside it) grows longer. Ten well-known,
 * broad-spectrum UK outlets is enough for solid coverage without tipping
 * into that failure mode.
 */
export const UK_NEWS_DOMAINS = [
  'bbc.co.uk',
  'theguardian.com',
  'telegraph.co.uk',
  'independent.co.uk',
  'thetimes.co.uk',
  'skynews.com',
  'dailymail.co.uk',
  'mirror.co.uk',
  'standard.co.uk',
  'metro.co.uk',
];

/**
 * News API `sources` ids actually tagged `country: "gb"` in its registry.
 * Used only to validate a client-supplied `sources` param — never trusted
 * as-is.
 */
export const UK_SOURCE_IDS = [
  'bbc-news',
  'bbc-sport',
  'four-four-two',
  'google-news-uk',
  'independent',
  'talksport',
  'the-lad-bible',
  'the-sport-bible',
];

export function isApprovedUkSourceId(id) {
  return UK_SOURCE_IDS.includes(id);
}

/**
 * News API's `top-headlines?country=gb` intermittently returns zero results
 * for entire categories (an upstream availability issue, not a client
 * error — the small `gb`-tagged source registry sometimes has nothing
 * freshly indexed for a given category). When that happens the server
 * falls back to `/v2/everything` scoped to `UK_NEWS_DOMAINS`, using these
 * category-flavoured search terms so the fallback still reads as that
 * section rather than generic UK news.
 */
// Kept short (3-4 OR terms, at most one quoted phrase) for the same
// reliability reason as the domain list above — long, complex queries are
// where News API's free tier gets flaky.
export const UK_CATEGORY_FALLBACK_QUERY = {
  business: 'economy OR FTSE OR "Bank of England" OR inflation',
  health: 'NHS OR hospital OR "public health"',
  technology: 'technology OR AI OR cybersecurity',
  sports: '"Premier League" OR football OR rugby OR cricket',
};
