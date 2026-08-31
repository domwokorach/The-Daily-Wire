import { useState, type ReactNode } from 'react';
import { Box, Skeleton } from '@mui/material';

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">' +
      '<rect width="1200" height="675" fill="#101F3A"/>' +
      '<g fill="none" stroke="#C9A86A" stroke-width="4" opacity="0.55">' +
      '<circle cx="600" cy="300" r="64"/>' +
      '<path d="M568 300h64M600 268v64"/>' +
      '</g>' +
      '<text x="600" y="410" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#B8C2D1">Image unavailable</text>' +
      '</svg>',
  );

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
