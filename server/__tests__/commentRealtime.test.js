process.env.DB_PATH = ':memory:';

import { migrate } from '../db/migrate.js';
import { register } from '../services/authService.js';
import { createComment, updateComment, deleteComment, listComments } from '../services/commentService.js';
import { subscribeToArticle } from '../realtime/channels.js';
import { COMMENT_CREATED, COMMENT_UPDATED, COMMENT_DELETED } from '../realtime/events.js';

let user;

beforeAll(async () => {
  migrate();
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

describe('comment realtime broadcasts', () => {
  test('creating a comment broadcasts comment.created with the echoed clientMutationId', () => {
    const { events, unsubscribe } = collectEvents('realtime-article-1');

    const { body } = createComment('realtime-article-1', { id: user.id, full_name: user.fullName }, 'hello world', 'mutation-1');

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ type: COMMENT_CREATED, articleId: 'realtime-article-1', clientMutationId: 'mutation-1' });
    expect(events[0].comment.id).toBe(body.comment.id);
    unsubscribe();
  });

  test('updating and deleting a comment broadcasts to the same article channel', () => {
    const { events, unsubscribe } = collectEvents('realtime-article-2');
    const { body } = createComment('realtime-article-2', { id: user.id, full_name: user.fullName }, 'first version');
    const commentId = body.comment.id;

    updateComment(commentId, 'edited version');
    deleteComment(commentId);

    expect(events.map((e) => e.type)).toEqual([COMMENT_CREATED, COMMENT_UPDATED, COMMENT_DELETED]);
    expect(events[1].comment.body).toBe('edited version');
    expect(events[2].commentId).toBe(commentId);
    unsubscribe();
  });

  test('events for one article never reach a subscriber of a different article', () => {
    const { events: eventsA, unsubscribe: unsubA } = collectEvents('realtime-article-a');
    const { events: eventsB, unsubscribe: unsubB } = collectEvents('realtime-article-b');

    createComment('realtime-article-a', { id: user.id, full_name: user.fullName }, 'only for a');

    expect(eventsA).toHaveLength(1);
    expect(eventsB).toHaveLength(0);
    unsubA();
    unsubB();
  });
});

describe('comment pagination and count', () => {
  test('listComments returns a bounded page, a cursor, and the total visible count', () => {
    const articleId = 'paginated-article';
    for (let i = 0; i < 5; i += 1) {
      createComment(articleId, { id: user.id, full_name: user.fullName }, `comment ${i}`);
    }

    const firstPage = listComments(articleId, { limit: 2 });
    expect(firstPage.body.comments).toHaveLength(2);
    expect(firstPage.body.totalCount).toBe(5);
    expect(firstPage.body.nextCursor).toBeTruthy();

    const secondPage = listComments(articleId, { limit: 2, cursor: firstPage.body.nextCursor });
    expect(secondPage.body.comments).toHaveLength(2);
    expect(secondPage.body.comments[0].id).not.toBe(firstPage.body.comments[0].id);
  });

  test('newest-first is the default sort order', () => {
    const articleId = 'sort-order-article';
    const first = createComment(articleId, { id: user.id, full_name: user.fullName }, 'oldest').body.comment;
    const second = createComment(articleId, { id: user.id, full_name: user.fullName }, 'newest').body.comment;

    const { body } = listComments(articleId, {});
    expect(body.comments[0].id).toBe(second.id);
    expect(body.comments[1].id).toBe(first.id);
  });
});
