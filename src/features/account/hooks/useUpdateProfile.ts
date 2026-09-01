import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/services/apiClient';
import { useAuthStore } from '@/store';
import { updateProfile, type ProfilePayload } from '../services/userService';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: (payload: ProfilePayload) => updateProfile(payload),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(authKeys.me(), user);
    },
  });

  return {
    updateProfile: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? getErrorMessage(mutation.error, 'Unable to update your profile.') : null,
  };
}
