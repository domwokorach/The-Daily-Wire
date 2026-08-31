import { Box, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { Article } from '@/data/mockArticles';
import { timeAgo } from '@/utils/formatDate';
import { buildArticlePath } from '@/constants/routes';

interface TextStoryProps {
  article: Article;
}

function TextStory({ article }: TextStoryProps) {
  return (
    <Box
      component="article"
      sx={{
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-of-type': { borderBottom: 'none' },
        '&:hover .card-headline': {
          color: 'primary.main',
        },
      }}
    >
      {article.categoryLabel && (
        <Typography variant="overline" color="primary.main" sx={{ fontSize: '0.65rem' }}>
          {article.categoryLabel}
        </Typography>
      )}
      <Typography
        variant="subtitle1"
        component="h4"
        sx={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700,
          fontSize: '1rem',
          lineHeight: 1.3,
          mt: 0.25,
        }}
      >
        <Link
          component={RouterLink}
          to={buildArticlePath(article.id)}
          className="card-headline"
          underline="hover"
          sx={{ color: 'inherit', transition: 'color 160ms ease' }}
        >
          {article.headline}
        </Link>
      </Typography>
      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
        {timeAgo(article.timestamp)}
      </Typography>
    </Box>
  );
}

export default TextStory;
