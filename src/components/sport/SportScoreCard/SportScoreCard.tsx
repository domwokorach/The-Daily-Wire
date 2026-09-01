import { Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { Fixture } from '@/features/sport';
import { formatMatchStatus, hasScore } from '@/features/sport/utils/formatFixture';
import { buildMatchPath } from '@/config/routes';

interface SportScoreCardProps {
  fixture: Fixture;
}

function SportScoreCard({ fixture }: SportScoreCardProps) {
  const showScore = hasScore(fixture);

  return (
    <Stack
      component={RouterLink}
      to={buildMatchPath(fixture.id)}
      direction="row"
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        textDecoration: 'none',
        '&:last-of-type': { borderBottom: 'none' },
      }}
    >
      <Stack spacing={0.25} sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.disabled">
          {fixture.competition.name}
        </Typography>
        <Typography variant="body2" noWrap sx={{ color: 'text.primary', fontWeight: 600 }}>
          {fixture.homeTeam.name} v {fixture.awayTeam.name}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexShrink: 0 }}>
        {showScore && (
          <Typography
            variant="body1"
            sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, color: 'primary.main' }}
          >
            {fixture.homeScore} - {fixture.awayScore}
          </Typography>
        )}
        <Typography
          variant="caption"
          sx={{
            color: fixture.live ? 'live.main' : 'text.disabled',
            fontWeight: fixture.live ? 700 : 400,
          }}
        >
          {formatMatchStatus(fixture)}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default SportScoreCard;
