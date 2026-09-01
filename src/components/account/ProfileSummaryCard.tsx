import { useState, type FormEvent } from 'react';
import { Alert, Box, Button, Card, Stack, TextField, Typography } from '@mui/material';
import { useAuthStore } from '@/store';
import { useUpdateProfile } from '@/features/account';

const TODAY = new Date().toISOString().slice(0, 10);

function ProfileSummaryCard() {
  const user = useAuthStore((state) => state.user);
  const { updateProfile, isLoading, isSuccess, error } = useUpdateProfile();

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth ?? '');
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber ?? '');

  if (!user) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await updateProfile({ fullName, dateOfBirth, mobileNumber });
  };

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Profile
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          {isSuccess && <Alert severity="success">Profile updated.</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required fullWidth />
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
            label="Mobile number"
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
            fullWidth
          />
          <Box>
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
              {isLoading ? 'Saving…' : 'Save changes'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Card>
  );
}

export default ProfileSummaryCard;
