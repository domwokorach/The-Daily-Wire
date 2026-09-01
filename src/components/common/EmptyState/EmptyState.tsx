import { Box, Typography } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

interface EmptyStateProps {
  message?: string;
}

/** A successful response with no articles — distinct from `ErrorState`
 * (the request failed) and `LoadingState` (still in flight). */
function EmptyState({ message = 'No articles found.' }: EmptyStateProps) {
  return (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <InboxOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

export default EmptyState;
