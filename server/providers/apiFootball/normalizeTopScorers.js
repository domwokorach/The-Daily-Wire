// Converts `/players/topscorers` entries into a flat leaderboard row list.
// Each raw entry carries one `statistics` array item per competition the
// player appears in for the requested league/season — always index 0 here
// since the request is already scoped to a single league/season.

function normalizeRow(raw) {
  const player = raw?.player;
  const stats = raw?.statistics?.[0];

  return {
    player: { id: player?.id, name: player?.name, photo: player?.photo ?? null },
    team: { id: stats?.team?.id, name: stats?.team?.name, logo: stats?.team?.logo ?? null },
    goals: stats?.goals?.total ?? 0,
    assists: stats?.goals?.assists ?? 0,
    appearances: stats?.games?.appearences ?? 0,
  };
}

export function normalizeTopScorers(rawResponse) {
  return (rawResponse ?? []).map(normalizeRow);
}
