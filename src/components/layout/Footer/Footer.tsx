import Grid from '@mui/material/Grid';
import { Box, Container, Divider, IconButton, Link, Stack, Typography } from '@mui/material';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { NAV_ITEMS } from '@/data/navigation';
import { APP_CONFIG } from '@/constants/config';

const COMPANY_LINKS = ['About Us', 'Contact', 'Careers', 'Advertise'];
const LEGAL_LINKS = ['Privacy Policy', 'Terms of Service', 'Accessibility'];

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'surfaceAlt.main',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {APP_CONFIG.siteName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
              {APP_CONFIG.siteTagline} UK coverage across politics, world affairs, business,
              health, technology, sport, and weather.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2.5 }}>
              <IconButton
                aria-label="Follow us on X"
                size="small"
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { color: 'primary.main', borderColor: 'primary.main' },
                }}
              >
                <XIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="Follow us on Facebook"
                size="small"
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { color: 'primary.main', borderColor: 'primary.main' },
                }}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="Follow us on LinkedIn"
                size="small"
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { color: 'primary.main', borderColor: 'primary.main' },
                }}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <Typography variant="overline" color="primary.main">
              Sections
            </Typography>
            <Stack spacing={1} sx={{ mt: 1.5 }}>
              {NAV_ITEMS.filter((item) => item.key !== 'home').map((item) => (
                <Link
                  key={item.key}
                  href={item.path}
                  underline="none"
                  variant="body2"
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <Typography variant="overline" color="primary.main">
              Company
            </Typography>
            <Stack spacing={1} sx={{ mt: 1.5, mb: 2 }}>
              {COMPANY_LINKS.map((label) => (
                <Link
                  key={label}
                  href="#"
                  underline="none"
                  variant="body2"
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  {label}
                </Link>
              ))}
            </Stack>
            <Stack spacing={1}>
              {LEGAL_LINKS.map((label) => (
                <Link
                  key={label}
                  href="#"
                  underline="none"
                  variant="body2"
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  {label}
                </Link>
              ))}
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography variant="caption" color="text.disabled">
          © 2026 {APP_CONFIG.siteName}. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
