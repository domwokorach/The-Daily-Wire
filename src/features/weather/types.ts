// Mirrors the server's normalized weather shapes (see
// `server/providers/openweather/normalize*.js`) — the frontend never sees
// OpenWeather's raw response format.

export interface WeatherLocation {
  name?: string;
  state?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export interface CurrentConditions {
  temperature?: number;
  feelsLike?: number;
  temperatureMin?: number;
  temperatureMax?: number;
  condition?: string;
  description?: string;
  icon?: string;
  humidity?: number;
  pressure?: number;
  windSpeed?: number;
  windDirection?: number;
  visibility?: number;
  clouds?: number;
  sunrise?: string;
  sunset?: string;
  observedAt?: string;
}

export interface CurrentWeather {
  location: WeatherLocation;
  current: CurrentConditions;
}

export interface HourlyForecastPoint {
  dateTime?: string;
  temperature?: number;
  feelsLike?: number;
  condition?: string;
  description?: string;
  icon?: string;
  humidity?: number;
  windSpeed?: number;
  precipitationProbability?: number;
}

export interface DailyForecastDay {
  date?: string;
  temperatureHigh?: number;
  temperatureLow?: number;
  condition?: string;
  description?: string;
  icon?: string;
  precipitationProbability?: number;
  humidity?: number;
  windSpeed?: number;
}

export interface Forecast {
  timezone?: number;
  hourly: HourlyForecastPoint[];
  daily: DailyForecastDay[];
}

export type SelectedLocation = Pick<WeatherLocation, 'name' | 'country' | 'latitude' | 'longitude'>;
