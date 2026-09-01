import { Box, Card, CardActionArea, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { Fixture } from '@/features/sport';
import { formatFixtureTime } from '@/features/sport/utils/formatFixture';
import { buildMatchPath } from '@/config/routes';
import ResponsiveImage from '@/components/common/ResponsiveImage';

const BADGE_SIZE = 20;

interface FixtureRowProps {
  fixture: Fixture;
}

/** An upcoming fixture — team names either side of the kickoff time, never
 * a score (the match hasn't started). */
function FixtureRow({ fixture }: FixtureRowProps) {
  return (
    <Card>
      <CardActionArea component={RouterLink} to={buildMatchPath(fixture.id)} sx={{ px: 2, py: 1.5 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }} spacing={1}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flex: 1, minWidth: 0, justifyContent: 'flex-end' }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 600, color: 'text.primary', textAlign: 'right' }}>
              {fixture.homeTeam.name}
            </Typography>
            {fixture.homeTeam.logo ? (
              <Box sx={{ width: BADGE_SIZE, height: BADGE_SIZE, flexShrink: 0 }}>
                <ResponsiveImage variant="badge" src={fixture.homeTeam.logo} alt={`${fixture.homeTeam.name} badge`} />
              </Box>
            ) : (
              <Box sx={{ width: BADGE_SIZE, height: BADGE_SIZE, flexShrink: 0 }} />
            )}
          </Stack>
          <Typography
            variant="body2"
            sx={{
              flexShrink: 0,
              fontWeight: 700,
              color: 'secondary.main',
              bgcolor: 'surfaceAlt.main',
              px: 1,
              py: 0.25,
              borderRadius: 1,
            }}
          >
            {formatFixtureTime(fixture.kickoff)}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flex: 1, minWidth: 0 }}>
            {fixture.awayTeam.logo ? (
              <Box sx={{ width: BADGE_SIZE, height: BADGE_SIZE, flexShrink: 0 }}>
                <ResponsiveImage variant="badge" src={fixture.awayTeam.logo} alt={`${fixture.awayTeam.name} badge`} />
              </Box>
            ) : (
              <Box sx={{ width: BADGE_SIZE, height: BADGE_SIZE, flexShrink: 0 }} />
            )}
            <Typography variant="body2" noWrap sx={{ fontWeight: 600, color: 'text.primary' }}>
              {fixture.awayTeam.name}
            </Typography>
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
}

export default FixtureRow;
