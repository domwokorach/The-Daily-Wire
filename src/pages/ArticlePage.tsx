import { useEffect, useState } from 'react';
import { useParams, useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Button, IconButton, Snackbar, Stack, Tooltip, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import Container from '@/components/common/Container';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import ResponsiveImage from '@/components/common/ResponsiveImage';
import CommentList from '@/components/comments/CommentList';
import SubscribeForm from '@/components/subscription/SubscribeForm';
import SaveArticleButton from '@/components/saved/SaveArticleButton';
import type { Article } from '@/data/mockArticles';
import { getArticleBySlug } from '@/features/news/services/newsService';
import { formatFullDate, joinMeta } from '@/utils/formatDate';
import { ROUTES } from '@/config/routes';

interface ArticlePageLocationState {
  savedAfterLogin?: boolean;
}

function ShareButton({ article }: { article: Article }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: article.headline, url: shareUrl });
      } catch {
        // user cancelled the native share sheet — not an error
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      // clipboard unavailable — silently no-op rather than showing a raw error
    }
  };

  return (
    <>
      <Tooltip title="Share">
        <IconButton aria-label="Share article" onClick={handleShare} sx={{ color: 'text.secondary' }}>
          <ShareOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Snackbar open={copied} autoHideDuration={2500} onClose={() => setCopied(false)} message="Link copied" />
    </>
  );
}

interface ArticleLookupState {
  slug: string | undefined;
  article: Article | null | undefined;
}

function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [state, setState] = useState<ArticleLookupState>({ slug, article: undefined });
  const [showSavedSnackbar, setShowSavedSnackbar] = useState(
    Boolean((location.state as ArticlePageLocationState | null)?.savedAfterLogin),
  );

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
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 3 }}
      >
        <Typography variant="body2" color="text.disabled">
          {joinMeta(article.author ? `By ${article.author}` : undefined, formatFullDate(article.timestamp))}
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <SaveArticleButton article={article} variant="icon" />
          <ShareButton article={article} />
        </Stack>
      </Stack>
      <Box sx={{ mb: 3 }}>
        <ResponsiveImage
          variant="hero"
          src={article.image}
          alt={article.headline}
          lazy={false}
          fetchPriority="high"
        />
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
      <Box
        sx={{
          mt: 5,
          mb: 4,
          p: { xs: 2.5, md: 3.5 },
          bgcolor: 'surfaceAlt.main',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          Enjoyed this story?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Get the day&rsquo;s top stories delivered to your inbox.
        </Typography>
        <SubscribeForm variant="compact" />
      </Box>
      <CommentList articleId={article.id} />
      <Snackbar
        open={showSavedSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSavedSnackbar(false)}
        message="Article saved"
      />
    </Container>
  );
}

export default ArticlePage;
