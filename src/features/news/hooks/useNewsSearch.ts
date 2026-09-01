import { useInfiniteQuery } from '@tanstack/react-query';
import type { Article } from '@/data/mockArticles';
import { newsKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { searchNews } from '../services/newsService';

interface UseNewsSearchResult {
  articles: Article[];
  totalResults: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  refetch: () => void;
  loadMore: () => void;
}

/** Pagination is numeric (NewsAPI.org's `page`/`pageSize`) — `pageParam` is
 * `1` for the first page, then `lastPage.page + 1` while `hasMore` holds. */
export function useNewsSearch(query: string): UseNewsSearchResult {
  const trimmed = query.trim();

  const { data, isLoading, isError, error, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: newsKeys.search(trimmed),
    queryFn: ({ pageParam }: { pageParam: number }) => searchNews(trimmed, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    enabled: Boolean(trimmed),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    articles: data?.pages.flatMap((page) => page.articles) ?? [],
    totalResults: data?.pages[0]?.totalResults ?? 0,
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Unable to search right now. Please try again shortly.') : null,
    hasMore: hasNextPage ?? false,
    refetch: () => {
      void refetch();
    },
    loadMore: () => {
      void fetchNextPage();
    },
  };
}
