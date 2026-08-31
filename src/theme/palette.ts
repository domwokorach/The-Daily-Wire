import type { PaletteOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    breaking: Palette['primary'];
    live: Palette['primary'];
    surfaceAlt: Palette['primary'];
  }
  interface PaletteOptions {
    breaking?: PaletteOptions['primary'];
    live?: PaletteOptions['primary'];
    surfaceAlt?: PaletteOptions['primary'];
  }
}

export const palette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#C9A86A',
    light: '#D7C29E',
    dark: '#A98950',
    contrastText: '#071426',
  },
  secondary: {
    main: '#7FA8D8',
    contrastText: '#071426',
  },
  breaking: {
    main: '#9C3B3B',
    contrastText: '#F7F8FA',
  },
  live: {
    main: '#3E7A63',
    contrastText: '#F7F8FA',
  },
  surfaceAlt: {
    main: '#132642',
    contrastText: '#F7F8FA',
  },
  background: {
    default: '#071426',
    paper: '#101F3A',
  },
  text: {
    primary: '#F7F8FA',
    secondary: '#B8C2D1',
    disabled: '#8896AA',
  },
  divider: 'rgba(255,255,255,0.10)',
};
