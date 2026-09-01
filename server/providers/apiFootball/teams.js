import { apiFootballRequest } from './apiFootballClient.js';

export function fetchTeams({ league, season }) {
  return apiFootballRequest('teams', { league, season });
}
