import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { createComment } from '../services/commentService';

export function useCreateComment(articleId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (body: string) => createComment(articleId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: commentKeys.byArticle(articleId) }),
  });

  return {
    createComment: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Unable to post your comment.') : null,
  };
}
