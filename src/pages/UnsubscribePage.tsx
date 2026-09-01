import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import Container from '@/components/common/Container';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import SubscriptionPreferences from '@/components/subscription/SubscriptionPreferences';
import UnsubscribeDialog from '@/components/subscription/UnsubscribeDialog';
import { useManageSubscription, useUnsubscribe } from '@/features/subscription';
import type { SubscriptionPreferenceKey, SubscriptionPreferences as Preferences } from '@/features/subscription';

/**
 * Guest self-service landing page for both `/subscription/manage?token=...`
 * and `/subscription/unsubscribe?token=...` email links — no account
 * required, authorized entirely by the opaque management token, never by a
 * subscription id in the URL.
 */
function UnsubscribePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? undefined;
  const { subscription, loading, loadError, updatePreferences, isSaving, isSaveSuccess, saveError } =
    useManageSubscription(token);
  const { resubscribe, isResubscribing, resubscribeSuccess } = useUnsubscribe();
  const [draft, setDraft] = useState<Partial<Preferences> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);

  const preferences = draft ?? subscription?.preferences ?? {};

  const handleToggle = (key: SubscriptionPreferenceKey, value: boolean) => {
    setDraft({ ...preferences, [key]: value });
  };

  const handleSave = () => {
    if (draft) updatePreferences(draft);
  };

  if (!token) {
    return (
      <Container maxWidth="sm">
        <ErrorState message="This link is missing a token. Check the link in your email and try again." />
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="sm">
        <LoadingState variant="inline" count={1} />
      </Container>
    );
  }

  if (loadError || !subscription) {
    return (
      <Container maxWidth="sm">
        <ErrorState message={loadError ?? 'This link is invalid or has expired.'} />
      </Container>
    );
  }

  if (unsubscribed || subscription.status === 'unsubscribed') {
    return (
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
            You&rsquo;re unsubscribed.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You will no longer receive email updates from The Daily Wire.
          </Typography>
          {resubscribeSuccess ? (
            <Alert severity="success">You&rsquo;re resubscribed with your previous preferences.</Alert>
          ) : (
            <Button variant="outlined" disabled={isResubscribing} onClick={() => resubscribe(token)}>
              {isResubscribing ? 'Resubscribing…' : 'Resubscribe'}
            </Button>
          )}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        Manage your subscription
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {subscription.email}
      </Typography>
      <Stack spacing={3}>
        {isSaveSuccess && <Alert severity="success">Preferences updated.</Alert>}
        {saveError && <Alert severity="error">{saveError}</Alert>}
        <SubscriptionPreferences preferences={preferences} onChange={handleToggle} disabled={isSaving} />
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={isSaving || !draft}>
            {isSaving ? 'Saving…' : 'Save Preferences'}
          </Button>
          <Button variant="outlined" color="error" onClick={() => setDialogOpen(true)}>
            Unsubscribe from everything
          </Button>
        </Stack>
      </Stack>
      <UnsubscribeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        token={token}
        onUnsubscribed={() => setUnsubscribed(true)}
      />
    </Container>
  );
}

export default UnsubscribePage;
