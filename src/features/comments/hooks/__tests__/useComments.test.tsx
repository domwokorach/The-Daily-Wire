import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useComments } from '../useComments';
import { apiClient } from '@/services/apiClient';

jest.mock('@/services/apiClient', () => ({
  apiClient: { get: jest.fn() },
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

describe('useComments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('starts in a loading state with no comments', () => {
    (apiClient.get as jest.Mock).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useComments('article-1'), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.comments).toEqual([]);
  });

  test('resolves to the fetched comments', async () => {
    const comments = [
      { id: 'c1', articleId: 'article-1', author: { id: 'u1', displayName: 'Ada' }, body: 'Hi', createdAt: '', updatedAt: '', edited: false },
    ];
    (apiClient.get as jest.Mock).mockResolvedValue({ comments });

    const { result } = renderHook(() => useComments('article-1'), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.comments).toEqual(comments);
    expect(result.current.error).toBeNull();
  });

  test('surfaces a friendly error on failure', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('Unable to load comments right now.'));

    const { result } = renderHook(() => useComments('article-1'), { wrapper });

    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.comments).toEqual([]);
  });

  test('does not fetch for an empty article id', () => {
    renderHook(() => useComments(''), { wrapper });
    expect(apiClient.get).not.toHaveBeenCalled();
  });
});
