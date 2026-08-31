import { useEffect, useState } from 'react';
import type { Article } from '@/data/mockArticles';
import { getBreakingNews } from '@/services/newsService';

interface UseBreakingNewsResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
}

export function useBreakingNews(): UseBreakingNewsResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getBreakingNews()
      .then((result) => {
        if (active) {
          setArticles(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError('Unable to load breaking news right now.');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { articles, loading, error };
}
