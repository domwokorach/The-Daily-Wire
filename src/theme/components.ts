import type { ThemeOptions } from '@mui/material/styles';

export const components: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: '#071426',
      },
      '*:focus-visible': {
        outline: '2px solid #C9A86A',
        outlineOffset: '2px',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 3,
        boxShadow: 'none',
        backgroundImage: 'none',
        backgroundColor: '#101F3A',
        border: '1px solid rgba(255,255,255,0.08)',
        transition: 'border-color 160ms ease, background-color 160ms ease',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 3,
        fontWeight: 700,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        backgroundImage: 'none',
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        minHeight: 48,
        minWidth: 'auto',
        color: '#B8C2D1',
        '&.Mui-selected': {
          color: '#C9A86A',
        },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: {
        backgroundColor: '#C9A86A',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 3,
      },
      contained: {
        '&.MuiButton-colorPrimary': {
          color: '#071426',
          '&:hover': {
            backgroundColor: '#D7C29E',
          },
        },
      },
      outlined: {
        borderColor: 'rgba(255,255,255,0.24)',
        color: '#F7F8FA',
        '&:hover': {
          borderColor: '#C9A86A',
          backgroundColor: 'rgba(201,168,106,0.08)',
        },
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: '#0A1730',
        backgroundImage: 'none',
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: 'rgba(255,255,255,0.10)',
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        color: '#B8C2D1',
      },
    },
  },
  MuiSkeleton: {
    styleOverrides: {
      root: {
        backgroundColor: 'rgba(255,255,255,0.06)',
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        '&.Mui-selected': {
          backgroundColor: 'rgba(201,168,106,0.10)',
          '&:hover': {
            backgroundColor: 'rgba(201,168,106,0.14)',
          },
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.02)',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255,255,255,0.16)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255,255,255,0.32)',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#C9A86A',
          borderWidth: 1,
        },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': {
          borderColor: '#9C3B3B',
        },
      },
    },
  },
  MuiFormControl: {
    styleOverrides: {
      root: {
        width: '100%',
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        color: '#B8C2D1',
        '&.Mui-focused': {
          color: '#C9A86A',
        },
      },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        color: '#8896AA',
        '&.Mui-error': {
          color: '#9C3B3B',
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        backgroundColor: '#101F3A',
        backgroundImage: 'none',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 3,
      },
    },
  },
  MuiSnackbarContent: {
    styleOverrides: {
      root: {
        backgroundColor: '#101F3A',
        borderRadius: 3,
      },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: {
        backgroundColor: '#101F3A',
        backgroundImage: 'none',
        border: '1px solid rgba(255,255,255,0.08)',
      },
    },
  },
};
