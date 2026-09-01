import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useResetPassword } from '@/features/auth';
import { ROUTES } from '@/config/routes';

function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const { reset, isLoading, error } = useResetPassword();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await reset({ token, password, confirmPassword });
      navigate(ROUTES.LOGIN, { replace: true });
    } catch {
      // error already surfaced via `error` from useResetPassword
    }
  };

  if (!token) {
    return (
      <Box sx={{ maxWidth: 420, mx: 'auto' }}>
        <Alert severity="error">This reset link is invalid or has expired.</Alert>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 420, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Reset password
      </Typography>
      <Stack spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          helperText="At least 10 characters."
          required
          fullWidth
        />
        <TextField
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" size="large" disabled={isLoading} fullWidth>
          {isLoading ? 'Resetting…' : 'Reset password'}
        </Button>
      </Stack>
    </Box>
  );
}

export default ResetPasswordForm;
