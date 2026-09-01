import { hasTestDb, resetTestDb } from './helpers/testDb.js';
import { register } from '../services/authService.js';
import { saveArticle, removeSaved, checkSaved, listSaved } from '../services/savedArticleService.js';
import { parseSaveArticleBody } from '../validators/savedArticleValidator.js';

let user;

const maybeDescribe = hasTestDb ? describe : describe.skip;

beforeAll(async () => {
  if (!hasTestDb) return;
  await resetTestDb();
  const result = await register(
    {
      fullName: 'Saver',
      dateOfBirth: '1990-01-01',
      email: 'saver@example.com',
      mobileNumber: '+447700900010',
      password: 'password one two three',
    },
    'jest',
  );
  user = result.body.user;
});

const SNAPSHOT = {
  articleId: 'article-1',
  title: 'Government announces new policy',
  url: 'https://example.com/story',
  image: 'https://example.com/image.jpg',
  sourceName: 'BBC News',
  category: 'politics',
  publishedAt: '2026-01-01T09:00:00Z',
};

maybeDescribe('saveArticle', () => {
  test('creates a saved article snapshot for the authenticated user', async () => {
    const { status, body } = await saveArticle(user.id, SNAPSHOT);
    expect(status).toBe(201);
    expect(body.saved).toBe(true);
    expect(body.savedArticle.articleId).toBe('article-1');
    expect(body.savedArticle.title).toBe(SNAPSHOT.title);
  });

  test('saving the same article again returns the existing row instead of duplicating', async () => {
    const { status, body } = await saveArticle(user.id, SNAPSHOT);
    expect(status).toBe(200);
    expect(body.alreadySaved).toBe(true);

    const list = await listSaved(user.id, {});
    expect(list.body.savedArticles.filter((a) => a.articleId === 'article-1')).toHaveLength(1);
  });

  test('checkSaved reflects the current state', async () => {
    expect((await checkSaved(user.id, 'article-1')).body.saved).toBe(true);
    expect((await checkSaved(user.id, 'article-999')).body.saved).toBe(false);
  });

  test('removing a saved article makes it disappear from the list', async () => {
    await removeSaved(user.id, 'article-1');
    expect((await checkSaved(user.id, 'article-1')).body.saved).toBe(false);
  });
});

describe('parseSaveArticleBody', () => {
  test('rejects a missing title', () => {
    const result = parseSaveArticleBody({ articleId: 'a1' });
    expect(result.ok).toBe(false);
    expect(result.code).toBe('INVALID_TITLE');
  });

  test('drops a non-http(s) url instead of storing it', () => {
    const result = parseSaveArticleBody({ articleId: 'a1', title: 'Title', url: 'javascript:alert(1)' });
    expect(result.ok).toBe(true);
    expect(result.params.url).toBeUndefined();
  });

  test('rejects an unrecognized category', () => {
    const result = parseSaveArticleBody({ articleId: 'a1', title: 'Title', category: 'gossip' });
    expect(result.ok).toBe(true);
    expect(result.params.category).toBeUndefined();
  });
});
