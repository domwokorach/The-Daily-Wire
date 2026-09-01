import { Skeleton, Stack } from '@mui/material';

function StandingsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <Stack spacing={1}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} variant="rectangular" height={36} sx={{ borderRadius: 1 }} />
      ))}
    </Stack>
  );
}

export default StandingsSkeleton;
