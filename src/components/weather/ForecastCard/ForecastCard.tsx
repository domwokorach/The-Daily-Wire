import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import OpacityIcon from '@mui/icons-material/OpacityOutlined';
import WeatherIcon from '@/components/weather/WeatherIcon';
import type { DailyForecastDay } from '@/features/weather';

interface ForecastCardProps {
  day: DailyForecastDay;
}

function formatDayLabel(date?: string): string {
  if (!date) return '—';
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short' });
}

function ForecastCard({ day }: ForecastCardProps) {
  return (
    <Card sx={{ flex: { xs: '0 0 120px', md: '1 1 0' }, textAlign: 'center' }}>
      <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {formatDayLabel(day.date)}
        </Typography>
        <Box sx={{ my: 1 }}>
          <WeatherIcon icon={day.icon} fontSize={32} />
        </Box>
        <Typography variant="body2">
          <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {typeof day.temperatureHigh === 'number' ? `${Math.round(day.temperatureHigh)}°` : '—'}
          </Box>{' '}
          <Box component="span" sx={{ color: 'text.disabled' }}>
            {typeof day.temperatureLow === 'number' ? `${Math.round(day.temperatureLow)}°` : ''}
          </Box>
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', justifyContent: 'center', mt: 0.5 }}>
          <OpacityIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {typeof day.precipitationProbability === 'number' ? `${day.precipitationProbability}%` : '—'}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ForecastCard;
