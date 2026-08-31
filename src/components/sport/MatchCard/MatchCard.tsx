import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import type { ScoreFixture } from '@/data/mockSportScores';
import StatusChip from '@/components/common/StatusChip';

interface MatchCardProps {
  fixture: ScoreFixture;
}

function MatchCard({ fixture }: MatchCardProps) {
  const hasScore = fixture.homeScore !== null && fixture.awayScore !== null;

  return (
    <Card>
      <CardContent sx={{ p: 2 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {fixture.competition}
          </Typography>
          {fixture.live ? (
            <StatusChip
              status="live"
              label={`LIVE ${fixture.status}`}
              size="small"
              sx={{ fontSize: '0.65rem' }}
            />
          ) : (
            <Typography variant="caption" color="text.secondary">
              {fixture.status}
            </Typography>
          )}
        </Stack>
        <Stack spacing={1}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {fixture.homeTeam}
            </Typography>
            {hasScore && (
              <Typography
                variant="h6"
                component="span"
                sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, color: 'primary.main' }}
              >
                {fixture.homeScore}
              </Typography>
            )}
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {fixture.awayTeam}
            </Typography>
            {hasScore && (
              <Typography
                variant="h6"
                component="span"
                sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, color: 'primary.main' }}
              >
                {fixture.awayScore}
              </Typography>
            )}
          </Stack>
        </Stack>
        {!hasScore && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Kickoff {fixture.status}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default MatchCard;
