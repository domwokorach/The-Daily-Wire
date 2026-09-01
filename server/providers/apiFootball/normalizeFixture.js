// Converts an API-Football `/fixtures` entry into this app's clean
// internal shape. This is the only place API-Football's nested
// `fixture`/`league`/`teams`/`goals` structure and its short status codes
// (NS, 1H, HT, FT, PST, ...) are known about.

const STATUS_MAP = {
  TBD: 'scheduled',
  NS: 'scheduled',
  '1H': 'live',
  '2H': 'live',
  ET: 'live',
  BT: 'live',
  P: 'live',
  LIVE: 'live',
  HT: 'halftime',
  FT: 'finished',
  AET: 'finished',
  PEN: 'finished',
  AWD: 'finished',
  WO: 'finished',
  PST: 'postponed',
  CANC: 'cancelled',
  ABD: 'cancelled',
  SUSP: 'suspended',
  INT: 'suspended',
};

function normalizeStatus(rawStatus) {
  const code = STATUS_MAP[rawStatus?.short] ?? 'scheduled';
  return {
    code,
    label: rawStatus?.long,
    elapsed: rawStatus?.elapsed ?? null,
  };
}

function normalizeTeam(rawTeam) {
  return { id: rawTeam?.id, name: rawTeam?.name, logo: rawTeam?.logo ?? null };
}

export function normalizeFixture(raw) {
  const status = normalizeStatus(raw?.fixture?.status);

  return {
    id: raw?.fixture?.id,
    competition: {
      id: raw?.league?.id,
      name: raw?.league?.name,
      country: raw?.league?.country,
      logo: raw?.league?.logo ?? null,
    },
    round: raw?.league?.round,
    kickoff: raw?.fixture?.date,
    venue: raw?.fixture?.venue?.name ?? null,
    status,
    live: status.code === 'live' || status.code === 'halftime',
    homeTeam: normalizeTeam(raw?.teams?.home),
    awayTeam: normalizeTeam(raw?.teams?.away),
    homeScore: raw?.goals?.home ?? null,
    awayScore: raw?.goals?.away ?? null,
  };
}

export function normalizeFixtures(rawResponse) {
  return (rawResponse ?? []).map(normalizeFixture);
}
