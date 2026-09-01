import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/services/apiClient';
import { changeEmail, type ChangeEmailPayload } from '../services/userService';

export function useChangeEmail() {
  const mutation = useMutation({ mutationFn: (payload: ChangeEmailPayload) => changeEmail(payload) });

  return {
    changeEmail: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? getErrorMessage(mutation.error, 'Unable to update your email.') : null,
  };
}
