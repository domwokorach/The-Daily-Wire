import type { SelectedLocation } from './types';

/** Used when no location has been selected/geolocated yet. Mirrors
 * `server/config/weather.js`'s `DEFAULT_WEATHER_LOCATION` — kept as a
 * separate constant since the frontend can't import server code, not as a
 * sign the two should drift. */
export const DEFAULT_WEATHER_LOCATION: SelectedLocation = {
  name: 'London',
  country: 'GB',
  latitude: 51.5074,
  longitude: -0.1278,
};
