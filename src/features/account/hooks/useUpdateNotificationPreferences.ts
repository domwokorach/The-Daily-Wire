import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { updatePreferences, type NotificationPreferences } from '../services/notificationPrefsService';

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (prefs: NotificationPreferences) => updatePreferences(prefs),
    onSuccess: (prefs) => {
      queryClient.setQueryData(notificationKeys.preferences(), prefs);
    },
  });

  return {
    updatePreferences: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? getErrorMessage(mutation.error, 'Unable to save notification settings.') : null,
  };
}
