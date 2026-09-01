import { useQuery } from '@tanstack/react-query';
import { notificationKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { getPreferences } from '../services/notificationPrefsService';

export function useNotificationPreferences() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: getPreferences,
    staleTime: 5 * 60 * 1000,
  });

  return {
    preferences: data ?? { categories: [], pushEnabled: false },
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Unable to load notification settings.') : null,
  };
}
