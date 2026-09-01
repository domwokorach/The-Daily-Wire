import { Card, Skeleton, Stack } from '@mui/material';

function ScoreRowSkeleton() {
  return (
    <Card sx={{ px: 2, py: 1.5 }}>
      <Skeleton variant="text" width="40%" height={18} sx={{ mb: 1 }} />
      <Stack spacing={0.75}>
        <Skeleton variant="text" width="80%" height={26} />
        <Skeleton variant="text" width="70%" height={26} />
      </Stack>
      <Skeleton variant="text" width="20%" height={16} sx={{ ml: 'auto', mt: 1 }} />
    </Card>
  );
}

function LiveMatchSkeleton({ count = 2 }: { count?: number }) {
  return (
    <Stack spacing={1.5}>
      {Array.from({ length: count }).map((_, index) => (
        <ScoreRowSkeleton key={index} />
      ))}
    </Stack>
  );
}

export default LiveMatchSkeleton;
