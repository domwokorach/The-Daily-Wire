import { Card, CardActionArea, Skeleton, Stack, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link as RouterLink } from 'react-router-dom';
import WeatherIcon from '@/components/weather/WeatherIcon';
import { useWeather, DEFAULT_WEATHER_LOCATION } from '@/features/weather';
import { formatTemperature } from '@/utils/formatTemperature';
import { ROUTES } from '@/config/routes';

function capitalize(value?: string): string | undefined {
  if (!value) return undefined;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Compact homepage widget — current conditions only, no forecast fetch. */
function HomepageWeather() {
  const { weather, loading, error } = useWeather(DEFAULT_WEATHER_LOCATION);

  if (error) return null;

  return (
    <Card>
      <CardActionArea component={RouterLink} to={ROUTES.WEATHER} sx={{ p: 2 }}>
        {loading || !weather ? (
          <Stack spacing={1}>
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="70%" />
          </Stack>
        ) : (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <WeatherIcon icon={weather.current.icon} fontSize={40} />
            <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="overline" color="text.secondary">
                {weather.location.name ?? DEFAULT_WEATHER_LOCATION.name}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                {typeof weather.current.temperature === 'number'
                  ? formatTemperature(weather.current.temperature)
                  : '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {capitalize(weather.current.description) ?? weather.current.condition}
                {typeof weather.current.temperatureMax === 'number' &&
                typeof weather.current.temperatureMin === 'number'
                  ? ` · H ${Math.round(weather.current.temperatureMax)}° · L ${Math.round(weather.current.temperatureMin)}°`
                  : ''}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center', color: 'primary.main', whiteSpace: 'nowrap' }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Weather
              </Typography>
              <ChevronRightIcon sx={{ fontSize: '1.1rem' }} />
            </Stack>
          </Stack>
        )}
      </CardActionArea>
    </Card>
  );
}

export default HomepageWeather;
