import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/services/apiClient';
import { confirmSubscription } from '../services/subscriptionService';

export function useConfirmSubscription() {
  const mutation = useMutation({
    mutationFn: (token: string) => confirmSubscription(token),
  });

  return {
    confirm: mutation.mutateAsync,
    subscription: mutation.data?.subscription ?? null,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? getErrorMessage(mutation.error, 'This confirmation link is invalid or has expired.') : null,
  };
}
