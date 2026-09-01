import { useQuery } from '@tanstack/react-query';
import type { Article } from '@/data/mockArticles';
import type { ArticleCategory } from '@/data/categories';
import { newsKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { getArticles, getArticlesByCategory } from '../services/newsService';

interface UseTopHeadlinesResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** `top-headlines?country=gb`, optionally scoped to a category. Only for
 * sections News API has a real category for — see `useSectionNews` for
 * politics/world. */
export function useTopHeadlines(category?: ArticleCategory): UseTopHeadlinesResult {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: newsKeys.headlines(category),
    queryFn: () => (category ? getArticlesByCategory(category) : getArticles()),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    articles: data ?? [],
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Unable to load articles right now.') : null,
    refetch: () => {
      void refetch();
    },
  };
}
