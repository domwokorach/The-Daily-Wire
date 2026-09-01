import { Stack } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '@/constants/navigation';

function DesktopNavigation() {
  const location = useLocation();

  return (
    <Stack
      component="nav"
      direction="row"
      spacing={{ md: 1.5, lg: 3 }}
      aria-label="Primary"
      sx={{ overflowX: { md: 'auto', lg: 'visible' } }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Stack
            key={item.key}
            component={RouterLink}
            to={item.path}
            aria-current={isActive ? 'page' : undefined}
            sx={{
              flexShrink: 0,
              py: 2,
              textDecoration: 'none',
              color: isActive ? 'primary.main' : 'text.secondary',
              fontWeight: isActive ? 700 : 500,
              fontSize: { md: '0.85rem', lg: '0.95rem' },
              fontFamily: '"Inter", sans-serif',
              borderBottom: '2px solid',
              borderColor: isActive ? 'primary.main' : 'transparent',
              transition: 'color 120ms ease, border-color 120ms ease',
              '&:hover': {
                color: 'primary.light',
              },
            }}
          >
            {item.label}
          </Stack>
        );
      })}
    </Stack>
  );
}

export default DesktopNavigation;
