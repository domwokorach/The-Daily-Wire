import { useLiveMatches } from './useLiveMatches';
import { useResults } from './useResults';
import type { Fixture } from '../types';

interface UseSportScoresResult {
  fixtures: Fixture[];
  loading: boolean;
  error: string | null;
}

/** Compact "Scores & Fixtures" feed used by the homepage widget and the
 * Sport page's top strip — live matches when there are any, the most
 * recent finished results otherwise. */
export function useSportScores(): UseSportScoresResult {
  const live = useLiveMatches();
  const results = useResults(14);

  if (live.hasLive) {
    return { fixtures: live.fixtures, loading: live.loading, error: live.error };
  }

  return {
    fixtures: results.fixtures.slice(0, 4),
    loading: live.loading || results.loading,
    error: live.error ?? results.error,
  };
}
