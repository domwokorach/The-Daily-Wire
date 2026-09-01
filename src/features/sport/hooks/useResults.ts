import { useQuery } from '@tanstack/react-query';
import { sportsKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { getResults } from '../services/sportService';
import type { Fixture } from '../types';

interface UseResultsResult {
  fixtures: Fixture[];
  loading: boolean;
  error: string | null;
}

export function useResults(days = 14): UseResultsResult {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: sportsKeys.results(days),
    queryFn: () => getResults(days),
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });

  return {
    fixtures: data?.fixtures ?? [],
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Unable to load results right now.') : null,
  };
}
