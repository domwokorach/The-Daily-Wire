import { useState, type ReactNode } from 'react';
import { Box, Skeleton } from '@mui/material';
import { FALLBACK_IMAGE } from '@/constants/fallbackImage';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  lazy?: boolean;
  children?: ReactNode;
}

function ImageWithSkeleton({
  src,
  alt,
  aspectRatio = '16 / 9',
  lazy = true,
  children,
}: ImageWithSkeletonProps) {
  const [loadState, setLoadState] = useState({ src, loaded: false, failed: false });

  // Some publishers hotlink-block or CORP-restrict their images; when the
  // source article changes, give the new src a fresh chance to load.
  if (loadState.src !== src) {
    setLoadState({ src, loaded: false, failed: false });
  }

  const { loaded, failed } = loadState;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      {!loaded && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ position: 'absolute', inset: 0, height: '100%' }}
        />
      )}
      <Box
        component="img"
        src={failed ? FALLBACK_IMAGE : src}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={() => setLoadState((current) => ({ ...current, loaded: true }))}
        onError={() => setLoadState((current) => ({ ...current, loaded: true, failed: true }))}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 300ms ease, transform 400ms ease',
        }}
      />
      {children}
    </Box>
  );
}

export default ImageWithSkeleton;
