import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import WeatherIcon from '@/components/weather/WeatherIcon';
import { formatTemperature } from '@/utils/formatTemperature';
import type { CurrentWeather } from '@/features/weather';

interface WeatherHeroProps {
  weather: CurrentWeather;
  locationLabel: string;
}

function capitalize(value?: string): string | undefined {
  if (!value) return undefined;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function WeatherHero({ weather, locationLabel }: WeatherHeroProps) {
  const { current } = weather;

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 4 }}
          sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}
        >
          <WeatherIcon icon={current.icon} fontSize={80} />
          <Box>
            <Typography variant="overline" color="text.secondary">
              {locationLabel}
            </Typography>
            <Typography
              variant="h1"
              component="p"
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: { xs: '3rem', md: '4.5rem' },
                lineHeight: 1,
              }}
            >
              {typeof current.temperature === 'number' ? formatTemperature(current.temperature) : '—'}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {capitalize(current.description) ?? current.condition ?? 'Unknown'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {typeof current.temperatureMax === 'number' ? `H: ${Math.round(current.temperatureMax)}°` : ''}
              {typeof current.temperatureMin === 'number' ? `  L: ${Math.round(current.temperatureMin)}°` : ''}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default WeatherHero;
