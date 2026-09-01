import type { ReactNode } from 'react';
import { Box, Link, List, ListItem, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export type LegalBlock =
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  // Rich content (e.g. a paragraph with an in-line `<LegalLink>`) — rendered
  // as-is, never passed through the placeholder-highlighting text renderer.
  | { kind: 'node'; node: ReactNode };

export interface LegalSection {
  id: string;
  title: string;
  blocks: LegalBlock[];
}

const PLACEHOLDER_SPLIT_PATTERN = /(\[[A-Z0-9 /]+\])/g;
// Whole-string match against one isolated split part — deliberately a
// separate, non-global regex. Reusing a `g`-flagged RegExp's `.test()`
// across a `.map()` would silently skip alternating matches (a global
// regex carries `lastIndex` state between calls).
const PLACEHOLDER_WHOLE_PATTERN = /^\[[A-Z0-9 /]+\]$/;

/**
 * Highlights `[BRACKETED]` placeholders inline so they visually stand out
 * as "needs real information before publication" rather than reading as
 * finished legal text — this page is explicitly a draft pending review,
 * never a substitute for one.
 */
function renderWithPlaceholders(text: string): ReactNode {
  const parts = text.split(PLACEHOLDER_SPLIT_PATTERN);
  return parts.map((part, index) =>
    PLACEHOLDER_WHOLE_PATTERN.test(part) ? (
      <Box
        key={index}
        component="span"
        sx={{
          color: 'primary.main',
          borderBottom: '1px dashed',
          borderColor: 'primary.main',
          fontWeight: 600,
        }}
      >
        {part}
      </Box>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

/** Renders a plain-English cross-reference like `Privacy Policy` or
 * `Terms of Service` as an actual in-app link, so legal-body copy doesn't
 * have to hand-roll `<Link>` JSX for every mention. */
export function LegalLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link component={RouterLink} to={to} sx={{ color: 'primary.main' }}>
      {children}
    </Link>
  );
}

export function LegalSectionBody({ section }: { section: LegalSection }) {
  return (
    <Box component="section" id={section.id} sx={{ scrollMarginTop: 96 }}>
      <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
        {section.title}
      </Typography>
      {section.blocks.map((block, index) => {
        if (block.kind === 'p') {
          return (
            <Typography key={index} variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.75 }}>
              {renderWithPlaceholders(block.text)}
            </Typography>
          );
        }
        if (block.kind === 'node') {
          return (
            <Typography key={index} variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.75 }}>
              {block.node}
            </Typography>
          );
        }
        return (
          <List key={index} dense sx={{ listStyleType: 'disc', pl: 3, mb: 1.5 }}>
            {block.items.map((item, itemIndex) => (
              <ListItem key={itemIndex} sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                <Typography variant="body1" color="text.secondary" component="span" sx={{ lineHeight: 1.75 }}>
                  {renderWithPlaceholders(item)}
                </Typography>
              </ListItem>
            ))}
          </List>
        );
      })}
    </Box>
  );
}
