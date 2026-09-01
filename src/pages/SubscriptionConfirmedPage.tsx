import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import Container from '@/components/common/Container';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import SubscriptionSuccess from '@/components/subscription/SubscriptionSuccess';
import { useConfirmSubscription } from '@/features/subscription';
import { useAuthStore } from '@/store';

function SubscriptionConfirmedPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { confirm, isLoading, isSuccess, error } = useConfirmSubscription();
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');
  const attempted = useRef(false);

  useEffect(() => {
    if (token && !attempted.current) {
      attempted.current = true;
      confirm(token).catch(() => {
        // surfaced via `error`
      });
    }
  }, [token, confirm]);

  if (!token) {
    return (
      <Container maxWidth="sm">
        <ErrorState message="This confirmation link is missing a token. Check the link in your email and try again." />
      </Container>
    );
  }

  if (isLoading || (!isSuccess && !error)) {
    return (
      <Container maxWidth="sm">
        <LoadingState variant="inline" count={1} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <ErrorState message={error} />
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button href="/subscribe">Subscribe again</Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <SubscriptionSuccess isGuest={!isAuthenticated} />
    </Container>
  );
}

export default SubscriptionConfirmedPage;
