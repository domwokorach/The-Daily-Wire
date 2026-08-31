import { useArticles } from '@/hooks/useArticles';
import { useSportScores } from '@/hooks/useSportScores';

export function useSportFeed() {
  const { articles, loading: articlesLoading, error: articlesError } = useArticles('sport');
  const { fixtures, loading: fixturesLoading, error: fixturesError } = useSportScores();

  return {
    articles,
    fixtures,
    loading: articlesLoading || fixturesLoading,
    error: articlesError ?? fixturesError,
  };
}
