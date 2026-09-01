import { useQuery } from '@tanstack/react-query';
import type { Article } from '@/data/mockArticles';
import { newsKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { getEverything, type EverythingQueryOptions } from '../services/newsService';

interface UseEverythingNewsResult {
  articles: Article[];
  totalResults: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** Generic NewsData.io-backed query (search and/or section) — single page,
 * no pagination. `useSectionNews` and `useNewsSearch` build on the same
 * service function for their own shapes. */
export function useEverythingNews(
  query: string | undefined,
  options: EverythingQueryOptions = {},
): UseEverythingNewsResult {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: newsKeys.everything(query, options),
    queryFn: () => getEverything(query, options),
    enabled: Boolean(query?.trim() || options.section),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    articles: data?.articles ?? [],
    totalResults: data?.totalResults ?? 0,
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Unable to load articles right now.') : null,
    refetch: () => {
      void refetch();
    },
  };
}
