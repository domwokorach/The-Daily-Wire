export const APP_CONFIG = {
  siteName: 'The Daily Wire',
  siteTagline: 'Independent UK journalism, delivered daily.',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  defaultPageSize: 12,
} as const;
