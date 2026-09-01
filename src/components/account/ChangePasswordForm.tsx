import { useState, type FormEvent } from 'react';
import { Alert, Box, Button, Card, Stack, TextField, Typography } from '@mui/material';
import { useChangePassword } from '@/features/account';

function ChangePasswordForm() {
  const { changePassword, isLoading, isSuccess, error } = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await changePassword({ currentPassword, newPassword, confirmNewPassword });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Password
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          {isSuccess && <Alert severity="success">Password changed successfully.</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Current password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
            fullWidth
          />
          <TextField
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            helperText="At least 10 characters."
            required
            fullWidth
          />
          <TextField
            label="Confirm new password"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            autoComplete="new-password"
            required
            fullWidth
          />
          <Box>
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
              {isLoading ? 'Changing…' : 'Change password'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Card>
  );
}

export default ChangePasswordForm;
