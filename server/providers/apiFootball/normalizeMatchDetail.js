// Normalizes API-Football's `/fixtures/events`, `/fixtures/lineups`, and
// `/fixtures/statistics` responses — each a separate upstream endpoint,
// combined here into the one match-detail shape the frontend consumes.

function normalizeParticipant(raw) {
  if (!raw?.id && !raw?.name) return null;
  return { id: raw.id, name: raw.name };
}

export function normalizeEvents(rawEvents) {
  return (rawEvents ?? []).map((event) => ({
    minute: event?.time?.elapsed,
    extraMinute: event?.time?.extra ?? null,
    type: event?.type,
    detail: event?.detail,
    team: { id: event?.team?.id, name: event?.team?.name, logo: event?.team?.logo ?? null },
    player: normalizeParticipant(event?.player),
    assist: normalizeParticipant(event?.assist),
  }));
}

function normalizeLineupPlayer(entry) {
  const player = entry?.player;
  if (!player) return null;
  return { id: player.id, name: player.name, number: player.number, position: player.pos ?? null };
}

export function normalizeLineups(rawLineups) {
  return (rawLineups ?? []).map((lineup) => ({
    team: { id: lineup?.team?.id, name: lineup?.team?.name, logo: lineup?.team?.logo ?? null },
    formation: lineup?.formation ?? null,
    startXI: (lineup?.startXI ?? []).map(normalizeLineupPlayer).filter(Boolean),
    substitutes: (lineup?.substitutes ?? []).map(normalizeLineupPlayer).filter(Boolean),
  }));
}

export function normalizeStatistics(rawStatistics) {
  return (rawStatistics ?? []).map((entry) => ({
    team: { id: entry?.team?.id, name: entry?.team?.name, logo: entry?.team?.logo ?? null },
    stats: (entry?.statistics ?? []).map((stat) => ({ type: stat?.type, value: stat?.value })),
  }));
}
