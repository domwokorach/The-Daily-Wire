import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/services/apiClient';
import { forgotPassword } from '../services/authService';

export function useForgotPassword() {
  const mutation = useMutation({ mutationFn: (email: string) => forgotPassword(email) });

  return {
    requestReset: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? getErrorMessage(mutation.error, 'Unable to process that request right now.') : null,
  };
}
