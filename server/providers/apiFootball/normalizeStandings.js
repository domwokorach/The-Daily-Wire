// Converts an API-Football `/standings` response into a flat table row
// list. API-Football nests standings as `response[0].league.standings`, an
// array of *groups* (usually one, for a single-table league like the
// Premier League) each containing an array of rows — that nesting is
// flattened here so callers/components only ever see one flat array.

function normalizeRow(raw) {
  return {
    position: raw?.rank,
    team: { id: raw?.team?.id, name: raw?.team?.name, badge: raw?.team?.logo ?? null },
    played: raw?.all?.played,
    won: raw?.all?.win,
    drawn: raw?.all?.draw,
    lost: raw?.all?.lose,
    goalsFor: raw?.all?.goals?.for,
    goalsAgainst: raw?.all?.goals?.against,
    goalDifference: raw?.goalsDiff,
    points: raw?.points,
    form: raw?.form ?? null,
  };
}

export function normalizeStandings(rawResponse) {
  const groups = rawResponse?.[0]?.league?.standings ?? [];
  return groups.flat().map(normalizeRow);
}
