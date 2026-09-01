import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/services/apiClient';
import { useAuthStore } from '@/store';
import { deleteAccount } from '../services/userService';

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const clear = useAuthStore((state) => state.clear);

  const mutation = useMutation({
    mutationFn: (currentPassword: string) => deleteAccount(currentPassword),
    onSuccess: () => {
      clear();
      queryClient.clear();
    },
  });

  return {
    deleteAccount: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Unable to delete your account right now.') : null,
  };
}
