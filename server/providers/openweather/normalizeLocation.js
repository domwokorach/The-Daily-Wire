// Converts OpenWeather Geocoding API results into this app's clean
// location shape.
export function normalizeLocation(raw) {
  return {
    name: raw?.name,
    state: raw?.state || undefined,
    country: raw?.country,
    latitude: raw?.lat,
    longitude: raw?.lon,
  };
}

export function normalizeLocations(rawResults) {
  return (rawResults ?? []).map(normalizeLocation).filter((location) => location.name && location.country);
}
