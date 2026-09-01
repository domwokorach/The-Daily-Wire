import { useQuery } from '@tanstack/react-query';
import { sportsKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { getFixtures } from '../services/sportService';
import type { Fixture } from '../types';

interface UseFixturesResult {
  fixtures: Fixture[];
  loading: boolean;
  error: string | null;
}

/** Upcoming Premier League fixtures only — see `getFixtures` in
 * `sportService.ts`. Cached 10 minutes; fixtures don't change minute to
 * minute the way live scores do. */
export function useFixtures(days = 14): UseFixturesResult {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: sportsKeys.fixtures(days),
    queryFn: () => getFixtures(days),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  return {
    fixtures: data?.fixtures ?? [],
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Unable to load fixtures right now.') : null,
  };
}
