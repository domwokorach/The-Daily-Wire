import { hasTestDb, resetTestDb } from './helpers/testDb.js';
import { register } from '../services/authService.js';
import { createComment, updateComment, deleteComment, listComments } from '../services/commentService.js';
import { subscribeToArticle } from '../realtime/channels.js';
import { COMMENT_CREATED, COMMENT_UPDATED, COMMENT_DELETED } from '../realtime/events.js';

let user;

const maybeDescribe = hasTestDb ? describe : describe.skip;

beforeAll(async () => {
  if (!hasTestDb) return;
  await resetTestDb();
  const result = await register(
    {
      fullName: 'Commenter',
      dateOfBirth: '1990-01-01',
      email: 'commenter@example.com',
      mobileNumber: '+447700900011',
      password: 'password one two three',
    },
    'jest',
  );
  user = result.body.user;
});

function collectEvents(articleId) {
  const events = [];
  const unsubscribe = subscribeToArticle(articleId, (event) => events.push(event));
  return { events, unsubscribe };
}

maybeDescribe('comment realtime broadcasts', () => {
  test('creating a comment broadcasts comment.created with the echoed clientMutationId', async () => {
    const { events, unsubscribe } = collectEvents('realtime-article-1');

    const { body } = await createComment('realtime-article-1', { id: user.id, full_name: user.fullName }, 'hello world', 'mutation-1');

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ type: COMMENT_CREATED, articleId: 'realtime-article-1', clientMutationId: 'mutation-1' });
    expect(events[0].comment.id).toBe(body.comment.id);
    unsubscribe();
  });

  test('updating and deleting a comment broadcasts to the same article channel', async () => {
    const { events, unsubscribe } = collectEvents('realtime-article-2');
    const { body } = await createComment('realtime-article-2', { id: user.id, full_name: user.fullName }, 'first version');
    const commentId = body.comment.id;

    await updateComment(commentId, 'edited version');
    await deleteComment(commentId);

    expect(events.map((e) => e.type)).toEqual([COMMENT_CREATED, COMMENT_UPDATED, COMMENT_DELETED]);
    expect(events[1].comment.body).toBe('edited version');
    expect(events[2].commentId).toBe(commentId);
    unsubscribe();
  });

  test('events for one article never reach a subscriber of a different article', async () => {
    const { events: eventsA, unsubscribe: unsubA } = collectEvents('realtime-article-a');
    const { events: eventsB, unsubscribe: unsubB } = collectEvents('realtime-article-b');

    await createComment('realtime-article-a', { id: user.id, full_name: user.fullName }, 'only for a');

    expect(eventsA).toHaveLength(1);
    expect(eventsB).toHaveLength(0);
    unsubA();
    unsubB();
  });
});

maybeDescribe('comment pagination and count', () => {
  test('listComments returns a bounded page, a cursor, and the total visible count', async () => {
    const articleId = 'paginated-article';
    for (let i = 0; i < 5; i += 1) {
      await createComment(articleId, { id: user.id, full_name: user.fullName }, `comment ${i}`);
    }

    const firstPage = await listComments(articleId, { limit: 2 });
    expect(firstPage.body.comments).toHaveLength(2);
    expect(firstPage.body.totalCount).toBe(5);
    expect(firstPage.body.nextCursor).toBeTruthy();

    const secondPage = await listComments(articleId, { limit: 2, cursor: firstPage.body.nextCursor });
    expect(secondPage.body.comments).toHaveLength(2);
    expect(secondPage.body.comments[0].id).not.toBe(firstPage.body.comments[0].id);
  });

  test('newest-first is the default sort order', async () => {
    const articleId = 'sort-order-article';
    const first = (await createComment(articleId, { id: user.id, full_name: user.fullName }, 'oldest')).body.comment;
    const second = (await createComment(articleId, { id: user.id, full_name: user.fullName }, 'newest')).body.comment;

    const { body } = await listComments(articleId, {});
    expect(body.comments[0].id).toBe(second.id);
    expect(body.comments[1].id).toBe(first.id);
  });
});
