import { useState } from 'react';
import { Box, Button, Divider, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useAuthStore } from '@/store';
import { useComments, useDeleteComment, useCommentRealtime } from '@/features/comments';
import type { CommentSort } from '@/features/comments';
import ErrorState from '@/components/common/ErrorState';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import CommentSkeleton from './CommentSkeleton';
import LoginToComment from './LoginToComment';

interface CommentListProps {
  articleId: string;
}

function CommentList({ articleId }: CommentListProps) {
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');
  const [sort, setSort] = useState<CommentSort>('newest');
  const { comments, totalCount, loading, error, hasMore, loadMore, isLoadingMore } = useComments(articleId, sort);
  const { deleteComment, isLoading: isDeleting } = useDeleteComment(articleId);

  // Public reads stay live even while logged out — only posting/editing/
  // deleting require auth, enforced server-side regardless of who is
  // subscribed to this article's realtime channel.
  useCommentRealtime(articleId);

  return (
    <Box sx={{ mt: 5 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h5">Discussion {!loading && `(${totalCount})`}</Typography>
        {!loading && comments.length > 1 && (
          <ToggleButtonGroup
            value={sort}
            exclusive
            size="small"
            onChange={(_e, value: CommentSort | null) => value && setSort(value)}
            aria-label="Comment sort order"
          >
            <ToggleButton value="newest" aria-label="Newest first">
              Newest
            </ToggleButton>
            <ToggleButton value="oldest" aria-label="Oldest first">
              Oldest
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Stack>

      {isAuthenticated ? <CommentForm articleId={articleId} sort={sort} /> : <LoginToComment />}

      {loading && (
        <Stack divider={<Divider />}>
          <CommentSkeleton />
          <CommentSkeleton />
        </Stack>
      )}

      {error && <ErrorState message={error} />}

      {!loading && !error && comments.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
          No comments yet. Be the first to join the discussion.
        </Typography>
      )}

      {!loading && !error && comments.length > 0 && (
        <>
          <Stack divider={<Divider />}>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                articleId={articleId}
                onDelete={deleteComment}
                isDeleting={isDeleting}
              />
            ))}
          </Stack>
          {hasMore && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button onClick={loadMore} disabled={isLoadingMore} variant="outlined">
                {isLoadingMore ? 'Loading…' : 'Load more comments'}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default CommentList;
