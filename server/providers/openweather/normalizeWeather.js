// Converts OpenWeather's raw /data/2.5/weather response into this app's
// clean internal shape. This is the only place that raw shape (nested
// `main`/`wind`/`sys`/`weather[0]`) is known about — every server route and
// every React component downstream consumes the normalized model only.

function toIso(unixSeconds) {
  return typeof unixSeconds === 'number' ? new Date(unixSeconds * 1000).toISOString() : undefined;
}

export function normalizeCurrentWeather(raw, requestedCoords) {
  const condition = raw?.weather?.[0];

  return {
    location: {
      name: raw?.name || undefined,
      country: raw?.sys?.country || undefined,
      latitude: raw?.coord?.lat ?? requestedCoords.latitude,
      longitude: raw?.coord?.lon ?? requestedCoords.longitude,
    },
    current: {
      temperature: raw?.main?.temp,
      feelsLike: raw?.main?.feels_like,
      temperatureMin: raw?.main?.temp_min,
      temperatureMax: raw?.main?.temp_max,

      condition: condition?.main,
      description: condition?.description,
      icon: condition?.icon,

      humidity: raw?.main?.humidity,
      pressure: raw?.main?.pressure,

      windSpeed: raw?.wind?.speed,
      windDirection: raw?.wind?.deg,

      visibility: raw?.visibility,
      clouds: raw?.clouds?.all,

      sunrise: toIso(raw?.sys?.sunrise),
      sunset: toIso(raw?.sys?.sunset),

      observedAt: toIso(raw?.dt),
    },
  };
}
