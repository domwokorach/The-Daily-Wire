import { useContext } from 'react';
import { AppContext, type AppContextValue } from './appContextStore';

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
