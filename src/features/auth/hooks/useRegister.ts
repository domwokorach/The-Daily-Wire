import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { useAuthStore } from '@/store';
import { register } from '../services/authService';
import type { RegisterPayload } from '../types';

export function useRegister() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(authKeys.me(), user);
    },
  });

  return {
    register: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Unable to create your account right now.') : null,
  };
}
