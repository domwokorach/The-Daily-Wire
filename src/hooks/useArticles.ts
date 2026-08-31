import { useEffect, useState } from 'react';
import type { Article } from '@/data/mockArticles';
import { getArticles, getArticlesByCategory } from '@/services/newsService';

interface ArticlesState {
  category?: Article['category'];
  version: number;
  articles: Article[];
  loading: boolean;
  error: string | null;
}

interface UseArticlesResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function createInitialState(category?: Article['category']): ArticlesState {
  return { category, version: 0, articles: [], loading: true, error: null };
}

export function useArticles(category?: Article['category']): UseArticlesResult {
  const [state, setState] = useState<ArticlesState>(() => createInitialState(category));

  if (state.category !== category) {
    setState(createInitialState(category));
  }

  useEffect(() => {
    let active = true;

    const request = category ? getArticlesByCategory(category) : getArticles();
    request
      .then((result) => {
        if (active) setState((current) => ({ ...current, articles: result, loading: false, error: null }));
      })
      .catch(() => {
        if (active) {
          setState((current) => ({
            ...current,
            loading: false,
            error: 'Unable to load articles right now.',
          }));
        }
      });

    return () => {
      active = false;
    };
  }, [category, state.version]);

  return {
    articles: state.articles,
    loading: state.loading,
    error: state.error,
    refetch: () =>
      setState((current) => ({ ...current, version: current.version + 1, loading: true, error: null })),
  };
}
