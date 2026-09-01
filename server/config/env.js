// Single place server code reads `process.env` from. Read at call time
// (not cached at import time) so it always reflects the environment the
// process was actually started with.
export function getEnv() {
  return {
    newsApiKey: process.env.NEWS_API_KEY || '',
    weatherApiKey: process.env.WEATHER_API_KEY || '',
    sportsApiKey: process.env.SPORTS_API_KEY || '',
    sportsApiBaseUrl: process.env.SPORTS_API_BASE_URL || '',
    sportsApiHost: process.env.SPORTS_API_HOST || '',
    port: Number(process.env.PORT) || 8787,
    isProduction: process.env.NODE_ENV === 'production',

    databaseUrl: process.env.POSTGRES_URL || process.env.DATABASE_URL || '',
    cronSecret: process.env.CRON_SECRET || '',
    sessionCookieName: process.env.SESSION_COOKIE_NAME || 'dw_session',
    sessionSecret: process.env.SESSION_SECRET || '',
    sessionTtlDays: Number(process.env.SESSION_TTL_DAYS) || 30,
    appOrigin: process.env.APP_ORIGIN || 'http://localhost:5173',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

    resendApiKey: process.env.RESEND_API_KEY || '',
    emailFrom: process.env.EMAIL_FROM || 'The Daily Wire <onboarding@resend.dev>',

    vapidPublicKey: process.env.VAPID_PUBLIC_KEY || '',
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY || '',
    vapidSubject: process.env.VAPID_SUBJECT || 'mailto:support@example.com',

    resendWebhookSecret: process.env.RESEND_WEBHOOK_SECRET || '',
  };
}
