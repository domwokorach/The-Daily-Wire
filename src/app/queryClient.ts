import { QueryClient } from '@tanstack/react-query';

// News feeds are cached server-side too — this just stops the same
// category/query being refetched on every re-render or focus event.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
