import { useState } from 'react';
import { Button, IconButton, Snackbar, Tooltip } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { useAuthStore } from '@/store';
import { useIsArticleSaved, useSaveArticle, useRemoveSavedArticle, toSaveArticlePayload } from '@/features/savedArticles';
import type { Article } from '@/data/mockArticles';
import LoginToSaveDialog from '@/components/saved/LoginToSaveDialog';

interface SaveArticleButtonProps {
  article: Article;
  variant?: 'icon' | 'button';
}

/** The one Save control reused everywhere an article can be saved — an
 * icon-only variant for compact placements, a labeled variant for the
 * headline/metadata row. Both share the same auth gate, mutation, and gold
 * "saved" treatment. */
function SaveArticleButton({ article, variant = 'button' }: SaveArticleButtonProps) {
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');
  const { isSaved } = useIsArticleSaved(article.id);
  const { save, isLoading: isSaving, error: saveError } = useSaveArticle();
  const { remove, isLoading: isRemoving, error: removeError } = useRemoveSavedArticle();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [errorDismissed, setErrorDismissed] = useState(false);

  const isLoading = isSaving || isRemoving;
  const error = !errorDismissed ? saveError || removeError : null;

  const handleClick = async () => {
    if (!isAuthenticated) {
      setDialogOpen(true);
      return;
    }

    try {
      setErrorDismissed(false);
      if (isSaved) {
        await remove(article.id);
      } else {
        await save(toSaveArticlePayload(article));
        setSnackbarMessage('Article saved');
      }
    } catch {
      // surfaced via `error` below
    }
  };

  const label = isSaved ? 'Remove article from saved articles' : 'Save article';
  const icon = isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />;

  return (
    <>
      {variant === 'icon' ? (
        <Tooltip title={label}>
          <span>
            <IconButton
              aria-label={label}
              onClick={handleClick}
              disabled={isLoading}
              sx={{ color: isSaved ? '#C9A86A' : 'text.secondary' }}
            >
              {icon}
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <Button
          aria-label={label}
          onClick={handleClick}
          disabled={isLoading}
          startIcon={icon}
          variant={isSaved ? 'contained' : 'outlined'}
          sx={
            isSaved
              ? { bgcolor: '#C9A86A', color: '#071426', '&:hover': { bgcolor: '#D7C29E' } }
              : { color: 'text.secondary', borderColor: 'divider' }
          }
        >
          {isSaved ? 'Saved' : 'Save'}
        </Button>
      )}

      <LoginToSaveDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        returnTo={`/article/${article.id}`}
      />

      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage(null)}
        message={snackbarMessage}
      />
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={4000}
        onClose={() => setErrorDismissed(true)}
        message={error}
      />
    </>
  );
}

export default SaveArticleButton;
