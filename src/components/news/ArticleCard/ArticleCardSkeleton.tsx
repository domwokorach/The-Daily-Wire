import { Card, CardContent, Skeleton } from '@mui/material';

function ArticleCardSkeleton() {
  return (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '16 / 9' }} />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Skeleton variant="text" width="35%" />
        <Skeleton variant="text" width="90%" height={32} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="60%" />
      </CardContent>
    </Card>
  );
}

export default ArticleCardSkeleton;
