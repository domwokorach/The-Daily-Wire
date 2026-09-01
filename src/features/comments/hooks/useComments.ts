import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { commentKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { listComments } from '../services/commentService';
import type { CommentSort, CommentsPage } from '../types';

const PAGE_SIZE = 20;

export function useComments(articleId: string, sort: CommentSort = 'newest') {
  const queryClient = useQueryClient();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const queryKey = commentKeys.byArticle(articleId, sort);

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: () => listComments(articleId, { sort, limit: PAGE_SIZE }),
    enabled: Boolean(articleId),
    staleTime: 30 * 1000,
  });

  const loadMore = async () => {
    if (!data?.nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    setLoadMoreError(null);
    try {
      const nextPage = await listComments(articleId, { sort, limit: PAGE_SIZE, cursor: data.nextCursor });
      queryClient.setQueryData<CommentsPage>(queryKey, (current) =>
        current
          ? { ...current, comments: [...current.comments, ...nextPage.comments], nextCursor: nextPage.nextCursor }
          : nextPage,
      );
    } catch (err) {
      setLoadMoreError(getErrorMessage(err, 'Unable to load more comments right now.'));
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    comments: data?.comments ?? [],
    totalCount: data?.totalCount ?? 0,
    hasMore: Boolean(data?.nextCursor),
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Comments are temporarily unavailable.') : null,
    loadMore,
    isLoadingMore,
    loadMoreError,
  };
}
