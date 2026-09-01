import { EventEmitter } from 'node:events';
import webpush from 'web-push';
import {
  getPreferences as getPreferencesRow,
  upsertPreferences,
  setPushSubscription,
  clearPushSubscription,
  listPushSubscribers,
} from '../repositories/notificationPrefRepository.js';
import { getEnv } from '../config/env.js';
import { sendBreakingNewsToSubscribers } from './newsletterService.js';

// Single-process pub/sub for SSE — matches the existing in-memory cache's
// same single-instance limitation (see server/cache/cacheClient.js).
const breakingNewsEmitter = new EventEmitter();
breakingNewsEmitter.setMaxListeners(0);

const RECENT_ALERT_IDS = [];
const RECENT_ALERT_LIMIT = 50;

let vapidConfigured = false;
function ensureVapid() {
  if (vapidConfigured) return true;
  const env = getEnv();
  if (!env.vapidPublicKey || !env.vapidPrivateKey) return false;
  webpush.setVapidDetails(env.vapidSubject, env.vapidPublicKey, env.vapidPrivateKey);
  vapidConfigured = true;
  return true;
}

export function subscribeToBreakingNews(listener) {
  breakingNewsEmitter.on('alert', listener);
  return () => breakingNewsEmitter.off('alert', listener);
}

export function getRecentAlerts() {
  return [...RECENT_ALERT_IDS.map((entry) => entry.alert)];
}

export function publishBreakingAlert(alert) {
  RECENT_ALERT_IDS.push({ id: alert.id, alert });
  if (RECENT_ALERT_IDS.length > RECENT_ALERT_LIMIT) RECENT_ALERT_IDS.shift();

  breakingNewsEmitter.emit('alert', alert);

  sendBreakingNewsToSubscribers(alert).catch((err) =>
    console.error('[notificationService] breaking news email dispatch failed', err),
  );

  if (!ensureVapid()) return;
  const subscribers = listPushSubscribers();
  for (const subscriber of subscribers) {
    if (subscriber.categories.length && !subscriber.categories.includes(alert.category)) continue;
    webpush
      .sendNotification(subscriber.subscription, JSON.stringify({ title: alert.headline, url: alert.url }))
      .catch((err) => console.error('[notificationService] push send failed', err));
  }
}

export function getPreferences(userId) {
  const prefs = getPreferencesRow(userId);
  return {
    status: 200,
    body: {
      categories: prefs.categoriesCsv ? prefs.categoriesCsv.split(',') : [],
      pushEnabled: prefs.pushEnabled,
    },
  };
}

export function updatePreferences(userId, { categories, pushEnabled }) {
  const prefs = upsertPreferences(userId, { categories, pushEnabled });
  return {
    status: 200,
    body: { categories: prefs.categoriesCsv ? prefs.categoriesCsv.split(',') : [], pushEnabled: prefs.pushEnabled },
  };
}

export function subscribePush(userId, subscription) {
  setPushSubscription(userId, subscription);
  return { status: 200, body: { subscribed: true } };
}

export function unsubscribePush(userId) {
  clearPushSubscription(userId);
  return { status: 200, body: { subscribed: false } };
}
