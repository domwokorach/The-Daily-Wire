import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useUnsubscribe } from '@/features/subscription';

interface UnsubscribeDialogProps {
  open: boolean;
  onClose: () => void;
  token: string;
  onUnsubscribed?: () => void;
}

/** Confirms a full unsubscribe (every category, not just one) before it
 * happens — reached from the manage page's "Unsubscribe from everything"
 * action. Turning off individual categories doesn't need this confirmation;
 * it's just a preference save. */
function UnsubscribeDialog({ open, onClose, token, onUnsubscribed }: UnsubscribeDialogProps) {
  const { unsubscribe, isLoading, error } = useUnsubscribe();

  const handleConfirm = async () => {
    await unsubscribe({ token });
    onUnsubscribed?.();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Unsubscribe from everything?</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: error ? 2 : 0 }}>
          You&rsquo;ll stop receiving all email updates, including any topics you&rsquo;re currently subscribed to. You
          can resubscribe at any time.
        </DialogContentText>
        {error && <Alert severity="error">{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disabled={isLoading}>
          {isLoading ? 'Unsubscribing…' : 'Unsubscribe'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UnsubscribeDialog;
