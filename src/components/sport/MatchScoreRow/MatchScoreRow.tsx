import { Box, Card, CardActionArea, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { Fixture } from '@/features/sport';
import { formatMatchStatus, formatResultDate } from '@/features/sport/utils/formatFixture';
import { buildMatchPath } from '@/config/routes';
import ResponsiveImage from '@/components/common/ResponsiveImage';

const BADGE_SIZE = 22;

interface MatchScoreRowProps {
  fixture: Fixture;
}

function TeamLine({ team, score }: { team: Fixture['homeTeam']; score: number | null }) {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
        {team.logo ? (
          <Box sx={{ width: BADGE_SIZE, height: BADGE_SIZE, flexShrink: 0 }}>
            <ResponsiveImage variant="badge" src={team.logo} alt={`${team.name} badge`} />
          </Box>
        ) : (
          <Box sx={{ width: BADGE_SIZE, height: BADGE_SIZE, flexShrink: 0 }} />
        )}
        <Typography variant="body1" noWrap sx={{ fontWeight: 600, color: 'text.primary' }}>
          {team.name}
        </Typography>
      </Stack>
      <Typography variant="body1" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, color: 'primary.main' }}>
        {score}
      </Typography>
    </Stack>
  );
}

/** One row in the Live Matches / Recent Results module — each team on its
 * own line with the score at the right, and a live clock or the match date
 * beneath. Distinct from `MatchCard` (the Fixtures/general grid card):
 * this is the denser, list-style layout the combined live/results module
 * calls for. */
function MatchScoreRow({ fixture }: MatchScoreRowProps) {
  return (
    <Card>
      <CardActionArea component={RouterLink} to={buildMatchPath(fixture.id)} sx={{ px: 2, py: 1.5 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" color="text.secondary" noWrap>
            {fixture.competition.name}
          </Typography>
          {fixture.live ? (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <Typography component="span" sx={{ color: 'breaking.main', fontSize: '0.6rem', lineHeight: 1 }}>
                ●
              </Typography>
              <Typography variant="caption" sx={{ color: 'breaking.main', fontWeight: 700, letterSpacing: '0.06em' }}>
                LIVE
              </Typography>
            </Stack>
          ) : (
            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700 }}>
              FT
            </Typography>
          )}
        </Stack>
        <Stack spacing={0.75}>
          <TeamLine team={fixture.homeTeam} score={fixture.homeScore} />
          <TeamLine team={fixture.awayTeam} score={fixture.awayScore} />
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 1 }}>
          {fixture.live ? formatMatchStatus(fixture) : formatResultDate(fixture.kickoff)}
        </Typography>
      </CardActionArea>
    </Card>
  );
}

export default MatchScoreRow;
