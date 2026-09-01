import type { QueryClient } from '@tanstack/react-query';
import { commentKeys } from '@/constants/queryKeys';
import type { Comment, CommentSort, CommentsPage } from '../types';

const SORTS: CommentSort[] = ['newest', 'oldest'];

/** Applies one cache mutation to every sort variant currently in the
 * cache (`getQueryData` returns `undefined` for a sort the user hasn't
 * switched to yet, so that variant is skipped) — a realtime event or a
 * mutation's result should be visible immediately no matter which sort
 * order is selected when the user next toggles it. */
function updateAllSorts(
  queryClient: QueryClient,
  articleId: string,
  updater: (page: CommentsPage, sort: CommentSort) => CommentsPage,
) {
  for (const sort of SORTS) {
    const key = commentKeys.byArticle(articleId, sort);
    const current = queryClient.getQueryData<CommentsPage>(key);
    if (!current) continue;
    queryClient.setQueryData<CommentsPage>(key, updater(current, sort));
  }
}

/** Inserts a new comment — prepended for newest-first, appended for
 * oldest-first — skipping it if a comment with the same id (or the same
 * pending placeholder id) is already present, so a realtime broadcast of
 * the posting user's own comment never duplicates their optimistic entry. */
export function insertCommentIntoCache(
  queryClient: QueryClient,
  articleId: string,
  comment: Comment,
  clientMutationId?: string,
) {
  updateAllSorts(queryClient, articleId, (page, sort) => {
    const pendingId = clientMutationId ? `pending-${clientMutationId}` : undefined;
    const alreadyPresent = page.comments.some((c) => c.id === comment.id);
    const pendingIndex = pendingId ? page.comments.findIndex((c) => c.id === pendingId) : -1;

    if (alreadyPresent) return page;

    if (pendingIndex !== -1) {
      const comments = [...page.comments];
      comments[pendingIndex] = comment;
      return { ...page, comments };
    }

    const comments = sort === 'oldest' ? [...page.comments, comment] : [comment, ...page.comments];
    return { ...page, comments, totalCount: page.totalCount + 1 };
  });
}

export function replaceCommentInCache(queryClient: QueryClient, articleId: string, comment: Comment) {
  updateAllSorts(queryClient, articleId, (page) => ({
    ...page,
    comments: page.comments.map((c) => (c.id === comment.id ? comment : c)),
  }));
}

export function removeCommentFromCache(queryClient: QueryClient, articleId: string, commentId: string) {
  updateAllSorts(queryClient, articleId, (page) => {
    if (!page.comments.some((c) => c.id === commentId)) return page;
    return {
      ...page,
      comments: page.comments.filter((c) => c.id !== commentId),
      totalCount: Math.max(0, page.totalCount - 1),
    };
  });
}

export function addPendingCommentToCache(
  queryClient: QueryClient,
  articleId: string,
  sort: CommentSort,
  pendingComment: Comment,
) {
  const key = commentKeys.byArticle(articleId, sort);
  const current = queryClient.getQueryData<CommentsPage>(key);
  if (!current) return;
  const comments = sort === 'oldest' ? [...current.comments, pendingComment] : [pendingComment, ...current.comments];
  queryClient.setQueryData<CommentsPage>(key, { ...current, comments, totalCount: current.totalCount + 1 });
}

export function removePendingCommentFromCache(queryClient: QueryClient, articleId: string, pendingId: string) {
  updateAllSorts(queryClient, articleId, (page) => {
    if (!page.comments.some((c) => c.id === pendingId)) return page;
    return {
      ...page,
      comments: page.comments.filter((c) => c.id !== pendingId),
      totalCount: Math.max(0, page.totalCount - 1),
    };
  });
}
