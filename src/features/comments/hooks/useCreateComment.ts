import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/services/apiClient';
import { useAuthStore } from '@/store';
import { createComment } from '../services/commentService';
import { insertCommentIntoCache, addPendingCommentToCache, removePendingCommentFromCache } from '../utils/commentCache';
import type { Comment, CommentSort } from '../types';

interface CreateCommentVariables {
  body: string;
  clientMutationId: string;
}

/**
 * Optimistic posting: the pending comment appears immediately (respecting
 * the active sort order), gets swapped for the server-confirmed comment on
 * success, and is rolled back on failure. `clientMutationId` is what lets
 * this stay correct even if the comment's own realtime broadcast arrives
 * before the POST response does — both paths converge on the same cache
 * update (`insertCommentIntoCache`), so the comment is never duplicated.
 */
export function useCreateComment(articleId: string, sort: CommentSort = 'newest') {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const mutation = useMutation({
    mutationFn: ({ body, clientMutationId }: CreateCommentVariables) => createComment(articleId, body, clientMutationId),
    onMutate: ({ body, clientMutationId }) => {
      if (!user) return;
      const pendingComment: Comment = {
        id: `pending-${clientMutationId}`,
        articleId,
        author: { id: user.id, displayName: user.fullName },
        body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        edited: false,
        pending: true,
      };
      addPendingCommentToCache(queryClient, articleId, sort, pendingComment);
    },
    onSuccess: (result, { clientMutationId }) => {
      insertCommentIntoCache(queryClient, articleId, result.comment, clientMutationId);
    },
    onError: (_error, { clientMutationId }) => {
      removePendingCommentFromCache(queryClient, articleId, `pending-${clientMutationId}`);
    },
  });

  const post = (body: string) => mutation.mutateAsync({ body, clientMutationId: crypto.randomUUID() });

  return {
    createComment: post,
    isLoading: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Your comment could not be posted. Please try again.') : null,
  };
}
