import { Box, Typography } from '@mui/material';
import Container from '@/components/common/Container';
import SectionHeader from '@/components/common/SectionHeader';
import ErrorState from '@/components/common/ErrorState';
import { WeatherHero, WeatherHeroSkeleton } from '@/components/weather/WeatherHero';
import WeatherDetails from '@/components/weather/WeatherDetails';
import WeatherSearch from '@/components/weather/WeatherSearch';
import HourlyForecast from '@/components/weather/HourlyForecast';
import ForecastList from '@/components/weather/ForecastList';
import { useWeatherFeed } from '@/features/weather';

function locationLabel(
  weatherLocationName: string | undefined,
  weatherLocationCountry: string | undefined,
  selectedName: string | undefined,
): string {
  if (weatherLocationName) return [weatherLocationName, weatherLocationCountry].filter(Boolean).join(', ');
  return selectedName ?? 'Your location';
}

function WeatherPage() {
  const {
    location,
    selectLocation,
    useMyLocation,
    geolocating,
    geolocationError,
    weather,
    forecast,
    loading,
    error,
    refetch,
  } = useWeatherFeed();

  const label = locationLabel(weather?.location.name, weather?.location.country, location.name);

  return (
    <Container>
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>
          Weather
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Current conditions and 5-day forecast for UK locations.
        </Typography>
      </Box>

      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <WeatherSearch onSelect={selectLocation} onUseMyLocation={useMyLocation} geolocating={geolocating} />
        {geolocationError && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {geolocationError}
          </Typography>
        )}
      </Box>

      {error && <ErrorState message={error} onRetry={refetch} />}

      {!error && loading && <WeatherHeroSkeleton />}

      {!error && !loading && weather && (
        <>
          <Box sx={{ mb: { xs: 4, md: 5 } }}>
            <WeatherHero weather={weather} locationLabel={label} />
          </Box>

          {forecast && forecast.hourly.length > 0 && (
            <Box sx={{ mb: { xs: 4, md: 5 } }}>
              <SectionHeader title="Hourly Forecast" />
              <HourlyForecast points={forecast.hourly} />
            </Box>
          )}

          {forecast && forecast.daily.length > 0 && (
            <Box sx={{ mb: { xs: 4, md: 5 } }}>
              <SectionHeader title="5-Day Forecast" />
              <ForecastList days={forecast.daily} />
            </Box>
          )}

          <Box>
            <SectionHeader title="Weather Details" />
            <WeatherDetails current={weather.current} />
          </Box>
        </>
      )}
    </Container>
  );
}

export default WeatherPage;
