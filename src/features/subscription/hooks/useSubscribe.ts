import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/services/apiClient';
import { subscribe } from '../services/subscriptionService';
import type { SubscribePayload } from '../types';

export function useSubscribe() {
  const mutation = useMutation({
    mutationFn: (payload: SubscribePayload) => subscribe(payload),
  });

  return {
    subscribe: mutation.mutateAsync,
    result: mutation.data ?? null,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? getErrorMessage(mutation.error, "We couldn't complete your subscription right now. Please try again.") : null,
    reset: mutation.reset,
  };
}
