import { useEffect, useState } from 'react';
import type { ScoreFixture } from '@/data/mockSportScores';
import { getFixtures } from '@/services/sportService';

interface SportScoresState {
  version: number;
  fixtures: ScoreFixture[];
  loading: boolean;
  error: string | null;
}

interface UseSportScoresResult {
  fixtures: ScoreFixture[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const INITIAL_STATE: SportScoresState = { version: 0, fixtures: [], loading: true, error: null };

export function useSportScores(): UseSportScoresResult {
  const [state, setState] = useState<SportScoresState>(INITIAL_STATE);

  useEffect(() => {
    let active = true;

    getFixtures()
      .then((result) => {
        if (active) setState((current) => ({ ...current, fixtures: result, loading: false, error: null }));
      })
      .catch(() => {
        if (active) {
          setState((current) => ({
            ...current,
            loading: false,
            error: 'Unable to load sport scores right now.',
          }));
        }
      });

    return () => {
      active = false;
    };
  }, [state.version]);

  return {
    fixtures: state.fixtures,
    loading: state.loading,
    error: state.error,
    refetch: () =>
      setState((current) => ({ ...current, version: current.version + 1, loading: true, error: null })),
  };
}
