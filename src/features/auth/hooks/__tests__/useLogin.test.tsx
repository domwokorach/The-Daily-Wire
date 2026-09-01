import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useLogin } from '../useLogin';
import { apiClient } from '@/services/apiClient';
import { useAuthStore } from '@/store';

jest.mock('@/services/apiClient', () => ({
  apiClient: { post: jest.fn() },
  getErrorMessage: (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback,
}));

jest.mock('@/config/appConfig', () => ({
  APP_CONFIG: { siteName: 'The Daily Wire', siteTagline: '', apiBaseUrl: '/api', defaultPageSize: 12 },
}));

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ user: null, status: 'idle' });
  });

  test('populates authStore on a successful login', async () => {
    const user = {
      id: 'u1',
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      mobileNumber: '+447700900000',
      dateOfBirth: '1990-01-01',
      emailVerified: false,
      createdAt: '',
    };
    (apiClient.post as jest.Mock).mockResolvedValue({ user });

    const { result } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      await result.current.login({ email: 'ada@example.com', password: 'whatever' });
    });

    await waitFor(() => expect(useAuthStore.getState().status).toBe('authenticated'));
    expect(useAuthStore.getState().user).toEqual(user);
  });

  test('surfaces the server error message on invalid credentials', async () => {
    (apiClient.post as jest.Mock).mockRejectedValue(new Error('Email or password is incorrect.'));

    const { result } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      await result.current.login({ email: 'ada@example.com', password: 'wrong' }).catch(() => {});
    });

    await waitFor(() => expect(result.current.error).toBe('Email or password is incorrect.'));
    expect(useAuthStore.getState().status).not.toBe('authenticated');
  });
});
