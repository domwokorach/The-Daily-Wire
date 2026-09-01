import { useState } from 'react';
import { Alert, Box, Button, Card, Skeleton, Stack, Typography } from '@mui/material';
import SubscriptionPreferences from '@/components/subscription/SubscriptionPreferences';
import { useSubscriptionPreferences, useUpdateSubscriptionPreferences } from '@/features/subscription';
import type { SubscriptionPreferenceKey, SubscriptionPreferences as Preferences } from '@/features/subscription';

const EMPTY_PREFERENCES: Partial<Preferences> = {};

function EmailSubscriptionsFields({ initialPreferences }: { initialPreferences: Partial<Preferences> }) {
  const { updatePreferences, isLoading, isSuccess, error } = useUpdateSubscriptionPreferences();
  const [draft, setDraft] = useState<Partial<Preferences> | null>(null);

  const preferences = draft ?? initialPreferences;

  const handleToggle = (key: SubscriptionPreferenceKey, value: boolean) => {
    setDraft({ ...preferences, [key]: value });
  };

  return (
    <Stack spacing={1.5}>
      {isSuccess && <Alert severity="success">Email subscriptions saved.</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <SubscriptionPreferences preferences={preferences} onChange={handleToggle} disabled={isLoading} />
      <Box sx={{ pt: 1 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => draft && updatePreferences(draft)}
          disabled={isLoading || !draft}
        >
          {isLoading ? 'Saving…' : 'Save Preferences'}
        </Button>
      </Box>
    </Stack>
  );
}

/** Distinct from account email verification — a signed-in user's email
 * being verified is not the same as having opted into any newsletter, so
 * this always starts from the subscriber's actual saved preferences (or an
 * all-off default if they've never subscribed) rather than assuming consent. */
function EmailSubscriptionsForm() {
  const { subscription, loading } = useSubscriptionPreferences();

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Email Subscriptions
      </Typography>
      {loading ? (
        <Stack spacing={1.5}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} variant="text" height={32} />
          ))}
        </Stack>
      ) : (
        <EmailSubscriptionsFields initialPreferences={subscription?.preferences ?? EMPTY_PREFERENCES} />
      )}
    </Card>
  );
}

export default EmailSubscriptionsForm;
