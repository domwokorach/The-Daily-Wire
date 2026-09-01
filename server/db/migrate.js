import { getPool } from './connection.js';

const STATEMENTS = [
  `CREATE EXTENSION IF NOT EXISTS citext`,

  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    email CITEXT NOT NULL UNIQUE,
    mobile TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    email_verified_at TIMESTAMPTZ,
    pending_email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    user_agent TEXT,
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`,

  `CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ
  )`,

  `CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_email TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ
  )`,

  `CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    seq BIGSERIAL,
    article_id TEXT NOT NULL,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    author_name_snapshot TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    edited_at TIMESTAMPTZ,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'visible'
  )`,
  `CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id, created_at)`,

  `CREATE TABLE IF NOT EXISTS saved_articles (
    id TEXT PRIMARY KEY,
    seq BIGSERIAL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    article_id TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT,
    image TEXT,
    source_name TEXT,
    category TEXT,
    published_at TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, article_id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_saved_articles_user_id ON saved_articles(user_id, created_at)`,

  `CREATE TABLE IF NOT EXISTS notification_preferences (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    categories_csv TEXT NOT NULL DEFAULT '',
    push_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    push_subscription_json TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    email CITEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending',
    daily_digest BOOLEAN NOT NULL DEFAULT FALSE,
    weekly_digest BOOLEAN NOT NULL DEFAULT FALSE,
    breaking_news BOOLEAN NOT NULL DEFAULT FALSE,
    politics BOOLEAN NOT NULL DEFAULT FALSE,
    world BOOLEAN NOT NULL DEFAULT FALSE,
    business BOOLEAN NOT NULL DEFAULT FALSE,
    health BOOLEAN NOT NULL DEFAULT FALSE,
    tech BOOLEAN NOT NULL DEFAULT FALSE,
    sport BOOLEAN NOT NULL DEFAULT FALSE,
    email_verified_at TIMESTAMPTZ,
    last_confirmation_sent_at TIMESTAMPTZ,
    subscribed_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status)`,

  `CREATE TABLE IF NOT EXISTS subscription_confirmation_tokens (
    id TEXT PRIMARY KEY,
    subscription_id TEXT NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_subscription_confirmation_tokens_subscription_id ON subscription_confirmation_tokens(subscription_id)`,

  `CREATE TABLE IF NOT EXISTS subscription_management_tokens (
    id TEXT PRIMARY KEY,
    subscription_id TEXT NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_subscription_management_tokens_subscription_id ON subscription_management_tokens(subscription_id)`,

  `CREATE TABLE IF NOT EXISTS subscription_email_log (
    id TEXT PRIMARY KEY,
    subscription_id TEXT NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    email_type TEXT NOT NULL,
    article_id TEXT,
    idempotency_key TEXT NOT NULL UNIQUE,
    provider_email_id TEXT,
    status TEXT NOT NULL DEFAULT 'sent',
    sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_subscription_email_log_subscription_id ON subscription_email_log(subscription_id)`,
];

export async function migrate() {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    for (const statement of STATEMENTS) await client.query(statement);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
