import type { TypographyVariantsOptions } from '@mui/material/styles';

export const fontFamilies = {
  headline: '"Playfair Display", "Georgia", "Times New Roman", serif',
  body: '"Inter", "Helvetica Neue", Arial, sans-serif',
};

export const typography: TypographyVariantsOptions = {
  fontFamily: fontFamilies.body,
  h1: {
    fontFamily: fontFamilies.headline,
    fontWeight: 700,
    lineHeight: 1.05,
    letterSpacing: '-0.01em',
    color: '#F7F8FA',
  },
  h2: {
    fontFamily: fontFamilies.headline,
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: '-0.01em',
    color: '#F7F8FA',
  },
  h3: {
    fontFamily: fontFamilies.headline,
    fontWeight: 700,
    lineHeight: 1.15,
    color: '#F7F8FA',
  },
  h4: {
    fontFamily: fontFamilies.headline,
    fontWeight: 700,
    lineHeight: 1.2,
    color: '#F7F8FA',
  },
  h5: {
    fontFamily: fontFamilies.headline,
    fontWeight: 700,
    lineHeight: 1.25,
    color: '#F7F8FA',
  },
  h6: {
    fontFamily: fontFamilies.headline,
    fontWeight: 700,
    lineHeight: 1.3,
    color: '#F7F8FA',
  },
  subtitle1: {
    fontFamily: fontFamilies.body,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontFamily: fontFamilies.body,
    lineHeight: 1.45,
    fontWeight: 600,
  },
  body1: {
    fontFamily: fontFamilies.body,
    lineHeight: 1.7,
    color: '#B8C2D1',
  },
  body2: {
    fontFamily: fontFamilies.body,
    lineHeight: 1.6,
    color: '#B8C2D1',
  },
  caption: {
    fontFamily: fontFamilies.body,
    lineHeight: 1.4,
    color: '#8896AA',
  },
  button: {
    fontFamily: fontFamilies.body,
    textTransform: 'none',
    fontWeight: 600,
  },
  overline: {
    fontFamily: fontFamilies.body,
    fontWeight: 700,
    letterSpacing: '0.1em',
  },
};
