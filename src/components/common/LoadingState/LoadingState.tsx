import { Box, Skeleton, Stack } from '@mui/material';

interface LoadingStateProps {
  variant?: 'grid' | 'lead' | 'inline';
  count?: number;
}

function LoadingState({ variant = 'grid', count = 4 }: LoadingStateProps) {
  if (variant === 'lead') {
    return (
      <Box>
        <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '16 / 9', mb: 2 }} />
        <Skeleton variant="text" width="30%" height={20} />
        <Skeleton variant="text" width="80%" height={48} />
        <Skeleton variant="text" width="60%" height={24} />
      </Box>
    );
  }

  if (variant === 'inline') {
    return (
      <Stack spacing={1.5}>
        {Array.from({ length: count }).map((_, index) => (
          <Skeleton key={index} variant="text" height={28} />
        ))}
      </Stack>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index} sx={{ flex: '1 1 220px' }}>
          <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '16 / 9' }} />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="90%" height={32} />
        </Box>
      ))}
    </Box>
  );
}

export default LoadingState;
