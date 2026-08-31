import { useArticles } from '@/hooks/useArticles';

export function useWorldFeed() {
  return useArticles('world');
}
