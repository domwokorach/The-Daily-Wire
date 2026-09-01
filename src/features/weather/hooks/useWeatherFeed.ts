import { useCallback, useState } from 'react';
import { useWeather } from './useWeather';
import { useForecast } from './useForecast';
import { DEFAULT_WEATHER_LOCATION } from '../constants';
import type { SelectedLocation, CurrentWeather, Forecast } from '../types';

export interface UseWeatherFeedResult {
  location: SelectedLocation;
  selectLocation: (location: SelectedLocation) => void;
  useMyLocation: () => void;
  geolocating: boolean;
  geolocationError: string | null;
  weather: CurrentWeather | undefined;
  forecast: Forecast | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** Combines current weather + forecast for one selected location, and owns
 * that selection (manual search pick, browser geolocation, or the default
 * UK location). Weather keeps working with no location permission granted
 * — geolocation is purely additive. */
export function useWeatherFeed(): UseWeatherFeedResult {
  const [location, setLocation] = useState<SelectedLocation>(DEFAULT_WEATHER_LOCATION);
  const [geolocating, setGeolocating] = useState(false);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);

  const weather = useWeather(location);
  const forecast = useForecast(location);

  const selectLocation = useCallback((next: SelectedLocation) => {
    setGeolocationError(null);
    setLocation(next);
  }, []);

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeolocationError('Location access is not available in this browser. Search for a UK location instead.');
      return;
    }

    setGeolocating(true);
    setGeolocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeolocating(false);
        setLocation({
          name: undefined,
          country: undefined,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setGeolocating(false);
        setGeolocationError('Location access was not granted. Search for a UK location instead.');
      },
      { timeout: 10000 },
    );
  }, []);

  return {
    location,
    selectLocation,
    useMyLocation,
    geolocating,
    geolocationError,
    weather: weather.weather,
    forecast: forecast.forecast,
    loading: weather.loading || forecast.loading,
    error: weather.error ?? forecast.error,
    refetch: () => {
      weather.refetch();
      forecast.refetch();
    },
  };
}
