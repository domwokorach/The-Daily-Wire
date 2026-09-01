import { useQuery } from '@tanstack/react-query';
import { commentKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { listComments } from '../services/commentService';

export function useComments(articleId: string) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: commentKeys.byArticle(articleId),
    queryFn: () => listComments(articleId),
    enabled: Boolean(articleId),
    staleTime: 60 * 1000,
  });

  return {
    comments: data ?? [],
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Unable to load comments right now.') : null,
  };
}
