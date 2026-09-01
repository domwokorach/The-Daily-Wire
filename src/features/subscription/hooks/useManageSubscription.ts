import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { getManagedSubscription, updateManagedSubscription } from '../services/subscriptionService';
import type { SubscriptionPreferences } from '../types';

/** Guest (token-scoped) subscription management — no account required.
 * `token` comes from the `/subscription/manage?token=...` link in emails. */
export function useManageSubscription(token: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: subscriptionKeys.managed(token ?? ''),
    queryFn: () => getManagedSubscription(token as string),
    enabled: Boolean(token),
  });

  const mutation = useMutation({
    mutationFn: (preferences: Partial<SubscriptionPreferences>) => updateManagedSubscription(token as string, preferences),
    onSuccess: (result) => {
      if (token) queryClient.setQueryData(subscriptionKeys.managed(token), { subscription: result.subscription });
    },
  });

  return {
    subscription: query.data?.subscription ?? null,
    loading: query.isLoading,
    loadError: query.isError ? getErrorMessage(query.error, 'This link is invalid or has expired.') : null,
    updatePreferences: mutation.mutateAsync,
    isSaving: mutation.isPending,
    isSaveSuccess: mutation.isSuccess,
    saveError: mutation.error ? getErrorMessage(mutation.error, 'Unable to save your preferences right now.') : null,
  };
}
