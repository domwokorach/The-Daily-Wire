import { newsHeadlinesKey, newsEverythingKey } from '../cache/cacheKeys.js';

test('same params produce the same headlines key regardless of key order', () => {
  const a = newsHeadlinesKey({ category: 'business', page: 1 });
  const b = newsHeadlinesKey({ page: 1, category: 'business' });
  expect(a).toBe(b);
});

test('distinct params produce distinct keys', () => {
  const a = newsHeadlinesKey({ category: 'business' });
  const b = newsHeadlinesKey({ category: 'health' });
  expect(a).not.toBe(b);
});

test('undefined/empty values are excluded from the key', () => {
  const a = newsEverythingKey({ q: 'NHS', from: undefined, to: '' });
  const b = newsEverythingKey({ q: 'NHS' });
  expect(a).toBe(b);
});

test('headlines and everything keys never collide for equivalent params', () => {
  const a = newsHeadlinesKey({ q: 'NHS' });
  const b = newsEverythingKey({ q: 'NHS' });
  expect(a).not.toBe(b);
});
