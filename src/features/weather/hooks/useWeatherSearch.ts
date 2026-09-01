import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { weatherKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { searchLocations } from '../services/weatherService';
import type { WeatherLocation } from '../types';

const DEBOUNCE_MS = 400;

interface UseWeatherSearchResult {
  inputValue: string;
  setInputValue: (value: string) => void;
  results: WeatherLocation[];
  loading: boolean;
  error: string | null;
}

/** Debounces the raw keystroke input before it ever reaches a query — the
 * server is only ever hit ~400ms after typing stops. */
export function useWeatherSearch(): UseWeatherSearchResult {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(inputValue.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const { data, isFetching, isError, error } = useQuery({
    queryKey: weatherKeys.search(debouncedValue),
    queryFn: () => searchLocations(debouncedValue),
    enabled: debouncedValue.length > 1,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });

  return {
    inputValue,
    setInputValue,
    results: debouncedValue.length > 1 ? (data ?? []) : [],
    loading: isFetching,
    error: isError ? getErrorMessage(error, "We couldn't find that location.") : null,
  };
}
