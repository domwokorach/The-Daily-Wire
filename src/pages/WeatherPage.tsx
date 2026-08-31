import { Box, Typography } from '@mui/material';
import Container from '@/components/common/Container';
import SectionHeader from '@/components/common/SectionHeader';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import WeatherCard from '@/components/weather/WeatherCard';
import WeatherForecast from '@/components/weather/WeatherForecast';
import { useWeatherFeed } from '@/features/weather';

function WeatherPage() {
  const { weather, loading, error, refetch } = useWeatherFeed();

  return (
    <Container>
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>
          Weather
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Current conditions and 7-day forecast{weather ? ` for ${weather.location}` : ''}.
        </Typography>
      </Box>

      {error && <ErrorState message={error} onRetry={refetch} />}

      {!error && loading && <LoadingState variant="lead" />}

      {!error && !loading && weather && (
        <>
          <Box sx={{ mb: { xs: 4, md: 5 } }}>
            <WeatherCard weather={weather} />
          </Box>
          <Box>
            <SectionHeader title="7-Day Forecast" />
            <WeatherForecast forecast={weather.forecast} />
          </Box>
        </>
      )}
    </Container>
  );
}

export default WeatherPage;
