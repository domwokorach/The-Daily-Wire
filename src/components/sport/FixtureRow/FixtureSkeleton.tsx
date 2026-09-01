import { Card, Skeleton, Stack } from '@mui/material';

function FixtureRowSkeleton() {
  return (
    <Card sx={{ px: 2, py: 1.5 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Skeleton variant="text" width="35%" height={22} />
        <Skeleton variant="rectangular" width={48} height={22} sx={{ borderRadius: 1 }} />
        <Skeleton variant="text" width="35%" height={22} />
      </Stack>
    </Card>
  );
}

function FixtureSkeleton({ count = 4 }: { count?: number }) {
  return (
    <Stack spacing={1.5}>
      {Array.from({ length: count }).map((_, index) => (
        <FixtureRowSkeleton key={index} />
      ))}
    </Stack>
  );
}

export default FixtureSkeleton;
