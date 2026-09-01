import { Box, Card, Typography } from '@mui/material';
import SubscribeForm from '@/components/subscription/SubscribeForm';

/** The premium editorial subscription panel for the homepage. Deliberately
 * plain — no gradients, no imagery — matching the site's understated dark
 * navy/gold treatment rather than a typical marketing-style newsletter box. */
function SubscribeCard() {
  return (
    <Card
      sx={{
        p: { xs: 3, md: 5 },
        textAlign: 'center',
        bgcolor: 'surfaceAlt.main',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ maxWidth: 480, mx: 'auto' }}>
        <Typography variant="overline" color="primary.main" sx={{ letterSpacing: '0.14em' }}>
          Stay Informed
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, mb: 3 }}>
          Get the day&rsquo;s most important UK and world stories delivered directly to your inbox.
        </Typography>
        <SubscribeForm secondaryText="Breaking news, politics, business, technology, health and sport." />
      </Box>
    </Card>
  );
}

export default SubscribeCard;
