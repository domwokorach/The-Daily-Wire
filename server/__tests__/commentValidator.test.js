import { parseArticleIdParam, parseCommentBody } from '../validators/commentValidator.js';

describe('parseArticleIdParam', () => {
  test('rejects an empty article id', () => {
    expect(parseArticleIdParam('').ok).toBe(false);
    expect(parseArticleIdParam(undefined).ok).toBe(false);
  });

  test('accepts a real article id', () => {
    const result = parseArticleIdParam('article-123');
    expect(result.ok).toBe(true);
    expect(result.articleId).toBe('article-123');
  });
});

describe('parseCommentBody', () => {
  test('rejects an empty comment', () => {
    expect(parseCommentBody({ body: '' }).ok).toBe(false);
    expect(parseCommentBody({ body: '   ' }).ok).toBe(false);
  });

  test('trims and accepts a real comment', () => {
    const result = parseCommentBody({ body: '  Great piece!  ' });
    expect(result.ok).toBe(true);
    expect(result.params.body).toBe('Great piece!');
  });

  test('caps comment length rather than rejecting outright', () => {
    const long = 'a'.repeat(5000);
    const result = parseCommentBody({ body: long });
    expect(result.ok).toBe(true);
    expect(result.params.body.length).toBe(2000);
  });
});
