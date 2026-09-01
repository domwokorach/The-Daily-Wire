import { useState } from 'react';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useAuthStore } from '@/store';
import { useUpdateComment } from '@/features/comments';
import type { Comment } from '@/features/comments';
import { timeAgo, joinMeta } from '@/utils/formatDate';
import CommentEditForm from './CommentEditForm';
import CommentActions from './CommentActions';

interface CommentItemProps {
  comment: Comment;
  articleId: string;
  onDelete: (commentId: string) => void;
  isDeleting: boolean;
}

function CommentItem({ comment, articleId, onDelete, isDeleting }: CommentItemProps) {
  const userId = useAuthStore((state) => state.user?.id);
  const { updateComment, isLoading: isSaving } = useUpdateComment(articleId);

  const [isEditing, setIsEditing] = useState(false);

  const isOwner = Boolean(userId && comment.author.id === userId);

  const handleSave = async (body: string) => {
    await updateComment({ commentId: comment.id, body });
    setIsEditing(false);
  };

  return (
    <Stack direction="row" spacing={1.5} sx={{ py: 2, opacity: comment.pending ? 0.6 : 1 }}>
      <Avatar sx={{ width: 32, height: 32, fontSize: '0.85rem', bgcolor: 'surfaceAlt.main' }}>
        {comment.author.displayName[0]?.toUpperCase() ?? '?'}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle2">{comment.author.displayName}</Typography>
          {isOwner && !isEditing && !comment.pending && (
            <CommentActions onEdit={() => setIsEditing(true)} onDelete={() => onDelete(comment.id)} isDeleting={isDeleting} />
          )}
        </Stack>
        <Typography variant="caption" color="text.disabled">
          {comment.pending
            ? 'Posting…'
            : joinMeta(timeAgo(comment.createdAt), comment.edited && 'Edited')}
        </Typography>
        {isEditing ? (
          <Box sx={{ mt: 1 }}>
            <CommentEditForm
              initialBody={comment.body}
              isLoading={isSaving}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          </Box>
        ) : (
          <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
            {comment.body}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

export default CommentItem;
