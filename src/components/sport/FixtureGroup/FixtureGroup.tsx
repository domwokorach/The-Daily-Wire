import { Box, Stack, Typography } from '@mui/material';
import FixtureRow from '@/components/sport/FixtureRow';
import type { Fixture } from '@/features/sport';
import { groupFixturesByDate } from '@/features/sport/utils/formatFixture';

interface FixtureGroupProps {
  fixtures: Fixture[];
}

/** Upcoming fixtures grouped under a date heading — "FRIDAY 4 SEPTEMBER"
 * followed by that day's matches, nearest date first. */
function FixtureGroup({ fixtures }: FixtureGroupProps) {
  const groups = groupFixturesByDate(fixtures);

  return (
    <Stack spacing={3}>
      {groups.map((group) => (
        <Box key={group.heading}>
          <Typography
            variant="overline"
            sx={{ display: 'block', color: 'text.secondary', letterSpacing: '0.08em', mb: 1 }}
          >
            {group.heading}
          </Typography>
          <Stack spacing={1.25}>
            {group.fixtures.map((fixture) => (
              <FixtureRow key={fixture.id} fixture={fixture} />
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

export default FixtureGroup;
