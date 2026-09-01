import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import Container from '@/components/common/Container';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import SavedArticleCard from '@/components/saved/SavedArticleCard';
import { useSavedArticles } from '@/features/savedArticles';

function SavedArticlesPage() {
  const { savedArticles, loading, error } = useSavedArticles();

  return (
    <Container>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Saved Articles
      </Typography>

      {loading && <LoadingState variant="grid" count={6} />}
      {error && <ErrorState message={error} />}

      {!loading && !error && savedArticles.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          You haven&rsquo;t saved any articles yet. Look for the Save button on any story.
        </Typography>
      )}

      {!loading && !error && savedArticles.length > 0 && (
        <Grid container spacing={3}>
          {savedArticles.map((savedArticle) => (
            <Grid key={savedArticle.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <SavedArticleCard savedArticle={savedArticle} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default SavedArticlesPage;
