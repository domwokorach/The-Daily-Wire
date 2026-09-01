import { useQuery } from '@tanstack/react-query';
import { savedArticleKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { listSavedArticles } from '../services/savedArticleService';

/** The `/saved` page's list — cursor pagination via `nextCursor`, not an
 * unbounded fetch of everything the user has ever saved. */
export function useSavedArticles() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: savedArticleKeys.list(),
    queryFn: () => listSavedArticles(),
    staleTime: 30 * 1000,
  });

  return {
    savedArticles: data?.savedArticles ?? [],
    nextCursor: data?.nextCursor ?? null,
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Unable to load your saved articles right now.') : null,
  };
}
