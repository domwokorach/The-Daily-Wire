import Grid from '@mui/material/Grid';
import type { ScoreFixture } from '@/data/mockSportScores';
import MatchCard from '@/components/sport/MatchCard';

interface FixtureListProps {
  fixtures: ScoreFixture[];
}

function FixtureList({ fixtures }: FixtureListProps) {
  return (
    <Grid container spacing={2}>
      {fixtures.map((fixture) => (
        <Grid key={fixture.id} size={{ xs: 12, sm: 6, lg: 3 }}>
          <MatchCard fixture={fixture} />
        </Grid>
      ))}
    </Grid>
  );
}

export default FixtureList;
