import { useQuery } from '@tanstack/react-query';
import { sportsKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { getMatchDetail } from '../services/sportService';
import type { MatchDetail } from '../types';

interface UseMatchDetailResult {
  match: MatchDetail | undefined;
  loading: boolean;
  error: string | null;
}

/** Only ever fetched for one fixture at a time (the match page) — this is
 * the most expensive sport request (4 upstream calls server-side), so it's
 * never triggered from a list view. */
export function useMatchDetail(id: number | undefined): UseMatchDetailResult {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: sportsKeys.match(id ?? 0),
    queryFn: () => getMatchDetail(id as number),
    enabled: typeof id === 'number' && Number.isFinite(id),
    staleTime: 30 * 1000,
    retry: 1,
    refetchInterval: (query) => (query.state.data?.fixture.live ? 30 * 1000 : false),
  });

  return {
    match: data,
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Unable to load this match right now.') : null,
  };
}
