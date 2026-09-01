// Converts OpenWeather's raw /data/2.5/forecast response (a flat list of
// 3-hour points) into this app's frontend-friendly `{ timezone, hourly,
// daily }` model. Day-grouping happens here, server-side, so the client
// never has to reconstruct calendar days from 3-hour buckets itself.

function toIso(unixSeconds) {
  return typeof unixSeconds === 'number' ? new Date(unixSeconds * 1000).toISOString() : undefined;
}

function toPercent(pop) {
  return typeof pop === 'number' ? Math.round(pop * 100) : undefined;
}

function normalizeHourlyPoint(point) {
  const condition = point?.weather?.[0];
  return {
    dateTime: toIso(point?.dt),
    temperature: point?.main?.temp,
    feelsLike: point?.main?.feels_like,
    condition: condition?.main,
    description: condition?.description,
    icon: condition?.icon,
    humidity: point?.main?.humidity,
    windSpeed: point?.wind?.speed,
    precipitationProbability: toPercent(point?.pop),
  };
}

// `dt_txt` is UTC ("YYYY-MM-DD HH:mm:ss") — its date portion groups points
// into calendar days without needing timezone math for a UK-focused app.
function dayKey(point) {
  return point?.dt_txt?.slice(0, 10);
}

/** Picks the point closest to local midday as each day's "representative"
 * condition/wind/humidity — matches how a single daily icon/condition is
 * normally chosen from 3-hour data. */
function pickRepresentative(points) {
  return points.reduce((best, point) => {
    const hour = Number(point?.dt_txt?.slice(11, 13));
    const bestHour = Number(best?.dt_txt?.slice(11, 13));
    return Math.abs(hour - 12) < Math.abs(bestHour - 12) ? point : best;
  }, points[0]);
}

function normalizeDailyGroup(points) {
  const representative = pickRepresentative(points);
  const condition = representative?.weather?.[0];
  const temps = points.map((point) => point?.main?.temp).filter((value) => typeof value === 'number');
  const pops = points.map((point) => point?.pop).filter((value) => typeof value === 'number');

  return {
    date: dayKey(representative),
    temperatureHigh: temps.length ? Math.max(...temps) : undefined,
    temperatureLow: temps.length ? Math.min(...temps) : undefined,
    condition: condition?.main,
    description: condition?.description,
    icon: condition?.icon,
    precipitationProbability: pops.length ? toPercent(Math.max(...pops)) : undefined,
    humidity: representative?.main?.humidity,
    windSpeed: representative?.wind?.speed,
  };
}

function groupForecastByDay(list) {
  const groups = new Map();
  for (const point of list) {
    const key = dayKey(point);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(point);
  }
  return [...groups.values()].map(normalizeDailyGroup);
}

export function normalizeForecast(raw) {
  const list = raw?.list ?? [];

  return {
    timezone: raw?.city?.timezone,
    hourly: list.map(normalizeHourlyPoint),
    daily: groupForecastByDay(list),
  };
}
