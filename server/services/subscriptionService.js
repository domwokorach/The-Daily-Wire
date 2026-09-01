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

async function sendConfirmationEmail(subscription) {
  const token = await createConfirmationToken(subscription.id);
  await touchConfirmationSentAt(subscription.id);
  sendSubscriptionConfirmation(subscription.email, token).catch((err) =>
    console.error('[subscriptionService] confirmation email failed', err),
  );
}

/** Creates (or updates) a subscription for `email`. Never activates
 * immediately — an unverified address must confirm via email first
 * (double opt-in), except the caller updating an already-active
 * subscription's preferences. */
export async function subscribe({ email, preferences }, userId = null) {
  const existing = await findSubscriptionByEmail(email);

  if (existing?.status === 'active') {
    const updated = await updatePreferencesRow(existing.id, preferences);
    if (userId && !updated.user_id) await linkUserId(updated.id, userId);
    return {
      status: 200,
      body: { alreadySubscribed: true, message: "You're already subscribed with this email. Preferences updated.", subscription: toPublicSubscription(updated) },
    };
  }

  if (existing?.status === 'pending') {
    const updated = await updatePreferencesRow(existing.id, preferences);
    return {
      status: 200,
      body: { pending: true, message: 'Check your inbox — a confirmation link is already on its way.', subscription: toPublicSubscription(updated) },
    };
  }

  // `unsubscribed`/`bounced`/`complained` addresses re-enter as a fresh
  // pending subscription rather than silently reactivating.
  let subscription;
  if (existing) {
    const updated = await updatePreferencesRow(existing.id, preferences);
    subscription = await setStatus(updated.id, 'pending');
  } else {
    subscription = await createSubscription({ email, userId, preferences });
  }

  await sendConfirmationEmail(subscription);

  return {
    status: 202,
    body: { message: "Check your inbox. We've sent you a link to confirm your subscription.", subscription: toPublicSubscription(subscription) },
  };
}

export async function confirmSubscription(token) {
  const row = await consumeConfirmationToken(token);
  if (!row) return tokenInvalidResponse();

  const activated = await activateSubscription(row.subscription_id);
  await revokeManagementTokens(activated.id);
  const managementToken = await createManagementToken(activated.id);

  sendSubscriptionWelcome(activated.email, managementToken).catch((err) =>
    console.error('[subscriptionService] welcome email failed', err),
  );

  return { status: 200, body: { confirmed: true, subscription: toPublicSubscription(activated) } };
}

export async function resendConfirmation(email) {
  const subscription = await findSubscriptionByEmail(email);
  // Always respond the same way whether or not the address exists, and
  // whether or not it's actually pending — never confirms/denies a
  // subscriber's existence to an unauthenticated caller.
  const genericBody = { message: 'If that address has a pending subscription, a new confirmation email is on its way.' };

  if (!subscription || subscription.status !== 'pending') return { status: 200, body: genericBody };

  if (isWithinResendCooldown(subscription)) {
    return { status: 429, body: { error: true, code: 'RATE_LIMITED', message: 'Please wait a moment before requesting another confirmation email.' } };
  }

  await sendConfirmationEmail(subscription);
  return { status: 200, body: genericBody };
}

export async function getPreferencesForUser(userId) {
  const subscription = await findSubscriptionByUserId(userId);
  if (!subscription) return { status: 200, body: { subscribed: false, subscription: null } };
  return { status: 200, body: { subscribed: true, subscription: toPublicSubscription(subscription) } };
}

/** A verified account email is not the same as newsletter consent — saving
 * preferences from Settings still requires the user to have explicitly
 * chosen them here, but since it's an authenticated, already-verified
 * account email (not an anonymous address), it activates immediately
 * rather than re-running the guest double-opt-in email loop. */
export async function updatePreferencesForUser(userId, userEmail, preferences) {
  let subscription = await findSubscriptionByUserId(userId);

  if (!subscription) {
    const existingByEmail = await findSubscriptionByEmail(userEmail);
    if (existingByEmail) {
      await linkUserId(existingByEmail.id, userId);
      subscription = await findSubscriptionById(existingByEmail.id);
    } else {
      subscription = await createSubscription({ email: userEmail, userId, preferences: {} });
    }
  }

  const updated = await updatePreferencesRow(subscription.id, preferences);
  const active = updated.status === 'active' ? updated : await activateSubscription(updated.id);
  return { status: 200, body: { subscription: toPublicSubscription(active) } };
}

export async function manageByToken(token) {
  const subscription = await findByManagementToken(token);
  if (!subscription) return tokenInvalidResponse();
  return { status: 200, body: { subscription: toPublicSubscription(subscription) } };
}

export async function updatePreferencesByToken(token, preferences) {
  const subscription = await findByManagementToken(token);
  if (!subscription) return tokenInvalidResponse();
  const updated = await updatePreferencesRow(subscription.id, preferences);
  return { status: 200, body: { subscription: toPublicSubscription(updated) } };
}

export async function unsubscribeByToken(token, categories) {
  const subscription = await findByManagementToken(token);
  if (!subscription) return tokenInvalidResponse();

  if (categories && categories.length > 0) {
    const preferences = {};
    for (const key of PREFERENCE_KEYS) {
      preferences[key] = categories.includes(key) ? false : Boolean(subscription[toColumn(key)]);
    }
    const updated = await updatePreferencesRow(subscription.id, preferences);
    return { status: 200, body: { message: 'Preferences updated.', subscription: toPublicSubscription(updated) } };
  }

  const updated = await setStatus(subscription.id, 'unsubscribed');
  return { status: 200, body: { message: 'You have been unsubscribed.', subscription: toPublicSubscription(updated) } };
}

export async function resubscribeByToken(token) {
  const subscription = await findByManagementToken(token);
  if (!subscription) return tokenInvalidResponse();
  const updated = await setStatus(subscription.id, 'active');
  return { status: 200, body: { message: "You're resubscribed.", subscription: toPublicSubscription(updated) } };
}

export async function handleBounce(email) {
  const subscription = await findSubscriptionByEmail(email);
  if (subscription && subscription.status !== 'unsubscribed') await setStatus(subscription.id, 'bounced');
}

export async function handleComplaint(email) {
  const subscription = await findSubscriptionByEmail(email);
  if (subscription) await setStatus(subscription.id, 'complained');
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
