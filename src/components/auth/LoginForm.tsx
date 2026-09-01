import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useLogin } from '@/features/auth';
import { useSaveArticle, toSaveArticlePayload } from '@/features/savedArticles';
import { getArticleBySlug } from '@/features/news/services/newsService';
import { ROUTES } from '@/config/routes';
import { sanitizeReturnTo, extractArticleIdFromReturnTo } from '@/utils/returnTo';

interface LocationState {
  from?: { pathname: string };
}

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, isLoading, error } = useLogin();
  const { save } = useSaveArticle();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await login({ email, password });

      const returnTo = sanitizeReturnTo(searchParams.get('returnTo'));
      const state = location.state as LocationState | null;
      const target = returnTo ?? state?.from?.pathname ?? ROUTES.HOME;

      // Complete a pending "Save" that was interrupted by the login
      // redirect — the article is resolved from the same in-session
      // article cache the article page already reads from, not re-fetched.
      let savedAfterLogin = false;
      if (returnTo && searchParams.get('action') === 'save') {
        const articleId = extractArticleIdFromReturnTo(returnTo);
        const article = articleId ? await getArticleBySlug(articleId) : undefined;
        if (article) {
          try {
            await save(toSaveArticlePayload(article));
            savedAfterLogin = true;
          } catch {
            // Sign-in still succeeded; the article page's own Save button
            // still works normally if this best-effort save fails.
          }
        }
      }

      navigate(target, { replace: true, state: savedAfterLogin ? { savedAfterLogin: true } : undefined });
    } catch {
      // error already surfaced via `error` from useLogin
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 420, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Sign in
      </Typography>
      <Stack spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}
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
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <Button size="small" onClick={() => setShowPassword((s) => !s)} sx={{ minWidth: 'auto' }}>
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              ),
            },
          }}
        />
        <Box sx={{ textAlign: 'right' }}>
          <Link component={RouterLink} to={ROUTES.FORGOT_PASSWORD} variant="body2" color="text.secondary">
            Forgot password?
          </Link>
        </Box>
        <Button type="submit" variant="contained" color="primary" size="large" disabled={isLoading} fullWidth>
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} to={ROUTES.REGISTER}>
            Register
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
}

export default LoginForm;
