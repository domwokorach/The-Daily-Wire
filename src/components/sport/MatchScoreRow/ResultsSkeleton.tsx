import { Card, Skeleton, Stack } from '@mui/material';

function ResultRowSkeleton() {
  return (
    <Card sx={{ px: 2, py: 1.5 }}>
      <Skeleton variant="text" width="40%" height={18} sx={{ mb: 1 }} />
      <Stack spacing={0.75}>
        <Skeleton variant="text" width="80%" height={22} />
        <Skeleton variant="text" width="70%" height={22} />
      </Stack>
      <Skeleton variant="text" width="20%" height={16} sx={{ ml: 'auto', mt: 1 }} />
    </Card>
  );
}

function ResultsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <Stack spacing={1.5}>
      {Array.from({ length: count }).map((_, index) => (
        <ResultRowSkeleton key={index} />
      ))}
    </Stack>
  );
}

export default ResultsSkeleton;
