import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/services/apiClient';
import { changePassword, type ChangePasswordPayload } from '../services/userService';

export function useChangePassword() {
  const mutation = useMutation({ mutationFn: (payload: ChangePasswordPayload) => changePassword(payload) });

  return {
    changePassword: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? getErrorMessage(mutation.error, 'Your password could not be changed.') : null,
  };
}
