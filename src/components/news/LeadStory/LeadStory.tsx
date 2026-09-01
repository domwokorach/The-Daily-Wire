import { Box, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { Article } from '@/data/mockArticles';
import { timeAgo, joinMeta } from '@/utils/formatDate';
import { buildArticlePath } from '@/config/routes';
import StatusChip from '@/components/common/StatusChip';
import ResponsiveImage from '@/components/common/ResponsiveImage';

interface LeadStoryProps {
  article: Article;
}

function LeadStory({ article }: LeadStoryProps) {
  return (
    <Box component="article">
      <Box sx={{ mb: 2 }}>
        <ResponsiveImage
          variant="hero"
          src={article.image}
          alt={article.headline}
          lazy={false}
          fetchPriority="high"
        >
          {(article.breaking || article.live) && (
            <StatusChip
              status={article.live ? 'live' : 'breaking'}
              label={article.live ? 'LIVE' : 'BREAKING'}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
              }}
            />
          )}
        </ResponsiveImage>
      </Box>
      {article.categoryLabel && (
        <Typography variant="overline" color="primary.main">
          {article.categoryLabel}
        </Typography>
      )}
      <Typography
        variant="h1"
        component="h2"
        sx={{
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem', lg: '3.25rem' },
          mt: 0.5,
          mb: 1.5,
        }}
      >
        <Link
          component={RouterLink}
          to={buildArticlePath(article.id)}
          underline="hover"
          sx={{ color: 'inherit', '&:hover': { color: 'primary.main' } }}
        >
          {article.headline}
        </Link>
      </Typography>
      {article.summary && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: { xs: '1rem', md: '1.15rem' }, mb: 2, maxWidth: '65ch' }}
        >
          {article.summary}
        </Typography>
      )}
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography variant="body2" color="text.disabled">
          {joinMeta(article.author ? `By ${article.author}` : undefined, timeAgo(article.timestamp))}
        </Typography>
      </Stack>
    </Box>
  );
}

export default LeadStory;
