import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authKeys } from '@/constants/queryKeys';
import { useAuthStore } from '@/store';
import { getMe } from '../services/authService';

/** Bootstraps `authStore` from the session cookie (if any) on app load, and
 * keeps it in sync on refetch. Renders decide auth state from `authStore`,
 * not from this hook's return value directly. */
export function useAuth() {
  const setUser = useAuthStore((state) => state.setUser);
  const setStatus = useAuthStore((state) => state.setStatus);

  const query = useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.isLoading) {
      setStatus('loading');
    } else if (query.isError) {
      setUser(null);
    } else if (query.data) {
      setUser(query.data);
    }
  }, [query.isLoading, query.isError, query.data, setUser, setStatus]);

  return query;
}
