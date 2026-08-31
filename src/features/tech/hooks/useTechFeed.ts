import { useArticles } from '@/hooks/useArticles';

export function useTechFeed() {
  return useArticles('tech');
}
