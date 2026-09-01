import {
  findSubscriptionByEmail,
  findSubscriptionById,
  findSubscriptionByUserId,
  createSubscription,
  updatePreferences as updatePreferencesRow,
  linkUserId,
  activateSubscription,
  setStatus,
  touchConfirmationSentAt,
  isWithinResendCooldown,
  createConfirmationToken,
  consumeConfirmationToken,
  createManagementToken,
  findByManagementToken,
  revokeManagementTokens,
  toPublicSubscription,
  PREFERENCE_KEYS,
} from '../repositories/subscriptionRepository.js';
import { sendSubscriptionConfirmation, sendSubscriptionWelcome } from './emailService.js';

function tokenInvalidResponse() {
  return {
    status: 400,
    body: { error: true, code: 'INVALID_TOKEN', message: 'This link is invalid, expired, or has already been used.' },
  };
}

function sendConfirmationEmail(subscription) {
  const token = createConfirmationToken(subscription.id);
  touchConfirmationSentAt(subscription.id);
  sendSubscriptionConfirmation(subscription.email, token).catch((err) =>
    console.error('[subscriptionService] confirmation email failed', err),
  );
}

/** Creates (or updates) a subscription for `email`. Never activates
 * immediately — an unverified address must confirm via email first
 * (double opt-in), except the caller updating an already-active
 * subscription's preferences. */
export function subscribe({ email, preferences }, userId = null) {
  const existing = findSubscriptionByEmail(email);

  if (existing?.status === 'active') {
    const updated = updatePreferencesRow(existing.id, preferences);
    if (userId && !updated.user_id) linkUserId(updated.id, userId);
    return {
      status: 200,
      body: { alreadySubscribed: true, message: "You're already subscribed with this email. Preferences updated.", subscription: toPublicSubscription(updated) },
    };
  }

  if (existing?.status === 'pending') {
    const updated = updatePreferencesRow(existing.id, preferences);
    return {
      status: 200,
      body: { pending: true, message: 'Check your inbox — a confirmation link is already on its way.', subscription: toPublicSubscription(updated) },
    };
  }

  // `unsubscribed`/`bounced`/`complained` addresses re-enter as a fresh
  // pending subscription rather than silently reactivating.
  const subscription = existing
    ? (() => {
        const updated = updatePreferencesRow(existing.id, preferences);
        return setStatus(updated.id, 'pending');
      })()
    : createSubscription({ email, userId, preferences });

  sendConfirmationEmail(subscription);

  return {
    status: 202,
    body: { message: "Check your inbox. We've sent you a link to confirm your subscription.", subscription: toPublicSubscription(subscription) },
  };
}

export function confirmSubscription(token) {
  const row = consumeConfirmationToken(token);
  if (!row) return tokenInvalidResponse();

  const activated = activateSubscription(row.subscription_id);
  revokeManagementTokens(activated.id);
  const managementToken = createManagementToken(activated.id);

  sendSubscriptionWelcome(activated.email, managementToken).catch((err) =>
    console.error('[subscriptionService] welcome email failed', err),
  );

  return { status: 200, body: { confirmed: true, subscription: toPublicSubscription(activated) } };
}

export function resendConfirmation(email) {
  const subscription = findSubscriptionByEmail(email);
  // Always respond the same way whether or not the address exists, and
  // whether or not it's actually pending — never confirms/denies a
  // subscriber's existence to an unauthenticated caller.
  const genericBody = { message: 'If that address has a pending subscription, a new confirmation email is on its way.' };

  if (!subscription || subscription.status !== 'pending') return { status: 200, body: genericBody };

  if (isWithinResendCooldown(subscription)) {
    return { status: 429, body: { error: true, code: 'RATE_LIMITED', message: 'Please wait a moment before requesting another confirmation email.' } };
  }

  sendConfirmationEmail(subscription);
  return { status: 200, body: genericBody };
}

export function getPreferencesForUser(userId) {
  const subscription = findSubscriptionByUserId(userId);
  if (!subscription) return { status: 200, body: { subscribed: false, subscription: null } };
  return { status: 200, body: { subscribed: true, subscription: toPublicSubscription(subscription) } };
}

/** A verified account email is not the same as newsletter consent — saving
 * preferences from Settings still requires the user to have explicitly
 * chosen them here, but since it's an authenticated, already-verified
 * account email (not an anonymous address), it activates immediately
 * rather than re-running the guest double-opt-in email loop. */
export function updatePreferencesForUser(userId, userEmail, preferences) {
  let subscription = findSubscriptionByUserId(userId);

  if (!subscription) {
    const existingByEmail = findSubscriptionByEmail(userEmail);
    subscription = existingByEmail
      ? (linkUserId(existingByEmail.id, userId), findSubscriptionById(existingByEmail.id))
      : createSubscription({ email: userEmail, userId, preferences: {} });
  }

  const updated = updatePreferencesRow(subscription.id, preferences);
  const active = updated.status === 'active' ? updated : activateSubscription(updated.id);
  return { status: 200, body: { subscription: toPublicSubscription(active) } };
}

export function manageByToken(token) {
  const subscription = findByManagementToken(token);
  if (!subscription) return tokenInvalidResponse();
  return { status: 200, body: { subscription: toPublicSubscription(subscription) } };
}

export function updatePreferencesByToken(token, preferences) {
  const subscription = findByManagementToken(token);
  if (!subscription) return tokenInvalidResponse();
  const updated = updatePreferencesRow(subscription.id, preferences);
  return { status: 200, body: { subscription: toPublicSubscription(updated) } };
}

export function unsubscribeByToken(token, categories) {
  const subscription = findByManagementToken(token);
  if (!subscription) return tokenInvalidResponse();

  if (categories && categories.length > 0) {
    const preferences = {};
    for (const key of PREFERENCE_KEYS) {
      preferences[key] = categories.includes(key) ? false : Boolean(subscription[toColumn(key)]);
    }
    const updated = updatePreferencesRow(subscription.id, preferences);
    return { status: 200, body: { message: 'Preferences updated.', subscription: toPublicSubscription(updated) } };
  }

  const updated = setStatus(subscription.id, 'unsubscribed');
  return { status: 200, body: { message: 'You have been unsubscribed.', subscription: toPublicSubscription(updated) } };
}

export function resubscribeByToken(token) {
  const subscription = findByManagementToken(token);
  if (!subscription) return tokenInvalidResponse();
  const updated = setStatus(subscription.id, 'active');
  return { status: 200, body: { message: "You're resubscribed.", subscription: toPublicSubscription(updated) } };
}

export function handleBounce(email) {
  const subscription = findSubscriptionByEmail(email);
  if (subscription && subscription.status !== 'unsubscribed') setStatus(subscription.id, 'bounced');
}

export function handleComplaint(email) {
  const subscription = findSubscriptionByEmail(email);
  if (subscription) setStatus(subscription.id, 'complained');
}

const COLUMN_BY_KEY = {
  dailyDigest: 'daily_digest',
  weeklyDigest: 'weekly_digest',
  breakingNews: 'breaking_news',
  politics: 'politics',
  world: 'world',
  business: 'business',
  health: 'health',
  tech: 'tech',
  sport: 'sport',
};

function toColumn(key) {
  return COLUMN_BY_KEY[key];
}
