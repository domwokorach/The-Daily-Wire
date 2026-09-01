import { hasTestDb, resetTestDb } from './helpers/testDb.js';
import { register } from '../services/authService.js';
import { createComment, updateComment, deleteComment, listComments } from '../services/commentService.js';
import { findCommentById } from '../repositories/commentRepository.js';
import { anonymizeUserComments } from '../repositories/userRepository.js';

let userA;
let userB;

const maybeDescribe = hasTestDb ? describe : describe.skip;

beforeAll(async () => {
  if (!hasTestDb) return;
  await resetTestDb();
  const a = await register(
    {
      fullName: 'User A',
      dateOfBirth: '1990-01-01',
      email: 'a@example.com',
      mobileNumber: '+447700900001',
      password: 'password one two three',
    },
    'jest',
  );
  const b = await register(
    {
      fullName: 'User B',
      dateOfBirth: '1990-01-01',
      email: 'b@example.com',
      mobileNumber: '+447700900002',
      password: 'password one two three',
    },
    'jest',
  );
  userA = a.body.user;
  userB = b.body.user;
});

maybeDescribe('comment ownership', () => {
  test('a comment can be created and listed for its article', async () => {
    const { body } = await createComment('article-1', { id: userA.id, full_name: userA.fullName }, 'first comment');
    const list = await listComments('article-1');
    expect(list.body.comments.some((c) => c.id === body.comment.id)).toBe(true);
  });

  test('updateComment/deleteComment are only reachable for the row that was actually loaded by ownership middleware', async () => {
    // commentService itself trusts the caller (the requireCommentOwner
    // middleware is what enforces ownership at the HTTP layer) — this test
    // verifies the underlying data operations behave correctly given a
    // comment id, matching what requireCommentOwner would have already
    // authorized.
    const { body } = await createComment('article-2', { id: userA.id, full_name: userA.fullName }, 'owned comment');
    const commentId = body.comment.id;

    const updated = await updateComment(commentId, 'edited body');
    expect(updated.body.comment.edited).toBe(true);
    expect(updated.body.comment.body).toBe('edited body');

    await deleteComment(commentId);
    expect(await findCommentById(commentId)).toBeNull();
  });
});

maybeDescribe('account deletion anonymizes comments instead of removing them', () => {
  test('comments survive with "Deleted User" attribution and a null user id', async () => {
    const { body } = await createComment('article-3', { id: userB.id, full_name: userB.fullName }, 'before deletion');
    await anonymizeUserComments(userB.id);

    const comment = await findCommentById(body.comment.id);
    expect(comment.user_id).toBeNull();
    expect(comment.author_name_snapshot).toBe('Deleted User');
  });
});
