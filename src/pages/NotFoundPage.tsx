import { Link as RouterLink } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import Container from '@/components/common/Container';
import { ROUTES } from '@/constants/routes';

function NotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', py: { xs: 8, md: 12 } }}>
      <Typography variant="overline" color="primary.main">
        404
      </Typography>
      <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
        Page not found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The page you're looking for doesn't exist or may have been moved.
      </Typography>
      <Button component={RouterLink} to={ROUTES.HOME} variant="contained" color="primary">
        Back to Home
      </Button>
    </Container>
  );
}

export default NotFoundPage;
