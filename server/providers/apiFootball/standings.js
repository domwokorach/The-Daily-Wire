import { apiFootballRequest } from './apiFootballClient.js';

export function fetchStandings({ league, season }) {
  return apiFootballRequest('standings', { league, season });
}
