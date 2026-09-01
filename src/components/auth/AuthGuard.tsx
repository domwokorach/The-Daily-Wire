import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/config/routes';
import LoadingState from '@/components/common/LoadingState';
import Container from '@/components/common/Container';

interface AuthGuardProps {
  children: ReactNode;
}

function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation();
  const status = useAuthStore((state) => state.status);
  useAuth();

  if (status === 'idle' || status === 'loading') {
    return (
      <Container maxWidth="md">
        <LoadingState variant="inline" />
      </Container>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default AuthGuard;
