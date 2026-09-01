import { Avatar, Box, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import StatusChip from '@/components/common/StatusChip';
import type { Fixture } from '@/features/sport';
import { formatMatchStatus, hasScore } from '@/features/sport/utils/formatFixture';
import { buildMatchPath } from '@/config/routes';

interface MatchCardProps {
  fixture: Fixture;
}

function TeamRow({ team, score, showScore }: { team: Fixture['homeTeam']; score: number | null; showScore: boolean }) {
  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
        <Avatar src={team.logo ?? undefined} variant="square" sx={{ width: 22, height: 22, bgcolor: 'transparent' }} />
        <Typography variant="body1" noWrap sx={{ fontWeight: 600, color: 'text.primary' }}>
          {team.name}
        </Typography>
      </Stack>
      {showScore && (
        <Typography
          variant="h6"
          component="span"
          sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, color: 'primary.main' }}
        >
          {score}
        </Typography>
      )}
    </Stack>
  );
}

function MatchCard({ fixture }: MatchCardProps) {
  const showScore = hasScore(fixture);
  const statusLabel = formatMatchStatus(fixture);

  return (
    <Card>
      <CardActionArea component={RouterLink} to={buildMatchPath(fixture.id)}>
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }} noWrap>
              {fixture.competition.name}
            </Typography>
            {fixture.live ? (
              <StatusChip status="live" label={`LIVE ${statusLabel}`} size="small" sx={{ fontSize: '0.65rem' }} />
            ) : (
              <Typography variant="caption" color="text.secondary">
                {statusLabel}
              </Typography>
            )}
          </Stack>
          <Stack spacing={1}>
            <TeamRow team={fixture.homeTeam} score={fixture.homeScore} showScore={showScore} />
            <TeamRow team={fixture.awayTeam} score={fixture.awayScore} showScore={showScore} />
          </Stack>
          {!showScore && fixture.status.code === 'scheduled' && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Kickoff {statusLabel}
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default MatchCard;
