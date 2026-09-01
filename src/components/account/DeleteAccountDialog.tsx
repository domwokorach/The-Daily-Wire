import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useDeleteAccount } from '@/features/account';
import { ROUTES } from '@/config/routes';

function DeleteAccountDialog() {
  const navigate = useNavigate();
  const { deleteAccount, isLoading, error } = useDeleteAccount();

  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const canSubmit = confirmation === 'DELETE' && currentPassword.length > 0;

  const handleClose = () => {
    setOpen(false);
    setConfirmation('');
    setCurrentPassword('');
  };

  const handleConfirm = async () => {
    try {
      await deleteAccount(currentPassword);
      navigate(ROUTES.HOME, { replace: true });
    } catch {
      // error already surfaced via `error` from useDeleteAccount
    }
  };

  return (
    <Card sx={{ p: 3, border: '1px solid', borderColor: 'breaking.main' }}>
      <Typography variant="h6" color="breaking.main" sx={{ mb: 1 }}>
        Danger zone
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Deleting your account will permanently remove your profile and account access. This action cannot be
        undone.
      </Typography>
      <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
        Delete account
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Delete account</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <Typography variant="body2" color="text.secondary">
              This cannot be undone. Type <strong>DELETE</strong> and confirm your password to continue.
            </Typography>
            <TextField
              label="Type DELETE to confirm"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              fullWidth
            />
            <TextField
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="error" disabled={!canSubmit || isLoading} onClick={handleConfirm}>
            {isLoading ? 'Deleting…' : 'Delete my account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default DeleteAccountDialog;
