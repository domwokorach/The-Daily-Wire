import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authKeys, commentKeys, notificationKeys, savedArticleKeys } from '@/constants/queryKeys';
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
      // weather, and sports data stay cached across logout. Comments are
      // dropped too (their own-comment ownership/edit state is
      // session-scoped) even though public reading continues — the next
      // mount just refetches the article's comment list, no auth required.
      // Saved articles are entirely private, so their cache is cleared
      // outright rather than just invalidated.
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.removeQueries({ queryKey: commentKeys.all });
      queryClient.removeQueries({ queryKey: notificationKeys.all });
      queryClient.removeQueries({ queryKey: savedArticleKeys.all });
    },
  });

  return { logout: mutation.mutateAsync, isLoading: mutation.isPending };
}
