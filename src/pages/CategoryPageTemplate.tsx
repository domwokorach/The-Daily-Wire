import Grid from '@mui/material/Grid';
import { Box, Stack, Typography } from '@mui/material';
import Container from '@/components/common/Container';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import LeadStory from '@/components/news/LeadStory';
import TextStory from '@/components/news/TextStory';
import NewsGrid from '@/components/news/NewsGrid';
import type { Article } from '@/data/mockArticles';

interface CategoryFeed {
  articles: Article[];
  loading: boolean;
  error: string | null;
}

interface CategoryPageTemplateProps {
  label: string;
  description?: string;
  feed: CategoryFeed;
}

function CategoryPageTemplate({ label, description, feed }: CategoryPageTemplateProps) {
  const { articles, loading, error } = feed;
  const [lead, ...rest] = articles;
  const sideStories = rest.slice(0, 3);
  const gridStories = rest.slice(3);

  return (
    <Container>
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>
          {label}
        </Typography>
        {description && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, maxWidth: '60ch' }}>
            {description}
          </Typography>
        )}
      </Box>

      {error && <ErrorState message={error} />}

      {!error && loading && <LoadingState variant="lead" />}

      {!error && !loading && articles.length === 0 && <EmptyState />}

      {!error && !loading && lead && (
        <Grid container spacing={{ xs: 3, md: 5 }} sx={{ mb: { xs: 5, md: 7 } }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <LeadStory article={lead} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack>
              {sideStories.map((article) => (
                <TextStory key={article.id} article={article} />
              ))}
            </Stack>
          </Grid>
        </Grid>
      )}

      {!error && !loading && gridStories.length > 0 && (
        <NewsGrid articles={gridStories} columns={{ xs: 12, sm: 6, md: 6, lg: 4 }} />
      )}
    </Container>
  );
}

export default CategoryPageTemplate;
