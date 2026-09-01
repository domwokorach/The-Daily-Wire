import cron from 'node-cron';
import { getEnv } from '../config/env.js';
import { sendDailyDigestToSubscribers, sendWeeklyDigestToSubscribers } from '../services/newsletterService.js';

/**
 * Isolated dispatch scheduling — synchronous in-process cron for now since
 * no job queue exists yet in this app, but every call goes through
 * `newsletterService`'s batched/idempotent dispatch, so swapping this file
 * for a real queue trigger (BullMQ, a hosted cron endpoint, etc.) later
 * requires no changes to the sending logic itself.
 */
export function startNewsletterScheduler() {
  if (!getEnv().newsletterCronEnabled) {
    console.log('[newsletterScheduler] disabled (set NEWSLETTER_CRON_ENABLED=true to enable).');
    return;
  }

  // 07:00 UK time daily.
  cron.schedule('0 7 * * *', () => {
    sendDailyDigestToSubscribers().catch((err) => console.error('[newsletterScheduler] daily digest failed', err));
  });

  // 07:00 UK time every Monday.
  cron.schedule('0 7 * * 1', () => {
    sendWeeklyDigestToSubscribers().catch((err) => console.error('[newsletterScheduler] weekly digest failed', err));
  });

  console.log('[newsletterScheduler] daily and weekly digest jobs scheduled.');
}
