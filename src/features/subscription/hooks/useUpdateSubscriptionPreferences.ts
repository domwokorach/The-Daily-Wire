import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { updateMyPreferences } from '../services/subscriptionService';
import type { SubscriptionPreferences } from '../types';

export function useUpdateSubscriptionPreferences() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (preferences: Partial<SubscriptionPreferences>) => updateMyPreferences(preferences),
    onSuccess: (result) => {
      queryClient.setQueryData(subscriptionKeys.me(), { subscribed: true, subscription: result.subscription });
    },
  });

  return {
    updatePreferences: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? getErrorMessage(mutation.error, 'Unable to save your email preferences right now.') : null,
  };
}
