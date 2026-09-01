import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/services/apiClient';
import { resendConfirmation } from '../services/subscriptionService';

export function useResendConfirmation() {
  const mutation = useMutation({
    mutationFn: (email: string) => resendConfirmation(email),
  });

  return {
    resend: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? getErrorMessage(mutation.error, 'Please wait a moment before requesting another confirmation email.') : null,
  };
}
