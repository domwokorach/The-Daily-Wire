import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { AppContext } from './appContextStore';

const STORAGE_KEY = 'daily-wire:saved-articles';

function readStoredIds(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => readStoredIds());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedArticleIds));
    } catch {
      // localStorage may be unavailable (private browsing, disabled storage); saved
      // state simply won't persist across reloads in that case.
    }
  }, [savedArticleIds]);

  const toggleSaved = useCallback((id: string) => {
    setSavedArticleIds((current) =>
      current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id],
    );
  }, []);

  const isSaved = useCallback(
    (id: string) => savedArticleIds.includes(id),
    [savedArticleIds],
  );

  return (
    <AppContext.Provider value={{ savedArticleIds, isSaved, toggleSaved }}>
      {children}
    </AppContext.Provider>
  );
}
