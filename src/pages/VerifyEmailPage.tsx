import { useEffect, useState } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button } from '@mui/material';
import Container from '@/components/common/Container';
import LoadingState from '@/components/common/LoadingState';
import { verifyEmail } from '@/features/auth';
import { ROUTES } from '@/config/routes';

type Status = 'verifying' | 'success' | 'error';

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [status, setStatus] = useState<Status>(token ? 'verifying' : 'error');

  useEffect(() => {
    if (!token) return;
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <Container maxWidth="sm">
      {status === 'verifying' && <LoadingState variant="inline" count={2} />}
      {status === 'success' && <Alert severity="success">Your email has been verified.</Alert>}
      {status === 'error' && (
        <Alert severity="error">This verification link is invalid or has expired.</Alert>
      )}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button component={RouterLink} to={ROUTES.HOME}>
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}

export default VerifyEmailPage;
