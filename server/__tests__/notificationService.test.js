process.env.DB_PATH = ':memory:';

import { migrate } from '../db/migrate.js';
import { subscribeToBreakingNews, publishBreakingAlert, getRecentAlerts } from '../services/notificationService.js';

beforeAll(() => {
  migrate();
});

describe('breaking news pub/sub', () => {
  test('a subscriber receives a published alert', () => {
    const received = [];
    const unsubscribe = subscribeToBreakingNews((alert) => received.push(alert));

    publishBreakingAlert({ id: 'alert-1', headline: 'Test alert', category: 'politics', url: '/article/alert-1' });

    expect(received).toHaveLength(1);
    expect(received[0].id).toBe('alert-1');
    unsubscribe();
  });

  test('an unsubscribed listener stops receiving alerts', () => {
    const received = [];
    const unsubscribe = subscribeToBreakingNews((alert) => received.push(alert));
    unsubscribe();

    publishBreakingAlert({ id: 'alert-2', headline: 'Another alert', category: 'sport', url: '/article/alert-2' });

    expect(received).toHaveLength(0);
  });

  test('published alerts are tracked in the recent-alerts ring buffer', () => {
    publishBreakingAlert({ id: 'alert-3', headline: 'Ring buffer check', category: 'tech', url: '/article/alert-3' });
    const recent = getRecentAlerts();
    expect(recent.some((a) => a.id === 'alert-3')).toBe(true);
  });
});
