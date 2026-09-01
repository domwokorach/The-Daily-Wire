import { useQuery } from '@tanstack/react-query';
import { weatherKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { getCurrentWeather, type Coordinates } from '../services/weatherService';
import type { CurrentWeather } from '../types';

interface UseWeatherResult {
  weather: CurrentWeather | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWeather({ latitude, longitude }: Coordinates): UseWeatherResult {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: weatherKeys.current(latitude, longitude),
    queryFn: () => getCurrentWeather({ latitude, longitude }),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  return {
    weather: data,
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Unable to load weather data right now.') : null,
    refetch: () => {
      void refetch();
    },
  };
}
