import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/services/apiClient';
import { unsubscribe, resubscribe } from '../services/subscriptionService';

export function useUnsubscribe() {
  const unsubscribeMutation = useMutation({
    mutationFn: ({ token, categories }: { token: string; categories?: string[] }) => unsubscribe(token, categories),
  });

  const resubscribeMutation = useMutation({
    mutationFn: (token: string) => resubscribe(token),
  });

  return {
    unsubscribe: unsubscribeMutation.mutateAsync,
    isLoading: unsubscribeMutation.isPending,
    isSuccess: unsubscribeMutation.isSuccess,
    result: unsubscribeMutation.data ?? null,
    error: unsubscribeMutation.error ? getErrorMessage(unsubscribeMutation.error, 'This link is invalid or has expired.') : null,
    resubscribe: resubscribeMutation.mutateAsync,
    isResubscribing: resubscribeMutation.isPending,
    resubscribeSuccess: resubscribeMutation.isSuccess,
  };
}
