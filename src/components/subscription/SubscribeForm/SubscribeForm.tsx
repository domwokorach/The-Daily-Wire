import { useState, type FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useSubscribe } from '@/features/subscription';
import type { SubscriptionPreferences } from '@/features/subscription';
import { ROUTES } from '@/config/routes';

interface SubscribeFormProps {
  variant?: 'default' | 'compact';
  secondaryText?: string;
  preferences?: Partial<SubscriptionPreferences>;
  onSubscribed?: () => void;
}

/** The one email-capture form reused across every entry point (homepage
 * module, footer, article CTA) — only the surrounding copy/spacing differs
 * per placement, never the submit behaviour. Honeypot field is visually
 * hidden, never `display:none` (some bots skip those), and never announced
 * to assistive tech. */
function SubscribeForm({ variant = 'default', secondaryText, preferences, onSubscribed }: SubscribeFormProps) {
  const { subscribe, isLoading, isSuccess, error, result } = useSubscribe();
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setValidationError(null);

    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setValidationError('Enter a valid email address.');
      return;
    }

    try {
      await subscribe({ email: trimmed, preferences, website });
      onSubscribed?.();
    } catch {
      // surfaced via `error` below
    }
  };

  if (isSuccess && result) {
    return (
      <Alert severity={result.alreadySubscribed ? 'info' : 'success'} sx={{ alignItems: 'center' }}>
        {result.message}
      </Alert>
    );
  }

  const isCompact = variant === 'compact';

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={isCompact ? 1.25 : 1.75}>
        {secondaryText && (
          <Typography variant="body2" color="text.secondary">
            {secondaryText}
          </Typography>
        )}
        {(validationError || error) && <Alert severity="error">{validationError || error}</Alert>}
        <Stack direction={{ xs: 'column', sm: isCompact ? 'column' : 'row' }} spacing={1.25}>
          <TextField
            type="email"
            label="Email address"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            size={isCompact ? 'small' : 'medium'}
            slotProps={{ htmlInput: { 'aria-label': 'Email address', autoComplete: 'email' } }}
          />
          {/* Honeypot — hidden from sighted users and screen readers alike. */}
          <Box
            aria-hidden="true"
            sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}
          >
            <TextField
              label="Website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            size={isCompact ? 'medium' : 'large'}
            sx={{ flexShrink: 0, whiteSpace: 'nowrap', width: { xs: '100%', sm: 'auto' } }}
          >
            {isLoading ? 'Subscribing…' : 'Subscribe'}
          </Button>
        </Stack>
        <Typography variant="caption" color="text.disabled">
          By subscribing, you agree to receive the email updates you select. You can unsubscribe at any time. See our{' '}
          <Link component={RouterLink} to={ROUTES.PRIVACY} color="inherit">
            Privacy Policy
          </Link>
          .
        </Typography>
      </Stack>
    </Box>
  );
}

export default SubscribeForm;
