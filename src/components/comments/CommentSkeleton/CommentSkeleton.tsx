import { Box, Skeleton, Stack } from '@mui/material';

function CommentSkeleton() {
  return (
    <Stack direction="row" spacing={1.5} sx={{ py: 2 }}>
      <Skeleton variant="circular" width={32} height={32} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="text" width="20%" height={16} />
        <Skeleton variant="text" width="90%" />
      </Box>
    </Stack>
  );
}

export default CommentSkeleton;
