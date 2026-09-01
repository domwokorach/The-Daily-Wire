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

/** Pagination is cursor-based (NewsData.io's opaque `nextPage` token), not
 * numeric — `pageParam` is `undefined` for the first page, then whatever
 * token the previous page returned. */
export function useNewsSearch(query: string): UseNewsSearchResult {
  const trimmed = query.trim();

  const { data, isLoading, isError, error, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: newsKeys.search(trimmed),
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => searchNews(trimmed, { page: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
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
