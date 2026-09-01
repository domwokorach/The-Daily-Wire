import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { updateComment } from '../services/commentService';

export function useUpdateComment(articleId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ commentId, body }: { commentId: string; body: string }) => updateComment(commentId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: commentKeys.byArticle(articleId) }),
  });

  return {
    updateComment: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Unable to update your comment.') : null,
  };
}
