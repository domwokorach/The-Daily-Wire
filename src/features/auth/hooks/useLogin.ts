import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { useAuthStore } from '@/store';
import { login } from '../services/authService';
import type { LoginPayload } from '../types';

export function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(authKeys.me(), user);
    },
  });

  return {
    login: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Unable to sign in right now.') : null,
  };
}
