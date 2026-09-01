import { Accordion, AccordionDetails, AccordionSummary, Box, Link, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface TocEntry {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  entries: TocEntry[];
}

function TocLinks({ entries }: { entries: TocEntry[] }) {
  return (
    <Stack spacing={0.75}>
      {entries.map((entry) => (
        <Link
          key={entry.id}
          href={`#${entry.id}`}
          underline="hover"
          variant="body2"
          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          {entry.title}
        </Link>
      ))}
    </Stack>
  );
}

/** Desktop: a plain anchor-link list. Mobile: collapsed into an accordion
 * so a 40+ section table of contents doesn't push the actual document
 * below the fold on a small screen. */
function TableOfContents({ entries }: TableOfContentsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return (
      <Accordion sx={{ bgcolor: 'surfaceAlt.main', mb: 4 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="toc-content" id="toc-header">
          <Typography variant="subtitle2">Contents</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TocLinks entries={entries} />
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Box sx={{ bgcolor: 'surfaceAlt.main', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2.5, mb: 5 }}>
      <Typography variant="overline" color="primary.main" sx={{ display: 'block', mb: 1.5 }}>
        Contents
      </Typography>
      <TocLinks entries={entries} />
    </Box>
  );
}

export default TableOfContents;
