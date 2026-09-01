import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { ROUTES } from '@/config/routes';
import { sanitizeReturnTo } from '@/utils/returnTo';

/** Shown instead of an editable comment textarea for a logged-out visitor
 * — never a disabled/fake textarea, just a clear sign-in prompt that
 * returns them to this exact article afterwards. */
function LoginToComment() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignIn = () => {
    const returnTo = sanitizeReturnTo(`${location.pathname}${location.search}`) ?? ROUTES.HOME;
    navigate(`${ROUTES.LOGIN}?returnTo=${encodeURIComponent(returnTo)}`);
  };

  return (
    <Box sx={{ mb: 3, p: 2.5, bgcolor: 'surfaceAlt.main', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
        Join the discussion
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Sign in to add a comment.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleSignIn}>
        Sign In
      </Button>
    </Box>
  );
}

export default LoginToComment;
