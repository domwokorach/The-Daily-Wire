import { useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Divider, IconButton, Menu, MenuItem } from '@mui/material';
import { useAuthStore } from '@/store';
import { useLogout } from '@/features/auth';
import { ROUTES } from '@/config/routes';

function initials(fullName: string): string {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function AccountMenu() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { logout } = useLogout();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (!user) return null;

  const handleOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const go = (path: string) => {
    handleClose();
    navigate(path);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate(ROUTES.HOME);
  };

  return (
    <>
      <IconButton
        aria-label="Account menu"
        onClick={handleOpen}
        sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
      >
        <Avatar sx={{ width: 30, height: 30, fontSize: '0.85rem', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          {initials(user.fullName) || '?'}
        </Avatar>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => go(ROUTES.PROFILE)}>Profile</MenuItem>
        <MenuItem onClick={() => go(ROUTES.SETTINGS)}>Settings</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}

export default AccountMenu;
