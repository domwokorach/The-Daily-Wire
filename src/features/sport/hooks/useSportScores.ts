import { useLiveMatches } from './useLiveMatches';
import { useRecentResults } from './useRecentResults';
import type { Fixture } from '../types';

interface UseSportScoresResult {
  fixtures: Fixture[];
  loading: boolean;
  error: string | null;
}

/** Compact scores feed used by the homepage widget — live matches when
 * there are any, the most recent finished results otherwise. The Sport
 * page itself uses `useLiveMatches`/`useRecentResults` directly so it can
 * show both in one coordinated module. */
export function useSportScores(): UseSportScoresResult {
  const live = useLiveMatches();
  const results = useRecentResults(14);

  if (live.hasLive) {
    return { fixtures: live.fixtures, loading: live.loading, error: live.error };
  }

  return {
    fixtures: results.fixtures.slice(0, 4),
    loading: live.loading || results.loading,
    error: live.error ?? results.error,
  };
}
