import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authKeys, commentKeys, notificationKeys } from '@/constants/queryKeys';
import { useAuthStore } from '@/store';
import { logout } from '../services/authService';

export function useLogout() {
  const queryClient = useQueryClient();
  const clear = useAuthStore((state) => state.clear);

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clear();
      // Drop only personal/session-scoped cache entries — public news,
      // weather, and sports data stay cached across logout.
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.removeQueries({ queryKey: commentKeys.all });
      queryClient.removeQueries({ queryKey: notificationKeys.all });
    },
  });

  return { logout: mutation.mutateAsync, isLoading: mutation.isPending };
}
