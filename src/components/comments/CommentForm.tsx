import { useState, type FormEvent } from 'react';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useCreateComment } from '@/features/comments';
import type { CommentSort } from '@/features/comments';

const BODY_MAX_LENGTH = 2000;

interface CommentFormProps {
  articleId: string;
  sort?: CommentSort;
}

function CommentForm({ articleId, sort = 'newest' }: CommentFormProps) {
  const { createComment, isLoading, error } = useCreateComment(articleId, sort);
  const [body, setBody] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed || isLoading) return;
    setBody('');
    try {
      await createComment(trimmed);
    } catch {
      // surfaced via `error`; the optimistic entry is rolled back automatically
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <Stack spacing={1.5}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Join the discussion
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Add a comment…"
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, BODY_MAX_LENGTH))}
          multiline
          minRows={3}
          fullWidth
          disabled={isLoading}
          helperText={`${body.length}/${BODY_MAX_LENGTH}`}
          slotProps={{ formHelperText: { sx: { textAlign: 'right' } } }}
        />
        <Box sx={{ textAlign: 'right' }}>
          <Button type="submit" variant="contained" color="primary" disabled={isLoading || !body.trim()}>
            {isLoading ? 'Posting…' : 'Post Comment'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default CommentForm;
