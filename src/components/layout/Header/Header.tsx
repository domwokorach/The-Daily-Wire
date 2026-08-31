import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import DesktopNavigation from '@/components/layout/DesktopNavigation';
import MobileNavigation from '@/components/layout/MobileNavigation';
import { NAV_ITEMS } from '@/data/navigation';
import { APP_CONFIG } from '@/constants/config';
import { ROUTES } from '@/constants/routes';
import { useUIStore } from '@/store';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const openDrawer = useUIStore((state) => state.openDrawer);

  const activeIndex = NAV_ITEMS.findIndex((item) => item.path === location.pathname);

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: 'space-between',
            minHeight: { xs: 56, md: 88 },
            py: { md: 1 },
          }}
        >
          <IconButton
            edge="start"
            aria-label="Open navigation menu"
            onClick={openDrawer}
            sx={{ display: { xs: 'inline-flex', md: 'none' }, mr: 1 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            component={RouterLink}
            to={ROUTES.HOME}
            variant="h5"
            sx={{
              textDecoration: 'none',
              color: 'text.primary',
              fontWeight: 700,
              fontSize: { xs: '1.15rem', sm: '1.4rem', md: '1.75rem', lg: '2rem' },
              letterSpacing: '-0.01em',
              flexShrink: 0,
              '&:hover': { color: 'primary.main' },
            }}
          >
            {APP_CONFIG.siteName}
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1, ml: 4 }}>
            <DesktopNavigation />
          </Box>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <IconButton aria-label="Search" onClick={() => navigate(ROUTES.SEARCH)}>
              <SearchIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="Account"
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              <PersonOutlineIcon fontSize="small" />
            </IconButton>
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                ml: 1,
                px: 2.5,
                fontSize: '0.8rem',
              }}
            >
              Subscribe
            </Button>
          </Stack>
        </Toolbar>
      </Container>

      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Tabs
          value={activeIndex === -1 ? false : activeIndex}
          variant="scrollable"
          scrollButtons={false}
          aria-label="Primary"
          onChange={(_e, newValue: number) => navigate(NAV_ITEMS[newValue].path)}
          sx={{
            minHeight: 44,
            '& .MuiTab-root': {
              minHeight: 44,
              fontSize: '0.8rem',
              fontFamily: '"Inter", sans-serif',
              textTransform: 'none',
              fontWeight: 600,
              px: 1.5,
            },
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Tab key={item.key} label={item.label} />
          ))}
        </Tabs>
      </Box>

      <MobileNavigation />
    </AppBar>
  );
}

export default Header;
