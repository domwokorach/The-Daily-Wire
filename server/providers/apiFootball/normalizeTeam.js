// Converts `/teams` entries into this app's clean team shape.
function normalizeRow(raw) {
  const team = raw?.team;
  const venue = raw?.venue;

  return {
    id: team?.id,
    name: team?.name,
    logo: team?.logo ?? null,
    founded: team?.founded ?? null,
    venue: venue?.name ?? null,
  };
}

export function normalizeTeams(rawResponse) {
  return (rawResponse ?? []).map(normalizeRow);
}
