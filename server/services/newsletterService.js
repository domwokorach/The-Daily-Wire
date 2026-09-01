import { getHeadlines } from './newsService.js';
import { getEnv } from '../config/env.js';
import {
  listActiveSubscribersByColumn,
  hasDeliveryRecord,
  recordDelivery,
  createManagementToken,
  toPublicSubscription,
} from '../repositories/subscriptionRepository.js';
import { sendDailyDigest, sendWeeklyDigest, sendBreakingNewsEmail } from './emailService.js';

const SECTION_LABELS = {
  politics: 'Politics',
  world: 'World',
  business: 'Business',
  health: 'Health',
  tech: 'Technology',
  sport: 'Sport',
  general: 'News',
};

const DIGEST_STORY_COUNT = 8;
const SECTION_PRIORITY = ['politics', 'world', 'business', 'tech', 'health', 'sport', 'general'];
const BATCH_SIZE = 200;

function toStory(article) {
  return {
    headline: article.title,
    summary: article.description,
    image: article.image,
    url: article.url,
    sectionLabel: SECTION_LABELS[article.section] ?? 'News',
  };
}

/** NewsAPI Articles → Normalize → UK Filter → Deduplicate happens upstream
 * in `getHeadlines`/`runPipeline` (server/services/newsService.js). This
 * stage is Rank → Select — editorial ranking, never a raw provider feed
 * mailed as-is. Diversifies by topic (round-robin over section priority,
 * most important sections first) instead of just taking the top N by
 * recency, so one flood of same-topic stories can't crowd out the rest. */
export function rankAndSelectDigestStories(articles, limit = DIGEST_STORY_COUNT) {
  const bySection = new Map();
  for (const article of articles) {
    const key = SECTION_PRIORITY.includes(article.section) ? article.section : 'general';
    if (!bySection.has(key)) bySection.set(key, []);
    bySection.get(key).push(article);
  }

  const selected = [];
  let round = 0;
  while (selected.length < limit) {
    let addedThisRound = false;
    for (const section of SECTION_PRIORITY) {
      const bucket = bySection.get(section);
      if (bucket && bucket[round]) {
        selected.push(bucket[round]);
        addedThisRound = true;
        if (selected.length >= limit) break;
      }
    }
    if (!addedThisRound) break;
    round += 1;
  }

  return selected.map(toStory);
}

async function fetchRankedStories(limit) {
  if (!getEnv().newsApiKey) {
    console.error('[newsletterService] NEWS_API_KEY is not configured — digest not sent.');
    return [];
  }
  const { status, body } = await getHeadlines({ pageSize: 20 });
  if (status !== 200) return [];
  return rankAndSelectDigestStories(body.articles ?? [], limit);
}

/** Iterates active subscribers for a preference column in bounded pages
 * (never loads the whole table into memory), sending one email per
 * subscriber and skipping any already recorded under `idempotencyKey` —
 * safe to re-run after a partial failure without double-sending. */
async function dispatchToSubscribers(column, buildIdempotencyKey, sendOne) {
  let afterId = null;
  let sentCount = 0;

  for (;;) {
    const page = await listActiveSubscribersByColumn(column, { afterId, limit: BATCH_SIZE });
    if (page.length === 0) break;

    for (const subscriber of page) {
      const idempotencyKey = buildIdempotencyKey(subscriber);
      if (await hasDeliveryRecord(idempotencyKey)) continue;

      try {
        const providerEmailId = await sendOne(subscriber);
        await recordDelivery({ subscriptionId: subscriber.id, idempotencyKey, providerEmailId, status: 'sent' });
        sentCount += 1;
      } catch (err) {
        console.error('[newsletterService] send failed for subscriber', subscriber.id, err);
      }
    }

    afterId = page[page.length - 1].id;
    if (page.length < BATCH_SIZE) break;
  }

  return sentCount;
}

export async function sendDailyDigestToSubscribers(date = new Date().toISOString().slice(0, 10)) {
  const stories = await fetchRankedStories(DIGEST_STORY_COUNT);
  if (stories.length === 0) return 0;

  return dispatchToSubscribers(
    'daily_digest',
    (subscriber) => `daily-digest/${date}/${subscriber.id}`,
    async (subscriber) => {
      const managementToken = await createManagementToken(subscriber.id);
      return sendDailyDigest(subscriber.email, { date, stories, managementToken });
    },
  );
}

function isoWeekLabel(referenceDate = new Date()) {
  const date = new Date(Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), referenceDate.getUTCDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
}

export async function sendWeeklyDigestToSubscribers(weekLabel = isoWeekLabel()) {
  const stories = await fetchRankedStories(DIGEST_STORY_COUNT);
  if (stories.length === 0) return 0;

  return dispatchToSubscribers(
    'weekly_digest',
    (subscriber) => `weekly-digest/${weekLabel}/${subscriber.id}`,
    async (subscriber) => {
      const managementToken = await createManagementToken(subscriber.id);
      return sendWeeklyDigest(subscriber.email, { weekLabel, stories, managementToken });
    },
  );
}

/** Only ever called for an article explicitly flagged as breaking
 * (`alert.breaking === true` or `alert.alertLevel === 'breaking'`) — never
 * for every newly published article. Sends only to subscribers who opted
 * into Breaking News specifically, never to Daily-Digest-only subscribers. */
export async function sendBreakingNewsToSubscribers(alert) {
  if (!alert?.breaking && alert?.alertLevel !== 'breaking') return 0;
  if (!alert.id || !alert.headline || !alert.url) return 0;

  return dispatchToSubscribers(
    'breaking_news',
    (subscriber) => `breaking/${alert.id}/${subscriber.id}`,
    async (subscriber) => {
      const managementToken = await createManagementToken(subscriber.id);
      return sendBreakingNewsEmail(subscriber.email, {
        headline: alert.headline,
        summary: alert.summary,
        url: alert.url,
        managementToken,
      });
    },
  );
}

export { toPublicSubscription };
