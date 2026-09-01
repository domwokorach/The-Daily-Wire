import { parseHeadlinesQuery, parseEverythingQuery, parseSourcesQuery } from '../validators/newsValidator.js';

describe('parseHeadlinesQuery', () => {
  test('falls back to defaults for missing/invalid values', () => {
    const result = parseHeadlinesQuery({});
    expect(result.category).toBeUndefined();
    expect(result.pageSize).toBe(20);
  });

  test('rejects a category not in the NewsAPI.org allowlist', () => {
    const result = parseHeadlinesQuery({ category: 'not-a-real-category' });
    expect(result.category).toBeUndefined();
  });

  test('accepts a real category', () => {
    const result = parseHeadlinesQuery({ category: 'business' });
    expect(result.category).toBe('business');
  });

  test('clamps pageSize to the app ceiling of 20', () => {
    const result = parseHeadlinesQuery({ pageSize: '50' });
    expect(result.pageSize).toBe(20);
  });
});

describe('parseEverythingQuery', () => {
  test('requires a search term or section', () => {
    const result = parseEverythingQuery({});
    expect(result.ok).toBe(false);
    expect(result.status).toBe(400);
  });

  test('accepts a bare q', () => {
    const result = parseEverythingQuery({ q: 'NHS' });
    expect(result.ok).toBe(true);
    expect(result.params.q).toBe('NHS');
  });

  test('accepts a valid section, including politics/world', () => {
    const politics = parseEverythingQuery({ section: 'politics' });
    const world = parseEverythingQuery({ section: 'world' });
    expect(politics.ok).toBe(true);
    expect(politics.params.section).toBe('politics');
    expect(world.ok).toBe(true);
    expect(world.params.section).toBe('world');
  });

  test('parses `page` as a numeric page number, defaulting to 1', () => {
    const withPage = parseEverythingQuery({ q: 'NHS', page: '3' });
    expect(withPage.params.page).toBe(3);

    const withoutPage = parseEverythingQuery({ q: 'NHS' });
    expect(withoutPage.params.page).toBe(1);
  });

  test('defaults sortBy to publishedAt and rejects an unrecognised value', () => {
    const result = parseEverythingQuery({ q: 'NHS', sortBy: 'not-a-real-sort' });
    expect(result.params.sortBy).toBe('publishedAt');
  });

  test('accepts a valid sortBy', () => {
    const result = parseEverythingQuery({ q: 'NHS', sortBy: 'popularity' });
    expect(result.params.sortBy).toBe('popularity');
  });

  test('passes through valid `from`/`to` ISO dates', () => {
    const from = '2026-08-01';
    const to = '2026-08-31';
    const result = parseEverythingQuery({ q: 'NHS', from, to });
    expect(result.params.from).toBe(from);
    expect(result.params.to).toBe(to);
  });
});

describe('parseSourcesQuery', () => {
  test('accepts no category', () => {
    const result = parseSourcesQuery({});
    expect(result.category).toBeUndefined();
  });

  test('accepts a valid source category', () => {
    const result = parseSourcesQuery({ category: 'technology' });
    expect(result.category).toBe('technology');
  });

  test('rejects an invalid source category', () => {
    const result = parseSourcesQuery({ category: 'not-a-real-category' });
    expect(result.category).toBeUndefined();
  });
});
