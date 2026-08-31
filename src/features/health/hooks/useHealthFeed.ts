import { useArticles } from '@/hooks/useArticles';

export function useHealthFeed() {
  return useArticles('health');
}
