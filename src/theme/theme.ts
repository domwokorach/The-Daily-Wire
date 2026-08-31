import { createTheme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';
import { breakpoints } from './breakpoints';
import { components } from './components';

const theme = createTheme({
  breakpoints,
  palette,
  typography,
  shape: {
    borderRadius: 3,
  },
  components,
});

export default theme;
