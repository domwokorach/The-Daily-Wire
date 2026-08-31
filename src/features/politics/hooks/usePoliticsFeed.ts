import { useArticles } from '@/hooks/useArticles';

export function usePoliticsFeed() {
  return useArticles('politics');
}
