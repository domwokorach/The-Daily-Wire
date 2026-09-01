import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/services/apiClient';
import { updateComment } from '../services/commentService';
import { replaceCommentInCache } from '../utils/commentCache';

export function useUpdateComment(articleId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ commentId, body }: { commentId: string; body: string }) => updateComment(commentId, body),
    onSuccess: (comment) => replaceCommentInCache(queryClient, articleId, comment),
  });

  return {
    updateComment: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Unable to update your comment.') : null,
  };
}
