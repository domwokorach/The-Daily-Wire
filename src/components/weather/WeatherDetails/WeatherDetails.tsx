import { Box, Card, Stack, Typography } from '@mui/material';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostatOutlined';
import OpacityIcon from '@mui/icons-material/OpacityOutlined';
import AirIcon from '@mui/icons-material/AirOutlined';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import SpeedIcon from '@mui/icons-material/SpeedOutlined';
import WbTwilightIcon from '@mui/icons-material/WbTwilightOutlined';
import NightsStayIcon from '@mui/icons-material/NightsStayOutlined';
import type { SvgIconComponent } from '@mui/icons-material';
import { formatTemperature } from '@/utils/formatTemperature';
import type { CurrentConditions } from '@/features/weather';

interface WeatherDetailsProps {
  current: CurrentConditions;
}

interface DetailItem {
  label: string;
  value: string;
  Icon: SvgIconComponent;
}

function formatTime(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function formatWind(speedMs?: number): string {
  if (typeof speedMs !== 'number') return '—';
  return `${Math.round(speedMs * 3.6)} km/h`;
}

function buildItems(current: CurrentConditions): DetailItem[] {
  return [
    {
      label: 'Feels Like',
      value: typeof current.feelsLike === 'number' ? formatTemperature(current.feelsLike) : '—',
      Icon: DeviceThermostatIcon,
    },
    {
      label: 'Humidity',
      value: typeof current.humidity === 'number' ? `${current.humidity}%` : '—',
      Icon: OpacityIcon,
    },
    { label: 'Wind', value: formatWind(current.windSpeed), Icon: AirIcon },
    {
      label: 'Visibility',
      value: typeof current.visibility === 'number' ? `${(current.visibility / 1000).toFixed(1)} km` : '—',
      Icon: VisibilityIcon,
    },
    {
      label: 'Pressure',
      value: typeof current.pressure === 'number' ? `${current.pressure} hPa` : '—',
      Icon: SpeedIcon,
    },
    { label: 'Sunrise', value: formatTime(current.sunrise), Icon: WbTwilightIcon },
    { label: 'Sunset', value: formatTime(current.sunset), Icon: NightsStayIcon },
  ];
}

function WeatherDetails({ current }: WeatherDetailsProps) {
  const items = buildItems(current);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 1.5,
      }}
    >
      {items.map((item) => (
        <Card key={item.label} sx={{ p: 2 }}>
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
            <item.Icon sx={{ fontSize: 22, color: 'secondary.main' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {item.label}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {item.value}
              </Typography>
            </Box>
          </Stack>
        </Card>
      ))}
    </Box>
  );
}

export default WeatherDetails;
