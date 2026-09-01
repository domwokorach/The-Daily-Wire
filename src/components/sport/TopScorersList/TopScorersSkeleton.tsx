import { Skeleton, Stack } from '@mui/material';

function TopScorersSkeleton({ count = 5 }: { count?: number }) {
  return (
    <Stack spacing={1.5}>
      {Array.from({ length: count }).map((_, index) => (
        <Stack key={index} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width="60%" height={22} sx={{ flexGrow: 1 }} />
          <Skeleton variant="text" width={24} height={22} />
        </Stack>
      ))}
    </Stack>
  );
}

export default TopScorersSkeleton;
