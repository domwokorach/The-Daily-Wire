import { Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

interface SubscriptionSuccessProps {
  isGuest: boolean;
}

/** Shown on `/subscription/confirmed` once the double opt-in link has
 * actually been clicked — never shown just from submitting the form. */
function SubscriptionSuccess({ isGuest }: SubscriptionSuccessProps) {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 4, md: 6 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5 }}>
        You&rsquo;re subscribed.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Your news preferences have been saved.
      </Typography>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
        {!isGuest && (
          <Button component={RouterLink} to={ROUTES.SETTINGS} variant="outlined">
            Manage Preferences
          </Button>
        )}
        <Button component={RouterLink} to={ROUTES.HOME} variant="contained" color="primary">
          Return to News
        </Button>
      </Stack>
    </Box>
  );
}

export default SubscriptionSuccess;
