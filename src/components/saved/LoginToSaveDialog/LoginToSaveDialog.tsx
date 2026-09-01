import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ROUTES } from '@/config/routes';

interface LoginToSaveDialogProps {
  open: boolean;
  onClose: () => void;
  returnTo: string;
}

/** Opened when a logged-out visitor clicks Save — never saves locally, and
 * never silently drops the intent either: both actions carry `returnTo` +
 * `action=save` so the pending save can be completed automatically once
 * they're signed in (see `LoginForm`/`RegisterForm`). */
function LoginToSaveDialog({ open, onClose, returnTo }: LoginToSaveDialogProps) {
  const navigate = useNavigate();

  const continueTo = (path: string) => {
    onClose();
    navigate(`${path}?returnTo=${encodeURIComponent(returnTo)}&action=save`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth aria-labelledby="login-to-save-title">
      <DialogTitle id="login-to-save-title">Sign in to save articles</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Save stories to your personal reading list and return to them later.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', px: 3, pb: 3, gap: 1 }}>
        <Button variant="contained" color="primary" fullWidth onClick={() => continueTo(ROUTES.LOGIN)}>
          Sign In
        </Button>
        <Button variant="outlined" fullWidth onClick={() => continueTo(ROUTES.REGISTER)}>
          Create Account
        </Button>
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoginToSaveDialog;
