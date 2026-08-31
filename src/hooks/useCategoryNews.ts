import { useEffect, useState } from 'react';
import type { Article } from '@/data/mockArticles';
import type { ArticleCategory } from '@/config/news';
import { getCategoryNews, type NewsQueryOptions } from '@/services/newsService';

interface UseCategoryNewsResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  page: number;
  totalResults: number;
  hasMore: boolean;
  refetch: () => void;
  loadMore: () => void;
}

interface CategoryNewsState {
  category: ArticleCategory;
  version: number;
  page: number;
  articles: Article[];
  totalResults: number;
  loading: boolean;
  error: string | null;
}

function createInitialState(category: ArticleCategory): CategoryNewsState {
  return { category, version: 0, page: 1, articles: [], totalResults: 0, loading: true, error: null };
}

/** Category feed with pagination, for views that support "load more". */
export function useCategoryNews(
  category: ArticleCategory,
  options: NewsQueryOptions = {},
): UseCategoryNewsResult {
  const [state, setState] = useState<CategoryNewsState>(() => createInitialState(category));

  if (state.category !== category) {
    setState(createInitialState(category));
  }

  useEffect(() => {
    let active = true;
    const requestedPage = state.page;

    getCategoryNews(category, { ...options, page: requestedPage })
      .then((result) => {
        if (!active) return;
        setState((current) => ({
          ...current,
          articles: requestedPage === 1 ? result.articles : [...current.articles, ...result.articles],
          totalResults: result.totalResults,
          loading: false,
          error: null,
        }));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, state.page, state.version]);

  return {
    articles: state.articles,
    loading: state.loading,
    error: state.error,
    page: state.page,
    totalResults: state.totalResults,
    hasMore: state.articles.length < state.totalResults,
    refetch: () =>
      setState((current) => ({ ...createInitialState(current.category), version: current.version + 1 })),
    loadMore: () => setState((current) => ({ ...current, page: current.page + 1, loading: true })),
  };
}
