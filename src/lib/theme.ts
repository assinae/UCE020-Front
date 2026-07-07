import { createTheme } from '@mui/material/styles';
import { colorTokens } from '@/lib/colors';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colorTokens.brand.primary,
      light: colorTokens.brand.primaryLight,
      dark: colorTokens.brand.primaryDark,
      contrastText: colorTokens.neutral.black,
    },
    secondary: {
      main: colorTokens.brand.secondary,
      light: colorTokens.brand.secondaryLight,
      dark: colorTokens.brand.secondaryDark,
      contrastText: colorTokens.text.inverse,
    },
    error: {
      main: colorTokens.status.error,
      light: colorTokens.status.errorLight,
      dark: colorTokens.status.errorDark,
      contrastText: colorTokens.text.inverse,
    },
    warning: {
      main: colorTokens.status.warning,
      contrastText: colorTokens.text.inverse,
    },
    success: {
      main: colorTokens.status.success,
      contrastText: colorTokens.text.inverse,
    },
    info: {
      main: colorTokens.status.info,
      contrastText: colorTokens.text.inverse,
    },
    background: {
      default: colorTokens.surface.background,
      paper: colorTokens.surface.paper,
    },
    divider: colorTokens.neutral.border,
    text: {
      primary: colorTokens.text.primary,
      secondary: colorTokens.text.secondary,
    },
    action: {
      hover: colorTokens.navigation.hover,
      active: colorTokens.navigation.default,
      disabled: colorTokens.neutral.border,
      disabledBackground: colorTokens.surface.paper,
    },
    grey: {
      300: colorTokens.neutral.gray300,
      500: colorTokens.neutral.gray500,
      700: colorTokens.neutral.gray700,
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: 'var(--font-poppins), Inter, system-ui, sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.04em',
      fontFamily: 'var(--font-poppins)',
    },
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.035em',
      fontFamily: 'var(--font-poppins)',
    },
    h3: {
      fontWeight: 700,
      fontFamily: 'var(--font-poppins)',
    },
    h4: {
      fontWeight: 600,
      fontFamily: 'var(--font-poppins)',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontFamily: 'var(--font-poppins)',
    },
    body1: {
      fontFamily: 'var(--font-poppins)',
    },
    body2: {
      fontFamily: 'var(--font-poppins)',
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          padding: 0,
          backgroundImage: 'none',
          backgroundColor: colorTokens.surface.paper,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: colorTokens.neutral.white,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colorTokens.navigation.default,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colorTokens.navigation.hover,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colorTokens.navigation.hover,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: colorTokens.status.error,
          },
          '& input::placeholder': {
            color: colorTokens.neutral.gray500,
            opacity: 1,
          },
          '& textarea::placeholder': {
            color: colorTokens.neutral.gray500,
            opacity: 1,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: colorTokens.navigation.default,
          fontWeight: 600,
          fontSize: '0.875rem',
          '&.Mui-focused': {
            color: colorTokens.navigation.hover,
          },
          '&.Mui-error': {
            color: colorTokens.status.error,
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          '&.Mui-error': {
            color: colorTokens.status.error,
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: colorTokens.surface.paper,
          '&:hover': {
            backgroundColor: colorTokens.neutral.gray300,
          },
          '&.Mui-selected': {
            backgroundColor: colorTokens.neutral.border,
          },
          '&.Mui-selected:hover': {
            backgroundColor: colorTokens.neutral.gray300,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: colorTokens.neutral.gray700,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
          transition: 'transform .15s, filter .15s, background-color .2s',
          '&:hover:not(:disabled)': {
            transform: 'translateY(-2px)',
            filter: 'brightness(1.08)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
      },
      variants: [
        {
          props: {
            variant: 'contained',
            color: 'primary',
          },
          style: {
            backgroundColor: colorTokens.navigation.default,
            color: colorTokens.text.inverse,
            '&:hover': {
              backgroundColor: colorTokens.navigation.hover,
            },
          },
        },
        {
          props: {
            variant: 'contained',
            color: 'secondary',
          },
          style: {
            backgroundColor: colorTokens.brand.secondary,
            color: colorTokens.text.inverse,
            '&:hover': {
              backgroundColor: colorTokens.brand.secondaryDark,
            },
          },
        },
        // Outlined Primary
        {
          props: {
            variant: 'outlined',
            color: 'primary',
          },
          style: {
            borderColor: colorTokens.navigation.default,
            color: colorTokens.navigation.default,
            '&:hover': {
              borderColor: colorTokens.navigation.hover,
              backgroundColor: 'transparent',
            },
          },
        },
        {
          props: {
            variant: 'outlined',
            color: 'secondary',
          },
          style: {
            borderColor: colorTokens.brand.secondary,
            color: colorTokens.brand.secondary,
            '&:hover': {
              borderColor: colorTokens.brand.secondaryDark,
              color: colorTokens.brand.secondaryDark,
              backgroundColor: 'transparent',
            },
          },
        },
        {
          props: {
            variant: 'text',
            color: 'primary',
          },
          style: {
            color: colorTokens.navigation.default,
            '&:hover': {
              color: colorTokens.navigation.hover,
              backgroundColor: 'transparent',
            },
          },
        },
        {
          props: {
            variant: 'text',
            color: 'secondary',
          },
          style: {
            color: colorTokens.brand.secondary,
            '&:hover': {
              color: colorTokens.brand.secondaryDark,
              backgroundColor: 'transparent',
            },
          },
        },
        {
          props: {
            variant: 'contained',
            color: 'success',
          },
          style: {
            backgroundColor: colorTokens.status.success,
            color: colorTokens.text.inverse,
            '&:hover': {
              backgroundColor: colorTokens.status.success,
              opacity: 0.9,
            },
          },
        },
        {
          props: {
            variant: 'contained',
            color: 'error',
          },
          style: {
            backgroundColor: colorTokens.status.error,
            color: colorTokens.text.inverse,
            '&:hover': {
              backgroundColor: colorTokens.status.errorDark,
            },
          },
        },
        {
          props: {
            variant: 'contained',
            color: 'warning',
          },
          style: {
            backgroundColor: colorTokens.status.warning,
            color: colorTokens.text.inverse,
            '&:hover': {
              backgroundColor: colorTokens.status.warning,
              opacity: 0.9,
            },
          },
        },
        {
          props: {
            variant: 'outlined',
            color: 'error',
          },
          style: {
            borderColor: colorTokens.status.error,
            color: colorTokens.status.error,
            '&:hover': {
              borderColor: colorTokens.status.errorDark,
              color: colorTokens.status.errorDark,
              backgroundColor: 'transparent',
            },
          },
        },
        {
          props: {
            variant: 'outlined',
            color: 'success',
          },
          style: {
            borderColor: colorTokens.status.success,
            color: colorTokens.status.success,
            '&:hover': {
              borderColor: colorTokens.status.success,
              backgroundColor: 'transparent',
              opacity: 0.9,
            },
          },
        },
      ],
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colorTokens.neutral.white,
          color: '#0f172a',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#f4f6f9',
          backgroundImage: 'none',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a2744',
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
