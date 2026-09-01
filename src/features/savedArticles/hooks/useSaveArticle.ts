import { useMutation, useQueryClient } from '@tanstack/react-query';
import { savedArticleKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { saveArticle } from '../services/savedArticleService';
import type { SaveArticlePayload } from '../types';

export function useSaveArticle() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: SaveArticlePayload) => saveArticle(payload),
    onSuccess: (result, payload) => {
      queryClient.setQueryData(savedArticleKeys.check(payload.articleId), { saved: true, savedArticle: result.savedArticle });
      queryClient.invalidateQueries({ queryKey: savedArticleKeys.list() });
    },
  });

  return {
    save: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Unable to save this article.') : null,
  };
}
