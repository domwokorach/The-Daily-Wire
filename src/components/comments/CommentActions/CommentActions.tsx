import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface CommentActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

/** The owner-only "⋯" menu — edit jumps straight into the inline edit form,
 * delete requires an explicit confirmation dialog first (never an
 * immediate, accidental delete from one menu click). */
function CommentActions({ onEdit, onDelete, isDeleting }: CommentActionsProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <IconButton size="small" aria-label="Comment actions" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem
          aria-label="Edit comment"
          onClick={() => {
            setAnchorEl(null);
            onEdit();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          aria-label="Delete comment"
          onClick={() => {
            setAnchorEl(null);
            setConfirmOpen(true);
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete this comment?</DialogTitle>
        <DialogContent>
          <DialogContentText>This can&rsquo;t be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={isDeleting}
            onClick={() => {
              setConfirmOpen(false);
              onDelete();
            }}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CommentActions;
