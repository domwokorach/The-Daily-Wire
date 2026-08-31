import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import UmbrellaIcon from '@mui/icons-material/BeachAccess';
import OpacityIcon from '@mui/icons-material/Opacity';
import type { DailyForecast } from '@/data/mockWeather';

const iconMap = {
  sunny: WbSunnyIcon,
  cloudy: CloudIcon,
  rainy: UmbrellaIcon,
  stormy: ThunderstormIcon,
  partly: CloudQueueIcon,
};

interface WeatherForecastProps {
  forecast: DailyForecast[];
}

function WeatherForecast({ forecast }: WeatherForecastProps) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        overflowX: { xs: 'auto', md: 'visible' },
        pb: 1,
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {forecast.map((day) => {
        const Icon = iconMap[day.icon];
        return (
          <Card
            key={day.day}
            sx={{
              flex: { xs: '0 0 120px', md: '1 1 0' },
              textAlign: 'center',
            }}
          >
            <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {day.day}
              </Typography>
              <Icon sx={{ fontSize: 32, color: 'secondary.main', my: 1 }} />
              <Typography variant="body2">
                <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {day.high}°
                </Box>{' '}
                <Box component="span" sx={{ color: 'text.disabled' }}>
                  {day.low}°
                </Box>
              </Typography>
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ alignItems: 'center', justifyContent: 'center', mt: 0.5 }}
              >
                <OpacityIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {day.precipitation}%
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}

export default WeatherForecast;
