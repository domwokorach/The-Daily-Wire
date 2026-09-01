import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { deleteComment } from '../services/commentService';

export function useDeleteComment(articleId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: commentKeys.byArticle(articleId) }),
  });

  return {
    deleteComment: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Unable to delete your comment.') : null,
  };
}
