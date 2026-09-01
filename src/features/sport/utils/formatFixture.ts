import type { Fixture } from '../types';

/**
 * `Europe/London` auto-resolves GMT vs BST for whatever date is passed —
 * never manually add/subtract an hour for daylight saving.
 */
const KICKOFF_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatKickoff(kickoff?: string): string {
  if (!kickoff) return '—';
  return KICKOFF_FORMATTER.format(new Date(kickoff));
}

/** The short label shown alongside a score — a live clock, "HT", "FT", or
 * the scheduled kickoff time — never a raw provider status code. */
export function formatMatchStatus(fixture: Fixture): string {
  const { status } = fixture;
  switch (status.code) {
    case 'live':
      return status.elapsed ? `${status.elapsed}'` : 'Live';
    case 'halftime':
      return 'HT';
    case 'finished':
      return 'FT';
    case 'postponed':
      return 'Postponed';
    case 'cancelled':
      return 'Cancelled';
    case 'suspended':
      return 'Suspended';
    default:
      return formatKickoff(fixture.kickoff);
  }
}

export function hasScore(fixture: Fixture): boolean {
  return fixture.homeScore !== null && fixture.awayScore !== null;
}
