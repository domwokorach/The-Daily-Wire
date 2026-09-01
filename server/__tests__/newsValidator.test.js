import { parseHeadlinesQuery, parseEverythingQuery } from '../validators/newsValidator.js';

describe('parseHeadlinesQuery', () => {
  test('falls back to defaults for missing/invalid values', () => {
    const result = parseHeadlinesQuery({});
    expect(result.category).toBeUndefined();
    expect(result.pageSize).toBe(10);
  });

  test('rejects a category not in the NewsData.io allowlist', () => {
    const result = parseHeadlinesQuery({ category: 'not-a-real-category' });
    expect(result.category).toBeUndefined();
  });

  test('accepts a real category', () => {
    const result = parseHeadlinesQuery({ category: 'business' });
    expect(result.category).toBe('business');
  });

  test('clamps pageSize to the free-tier ceiling of 10', () => {
    const result = parseHeadlinesQuery({ pageSize: '50' });
    expect(result.pageSize).toBe(10);
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

  test('passes the `page` cursor token through as opaque text', () => {
    const result = parseEverythingQuery({ q: 'NHS', page: 'opaque-cursor-token-123' });
    expect(result.params.page).toBe('opaque-cursor-token-123');
  });

  test('converts a recent `from` date into a `timeframe` (hours ago)', () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const result = parseEverythingQuery({ q: 'NHS', from: oneHourAgo });
    expect(result.ok).toBe(true);
    expect(result.params.timeframe).toBe('1');
  });

  test('ignores a `from` date older than the 48h free-tier window rather than erroring', () => {
    const longAgo = new Date(Date.now() - 100 * 60 * 60 * 1000).toISOString();
    const result = parseEverythingQuery({ q: 'NHS', from: longAgo });
    expect(result.ok).toBe(true);
    expect(result.params.timeframe).toBeUndefined();
  });
});
