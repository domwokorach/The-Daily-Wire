import { Stack, Typography } from '@mui/material';
import Container from '@/components/common/Container';
import ChangeEmailForm from '@/components/account/ChangeEmailForm';
import ChangePasswordForm from '@/components/account/ChangePasswordForm';
import NotificationPreferencesForm from '@/components/account/NotificationPreferencesForm';
import DeleteAccountDialog from '@/components/account/DeleteAccountDialog';

function SettingsPage() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Settings
      </Typography>
      <Stack spacing={3}>
        <ChangeEmailForm />
        <ChangePasswordForm />
        <NotificationPreferencesForm />
        <DeleteAccountDialog />
      </Stack>
    </Container>
  );
}

export default SettingsPage;
