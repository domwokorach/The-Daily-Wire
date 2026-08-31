export interface DailyForecast {
  day: string;
  high: number;
  low: number;
  precipitation: number;
  icon: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partly';
}

export interface WeatherData {
  location: string;
  currentTemp: number;
  condition: string;
  icon: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partly';
  high: number;
  low: number;
  wind: string;
  humidity: number;
  forecast: DailyForecast[];
}

export const WEATHER: WeatherData = {
  location: 'London',
  currentTemp: 18,
  condition: 'Partly Cloudy',
  icon: 'partly',
  high: 20,
  low: 13,
  wind: '18 km/h SW',
  humidity: 72,
  forecast: [
    { day: 'Mon', high: 20, low: 13, precipitation: 20, icon: 'partly' },
    { day: 'Tue', high: 19, low: 12, precipitation: 40, icon: 'cloudy' },
    { day: 'Wed', high: 17, low: 11, precipitation: 70, icon: 'rainy' },
    { day: 'Thu', high: 16, low: 10, precipitation: 60, icon: 'rainy' },
    { day: 'Fri', high: 18, low: 12, precipitation: 30, icon: 'partly' },
    { day: 'Sat', high: 21, low: 13, precipitation: 10, icon: 'sunny' },
    { day: 'Sun', high: 19, low: 12, precipitation: 20, icon: 'cloudy' },
  ],
};
