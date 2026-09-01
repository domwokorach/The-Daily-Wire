import { apiFootballRequest } from './apiFootballClient.js';

export function fetchTopScorers({ league, season }) {
  return apiFootballRequest('players/topscorers', { league, season });
}
