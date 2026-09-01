import { useState, type FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import Container from '@/components/common/Container';
import SubscriptionPreferences from '@/components/subscription/SubscriptionPreferences';
import { useSubscribe, useResendConfirmation } from '@/features/subscription';
import type { SubscriptionPreferenceKey, SubscriptionPreferences as Preferences } from '@/features/subscription';
import { ROUTES } from '@/config/routes';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SubscribePage() {
  const { subscribe, isLoading, isSuccess, error, result } = useSubscribe();
  const { resend, isLoading: isResending, isSuccess: resent } = useResendConfirmation();
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState<Partial<Preferences>>({ dailyDigest: true });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleTogglePreference = (key: SubscriptionPreferenceKey, value: boolean) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setValidationError(null);

    const trimmed = email.trim();
    if (!trimmed || !EMAIL_RE.test(trimmed)) {
      setValidationError('Enter a valid email address.');
      return;
    }

    try {
      await subscribe({ email: trimmed, preferences });
    } catch {
      // surfaced via `error`
    }
  };

  if (isSuccess && result) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
            {result.alreadySubscribed ? "You're already subscribed." : 'Check your inbox.'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {result.message}
          </Typography>
          {!result.alreadySubscribed && (
            <Stack spacing={1} sx={{ alignItems: 'center' }}>
              {resent && <Alert severity="success">Confirmation email sent again.</Alert>}
              <Button variant="outlined" disabled={isResending} onClick={() => resend(email.trim())}>
                {isResending ? 'Sending…' : "Didn't get it? Resend confirmation"}
              </Button>
            </Stack>
          )}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="overline" color="primary.main">
        Stay Informed
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, mb: 3 }}>
        Subscribe to The Daily Wire
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          {(validationError || error) && <Alert severity="error">{validationError || error}</Alert>}
          <TextField
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            autoComplete="email"
          />
          <SubscriptionPreferences preferences={preferences} onChange={handleTogglePreference} disabled={isLoading} />
          <Button type="submit" variant="contained" color="primary" size="large" disabled={isLoading}>
            {isLoading ? 'Subscribing…' : 'Subscribe'}
          </Button>
          <Typography variant="caption" color="text.disabled">
            By subscribing, you agree to receive the email updates you select. You can unsubscribe at any time. See
            our <Link component={RouterLink} to={ROUTES.PRIVACY} color="inherit">Privacy Policy</Link>.
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
}

export default SubscribePage;
