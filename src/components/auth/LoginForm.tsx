import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useLogin } from '@/features/auth';
import { ROUTES } from '@/config/routes';

interface LocationState {
  from?: { pathname: string };
}

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await login({ email, password });
      const state = location.state as LocationState | null;
      navigate(state?.from?.pathname ?? ROUTES.HOME, { replace: true });
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
