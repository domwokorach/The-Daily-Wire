import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '@/constants/navigation';
import { APP_CONFIG } from '@/config/appConfig';
import { useUIStore } from '@/store';

function MobileNavigation() {
  const location = useLocation();
  const isDrawerOpen = useUIStore((state) => state.isDrawerOpen);
  const closeDrawer = useUIStore((state) => state.closeDrawer);

  return (
    <Drawer
      anchor="left"
      open={isDrawerOpen}
      onClose={closeDrawer}
      ModalProps={{ keepMounted: true }}
      slotProps={{
        paper: { sx: { width: 280 } },
      }}
    >
      <Stack
        direction="row"
        sx={{ px: 2, py: 1.5, alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography
          variant="h6"
          component="span"
          sx={{ fontSize: '1.3rem', color: 'text.primary' }}
        >
          {APP_CONFIG.siteName}
        </Typography>
        <IconButton onClick={closeDrawer} aria-label="Close navigation menu">
          <CloseIcon />
        </IconButton>
      </Stack>
      <Divider />
      <List component="nav" aria-label="Primary" sx={{ py: 0 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.key}
              component={RouterLink}
              to={item.path}
              onClick={closeDrawer}
              selected={isActive}
              aria-current={isActive ? 'page' : undefined}
              sx={{
                py: 1.5,
                minHeight: 48,
                borderLeft: '3px solid',
                borderColor: isActive ? 'primary.main' : 'transparent',
              }}
            >
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'primary.main' : 'text.primary',
                      fontFamily: '"Inter", sans-serif',
                    },
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ flexGrow: 1 }} />
    </Drawer>
  );
}

export default MobileNavigation;
