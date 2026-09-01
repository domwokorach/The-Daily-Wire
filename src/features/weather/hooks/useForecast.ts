import { useQuery } from '@tanstack/react-query';
import { weatherKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { getForecast, type Coordinates } from '../services/weatherService';
import type { Forecast } from '../types';

interface UseForecastResult {
  forecast: Forecast | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useForecast({ latitude, longitude }: Coordinates): UseForecastResult {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: weatherKeys.forecast(latitude, longitude),
    queryFn: () => getForecast({ latitude, longitude }),
    staleTime: 15 * 60 * 1000,
    retry: 1,
  });

  return {
    forecast: data,
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Unable to load the forecast right now.') : null,
    refetch: () => {
      void refetch();
    },
  };
}
