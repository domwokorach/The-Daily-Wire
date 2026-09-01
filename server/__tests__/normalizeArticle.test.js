import { normalizeArticle, normalizeArticles } from '../providers/newsdata/normalizeArticle.js';

test('filters an article with no title', () => {
  expect(normalizeArticle({ title: null, link: 'https://example.com/a' })).toBeNull();
});

test('filters an article with no link', () => {
  expect(normalizeArticle({ title: 'A real headline', link: undefined })).toBeNull();
});

test('filters News API\'s "[Removed]" placeholder', () => {
  expect(normalizeArticle({ title: '[Removed]', link: 'https://example.com/a' })).toBeNull();
});

test('filters an obviously too-short/malformed title', () => {
  expect(normalizeArticle({ title: 'Ok', link: 'https://example.com/a' })).toBeNull();
});

test('maps NewsData.io field names into the clean internal shape', () => {
  const result = normalizeArticle({
    article_id: 'abc123',
    title: 'A real headline about something',
    description: 'A short summary.',
    link: 'https://bbc.co.uk/news/story',
    image_url: 'https://bbc.co.uk/img.jpg',
    creator: ['Jane Smith'],
    pubDate: '2026-09-01 08:42:00',
    source_id: 'bbc',
    source_name: 'BBC News',
    category: ['business'],
  });

  expect(result).toMatchObject({
    id: 'abc123',
    title: 'A real headline about something',
    url: 'https://bbc.co.uk/news/story',
    image: 'https://bbc.co.uk/img.jpg',
    author: 'Jane Smith',
    section: 'business',
    source: { id: 'bbc', name: 'BBC News' },
  });
  expect(result?.publishedAt).toBe('2026-09-01T08:42:00.000Z');
});

test('null image stays null rather than being given a UI fallback (a client concern)', () => {
  const result = normalizeArticle({
    title: 'A real headline about something',
    link: 'https://example.com/a',
    image_url: null,
  });
  expect(result?.image).toBeNull();
});

test('maps politics and world categories directly (no keyword workaround needed)', () => {
  const politics = normalizeArticle({
    title: 'Parliament debates new legislation today',
    link: 'https://bbc.co.uk/a',
    category: ['politics'],
  });
  const world = normalizeArticle({
    title: 'Leaders meet for international summit',
    link: 'https://bbc.co.uk/b',
    category: ['world'],
  });
  expect(politics?.section).toBe('politics');
  expect(world?.section).toBe('world');
});

test('an unrecognised category falls back to general', () => {
  const result = normalizeArticle({
    title: 'A real headline about something',
    link: 'https://example.com/a',
    category: ['lifestyle'],
  });
  expect(result?.section).toBe('general');
});

test('normalizeArticles drops invalid entries and keeps valid ones', () => {
  const result = normalizeArticles([
    { title: 'A real headline about something', link: 'https://example.com/a' },
    { title: '[Removed]', link: 'https://example.com/b' },
    { title: null, link: 'https://example.com/c' },
  ]);
  expect(result).toHaveLength(1);
});
