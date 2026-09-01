import { deduplicateArticles } from '../services/newsDeduplication.js';

function article(overrides) {
  return {
    title: 'Headline',
    url: 'https://example.com/story',
    publishedAt: '2026-09-01T09:00:00Z',
    ...overrides,
  };
}

test('identical URLs collapse to one', () => {
  const result = deduplicateArticles([
    article({ url: 'https://bbc.co.uk/a' }),
    article({ url: 'https://bbc.co.uk/a?utm_source=twitter' }),
  ]);
  expect(result).toHaveLength(1);
});

test('near-identical titles about the same event collapse', () => {
  const result = deduplicateArticles([
    article({
      title: 'Bank of England cuts interest rates',
      url: 'https://bbc.co.uk/a',
      publishedAt: '2026-09-01T09:00:00Z',
    }),
    article({
      title: 'Bank of England announces interest-rate cut',
      url: 'https://theguardian.com/b',
      publishedAt: '2026-09-01T09:15:00Z',
    }),
  ]);
  expect(result).toHaveLength(1);
});

test('unrelated stories sharing only generic words do not collapse', () => {
  const result = deduplicateArticles([
    article({ title: 'Government announces new housing policy', url: 'https://bbc.co.uk/a' }),
    article({ title: 'Government announces new tech regulations', url: 'https://theguardian.com/b' }),
  ]);
  expect(result).toHaveLength(2);
});

test('same-topic headlines more than 48h apart do not collapse', () => {
  const result = deduplicateArticles([
    article({
      title: 'Bank of England cuts interest rates',
      url: 'https://bbc.co.uk/a',
      publishedAt: '2026-09-01T09:00:00Z',
    }),
    article({
      title: 'Bank of England cuts interest rates again',
      url: 'https://theguardian.com/b',
      publishedAt: '2026-09-10T09:00:00Z',
    }),
  ]);
  expect(result).toHaveLength(2);
});

test('distinct stories are all kept', () => {
  const result = deduplicateArticles([
    article({ title: 'Bank of England cuts interest rates', url: 'https://bbc.co.uk/a' }),
    article({ title: 'Arsenal signs new striker', url: 'https://bbc.co.uk/b' }),
    article({ title: 'NHS launches new cancer treatment', url: 'https://bbc.co.uk/c' }),
  ]);
  expect(result).toHaveLength(3);
});
