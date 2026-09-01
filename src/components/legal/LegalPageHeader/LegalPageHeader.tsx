import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface LegalPageHeaderProps {
  title: string;
  intro: ReactNode;
}

const EFFECTIVE_DATE = '[DATE]';
const LAST_UPDATED = '[DATE]';

function LegalPageHeader({ title, intro }: LegalPageHeaderProps) {
  return (
    <Box component="header" sx={{ mb: 4 }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.disabled" sx={{ mb: 2.5 }}>
        Effective date: {EFFECTIVE_DATE} · Last updated: {LAST_UPDATED}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75, maxWidth: 720 }}>
        {intro}
      </Typography>
    </Box>
  );
}

export default LegalPageHeader;
