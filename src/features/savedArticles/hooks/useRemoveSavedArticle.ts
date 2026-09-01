import { useMutation, useQueryClient } from '@tanstack/react-query';
import { savedArticleKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { removeSavedArticle } from '../services/savedArticleService';

export function useRemoveSavedArticle() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (articleId: string) => removeSavedArticle(articleId),
    onSuccess: (_result, articleId) => {
      queryClient.setQueryData(savedArticleKeys.check(articleId), { saved: false, savedArticle: null });
      queryClient.invalidateQueries({ queryKey: savedArticleKeys.list() });
    },
  });

  return {
    remove: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Unable to remove this saved article.') : null,
  };
}
