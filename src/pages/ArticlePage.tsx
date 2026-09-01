import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Container from '@/components/common/Container';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import ImageWithSkeleton from '@/components/common/ImageWithSkeleton';
import type { Article } from '@/data/mockArticles';
import { getArticleBySlug } from '@/features/news/services/newsService';
import { formatFullDate, joinMeta } from '@/utils/formatDate';
import { ROUTES } from '@/config/routes';

interface ArticleLookupState {
  slug: string | undefined;
  article: Article | null | undefined;
}

function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [state, setState] = useState<ArticleLookupState>({ slug, article: undefined });

  if (state.slug !== slug) {
    setState({ slug, article: slug ? undefined : null });
  }

  useEffect(() => {
    let active = true;

    if (!slug) return;

    getArticleBySlug(slug).then((result) => {
      if (active) setState((current) => ({ ...current, article: result ?? null }));
    });

    return () => {
      active = false;
    };
  }, [slug]);

  const article = state.article;

  if (article === undefined) {
    return (
      <Container maxWidth="md">
        <LoadingState variant="lead" />
      </Container>
    );
  }

  if (article === null) {
    return (
      <Container maxWidth="md">
        <ErrorState message="We couldn't find that article. It may have expired — try browsing from the homepage instead." />
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button component={RouterLink} to={ROUTES.HOME} startIcon={<ArrowBackIcon />}>
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Button
        component={RouterLink}
        to={ROUTES.HOME}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Back to Home
      </Button>
      {article.categoryLabel && (
        <Typography variant="overline" color="primary.main">
          {article.categoryLabel}
        </Typography>
      )}
      <Typography
        variant="h1"
        component="h1"
        sx={{ fontSize: { xs: '1.75rem', md: '2.75rem', lg: '3.25rem' }, mt: 0.5, mb: 2 }}
      >
        {article.headline}
      </Typography>
      <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
        {joinMeta(article.author ? `By ${article.author}` : undefined, formatFullDate(article.timestamp))}
      </Typography>
      <Box sx={{ mb: 3 }}>
        <ImageWithSkeleton src={article.image} alt={article.headline} lazy={false} />
      </Box>
      <Stack spacing={2.5}>
        {article.summary && (
          <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'text.primary' }}>
            {article.summary}
          </Typography>
        )}
        {article.url && (
          <Box>
            <Button
              component="a"
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              endIcon={<OpenInNewIcon fontSize="small" />}
            >
              Read full story{article.sourceName ? ` on ${article.sourceName}` : ''}
            </Button>
          </Box>
        )}
      </Stack>
    </Container>
  );
}

export default ArticlePage;
