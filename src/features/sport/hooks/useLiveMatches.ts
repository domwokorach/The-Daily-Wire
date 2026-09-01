import { useQuery } from '@tanstack/react-query';
import { sportsKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { getLiveMatches } from '../services/sportService';
import type { Fixture } from '../types';

interface UseLiveMatchesResult {
  fixtures: Fixture[];
  hasLive: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * Polls only while there are live matches, and only 60s apart — the free
 * API-Football quota (100 requests/day) can't sustain second-by-second
 * updates. `refetchIntervalInBackground` is left at its default `false`,
 * so polling already pauses while the tab is hidden and resumes (via
 * `refetchOnWindowFocus`, also on by default) when the user comes back.
 */
export function useLiveMatches(): UseLiveMatchesResult {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: sportsKeys.live(),
    queryFn: getLiveMatches,
    staleTime: 30 * 1000,
    retry: 1,
    refetchInterval: (query) => (query.state.data?.fixtures.length ? 60 * 1000 : false),
  });

  const fixtures = data?.fixtures ?? [];

  return {
    fixtures,
    hasLive: fixtures.length > 0,
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Unable to load live scores right now.') : null,
  };
}
