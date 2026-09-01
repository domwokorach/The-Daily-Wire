import { useState, type FormEvent } from 'react';
import { Alert, Box, Button, Card, Stack, TextField, Typography } from '@mui/material';
import { useAuthStore } from '@/store';
import { useChangeEmail } from '@/features/account';

function ChangeEmailForm() {
  const user = useAuthStore((state) => state.user);
  const { changeEmail, isLoading, isSuccess, error } = useChangeEmail();

  const [newEmail, setNewEmail] = useState('');
  const [confirmNewEmail, setConfirmNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await changeEmail({ newEmail, confirmNewEmail, currentPassword });
    setNewEmail('');
    setConfirmNewEmail('');
    setCurrentPassword('');
  };

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Email
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Current email: {user?.email}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          {isSuccess && <Alert severity="success">Email verification sent.</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="New email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required fullWidth />
          <TextField
            label="Confirm new email"
            type="email"
            value={confirmNewEmail}
            onChange={(e) => setConfirmNewEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Current password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            helperText="Confirm your password to change your email."
            required
            fullWidth
          />
          <Box>
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
              {isLoading ? 'Sending…' : 'Change email'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Card>
  );
}

export default ChangeEmailForm;
