import { Box, Button, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

function ErrorState({
  message = 'Something went wrong while loading this content.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <ErrorOutlineIcon sx={{ fontSize: 40, color: 'breaking.main', mb: 1 }} />
      <Typography variant="body1" color="text.secondary" sx={{ mb: onRetry ? 2 : 0 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="outlined" size="small" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Box>
  );
}

export default ErrorState;
