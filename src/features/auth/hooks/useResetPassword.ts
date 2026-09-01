import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/services/apiClient';
import { resetPassword } from '../services/authService';
import type { ResetPasswordPayload } from '../types';

export function useResetPassword() {
  const mutation = useMutation({ mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload) });

  return {
    reset: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? getErrorMessage(mutation.error, 'This reset link is invalid or has expired.') : null,
  };
}
