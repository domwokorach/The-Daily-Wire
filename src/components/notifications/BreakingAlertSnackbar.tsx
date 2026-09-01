import { useNavigate } from 'react-router-dom';
import { Alert, Button, Snackbar } from '@mui/material';
import type { BreakingAlert } from '@/features/notifications';

interface BreakingAlertSnackbarProps {
  alert: BreakingAlert | null;
  onDismiss: () => void;
}

function BreakingAlertSnackbar({ alert, onDismiss }: BreakingAlertSnackbarProps) {
  const navigate = useNavigate();

  const handleRead = () => {
    if (alert) navigate(alert.url);
    onDismiss();
  };

  return (
    <Snackbar
      open={Boolean(alert)}
      autoHideDuration={12000}
      onClose={onDismiss}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        severity="error"
        variant="filled"
        onClose={onDismiss}
        sx={{ bgcolor: 'breaking.main', color: 'breaking.contrastText', alignItems: 'center', maxWidth: 380 }}
        action={
          <Button size="small" color="inherit" onClick={handleRead} sx={{ fontWeight: 700 }}>
            Read story
          </Button>
        }
      >
        <strong>BREAKING</strong> {alert?.headline}
      </Alert>
    </Snackbar>
  );
}

export default BreakingAlertSnackbar;
