import { Autocomplete, CircularProgress, IconButton, Stack, TextField, Tooltip } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocationOutlined';
import { useWeatherSearch } from '@/features/weather';
import type { WeatherLocation } from '@/features/weather';

interface WeatherSearchProps {
  onSelect: (location: WeatherLocation) => void;
  onUseMyLocation: () => void;
  geolocating?: boolean;
}

function locationLabel(location: WeatherLocation): string {
  const region = location.state ? `${location.state}, ` : '';
  return `${location.name}, ${region}${location.country}`;
}

function WeatherSearch({ onSelect, onUseMyLocation, geolocating = false }: WeatherSearchProps) {
  const { inputValue, setInputValue, results, loading } = useWeatherSearch();

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <Autocomplete
        sx={{ flexGrow: 1, minWidth: 0 }}
        options={results}
        loading={loading}
        filterOptions={(options) => options}
        inputValue={inputValue}
        onInputChange={(_event, value) => setInputValue(value)}
        getOptionLabel={locationLabel}
        isOptionEqualToValue={(option, value) => option.name === value.name && option.latitude === value.latitude}
        noOptionsText={inputValue.trim().length > 1 ? "We couldn't find that location." : 'Search for a UK town or city'}
        onChange={(_event, value) => {
          if (value) onSelect(value);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search UK town, city or postcode…"
            size="small"
            slotProps={{
              ...params.slotProps,
              input: {
                ...params.slotProps.input,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={16} /> : null}
                    {params.slotProps.input.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />
      <Tooltip title="Use my location">
        <span>
          <IconButton onClick={onUseMyLocation} disabled={geolocating} color="secondary">
            {geolocating ? <CircularProgress size={20} /> : <MyLocationIcon />}
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}

export default WeatherSearch;
