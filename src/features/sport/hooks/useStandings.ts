import { useQuery } from '@tanstack/react-query';
import { sportsKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { getStandings } from '../services/sportService';
import type { StandingRow } from '../types';

interface UseStandingsResult {
  standings: StandingRow[];
  loading: boolean;
  error: string | null;
}

export function useStandings(): UseStandingsResult {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: sportsKeys.standings(),
    queryFn: getStandings,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });

  return {
    standings: data?.standings ?? [],
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Unable to load standings right now.') : null,
  };
}
