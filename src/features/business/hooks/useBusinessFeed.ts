import { useArticles } from '@/hooks/useArticles';

export function useBusinessFeed() {
  return useArticles('business');
}
