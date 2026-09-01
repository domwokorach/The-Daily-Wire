import { useQuery } from '@tanstack/react-query';
import { sportsKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { getFixtures, type FixturesQuery } from '../services/sportService';
import type { Fixture } from '../types';

interface UseFixturesResult {
  fixtures: Fixture[];
  loading: boolean;
  error: string | null;
}

export function useFixtures(params: FixturesQuery = {}): UseFixturesResult {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: sportsKeys.fixtures(params.date),
    queryFn: () => getFixtures(params),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    fixtures: data?.fixtures ?? [],
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Unable to load fixtures right now.') : null,
  };
}
