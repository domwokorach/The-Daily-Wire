import { parseSubscribeBody, parsePreferencesUpdateBody, parseUnsubscribeBody } from '../validators/subscriptionValidator.js';

describe('parseSubscribeBody', () => {
  test('rejects an invalid email', () => {
    const result = parseSubscribeBody({ email: 'not-an-email' });
    expect(result.ok).toBe(false);
    expect(result.code).toBe('INVALID_EMAIL');
  });

  test('defaults dailyDigest on and breakingNews off when omitted', () => {
    const result = parseSubscribeBody({ email: 'reader@example.com' });
    expect(result.ok).toBe(true);
    expect(result.params.preferences.dailyDigest).toBe(true);
    expect(result.params.preferences.breakingNews).toBe(false);
  });

  test('drops unknown preference keys and coerces booleans', () => {
    const result = parseSubscribeBody({
      email: 'reader@example.com',
      preferences: { business: 1, sport: 0, notARealCategory: true },
    });
    expect(result.ok).toBe(true);
    expect(result.params.preferences.business).toBe(true);
    expect(result.params.preferences.sport).toBe(false);
    expect(result.params.preferences.notARealCategory).toBeUndefined();
  });

  test('accepts a filled honeypot field without rejecting the request', () => {
    const result = parseSubscribeBody({ email: 'reader@example.com', website: 'http://spam.example' });
    expect(result.ok).toBe(true);
    expect(result.honeypot).toBe(true);
  });
});

describe('parsePreferencesUpdateBody', () => {
  test('requires at least one preference field', () => {
    const result = parsePreferencesUpdateBody({});
    expect(result.ok).toBe(false);
    expect(result.code).toBe('NO_PREFERENCES');
  });

  test('accepts a partial preferences update', () => {
    const result = parsePreferencesUpdateBody({ preferences: { breakingNews: true } });
    expect(result.ok).toBe(true);
    expect(result.params.preferences.breakingNews).toBe(true);
  });
});

describe('parseUnsubscribeBody', () => {
  test('rejects a missing token', () => {
    const result = parseUnsubscribeBody({});
    expect(result.ok).toBe(false);
    expect(result.code).toBe('MISSING_TOKEN');
  });

  test('filters unrecognized category keys', () => {
    const result = parseUnsubscribeBody({ token: 'abc', categories: ['sport', 'notReal'] });
    expect(result.ok).toBe(true);
    expect(result.params.categories).toEqual(['sport']);
  });
});
