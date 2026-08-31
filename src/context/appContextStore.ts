import { createContext } from 'react';

export interface AppContextValue {
  savedArticleIds: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);
