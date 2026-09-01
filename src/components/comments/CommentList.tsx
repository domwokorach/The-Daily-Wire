import { Box, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { useAuthStore } from '@/store';
import { useComments, useDeleteComment } from '@/features/comments';
import ErrorState from '@/components/common/ErrorState';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

interface CommentListProps {
  articleId: string;
}

function CommentSkeleton() {
  return (
    <Stack direction="row" spacing={1.5} sx={{ py: 2 }}>
      <Skeleton variant="circular" width={32} height={32} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="text" width="20%" height={16} />
        <Skeleton variant="text" width="90%" />
      </Box>
    </Stack>
  );
}

function CommentList({ articleId }: CommentListProps) {
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');
  const { comments, loading, error } = useComments(articleId);
  const { deleteComment, isLoading: isDeleting } = useDeleteComment(articleId);

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Comments
      </Typography>

      {isAuthenticated ? (
        <CommentForm articleId={articleId} />
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to join the discussion.
        </Typography>
      )}

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
      )}
    </Box>
  );
}

export default CommentList;
