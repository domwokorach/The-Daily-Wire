import { Stack, Typography } from '@mui/material';
import type { ScoreFixture } from '@/data/mockSportScores';

interface SportScoreCardProps {
  fixture: ScoreFixture;
}

function SportScoreCard({ fixture }: SportScoreCardProps) {
  const hasScore = fixture.homeScore !== null && fixture.awayScore !== null;

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-of-type': { borderBottom: 'none' },
      }}
    >
      <Stack spacing={0.25}>
        <Typography variant="caption" color="text.disabled">
          {fixture.competition}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {fixture.homeTeam} v {fixture.awayTeam}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        {hasScore && (
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
          {fixture.status}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default SportScoreCard;
