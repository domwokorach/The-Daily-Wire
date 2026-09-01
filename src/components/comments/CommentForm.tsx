import { useState, type FormEvent } from 'react';
import { Alert, Box, Button, Stack, TextField } from '@mui/material';
import { useCreateComment } from '@/features/comments';

interface CommentFormProps {
  articleId: string;
}

function CommentForm({ articleId }: CommentFormProps) {
  const { createComment, isLoading, error } = useCreateComment(articleId);
  const [body, setBody] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
    await createComment(trimmed);
    setBody('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <Stack spacing={1.5}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Add a comment…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          multiline
          minRows={3}
          fullWidth
        />
        <Box sx={{ textAlign: 'right' }}>
          <Button type="submit" variant="contained" color="primary" disabled={isLoading || !body.trim()}>
            {isLoading ? 'Posting…' : 'Post comment'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default CommentForm;
