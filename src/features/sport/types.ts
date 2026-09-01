// Mirrors the server's normalized sport shapes (see
// `server/providers/apiFootball/normalize*.js`) — the frontend never sees
// API-Football's raw response format or its short status codes.

export type FixtureStatusCode =
  | 'scheduled'
  | 'live'
  | 'halftime'
  | 'finished'
  | 'postponed'
  | 'cancelled'
  | 'suspended';

export interface FixtureStatus {
  code: FixtureStatusCode;
  label?: string;
  elapsed: number | null;
}

export interface SportTeamRef {
  id?: number;
  name?: string;
  logo: string | null;
}

export interface Competition {
  id?: number;
  name?: string;
  country?: string;
  logo: string | null;
}

export interface Fixture {
  id: number;
  competition: Competition;
  round?: string;
  kickoff?: string;
  venue: string | null;
  status: FixtureStatus;
  live: boolean;
  homeTeam: SportTeamRef;
  awayTeam: SportTeamRef;
  homeScore: number | null;
  awayScore: number | null;
}

export interface StandingRow {
  position?: number;
  team: { id?: number; name?: string; badge: string | null };
  played?: number;
  won?: number;
  drawn?: number;
  lost?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  goalDifference?: number;
  points?: number;
  form: string | null;
}

export interface TopScorerRow {
  player: { id?: number; name?: string; photo: string | null };
  team: SportTeamRef;
  goals: number;
  assists: number;
  appearances: number;
}

export interface SportTeam {
  id?: number;
  name?: string;
  logo: string | null;
  founded: number | null;
  venue: string | null;
}

export interface MatchEvent {
  minute?: number;
  extraMinute: number | null;
  type?: string;
  detail?: string;
  team: SportTeamRef;
  player: { id?: number; name?: string } | null;
  assist: { id?: number; name?: string } | null;
}

export interface LineupPlayer {
  id?: number;
  name?: string;
  number?: number;
  position: string | null;
}

export interface MatchLineup {
  team: SportTeamRef;
  formation: string | null;
  startXI: LineupPlayer[];
  substitutes: LineupPlayer[];
}

export interface MatchStatisticEntry {
  type?: string;
  value: unknown;
}

export interface MatchStatistics {
  team: SportTeamRef;
  stats: MatchStatisticEntry[];
}

export interface MatchDetail {
  fixture: Fixture;
  events: MatchEvent[];
  lineups: MatchLineup[];
  statistics: MatchStatistics[];
}
