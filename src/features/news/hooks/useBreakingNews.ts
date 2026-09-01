import { useQuery } from '@tanstack/react-query';
import type { Article } from '@/data/mockArticles';
import { newsKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { getBreakingNews } from '../services/newsService';

interface UseBreakingNewsResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
}

export function useBreakingNews(): UseBreakingNewsResult {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: newsKeys.breaking(),
    queryFn: getBreakingNews,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    articles: data ?? [],
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Unable to load breaking news right now.') : null,
  };
}
