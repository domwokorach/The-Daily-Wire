import { normalizeArticle, type ServerArticle } from '../normalizeArticle';

function serverArticle(overrides: Partial<ServerArticle> = {}): ServerArticle {
  return {
    id: 'abc123',
    title: 'A real headline',
    url: 'https://example.com/a',
    image: null,
    source: { id: 'bbc-news', name: 'BBC News' },
    section: 'business',
    ...overrides,
  };
}

test('passes through a defensive guard for a missing title', () => {
  expect(normalizeArticle(serverArticle({ title: '' }))).toBeUndefined();
});

test('passes through a defensive guard for a missing url', () => {
  expect(normalizeArticle(serverArticle({ url: '' }))).toBeUndefined();
});

test('falls back to a placeholder image when the server image is null', () => {
  const result = normalizeArticle(serverArticle({ image: null }));
  expect(result?.image.startsWith('data:image/svg+xml')).toBe(true);
});

test('carries the server image through untouched when present', () => {
  const result = normalizeArticle(serverArticle({ image: 'https://example.com/photo.jpg' }));
  expect(result?.image).toBe('https://example.com/photo.jpg');
});

test('maps a specific section to category + categoryLabel', () => {
  const result = normalizeArticle(serverArticle({ section: 'business' }));
  expect(result?.category).toBe('business');
  expect(result?.categoryLabel).toBe('Business');
});

test('maps the "general" section to no category', () => {
  const result = normalizeArticle(serverArticle({ section: 'general' }));
  expect(result?.category).toBeUndefined();
});

test('carries the server-assigned id through untouched', () => {
  const result = normalizeArticle(serverArticle({ id: 'xyz789' }));
  expect(result?.id).toBe('xyz789');
});
