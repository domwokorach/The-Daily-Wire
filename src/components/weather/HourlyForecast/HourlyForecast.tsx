import { Box, Stack, Typography } from '@mui/material';
import WeatherIcon from '@/components/weather/WeatherIcon';
import type { HourlyForecastPoint } from '@/features/weather';

interface HourlyForecastProps {
  points: HourlyForecastPoint[];
  /** How many of the upcoming 3-hour slots to show. */
  limit?: number;
}

function formatTime(dateTime?: string): string {
  if (!dateTime) return '—';
  return new Date(dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function HourlyForecast({ points, limit = 8 }: HourlyForecastProps) {
  const slots = points.slice(0, limit);

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        overflowX: 'auto',
        pb: 1,
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {slots.map((point, index) => (
        <Box
          key={point.dateTime ?? index}
          sx={{
            flex: '0 0 64px',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: index === 0 ? 700 : 400 }}>
            {index === 0 ? 'Now' : formatTime(point.dateTime)}
          </Typography>
          <Box sx={{ my: 0.75 }}>
            <WeatherIcon icon={point.icon} fontSize={26} />
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {typeof point.temperature === 'number' ? `${Math.round(point.temperature)}°` : '—'}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}

export default HourlyForecast;
