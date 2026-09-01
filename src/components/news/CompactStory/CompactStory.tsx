import { Box, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { Article } from '@/data/mockArticles';
import { timeAgo } from '@/utils/formatDate';
import { buildArticlePath } from '@/config/routes';
import StatusChip from '@/components/common/StatusChip';
import ImageWithSkeleton from '@/components/common/ImageWithSkeleton';

interface CompactStoryProps {
  article: Article;
}

function CompactStory({ article }: CompactStoryProps) {
  return (
    <Stack
      component="article"
      direction="row"
      spacing={1.5}
      sx={{
        py: 1.25,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-of-type': { borderBottom: 'none' },
        '&:hover .card-headline': {
          color: 'primary.main',
        },
      }}
    >
      <Box sx={{ flexShrink: 0, width: { xs: 84, sm: 96 } }}>
        <ImageWithSkeleton src={article.image} alt={article.headline} aspectRatio="1 / 1">
          {(article.breaking || article.live) && (
            <StatusChip
              status={article.live ? 'live' : 'breaking'}
              label={article.live ? 'LIVE' : 'BREAKING'}
              size="small"
              sx={{
                position: 'absolute',
                top: 4,
                left: 4,
                height: 16,
                fontSize: '0.55rem',
                '& .MuiChip-label': { px: 0.5 },
              }}
            />
          )}
        </ImageWithSkeleton>
      </Box>
      <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {article.categoryLabel && (
          <Typography variant="overline" color="primary.main" sx={{ fontSize: '0.65rem' }}>
            {article.categoryLabel}
          </Typography>
        )}
        <Typography
          variant="subtitle2"
          component="h4"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            fontSize: { xs: '0.9rem', sm: '0.95rem' },
            lineHeight: 1.25,
          }}
        >
          <Link
            component={RouterLink}
            to={buildArticlePath(article.id)}
            className="card-headline"
            underline="hover"
            sx={{
              color: 'inherit',
              transition: 'color 160ms ease',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {article.headline}
          </Link>
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
          {timeAgo(article.timestamp)}
        </Typography>
      </Box>
    </Stack>
  );
}

export default CompactStory;
