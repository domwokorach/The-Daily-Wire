import { useQuery } from '@tanstack/react-query';
import { subscriptionKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { getMyPreferences } from '../services/subscriptionService';

/** Preferences for the signed-in user's own subscription (Settings →
 * Email Subscriptions). Guest subscriptions are read via `useManageSubscription`
 * (token-scoped) instead. */
export function useSubscriptionPreferences() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: subscriptionKeys.me(),
    queryFn: () => getMyPreferences(),
    staleTime: 60 * 1000,
  });

  return {
    subscription: data?.subscription ?? null,
    subscribed: data?.subscribed ?? false,
    loading: isLoading,
    error: isError ? getErrorMessage(error, 'Unable to load your email preferences right now.') : null,
  };
}
