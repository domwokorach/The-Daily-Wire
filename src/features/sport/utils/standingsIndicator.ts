export type StandingsZone = 'championsLeague' | 'europa' | 'relegation' | undefined;

/**
 * Premier League qualification zones — top 4 Champions League, 5th Europa,
 * bottom 3 relegation. Computed from the table's own length (not a
 * hard-coded "20 teams") so it degrades gracefully for a shorter table.
 */
export function getStandingsZone(position: number | undefined, totalTeams: number): StandingsZone {
  if (!position) return undefined;
  if (position <= 4) return 'championsLeague';
  if (position === 5) return 'europa';
  if (totalTeams >= 3 && position > totalTeams - 3) return 'relegation';
  return undefined;
}

export const ZONE_ACCENT_COLOR: Record<Exclude<StandingsZone, undefined>, string> = {
  championsLeague: 'primary.main',
  europa: 'secondary.main',
  relegation: 'breaking.main',
};
