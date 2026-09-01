import { useQuery } from '@tanstack/react-query';
import { savedArticleKeys } from '@/constants/queryKeys';
import { useAuthStore } from '@/store';
import { checkSavedArticle } from '../services/savedArticleService';

/** Only ever queries when signed in — a logged-out visitor's saved state is
 * always `false` without a network round trip. */
export function useIsArticleSaved(articleId: string) {
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');

  const { data, isLoading } = useQuery({
    queryKey: savedArticleKeys.check(articleId),
    queryFn: () => checkSavedArticle(articleId),
    enabled: isAuthenticated && Boolean(articleId),
    staleTime: 30 * 1000,
  });

  return { isSaved: data?.saved ?? false, loading: isAuthenticated && isLoading };
}
