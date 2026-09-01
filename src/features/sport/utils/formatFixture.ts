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

/** Group heading for the Fixtures section — e.g. "FRIDAY 4 SEPTEMBER". */
const DATE_HEADING_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

export function formatFixtureDateHeading(kickoff?: string): string {
  if (!kickoff) return 'Date TBC';
  return DATE_HEADING_FORMATTER.format(new Date(kickoff)).toUpperCase();
}

/** Kickoff time only — used inside a date-grouped fixture row, where the
 * date is already shown by the group heading. */
const TIME_ONLY_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatFixtureTime(kickoff?: string): string {
  if (!kickoff) return '—';
  return TIME_ONLY_FORMATTER.format(new Date(kickoff));
}

/** Short date used on a result row — e.g. "31 Aug". */
const RESULT_DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  day: 'numeric',
  month: 'short',
});

export function formatResultDate(kickoff?: string): string {
  if (!kickoff) return '—';
  return RESULT_DATE_FORMATTER.format(new Date(kickoff));
}

/** Groups fixtures already sorted ascending by kickoff into calendar-day
 * buckets, keyed by the `Europe/London` calendar date. */
export function groupFixturesByDate(fixtures: Fixture[]): { heading: string; fixtures: Fixture[] }[] {
  const groups: { key: string; heading: string; fixtures: Fixture[] }[] = [];

  for (const fixture of fixtures) {
    const heading = formatFixtureDateHeading(fixture.kickoff);
    const key = fixture.kickoff ? fixture.kickoff.slice(0, 10) : heading;
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.key === key) {
      lastGroup.fixtures.push(fixture);
    } else {
      groups.push({ key, heading, fixtures: [fixture] });
    }
  }

  return groups.map(({ heading, fixtures: groupFixtures }) => ({ heading, fixtures: groupFixtures }));
}
