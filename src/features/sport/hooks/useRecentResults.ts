import { useQuery } from '@tanstack/react-query';
import { sportsKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { getRecentResults } from '../services/sportService';
import type { Fixture } from '../types';

interface UseRecentResultsResult {
  fixtures: Fixture[];
  loading: boolean;
  error: string | null;
}

/** Most recently completed Premier League matches only — see
 * `getRecentResults` in `sportService.ts`. */
export function useRecentResults(days = 14): UseRecentResultsResult {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: sportsKeys.results(days),
    queryFn: () => getRecentResults(days),
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });

  return {
    fixtures: data?.fixtures ?? [],
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Unable to load results right now.') : null,
  };
}
