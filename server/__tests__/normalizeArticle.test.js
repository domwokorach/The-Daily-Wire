import { normalizeArticle, normalizeArticles } from '../providers/newsapi/normalizeArticle.js';

test('filters an article with no title', () => {
  expect(normalizeArticle({ title: null, url: 'https://example.com/a' })).toBeNull();
});

test('filters an article with no url', () => {
  expect(normalizeArticle({ title: 'A real headline', url: undefined })).toBeNull();
});

test('filters NewsAPI\'s "[Removed]" placeholder', () => {
  expect(normalizeArticle({ title: '[Removed]', url: 'https://example.com/a' })).toBeNull();
});

test('filters an obviously too-short/malformed title', () => {
  expect(normalizeArticle({ title: 'Ok', url: 'https://example.com/a' })).toBeNull();
});

test('maps NewsAPI.org field names into the clean internal shape', () => {
  const result = normalizeArticle(
    {
      title: 'A real headline about something',
      description: 'A short summary.',
      url: 'https://bbc.co.uk/news/story',
      urlToImage: 'https://bbc.co.uk/img.jpg',
      author: 'Jane Smith',
      publishedAt: '2026-09-01T08:42:00Z',
      source: { id: 'bbc-news', name: 'BBC News' },
    },
    'business',
  );

  expect(result).toMatchObject({
    title: 'A real headline about something',
    url: 'https://bbc.co.uk/news/story',
    image: 'https://bbc.co.uk/img.jpg',
    author: 'Jane Smith',
    section: 'business',
    source: { id: 'bbc-news', name: 'BBC News' },
    publishedAt: '2026-09-01T08:42:00Z',
  });
  expect(result?.id).toEqual(expect.any(String));
  expect(result?.id.length).toBeGreaterThan(0);
});

test('derives a stable, deterministic id from the article url', () => {
  const article = { title: 'A real headline about something', url: 'https://example.com/a' };
  const first = normalizeArticle(article);
  const second = normalizeArticle(article);
  expect(first?.id).toBe(second?.id);
});

test('null image stays null rather than being given a UI fallback (a client concern)', () => {
  const result = normalizeArticle({
    title: 'A real headline about something',
    url: 'https://example.com/a',
    urlToImage: null,
  });
  expect(result?.image).toBeNull();
});

test('section comes from the caller (the requested category), not the article', () => {
  const politics = normalizeArticle(
    { title: 'Parliament debates new legislation today', url: 'https://bbc.co.uk/a' },
    'politics',
  );
  const world = normalizeArticle(
    { title: 'Leaders meet for international summit', url: 'https://bbc.co.uk/b' },
    'world',
  );
  expect(politics?.section).toBe('politics');
  expect(world?.section).toBe('world');
});

test('an omitted section falls back to general', () => {
  const result = normalizeArticle({ title: 'A real headline about something', url: 'https://example.com/a' });
  expect(result?.section).toBe('general');
});

test('normalizeArticles drops invalid entries and keeps valid ones', () => {
  const result = normalizeArticles([
    { title: 'A real headline about something', url: 'https://example.com/a' },
    { title: '[Removed]', url: 'https://example.com/b' },
    { title: null, url: 'https://example.com/c' },
  ]);
  expect(result).toHaveLength(1);
});
