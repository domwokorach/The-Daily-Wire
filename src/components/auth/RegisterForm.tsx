import { useState, type FormEvent } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useRegister } from '@/features/auth';
import { ROUTES } from '@/config/routes';

const TODAY = new Date().toISOString().slice(0, 10);

function RegisterForm() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useRegister();

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
      navigate(ROUTES.HOME, { replace: true });
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
