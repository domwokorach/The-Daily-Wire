# The Daily Wire

A responsive UK-focused news platform built with React and Material UI, integrating live news, weather, Premier League football data, and search behind a dark, editorial interface. The frontend never talks to third-party APIs directly — all external data passes through an internal Express API that owns the provider credentials.

## Project Description

The Daily Wire covers UK-relevant news across Home, Politics, World, Business, Health, Tech, Sport, and Weather, plus a global search. React communicates only with the application's own `/api/*` endpoints; those endpoints are backed by server-side services and provider adapters that talk to the real external APIs.

```text
React (browser)
  ↓
Internal /api/* (Express)
  ↓
Server services
  ↓
Provider adapters
  ↓
NewsAPI.org · OpenWeather · API-Football
```

Third-party API keys live only in server environment variables and are never sent to the browser.

## Preview

> Add screenshots or a deployment URL here.

| Desktop | Tablet | Mobile |
| --- | --- | --- |
| _placeholder_ | _placeholder_ | _placeholder_ |

## Features

### News

- UK-focused article feeds sourced from NewsAPI.org
- Home, Politics, World, Business, Health, and Tech sections
- Article normalisation and deduplication ([server/services/newsDeduplication.js](server/services/newsDeduplication.js), [src/features/news/utils/normalizeArticle.ts](src/features/news/utils/normalizeArticle.ts))
- `country=gb` on the four `top-headlines`-backed sections (Business/Health/Tech/Sport), plus a UK publisher domain allowlist (BBC, The Guardian, Sky News, The Telegraph, The Independent) layered onto the Politics/World editorial queries — see [server/config/ukNewsSources.js](server/config/ukNewsSources.js)
- Responsive story cards and lead-story hierarchy on the homepage

### Weather

- Current conditions: temperature, feels-like, humidity, wind, visibility, pressure, sunrise/sunset
- Multi-day forecast
- UK location search via geocoding
- Metric units by default

### Sport

- Premier League table, live matches, recent results, upcoming fixtures, and top scorers
- Match detail view
- Team and league identifiers kept out of the UI — sourced from [server/config/sports.js](server/config/sports.js)
- Server-side caching tuned for API-Football's free-tier quota

### Search

- Global news search backed by NewsAPI.org's `/v2/everything` endpoint (query/section filters)
- URL-based query state (`/search?q=...`)
- Debounced input via [src/features/news/hooks/useNewsSearch.ts](src/features/news/hooks/useNewsSearch.ts)
- Empty and error states

### Responsive UI

- Desktop, tablet, and mobile layouts on Material UI breakpoints
- Mobile navigation drawer
- Touch-friendly controls

## Tech Stack

| Technology | Purpose |
| --- | --- |
| React 19 | Frontend application |
| Material UI 9 | Component library and design system |
| TanStack Query 5 | Server-state fetching and caching |
| React Router 7 | Client-side routing |
| Zustand | Local/UI state |
| Express 5 | Internal API server |
| NewsAPI.org | News articles and source discovery |
| OpenWeather | Current weather, forecast, and geocoding |
| API-Football (API-Sports) | Premier League data |
| Vite | Development server and build tooling |
| TypeScript | Frontend type safety |
| Jest + Testing Library | Unit and normalisation tests |

## Architecture

```text
Browser
  ↓
React + Material UI (Vite dev server / static build)
  ↓
TanStack Query
  ↓
Frontend services (src/features/*/services)
  ↓
/api/*  (Express, server/index.js)
  ↓
Server routes (server/api/*)
  ↓
Domain services (server/services/*)
  ↓
Server cache (server/cache)
  ↓
Provider adapters (server/providers/*)
  ├── newsapi
  ├── openweather
  └── apiFootball
```

- React never holds a third-party API key.
- Each provider is isolated under its own adapter and only used through a domain service.
- Provider responses are normalised into internal shapes before reaching components (`normalizeArticle`, `normalizeFixture`, `normalizeStandings`, `normalizeWeather`, etc.).
- Server-side caching (see [Caching](#caching)) protects free-tier provider quotas.

## Project Structure

```text
news-storys/
├── public/
├── src/
│   ├── app/                 # App shell, providers, router, query client
│   ├── assets/               # Icons, images, logos
│   ├── components/           # Shared and feature UI (common, layout, news, sport, weather)
│   ├── config/                # App config, route path constants
│   ├── constants/             # Navigation, query keys, fallback image
│   ├── context/                # App-level React context
│   ├── data/                   # Static category/mock data
│   ├── features/
│   │   ├── news/               # News hooks, service, normalisation
│   │   ├── sport/               # Sport hooks, service, types
│   │   └── weather/             # Weather hooks, service, types
│   ├── layouts/                 # MainLayout (nav, drawer, footer)
│   ├── pages/                    # Route-level pages
│   ├── services/                  # Shared apiClient
│   ├── store/                      # Zustand UI store
│   ├── theme/                       # MUI theme, palette, typography, breakpoints
│   └── utils/                        # Date/time/temperature formatting
│
├── server/
│   ├── api/                    # Express routes: news, weather, sports
│   ├── providers/               # newsapi, openweather, apiFootball adapters
│   ├── services/                  # newsService, weatherService, sportsService, dedup
│   ├── config/                     # env.js, sports.js, weather.js, ukNewsSources.js
│   ├── cache/                       # cacheClient, cacheKeys, ttl
│   ├── middleware/                    # errorHandler
│   ├── validators/                     # Request query validation
│   ├── utils/                            # sanitize
│   └── index.js                           # Express app entry point
│
├── .env.example
├── .gitignore
├── package.json
├── vite.config.ts
└── tsconfig*.json
```

## Design System

A dark navy, editorial theme defined in [src/theme/palette.ts](src/theme/palette.ts):

```text
Primary background:  #071426
Elevated surface:     #101F3A
Secondary surface:     #132642

Primary text:      #F7F8FA
Secondary text:     #B8C2D1
Muted / disabled:    #8896AA

Premium gold (primary): #C9A86A
Champagne (primary light): #D7C29E
Refined blue (secondary):   #7FA8D8

Breaking news accent: #9C3B3B
Live accent:            #3E7A63
```

- Minimal shadows and restrained borders
- Generous whitespace
- Editorial typography hierarchy defined in [src/theme/typography.ts](src/theme/typography.ts)
- Responsive breakpoints in [src/theme/breakpoints.ts](src/theme/breakpoints.ts)

## Getting Started

### Prerequisites

- Node.js (see `engines` in a future `package.json` update, or use a current LTS release)
- npm
- API credentials for NewsAPI.org, OpenWeather, and API-Football (see [Environment Variables](#environment-variables))

### Installation

```bash
git clone <repository-url>
cd news-storys
npm install
cp .env.example .env
```

Then fill in the values in `.env` with your own provider credentials.

## Environment Variables

Defined in [server/config/env.js](server/config/env.js) and documented in [.env.example](.env.example):

```env
# NewsAPI.org — development/testing/localhost only on the free Developer
# plan; production requires a plan/licence that permits production use.
NEWS_API_KEY=your_newsapi_api_key_here

# OpenWeather
WEATHER_API_KEY=your_openweather_api_key_here

# API-Football / API-Sports
SPORTS_API_KEY=your_api_football_key_here
SPORTS_API_BASE_URL=https://v3.football.api-sports.io
SPORTS_API_HOST=

# Port the Express API/server process listens on
PORT=8787
```

| Variable | Purpose |
| --- | --- |
| `NEWS_API_KEY` | NewsAPI.org credential used for UK news feeds, sections, search, and source discovery. |
| `WEATHER_API_KEY` | OpenWeather credential used for current weather, geocoding, and forecasts. |
| `SPORTS_API_KEY` | API-Football credential. |
| `SPORTS_API_BASE_URL` | API-Football base endpoint. |
| `SPORTS_API_HOST` | API-Football host header, if required by your plan. |
| `PORT` | Port the Express API server listens on (default `8787`). |

### Environment Security

- Never commit `.env` files — real secrets stay local or in your hosting provider's environment configuration.
- Never expose provider keys through `VITE_*` variables — anything prefixed `VITE_` is bundled into browser code.
- Never include credentials in browser code or log them from the server (`server/index.js` only logs whether each key is configured, never its value).

`.gitignore` already excludes:

```gitignore
.env
.env.local
.env.production
.env.*.local
```

## Running the Project

```bash
npm run dev       # Runs Vite (web) and the Express API concurrently
npm run server     # Runs only the Express API (server/index.js)
npm run build       # Type-checks and builds the production bundle
npm run preview      # Serves the production build locally
npm run test           # Runs the Jest test suite
npm run test:watch      # Runs Jest in watch mode
npm run lint              # Runs ESLint
```

The dev server proxies frontend requests to `/api` (see [src/config/appConfig.ts](src/config/appConfig.ts)); the Express API listens on `PORT` (default `8787`).

## News Integration

Provider: **NewsAPI.org**.

```text
News UI (components/news, pages)
  ↓
News hooks (src/features/news/hooks)
  ↓
Frontend newsService (src/features/news/services/newsService.ts)
  ↓
/api/news/*
  ↓
Server newsService (server/services/newsService.js)
  ↓
NewsAPI provider (server/providers/newsapi)
  ↓
NewsAPI.org
```

Internal endpoints:

```text
GET /api/news              # UK top headlines (headlines.js) — NewsAPI /v2/top-headlines
GET /api/news/everything   # Full-text search / section query (everything.js) — NewsAPI /v2/everything
GET /api/news/sources      # Source discovery (sources.js) — NewsAPI /v2/top-headlines/sources
```

`business`/`health`/`tech`/`sport` map to NewsAPI's own `top-headlines` category; NewsAPI has no native `politics`/`world` category, so those two are served via `/v2/everything` with an editorial UK-focused query instead.

Applied filtering and processing:

- `country=gb` (never `uk`) plus a UK publisher domain allowlist maintained in [server/config/ukNewsSources.js](server/config/ukNewsSources.js) (BBC, The Guardian, Sky News, The Telegraph, The Independent)
- English-language filtering
- Response normalisation ([server/providers/newsapi/normalizeArticle.js](server/providers/newsapi/normalizeArticle.js))
- Deduplication ([server/services/newsDeduplication.js](server/services/newsDeduplication.js))
- Server-side caching, request deduplication, and stale-on-rate-limit fallback (see [Caching](#caching))

The `NEWS_API_KEY` is read only on the server via the `X-Api-Key` header, and is never sent in a URL, exposed to the browser, or returned to the client. NewsAPI.org's free Developer plan is intended for development/testing/localhost only — a production deployment needs a plan/licence that permits production use.

## UK News Categories

Internal section keys, defined in [src/data/categories.ts](src/data/categories.ts):

```text
home
politics
world
business
health
tech
sport
weather
```

These are the React-facing category keys. Provider-specific query parameters (e.g. NewsAPI.org category or domain values) are mapped server-side so the frontend stays independent of provider terminology.

## Weather Integration

Provider: **OpenWeather**.

```text
Weather UI (components/weather, pages/WeatherPage)
  ↓
Weather hooks (src/features/weather/hooks)
  ↓
Frontend weatherService (src/features/weather/services/weatherService.ts)
  ↓
/api/weather/*
  ↓
Server weatherService (server/services/weatherService.js)
  ↓
OpenWeather provider (server/providers/openweather)
```

Internal endpoints:

```text
GET /api/weather/current
GET /api/weather/forecast
GET /api/weather/search
```

- Metric units are used throughout.
- Location search uses OpenWeather geocoding ([server/providers/openweather/geocoding.js](server/providers/openweather/geocoding.js)).
- Current-weather and forecast responses are normalised ([normalizeWeather.js](server/providers/openweather/normalizeWeather.js), [normalizeForecast.js](server/providers/openweather/normalizeForecast.js)) before reaching the client.
- Responses are cached server-side (see [Caching](#caching)).

## Sports Integration

Provider: **API-Football** (API-Sports).

Base URL: `https://v3.football.api-sports.io` (configurable via `SPORTS_API_BASE_URL`).

Authentication uses `SPORTS_API_KEY`, read server-side only ([server/providers/apiFootball/apiFootballClient.js](server/providers/apiFootball/apiFootballClient.js)).

Currently supported competition: **Premier League**, provider league ID `39` (kept in [server/config/sports.js](server/config/sports.js), never hard-coded in routes or components). The default season is pinned to `2023` because the current API key's free plan only serves the 2022–2024 seasons — see the comment in `server/config/sports.js` for details.

### Sports Features

```text
Premier League table
Live matches
Recent results
Upcoming fixtures
Top scorers
Match details
```

Internal endpoints:

```text
GET /api/sports/standings
GET /api/sports/live
GET /api/sports/results
GET /api/sports/fixtures
GET /api/sports/top-scorers
GET /api/sports/teams
GET /api/sports/match/:id
GET /api/sports/leagues    # Dev-only: raw provider league discovery
```

`/api/sports/leagues` and both `/debug` routes (news, weather, sports) are only mounted when `NODE_ENV !== 'production'`.

- **Live** — currently active matches, polled on a short cache TTL.
- **Recent** — completed matches (results).
- **Fixtures** — future matches.

These stay distinct in the UI rather than being merged into a single "matches" list.

### Sports Images

Team badges, league logos, and player photos come directly from provider-returned URLs (not hard-coded per component), normalised through `normalizeTeam.js` / `normalizeFixture.js` / `normalizeMatchDetail.js`. Badges and logos use `object-fit: contain` to avoid distortion.

## Search

```text
/search?q=NHS
```

```text
Search input
  ↓
SearchPage (src/pages/SearchPage.tsx)
  ↓
useNewsSearch (src/features/news/hooks/useNewsSearch.ts)
  ↓
/api/news/everything
  ↓
Server newsService
  ↓
NewsAPI.org
```

- Query normalisation and server-side validation ([server/validators/newsValidator.js](server/validators/newsValidator.js))
- Debounced input
- URL-based query state so searches are shareable/back-button friendly
- Cached repeated queries via TanStack Query and the server cache
- Distinct empty and error states

## Image Handling

- Responsive images with correct aspect ratios; `16:9` is the preferred ratio for lead stories and standard article cards.
- `object-fit: cover` for editorial photography, `object-fit: contain` for team badges and league logos.
- A shared fallback image is used when an article or provider image is missing or broken ([src/constants/fallbackImage.ts](src/constants/fallbackImage.ts)).
- Material UI `Skeleton` placeholders are sized to match the final component to reduce layout shift.

## Caching

Server-side cache TTLs, centralised in [server/cache/ttl.js](server/cache/ttl.js):

```text
News:                 10 minutes
Weather current:       10 minutes
Weather forecast:       15 minutes
Weather location search: 6 hours

Sports live:            30 seconds
Sports fixtures:         5 minutes
Sports results:           30 minutes
Sports standings:          1 hour
Sports leagues/teams/scorers: 24 hours
Sports match detail:     30 seconds
```

These values are tuned for API-Football's free-tier 100-requests/day cap and can be adjusted centrally without touching route or service code.

## Responsive Design

Built on Material UI breakpoints (`xs`, `sm`, `md`, `lg`, `xl`; see [src/theme/breakpoints.ts](src/theme/breakpoints.ts)):

- **Desktop** — multi-column editorial layout, full navigation, larger lead story, full Premier League table.
- **Tablet** — two-column layouts, adaptive tables.
- **Mobile** — drawer navigation ([src/layouts/MainLayout.tsx](src/layouts/MainLayout.tsx)), single-column stories, compact sports rows, touch-friendly controls.

## Accessibility

- Semantic HTML and accessible Material UI components
- Keyboard navigation and visible focus states
- Alt text for editorial images; meaningful images carry accessible descriptions
- ARIA labels where native semantics are insufficient
- Touch-target sizing on mobile controls

## Error Handling

Each feature (news, weather, sport, search) handles loading, success, empty, and error states independently. Examples:

```text
No recent Premier League results available.
No Premier League matches are live right now.
No news results found.
Weather updates are temporarily unavailable.
```

Raw upstream provider errors are never surfaced to the client — errors are caught and transformed server-side ([server/middleware/errorHandler.js](server/middleware/errorHandler.js), and provider-specific `errors.js` files).

## Performance

- TanStack Query caching on the client, server-side provider caching on the API
- Lazy-loaded images with a prioritised lead image
- Reduced duplicate requests via shared query keys ([src/constants/queryKeys.ts](src/constants/queryKeys.ts))
- Avoids unnecessary polling — live sports data only polls while a match is actually live

No specific Lighthouse scores are claimed here; measure against your own deployment.

## Security

- Provider API keys are read only in `server/config/env.js` and never returned to the client
- `.env` is git-ignored; only `.env.example` (with empty/placeholder values) is committed
- Request query parameters are validated server-side ([server/validators](server/validators))
- User-supplied input is sanitised ([server/utils/sanitize.js](server/utils/sanitize.js))
- Debug routes (`/api/*/debug`, `/api/sports/leagues`) are disabled when `NODE_ENV=production`
- Server logs whether a key is configured, never the key value itself

## Testing

Jest + Testing Library are configured and used:

```text
npm run test
npm run test:watch
```

Existing coverage:

- Server: cache key generation, news deduplication, news query validation, article normalisation ([server/__tests__](server/__tests__))
- Frontend: article normalisation, a basic app-render sanity test ([src/features/news/utils/__tests__](src/features/news/utils/__tests__), [src/__tests__](src/__tests__))

This is not full end-to-end or component coverage across every feature — additional tests should be added as features grow.

## Deployment

No deployment provider is preconfigured in this repository. General guidance:

- Configure `NEWS_API_KEY`, `WEATHER_API_KEY`, `SPORTS_API_KEY`, `SPORTS_API_BASE_URL`, `SPORTS_API_HOST`, and `PORT` in your hosting provider's environment settings — never in source. NewsAPI.org's free Developer plan does not permit production use; a production deployment needs a plan/licence that does.
- Run `npm run build` to produce the static frontend bundle; run the Express server (`npm run server` / `server/index.js`) as a separate process or function.
- Ensure `NODE_ENV=production` is set so `/debug` and `/api/sports/leagues` routes are disabled.
- Verify each `/api/*` route responds and that provider connectivity is healthy after deploy.
- Check production logs for provider-configuration issues without exposing credentials.

## API Rate Limits

Free-tier provider plans (particularly API-Football, capped at 100 requests/day) are protected by:

- Server-side caching with TTLs tuned per data type (see [Caching](#caching))
- Only polling live-match data while a match is actually live
- Long TTLs for slow-changing data (leagues, teams, standings, top scorers)

```text
Many browsers
  ↓
Internal /api/*
  ↓
Shared server cache
  ↓
One provider request
```

## Troubleshooting

**News does not load**
Check `NEWS_API_KEY` (server restarted after `.env` changes, correct key, sent via the `X-Api-Key` header), provider quota, server logs, and the `/api/news`, `/api/news/everything`, and `/api/news/sources` responses directly.

**Weather does not load**
Check `WEATHER_API_KEY`, that the OpenWeather key is activated, the coordinates/location being requested, and provider quota.

**Sports data does not load**
Check `SPORTS_API_KEY`, `SPORTS_API_BASE_URL`, `SPORTS_API_HOST`, API-Football quota, the configured league (`server/config/sports.js`), the pinned season, and any provider error in the response body.

**Team badges fail to load**
Check the provider-returned logo URL, image host reachability, and that the fallback image path is correct.

**Search returns no articles**
Check the query string, the `gb` country filter and domain allowlist, the language filter, the raw provider response, and whether a stale cache entry is being served.

Distinguish an empty result (`{ articles: [] }`) from a failed request (`error: true`) — they are handled differently in the UI.

## Roadmap

Planned / not yet implemented:

```text
Additional football competitions beyond the Premier League
Saved articles
User preferences
Breaking-news alerts
Extended weather (hourly, radar)
Article recommendations
Progressive Web App support
```

## Contributing

```text
Fork the repository
Create a feature branch
Commit changes
Open a pull request
```

Please:

- Keep components provider-independent — consume normalised data, not raw provider shapes
- Reuse existing hooks/services rather than duplicating fetch logic
- Add or update tests for new behaviour where practical
- Never commit real API credentials

## Licence

Add the appropriate project licence here. No `LICENSE` file currently exists in this repository.

## Third-Party Content

- News articles remain the property of their original publishers (BBC, The Guardian, Sky News, The Telegraph, The Independent, and others returned by NewsAPI.org).
- Article and editorial images are subject to the originating publisher's or provider's licence terms.
- Team logos, league badges, and player images are subject to API-Football's and the relevant sporting organisations' usage terms.
- Weather data is provided by OpenWeather.
- Sports data is provided by API-Football (API-Sports).

This application does not claim ownership of any third-party editorial or media content it displays. Comply with each provider's terms of use before deploying or redistributing.
