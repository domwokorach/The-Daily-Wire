import { useEffect, useState } from 'react';
import type { WeatherData } from '@/data/mockWeather';
import { getWeather } from '@/services/weatherService';

interface WeatherState {
  version: number;
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

interface UseWeatherResult {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const INITIAL_STATE: WeatherState = { version: 0, weather: null, loading: true, error: null };

export function useWeather(): UseWeatherResult {
  const [state, setState] = useState<WeatherState>(INITIAL_STATE);

  useEffect(() => {
    let active = true;

    getWeather()
      .then((result) => {
        if (active) setState((current) => ({ ...current, weather: result, loading: false, error: null }));
      })
      .catch(() => {
        if (active) {
          setState((current) => ({
            ...current,
            loading: false,
            error: 'Unable to load weather data right now.',
          }));
        }
      });

    return () => {
      active = false;
    };
  }, [state.version]);

  return {
    weather: state.weather,
    loading: state.loading,
    error: state.error,
    refetch: () =>
      setState((current) => ({ ...current, version: current.version + 1, loading: true, error: null })),
  };
}
