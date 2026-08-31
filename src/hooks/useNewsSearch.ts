import { useEffect, useState } from 'react';
import type { Article } from '@/data/mockArticles';
import { searchNews } from '@/services/newsService';

interface UseNewsSearchResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  page: number;
  totalResults: number;
  hasMore: boolean;
  refetch: () => void;
  loadMore: () => void;
}

interface SearchState {
  query: string;
  version: number;
  page: number;
  articles: Article[];
  totalResults: number;
  loading: boolean;
  error: string | null;
}

function createInitialState(query: string): SearchState {
  return { query, version: 0, page: 1, articles: [], totalResults: 0, loading: Boolean(query.trim()), error: null };
}

export function useNewsSearch(query: string): UseNewsSearchResult {
  const [state, setState] = useState<SearchState>(() => createInitialState(query));

  if (state.query !== query) {
    setState(createInitialState(query));
  }

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return undefined;

    let active = true;
    const requestedPage = state.page;

    searchNews(trimmed, { page: requestedPage })
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
            error: 'Unable to search right now. Please try again shortly.',
          }));
        }
      });

    return () => {
      active = false;
    };
  }, [query, state.page, state.version]);

  return {
    articles: state.articles,
    loading: state.loading,
    error: state.error,
    page: state.page,
    totalResults: state.totalResults,
    hasMore: state.articles.length < state.totalResults,
    refetch: () =>
      setState((current) => ({ ...createInitialState(current.query), version: current.version + 1 })),
    loadMore: () => setState((current) => ({ ...current, page: current.page + 1, loading: true })),
  };
}
