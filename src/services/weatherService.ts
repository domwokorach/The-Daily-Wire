import { WEATHER, type WeatherData } from '@/data/mockWeather';
import { simulateDelay } from './apiClient';

export function getWeather(): Promise<WeatherData> {
  return simulateDelay(WEATHER);
}
