import { Skeleton } from '@mui/material';

interface ResponsiveImageSkeletonProps {
  shape?: 'rect' | 'circle';
}

function ResponsiveImageSkeleton({ shape = 'rect' }: ResponsiveImageSkeletonProps) {
  return (
    <Skeleton
      variant={shape === 'circle' ? 'circular' : 'rectangular'}
      animation="wave"
      sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}

export default ResponsiveImageSkeleton;
