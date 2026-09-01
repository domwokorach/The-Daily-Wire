import { useQuery } from '@tanstack/react-query';
import { sportsKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { getTopScorers } from '../services/sportService';
import type { TopScorerRow } from '../types';

interface UseTopScorersResult {
  topScorers: TopScorerRow[];
  loading: boolean;
  error: string | null;
}

export function useTopScorers(): UseTopScorersResult {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: sportsKeys.topScorers(),
    queryFn: getTopScorers,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });

  return {
    topScorers: data?.topScorers ?? [],
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Unable to load top scorers right now.') : null,
  };
}
