import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, IconButton, Link, Tooltip, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import ResponsiveImage from '@/components/common/ResponsiveImage';
import { useRemoveSavedArticle } from '@/features/savedArticles';
import type { SavedArticle } from '@/features/savedArticles';
import { buildArticlePath } from '@/config/routes';
import { timeAgo, joinMeta } from '@/utils/formatDate';

interface SavedArticleCardProps {
  savedArticle: SavedArticle;
}

function SavedArticleCard({ savedArticle }: SavedArticleCardProps) {
  const { remove, isLoading } = useRemoveSavedArticle();

  return (
    <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
      <Link component={RouterLink} to={buildArticlePath(savedArticle.articleId)} underline="none">
        <ResponsiveImage variant="card" src={savedArticle.image ?? ''} alt={savedArticle.title} />
      </Link>
      <Box sx={{ p: 2 }}>
        {savedArticle.category && (
          <Typography variant="overline" color="primary.main">
            {savedArticle.category}
          </Typography>
        )}
        <Link
          component={RouterLink}
          to={buildArticlePath(savedArticle.articleId)}
          underline="hover"
          sx={{ color: 'inherit' }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 0.5, mb: 1 }}>
            {savedArticle.title}
          </Typography>
        </Link>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.disabled">
            {joinMeta(savedArticle.sourceName ?? undefined, `Saved ${timeAgo(savedArticle.savedAt)}`)}
          </Typography>
          <Tooltip title="Remove from saved articles">
            <span>
              <IconButton
                aria-label="Remove article from saved articles"
                size="small"
                disabled={isLoading}
                onClick={() => remove(savedArticle.articleId)}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
}

export default SavedArticleCard;
