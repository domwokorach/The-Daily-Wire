import Grid from '@mui/material/Grid';
import { Box, Stack, Typography } from '@mui/material';
import Container from '@/components/common/Container';
import SectionHeader from '@/components/common/SectionHeader';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import LeadStory from '@/components/news/LeadStory';
import CompactStory from '@/components/news/CompactStory';
import NewsGrid from '@/components/news/NewsGrid';
import SportScoreCard from '@/components/sport/SportScoreCard';
import HomepageWeather from '@/components/weather/HomepageWeather';
import SubscribeCard from '@/components/subscription/SubscribeCard';
import { useHomeFeed } from '@/features/news';
import { useSportScores } from '@/features/sport';

function HomePage() {
  const { lead, topStories, latest, sections, loading, error } = useHomeFeed();
  const { fixtures } = useSportScores();

  if (error) {
    return (
      <Container>
        <ErrorState message={error} />
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={{ xs: 3, md: 5 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          {loading || !lead ? <LoadingState variant="lead" /> : <LeadStory article={lead} />}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <HomepageWeather />
          </Box>
          <SectionHeader title="Top Stories" />
          {loading ? (
            <LoadingState variant="inline" count={3} />
          ) : (
            <Stack>
              {topStories.map((article) => (
                <CompactStory key={article.id} article={article} />
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>

      <Box sx={{ mt: { xs: 5, md: 7 } }}>
        <SectionHeader title="Latest" />
        <NewsGrid articles={latest} columns={{ xs: 12, sm: 6, md: 6, lg: 3 }} loading={loading} />
      </Box>

      <Box sx={{ mt: { xs: 5, md: 7 } }}>
        <SubscribeCard />
      </Box>

      {sections.map((section) => (
        <Box key={section.key} sx={{ mt: { xs: 5, md: 7 } }}>
          <SectionHeader title={section.label} viewAllPath={section.path} />
          {section.key === 'sport' ? (
            <Grid container spacing={{ xs: 3, md: 4 }}>
              <Grid size={{ xs: 12, md: 8 }}>
                <NewsGrid
                  articles={section.articles}
                  columns={{ xs: 12, sm: 6, lg: 4 }}
                  loading={loading}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={{ mb: 1, display: 'block' }}
                >
                  Live Scores
                </Typography>
                <Stack>
                  {fixtures.slice(0, 3).map((fixture) => (
                    <SportScoreCard key={fixture.id} fixture={fixture} />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          ) : (
            <NewsGrid
              articles={section.articles}
              columns={{ xs: 12, sm: 6, md: 6, lg: 3 }}
              loading={loading}
            />
          )}
        </Box>
      ))}
    </Container>
  );
}

export default HomePage;
