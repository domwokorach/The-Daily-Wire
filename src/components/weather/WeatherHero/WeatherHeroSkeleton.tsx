import { Card, CardContent, Skeleton, Stack } from '@mui/material';

function WeatherHeroSkeleton() {
  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 }} sx={{ alignItems: 'center' }}>
          <Skeleton variant="circular" width={80} height={80} />
          <Stack spacing={1} sx={{ flexGrow: 1, width: '100%' }}>
            <Skeleton variant="text" width="20%" height={20} />
            <Skeleton variant="text" width="35%" height={72} />
            <Skeleton variant="text" width="30%" height={24} />
            <Skeleton variant="text" width="25%" height={20} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default WeatherHeroSkeleton;
