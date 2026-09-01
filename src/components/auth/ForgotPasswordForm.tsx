import { useState, type FormEvent } from 'react';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useForgotPassword } from '@/features/auth';

function ForgotPasswordForm() {
  const { requestReset, isLoading, isSuccess, error } = useForgotPassword();
  const [email, setEmail] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await requestReset(email);
  };

  if (isSuccess) {
    return (
      <Box sx={{ maxWidth: 420, mx: 'auto' }}>
        <Alert severity="success">
          If an account exists for that email, password reset instructions have been sent.
        </Alert>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 420, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Forgot password
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter your email and we&apos;ll send you a link to reset your password.
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
        <Button type="submit" variant="contained" color="primary" size="large" disabled={isLoading} fullWidth>
          {isLoading ? 'Sending…' : 'Send reset link'}
        </Button>
      </Stack>
    </Box>
  );
}

export default ForgotPasswordForm;
