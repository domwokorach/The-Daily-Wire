import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/services/apiClient';
import { deleteComment } from '../services/commentService';
import { removeCommentFromCache } from '../utils/commentCache';

export function useDeleteComment(articleId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: (_result, commentId) => removeCommentFromCache(queryClient, articleId, commentId),
  });

  return {
    deleteComment: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Unable to delete your comment.') : null,
  };
}
