import { Card, CardContent, IconButton, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import type { Article } from '@/data/mockArticles';
import { timeAgo, joinMeta } from '@/utils/formatDate';
import { buildArticlePath } from '@/constants/routes';
import { useAppContext } from '@/context/useAppContext';
import StatusChip from '@/components/common/StatusChip';
import ImageWithSkeleton from '@/components/common/ImageWithSkeleton';

interface ArticleCardProps {
  article: Article;
  lazy?: boolean;
}

function ArticleCard({ article, lazy = true }: ArticleCardProps) {
  const { isSaved, toggleSaved } = useAppContext();
  const saved = isSaved(article.id);

  return (
    <Card
      component="article"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        '&:hover': {
          borderColor: 'rgba(201,168,106,0.4)',
        },
        '&:hover img': {
          transform: 'scale(1.035)',
        },
        '&:hover .card-headline': {
          color: 'primary.main',
        },
      }}
    >
      <ImageWithSkeleton src={article.image} alt={article.headline} lazy={lazy}>
        {(article.breaking || article.live) && (
          <StatusChip
            status={article.live ? 'live' : 'breaking'}
            label={article.live ? 'LIVE' : 'BREAKING'}
            size="small"
            sx={{ position: 'absolute', top: 8, left: 8 }}
          />
        )}
        <IconButton
          aria-label={saved ? 'Remove from saved articles' : 'Save article'}
          onClick={() => toggleSaved(article.id)}
          size="small"
          sx={{
            position: 'absolute',
            top: 6,
            right: 6,
            bgcolor: 'rgba(7,20,38,0.6)',
            '&:hover': { bgcolor: 'rgba(7,20,38,0.8)' },
          }}
        >
          {saved ? (
            <BookmarkIcon fontSize="small" sx={{ color: 'primary.main' }} />
          ) : (
            <BookmarkBorderIcon fontSize="small" sx={{ color: 'text.primary' }} />
          )}
        </IconButton>
      </ImageWithSkeleton>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
        {article.categoryLabel && (
          <Typography variant="overline" color="primary.main" sx={{ fontSize: '0.7rem' }}>
            {article.categoryLabel}
          </Typography>
        )}
        <Typography
          variant="h6"
          component="h3"
          sx={{ fontSize: { xs: '1.05rem', md: '1.15rem' }, lineHeight: 1.25 }}
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
        {article.summary && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: { xs: 'none', sm: '-webkit-box' },
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {article.summary}
          </Typography>
        )}
        <Stack direction="row" spacing={1} sx={{ mt: 'auto', pt: 1, alignItems: 'center' }}>
          <Typography variant="caption" color="text.disabled">
            {joinMeta(article.author, timeAgo(article.timestamp))}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ArticleCard;
