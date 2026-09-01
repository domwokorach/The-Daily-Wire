import { hasTestDb, resetTestDb } from './helpers/testDb.js';
import {
  subscribe,
  confirmSubscription,
  resendConfirmation,
  manageByToken,
  updatePreferencesByToken,
  unsubscribeByToken,
} from '../services/subscriptionService.js';
import { findSubscriptionByEmail, createManagementToken } from '../repositories/subscriptionRepository.js';

const maybeDescribe = hasTestDb ? describe : describe.skip;

beforeAll(async () => {
  if (hasTestDb) await resetTestDb();
});

function extractConfirmationToken(sendMock, email) {
  const calls = sendMock.mock.calls.filter((args) => args[0] === email);
  return calls[calls.length - 1]?.[1];
}

jest.mock('../services/emailService.js', () => ({
  sendSubscriptionConfirmation: jest.fn().mockResolvedValue('email_1'),
  sendSubscriptionWelcome: jest.fn().mockResolvedValue('email_2'),
}));

import { sendSubscriptionConfirmation } from '../services/emailService.js';

maybeDescribe('subscribe (double opt-in)', () => {
  test('a new email creates a pending subscription and never activates immediately', async () => {
    const { status, body } = await subscribe({ email: 'Reader@Example.com', preferences: { dailyDigest: true, sport: true } });
    expect(status).toBe(202);
    expect(body.subscription.status).toBe('pending');

    const row = await findSubscriptionByEmail('reader@example.com');
    expect(row.status).toBe('pending');
    expect(row.email.toLowerCase()).toBe('reader@example.com');
  });

  test('confirming the emailed token activates the subscription', async () => {
    await subscribe({ email: 'confirm-me@example.com', preferences: { dailyDigest: true } });
    const token = extractConfirmationToken(sendSubscriptionConfirmation, 'confirm-me@example.com');
    expect(token).toBeTruthy();

    const { status, body } = await confirmSubscription(token);
    expect(status).toBe(200);
    expect(body.subscription.status).toBe('active');
    expect(body.subscription.emailVerified).toBe(true);
  });

  test('an invalid or already-used token is rejected', async () => {
    const { status, body } = await confirmSubscription('not-a-real-token');
    expect(status).toBe(400);
    expect(body.code).toBe('INVALID_TOKEN');
  });

  test('subscribing again while pending does not create a duplicate row', async () => {
    await subscribe({ email: 'dup@example.com', preferences: {} });
    const first = await findSubscriptionByEmail('dup@example.com');

    await subscribe({ email: 'dup@example.com', preferences: { sport: true } });
    const second = await findSubscriptionByEmail('dup@example.com');

    expect(second.id).toBe(first.id);
    expect(second.status).toBe('pending');
  });

  test('resending confirmation is blocked by the cooldown', async () => {
    await subscribe({ email: 'cooldown@example.com', preferences: {} });
    const { status } = await resendConfirmation('cooldown@example.com');
    expect(status).toBe(429);
  });

  test('subscribing again once active updates preferences instead of duplicating', async () => {
    await subscribe({ email: 'active@example.com', preferences: { dailyDigest: true } });
    const token = extractConfirmationToken(sendSubscriptionConfirmation, 'active@example.com');
    await confirmSubscription(token);

    const { status, body } = await subscribe({ email: 'active@example.com', preferences: { sport: true, dailyDigest: false } });
    expect(status).toBe(200);
    expect(body.alreadySubscribed).toBe(true);
    expect(body.subscription.preferences.sport).toBe(true);
    expect(body.subscription.preferences.dailyDigest).toBe(false);
  });
});

maybeDescribe('guest preference management via token', () => {
  test('an active subscriber can update and selectively unsubscribe by management token', async () => {
    await subscribe({ email: 'guest-manage@example.com', preferences: { breakingNews: true, sport: true } });
    const token = extractConfirmationToken(sendSubscriptionConfirmation, 'guest-manage@example.com');
    await confirmSubscription(token);

    const subscription = await findSubscriptionByEmail('guest-manage@example.com');
    const managementToken = await createManagementToken(subscription.id);

    const managed = await manageByToken(managementToken);
    expect(managed.status).toBe(200);
    expect(managed.body.subscription.preferences.breakingNews).toBe(true);

    const updated = await updatePreferencesByToken(managementToken, { breakingNews: false, sport: true, politics: true });
    expect(updated.body.subscription.preferences.breakingNews).toBe(false);
    expect(updated.body.subscription.preferences.politics).toBe(true);

    const unsub = await unsubscribeByToken(managementToken, ['sport']);
    expect(unsub.body.subscription.status).toBe('active');
    expect(unsub.body.subscription.preferences.sport).toBe(false);
    expect(unsub.body.subscription.preferences.politics).toBe(true);

    const fullUnsub = await unsubscribeByToken(managementToken);
    expect(fullUnsub.body.subscription.status).toBe('unsubscribed');
  });

  test('an invalid management token is rejected', async () => {
    const { status, body } = await manageByToken('bogus-token');
    expect(status).toBe(400);
    expect(body.code).toBe('INVALID_TOKEN');
  });
});
