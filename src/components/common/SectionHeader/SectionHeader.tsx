import { Box, Stack, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link as RouterLink } from 'react-router-dom';

interface SectionHeaderProps {
  title: string;
  viewAllPath?: string;
}

function SectionHeader({ title, viewAllPath }: SectionHeaderProps) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'baseline',
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider',
        pb: 1.25,
        mb: { xs: 2, md: 3 },
      }}
    >
      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'baseline' }}>
        <Box
          sx={{
            width: 3,
            height: 20,
            bgcolor: 'primary.main',
            alignSelf: 'center',
          }}
        />
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontSize: { xs: '1.4rem', md: '1.75rem' } }}
        >
          {title}
        </Typography>
      </Stack>
      {viewAllPath && (
        <Stack
          direction="row"
          spacing={0.25}
          component={RouterLink}
          to={viewAllPath}
          sx={{
            alignItems: 'center',
            fontSize: '0.85rem',
            fontWeight: 600,
            textDecoration: 'none',
            color: 'primary.main',
            whiteSpace: 'nowrap',
            '&:hover': { color: 'primary.light' },
          }}
        >
          <span>View all</span>
          <ChevronRightIcon sx={{ fontSize: '1.1rem' }} />
        </Stack>
      )}
    </Stack>
  );
}

export default SectionHeader;
