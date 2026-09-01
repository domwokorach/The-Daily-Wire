// Centralized NewsAPI.org provider configuration — kept server-side only.
export const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// App section (nav/query vocabulary) -> NewsAPI `top-headlines` category.
// Politics/World have no native NewsAPI category, so they aren't listed
// here — they're served via `/v2/everything` (see `NEWS_SECTION_QUERIES`).
export const APP_SECTION_TO_PROVIDER_CATEGORY = {
  business: 'business',
  health: 'health',
  tech: 'technology',
  sport: 'sports',
};

// NewsAPI `top-headlines` category -> internal normalized article `section`.
export const PROVIDER_CATEGORY_TO_APP_SECTION = {
  business: 'business',
  health: 'health',
  technology: 'tech',
  sports: 'sport',
};

// NewsAPI has no native "politics" or "world" category — these sections are
// served via `/v2/everything` with an editorial UK-focused query instead of
// a `category` param. The other four sections have query fallbacks here too
// (see the `/v2/everything` fallback in `newsService.js`'s `getHeadlines`
// and `getEverything`) — some NewsAPI.org plans/keys silently return zero
// `articles` for `/v2/top-headlines` once `country` is set (a
// `totalResults`-with-empty-`articles` response, not an error), so every
// section needs a working `/v2/everything` query to fall back to.
export const NEWS_SECTION_QUERIES = {
  politics: 'Westminster OR Parliament OR "Prime Minister" OR "Downing Street" OR government',
  world: 'Ukraine OR Europe OR NATO OR China OR "Middle East" OR "United States"',
  business: 'business OR economy OR markets OR finance OR companies',
  health: 'health OR NHS OR hospital OR medicine OR wellbeing',
  tech: 'technology OR AI OR software OR "artificial intelligence" OR tech',
  sport: 'football OR cricket OR rugby OR tennis OR "Premier League" OR sport',
};

export const NEWS_DEFAULT_PAGE_SIZE = 20;
export const NEWS_MAX_PAGE_SIZE = 20;
