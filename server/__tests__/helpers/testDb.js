import { getPool } from '../../db/connection.js';
import { migrate } from '../../db/migrate.js';

/** These suites need a real Postgres instance — unlike the old
 * better-sqlite3 `:memory:` shim, there's no in-process fake to fall back
 * to. Point POSTGRES_URL (or DATABASE_URL) at a scratch/test database to
 * run them; they skip cleanly (not silently, not a crash) when unset. */
export const hasTestDb = Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL);

export async function resetTestDb() {
  await migrate();
  await getPool().query(
    `TRUNCATE TABLE
       subscription_email_log,
       subscription_management_tokens,
       subscription_confirmation_tokens,
       subscriptions,
       notification_preferences,
       saved_articles,
       comments,
       email_verification_tokens,
       password_reset_tokens,
       sessions,
       users
     RESTART IDENTITY CASCADE`,
  );
}
