import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useRegister } from '@/features/auth';
import { useSaveArticle, toSaveArticlePayload } from '@/features/savedArticles';
import { getArticleBySlug } from '@/features/news/services/newsService';
import { ROUTES } from '@/config/routes';
import { sanitizeReturnTo, extractArticleIdFromReturnTo } from '@/utils/returnTo';

const TODAY = new Date().toISOString().slice(0, 10);

function RegisterForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, isLoading, error } = useRegister();
  const { save } = useSaveArticle();

  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await register({ fullName, dateOfBirth, email, mobileNumber, password, confirmPassword });

      const returnTo = sanitizeReturnTo(searchParams.get('returnTo'));
      const target = returnTo ?? ROUTES.HOME;

      let savedAfterLogin = false;
      if (returnTo && searchParams.get('action') === 'save') {
        const articleId = extractArticleIdFromReturnTo(returnTo);
        const article = articleId ? await getArticleBySlug(articleId) : undefined;
        if (article) {
          try {
            await save(toSaveArticlePayload(article));
            savedAfterLogin = true;
          } catch {
            // Account creation still succeeded; the article page's own
            // Save button still works normally if this best-effort save fails.
          }
        }
      }

      navigate(target, { replace: true, state: savedAfterLogin ? { savedAfterLogin: true } : undefined });
    } catch {
      // error already surfaced via `error` from useRegister
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 480, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Create your account
      </Typography>
      <Stack spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
          required
          fullWidth
        />
        <TextField
          label="Date of birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: TODAY } }}
          required
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          fullWidth
        />
        <TextField
          label="Mobile number"
          type="tel"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          autoComplete="tel"
          placeholder="+44 7700 900000"
          required
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          helperText="At least 10 characters."
          required
          fullWidth
        />
        <TextField
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" size="large" disabled={isLoading} fullWidth>
          {isLoading ? 'Creating account…' : 'Create account'}
        </Button>
        <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center', display: 'block' }}>
          By creating an account, you agree to our{' '}
          <Link component={RouterLink} to={ROUTES.TERMS}>
            Terms of Service
          </Link>{' '}
          and acknowledge our{' '}
          <Link component={RouterLink} to={ROUTES.PRIVACY}>
            Privacy Policy
          </Link>
          .
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <Link component={RouterLink} to={ROUTES.LOGIN}>
            Sign in
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
}

export default RegisterForm;
