import Grid from '@mui/material/Grid';
import { Box, Stack, Typography } from '@mui/material';
import Container from '@/components/common/Container';
import SectionHeader from '@/components/common/SectionHeader';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import LeadStory from '@/components/news/LeadStory';
import TextStory from '@/components/news/TextStory';
import NewsGrid from '@/components/news/NewsGrid';
import MatchScoreRow, { LiveMatchSkeleton, ResultsSkeleton } from '@/components/sport/MatchScoreRow';
import FixtureGroup from '@/components/sport/FixtureGroup';
import { FixtureSkeleton } from '@/components/sport/FixtureRow';
import StandingsTable, { StandingsSkeleton } from '@/components/sport/StandingsTable';
import TopScorersList, { TopScorersSkeleton } from '@/components/sport/TopScorersList';
import { useTopHeadlines } from '@/features/news';
import { useLiveMatches, useRecentResults, useFixtures, useStandings, useTopScorers } from '@/features/sport';
import { getCategoryByKey } from '@/data/categories';

const TOP_SCORERS_SHOWN = 5;

function SportPage() {
  const { articles, loading: articlesLoading, error: articlesError } = useTopHeadlines('sport');
  const live = useLiveMatches();
  const results = useRecentResults(14);
  const fixtures = useFixtures(14);
  const { standings, loading: standingsLoading, error: standingsError } = useStandings();
  const { topScorers, loading: topScorersLoading, error: topScorersError } = useTopScorers();
  const category = getCategoryByKey('sport');
  const [lead, ...rest] = articles;
  const sideStories = rest.slice(0, 3);
  const gridStories = rest.slice(3);

  return (
    <Container>
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>
          Sport
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, maxWidth: '60ch' }}>
          {category?.description}
        </Typography>
      </Box>

      {/* Live Matches & Recent Results — the most time-sensitive module,
          so it fails and loads independently of everything else on the page. */}
      <Box sx={{ mb: { xs: 5, md: 7 } }}>
        <SectionHeader title="Live Matches & Recent Results" />

        <Box sx={{ mb: 3 }}>
          {live.loading ? (
            <LiveMatchSkeleton />
          ) : live.error ? (
            <ErrorState message={live.error} />
          ) : live.hasLive ? (
            <Stack spacing={1.5}>
              {live.fixtures.map((fixture) => (
                <MatchScoreRow key={fixture.id} fixture={fixture} />
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No Premier League matches are live right now.
            </Typography>
          )}
        </Box>

        <Typography variant="overline" sx={{ display: 'block', color: 'text.secondary', letterSpacing: '0.08em', mb: 1.5 }}>
          Recent Results
        </Typography>
        {results.loading ? (
          <ResultsSkeleton />
        ) : results.error ? (
          <ErrorState message={results.error} />
        ) : results.fixtures.length > 0 ? (
          <Grid container spacing={1.5}>
            {results.fixtures.map((fixture) => (
              <Grid key={fixture.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <MatchScoreRow fixture={fixture} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyState message="No recent Premier League results available." />
        )}
      </Box>

      <Grid container spacing={{ xs: 4, md: 5 }} sx={{ mb: { xs: 5, md: 7 } }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <SectionHeader title="Premier League Table" />
          {standingsError ? (
            <ErrorState message={standingsError} />
          ) : standingsLoading ? (
            <StandingsSkeleton />
          ) : standings.length > 0 ? (
            <StandingsTable standings={standings} />
          ) : (
            <EmptyState message="Premier League table is temporarily unavailable." />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SectionHeader title="Top Scorers" />
          {topScorersError ? (
            <ErrorState message={topScorersError} />
          ) : topScorersLoading ? (
            <TopScorersSkeleton />
          ) : topScorers.length > 0 ? (
            <TopScorersList topScorers={topScorers.slice(0, TOP_SCORERS_SHOWN)} />
          ) : (
            <EmptyState message="Top scorer data is currently unavailable." />
          )}
        </Grid>
      </Grid>

      <Box sx={{ mb: { xs: 5, md: 7 } }}>
        <SectionHeader title="Fixtures" />
        {fixtures.loading ? (
          <FixtureSkeleton />
        ) : fixtures.error ? (
          <ErrorState message={fixtures.error} />
        ) : fixtures.fixtures.length > 0 ? (
          <FixtureGroup fixtures={fixtures.fixtures} />
        ) : (
          <EmptyState message="No upcoming Premier League fixtures found." />
        )}
      </Box>

      <SectionHeader title="Latest Football News" />

      {articlesError && <ErrorState message={articlesError} />}

      {!articlesError && !articlesLoading && articles.length === 0 && (
        <EmptyState message="No sport stories found." />
      )}

      {!articlesError && !articlesLoading && lead && (
        <Grid container spacing={{ xs: 3, md: 5 }} sx={{ mb: { xs: 5, md: 7 } }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <LeadStory article={lead} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack>
              {sideStories.map((article) => (
                <TextStory key={article.id} article={article} />
              ))}
            </Stack>
          </Grid>
        </Grid>
      )}

      {!articlesError && !articlesLoading && gridStories.length > 0 && (
        <NewsGrid articles={gridStories} columns={{ xs: 12, sm: 6, md: 6, lg: 4 }} />
      )}
    </Container>
  );
}

export default SportPage;
