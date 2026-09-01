import { useState, type FormEvent } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';

interface CommentEditFormProps {
  initialBody: string;
  isLoading: boolean;
  onSave: (body: string) => void;
  onCancel: () => void;
}

function CommentEditForm({ initialBody, isLoading, onSave, onCancel }: CommentEditFormProps) {
  const [body, setBody] = useState(initialBody);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
    onSave(trimmed);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={1.5}>
        <TextField value={body} onChange={(e) => setBody(e.target.value)} multiline minRows={2} fullWidth autoFocus />
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <Button size="small" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="small" type="submit" variant="contained" color="primary" disabled={isLoading || !body.trim()}>
            {isLoading ? 'Saving…' : 'Save'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default CommentEditForm;
