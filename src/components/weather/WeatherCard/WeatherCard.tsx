import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import UmbrellaIcon from '@mui/icons-material/BeachAccess';
import AirIcon from '@mui/icons-material/Air';
import OpacityIcon from '@mui/icons-material/Opacity';
import type { WeatherData } from '@/data/mockWeather';
import { formatTemperature } from '@/utils/formatTemperature';

const iconMap = {
  sunny: WbSunnyIcon,
  cloudy: CloudIcon,
  rainy: UmbrellaIcon,
  stormy: ThunderstormIcon,
  partly: CloudQueueIcon,
};

interface WeatherCardProps {
  weather: WeatherData;
}

function WeatherCard({ weather }: WeatherCardProps) {
  const Icon = iconMap[weather.icon];

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 4 }}
          sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}
        >
          <Icon sx={{ fontSize: { xs: 64, md: 88 }, color: 'secondary.main' }} />
          <Box>
            <Typography variant="overline" color="text.secondary">
              {weather.location}
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
              {formatTemperature(weather.currentTemp)}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {weather.condition}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              H: {weather.high}° L: {weather.low}°
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Stack spacing={1.5} sx={{ minWidth: 160 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <AirIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Wind: {weather.wind}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <OpacityIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Humidity: {weather.humidity}%
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default WeatherCard;
