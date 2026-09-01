import type { ReactNode } from 'react';
import { useBreakingAlerts } from '@/features/notifications';
import BreakingAlertSnackbar from './BreakingAlertSnackbar';

interface BreakingAlertProviderProps {
  children: ReactNode;
}

function BreakingAlertProvider({ children }: BreakingAlertProviderProps) {
  const { alert, dismiss } = useBreakingAlerts();

  return (
    <>
      {children}
      <BreakingAlertSnackbar alert={alert} onDismiss={dismiss} />
    </>
  );
}

export default BreakingAlertProvider;
