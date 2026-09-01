import { useState, type ReactNode } from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';
import { FALLBACK_IMAGE } from '@/constants/fallbackImage';
import ResponsiveImageSkeleton from './ResponsiveImageSkeleton';

export type ImageVariant = 'hero' | 'card' | 'compact' | 'avatar' | 'badge';

interface VariantDefaults {
  aspectRatio: string;
  objectFit: 'cover' | 'contain';
  shape: 'rect' | 'circle';
  lazy: boolean;
}

const VARIANT_DEFAULTS: Record<ImageVariant, VariantDefaults> = {
  hero: { aspectRatio: '16 / 9', objectFit: 'cover', shape: 'rect', lazy: false },
  card: { aspectRatio: '16 / 9', objectFit: 'cover', shape: 'rect', lazy: true },
  compact: { aspectRatio: '1 / 1', objectFit: 'cover', shape: 'rect', lazy: true },
  avatar: { aspectRatio: '1 / 1', objectFit: 'cover', shape: 'circle', lazy: true },
  badge: { aspectRatio: '1 / 1', objectFit: 'contain', shape: 'rect', lazy: true },
};

export interface ResponsiveImageProps {
  src: string;
  alt: string;
  variant?: ImageVariant;

  /** Forward-compatible plumbing — no current provider (NewsAPI.org,
   * API-Football) returns multiple resolutions, so these are inert unless
   * a future image proxy/CDN populates them. */
  srcSet?: string;
  sizes?: string;

  aspectRatio?: string;
  objectFit?: 'cover' | 'contain';
  objectPosition?: string;

  lazy?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';

  /** Rendered instead of the editorial "Image unavailable" placeholder
   * when the image fails to load — for `badge`/`avatar` variants, where a
   * full photo placeholder makes no sense at a few dozen pixels. Ignored
   * for `hero`/`card`/`compact`, which always fall back to the editorial
   * placeholder. */
  emptyFallback?: ReactNode;

  children?: ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

const PHOTO_VARIANTS: ReadonlySet<ImageVariant> = new Set(['hero', 'card', 'compact']);

function ResponsiveImage({
  src,
  alt,
  variant = 'card',
  srcSet,
  sizes,
  aspectRatio,
  objectFit,
  objectPosition = 'center',
  lazy,
  fetchPriority = 'auto',
  emptyFallback = null,
  children,
  className,
  sx,
}: ResponsiveImageProps) {
  const defaults = VARIANT_DEFAULTS[variant];
  const [loadState, setLoadState] = useState({ src, loaded: false, failed: false });

  // Some publishers hotlink-block or CORP-restrict their images; when the
  // source changes, give the new src a fresh chance to load.
  if (loadState.src !== src) {
    setLoadState({ src, loaded: false, failed: false });
  }

  const { loaded, failed } = loadState;
  const usesEditorialFallback = PHOTO_VARIANTS.has(variant);
  const showEmptyFallback = failed && !usesEditorialFallback;

  return (
    <Box
      className={className}
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: aspectRatio ?? defaults.aspectRatio,
        overflow: 'hidden',
        bgcolor: usesEditorialFallback ? 'background.paper' : 'transparent',
        borderRadius: defaults.shape === 'circle' ? '50%' : undefined,
        ...sx,
      }}
    >
      {!loaded && <ResponsiveImageSkeleton shape={defaults.shape} />}
      {showEmptyFallback
        ? emptyFallback
        : (
          <Box
            component="img"
            src={failed ? FALLBACK_IMAGE : src}
            srcSet={failed ? undefined : srcSet}
            sizes={sizes}
            alt={alt}
            loading={(lazy ?? defaults.lazy) ? 'lazy' : 'eager'}
            decoding="async"
            fetchPriority={fetchPriority}
            onLoad={() => setLoadState((current) => ({ ...current, loaded: true }))}
            onError={() => setLoadState((current) => ({ ...current, loaded: true, failed: true }))}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: objectFit ?? defaults.objectFit,
              objectPosition,
              opacity: loaded ? 1 : 0,
              transition: 'opacity 300ms ease, transform 400ms ease',
            }}
          />
        )}
      {children}
    </Box>
  );
}

export default ResponsiveImage;
