import { FIXTURES, type ScoreFixture } from '@/data/mockSportScores';
import { simulateDelay } from './apiClient';

export function getFixtures(): Promise<ScoreFixture[]> {
  return simulateDelay(FIXTURES);
}
