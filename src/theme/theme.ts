import { createTheme } from '@mui/material/styles';
import { COLORS } from './colors';

// Enhanced spacing system
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
};

// Animation system
const animations = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};

// Enhanced shadows
const shadows = {
  card: '0 2px 8px rgba(1, 4, 9, 0.15)',
  cardHover: '0 8px 25px rgba(1, 4, 9, 0.25)',
  modal: '0 16px 48px rgba(1, 4, 9, 0.4)',
  dropdown: '0 4px 16px rgba(1, 4, 9, 0.2)',
  button: '0 2px 4px rgba(1, 4, 9, 0.1)',
  buttonHover: '0 4px 8px rgba(1, 4, 9, 0.15)',
};

// Responsive breakpoints configuration
const responsiveConfig = {
  cardColumns: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  },
  containerPadding: {
    xs: spacing.md,
    sm: spacing.lg,
    md: spacing.xl,
    lg: spacing.xl,
    xl: spacing.xl,
  },
};

// Typography enhancements
const typography = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.4,
  },
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: COLORS.ACCENT,
      contrastText: COLORS.TEXT_PRIMARY,
    },
    secondary: {
      main: COLORS.SECONDARY,
      contrastText: COLORS.TEXT_PRIMARY,
    },
    background: {
      default: COLORS.PRIMARY,
      paper: COLORS.SECONDARY,
    },
    text: {
      primary: COLORS.TEXT_PRIMARY,
      secondary: COLORS.TEXT_SECONDARY,
    },
    divider: COLORS.DIVIDER,
    error: {
      main: COLORS.ERROR,
    },
    warning: {
      main: COLORS.WARNING,
    },
    info: {
      main: COLORS.INFO,
    },
    success: {
      main: COLORS.SUCCESS,
    },
  },
  typography,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: COLORS.DIALOG_BACKGROUND,
          color: COLORS.DIALOG_TEXT,
          borderRadius: spacing.md,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.CARD_BACKGROUND,
          border: `1px solid ${COLORS.CARD_BORDER}`,
          borderRadius: spacing.md,
          transition: `all ${animations.duration.standard}ms ${animations.easing.easeInOut}`,
          '&:hover': {
            backgroundColor: COLORS.CARD_HOVER,
            boxShadow: shadows.cardHover,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: spacing.sm,
          textTransform: 'none',
          fontWeight: 600,
          transition: `all ${animations.duration.shorter}ms ${animations.easing.easeInOut}`,
          minHeight: '44px', // Accessibility: minimum touch target
        },
        contained: {
          boxShadow: shadows.button,
          '&:hover': {
            boxShadow: shadows.buttonHover,
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: spacing.sm,
            transition: `all ${animations.duration.shorter}ms ${animations.easing.easeInOut}`,
            '& fieldset': {
              borderColor: COLORS.BORDER,
            },
            '&:hover fieldset': {
              borderColor: COLORS.ACCENT,
            },
            '&.Mui-focused fieldset': {
              borderColor: COLORS.ACCENT,
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTabs-indicator': {
            backgroundColor: COLORS.ACCENT,
            height: '3px',
            borderRadius: '2px',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minHeight: '48px',
          transition: `all ${animations.duration.shorter}ms ${animations.easing.easeInOut}`,
          '&:hover': {
            backgroundColor: COLORS.HOVER,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minWidth: '44px',
          minHeight: '44px',
          transition: `all ${animations.duration.shorter}ms ${animations.easing.easeInOut}`,
        },
      },
    },
  },
});

// Extend theme with custom properties
declare module '@mui/material/styles' {
  interface Theme {
    customSpacing: typeof spacing;
    customAnimations: typeof animations;
    customShadows: typeof shadows;
    responsiveConfig: typeof responsiveConfig;
  }
  interface ThemeOptions {
    customSpacing?: typeof spacing;
    customAnimations?: typeof animations;
    customShadows?: typeof shadows;
    responsiveConfig?: typeof responsiveConfig;
  }
}

// Add custom properties to theme
const enhancedTheme = {
  ...theme,
  customSpacing: spacing,
  customAnimations: animations,
  customShadows: shadows,
  responsiveConfig: responsiveConfig,
};

export default enhancedTheme;
export { spacing, animations, shadows, responsiveConfig };