import { Stack } from '@mui/material';
import ForecastCard from '@/components/weather/ForecastCard';
import type { DailyForecastDay } from '@/features/weather';

interface ForecastListProps {
  days: DailyForecastDay[];
}

function ForecastList({ days }: ForecastListProps) {
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
      {days.map((day) => (
        <ForecastCard key={day.date} day={day} />
      ))}
    </Stack>
  );
}

export default ForecastList;
