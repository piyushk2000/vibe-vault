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

// Glassmorphism shadows
const shadows = {
  card: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
  cardHover: '0 12px 48px rgba(99, 102, 241, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
  modal: '0 24px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
  dropdown: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
  button: '0 4px 16px rgba(99, 102, 241, 0.2)',
  buttonHover: '0 8px 24px rgba(99, 102, 241, 0.35)',
  glass: '0 8px 32px rgba(0, 0, 0, 0.25)',
  glassStrong: '0 12px 40px rgba(0, 0, 0, 0.4)',
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
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          color: COLORS.DIALOG_TEXT,
          borderRadius: spacing.md,
          border: `1px solid ${COLORS.GLASS_BORDER}`,
          boxShadow: shadows.modal,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.CARD_BACKGROUND,
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          border: `1px solid ${COLORS.CARD_BORDER}`,
          borderRadius: spacing.md,
          transition: `all ${animations.duration.standard}ms ${animations.easing.easeInOut}`,
          boxShadow: shadows.card,
          '&:hover': {
            backgroundColor: COLORS.CARD_HOVER,
            boxShadow: shadows.cardHover,
            borderColor: COLORS.GLASS_BORDER_STRONG,
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
          minHeight: '44px',
        },
        contained: {
          background: `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_HOVER} 100%)`,
          boxShadow: shadows.button,
          '&:hover': {
            background: `linear-gradient(135deg, ${COLORS.ACCENT_LIGHT} 0%, ${COLORS.ACCENT} 100%)`,
            boxShadow: shadows.buttonHover,
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: COLORS.GLASS_BORDER,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          '&:hover': {
            borderColor: COLORS.ACCENT,
            backgroundColor: COLORS.ACCENT_BACKGROUND,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: COLORS.INPUT_BACKGROUND,
            backdropFilter: 'blur(12px) saturate(180%)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
            borderRadius: spacing.sm,
            transition: `all ${animations.duration.shorter}ms ${animations.easing.easeInOut}`,
            '& fieldset': {
              borderColor: COLORS.BORDER,
            },
            '&:hover fieldset': {
              borderColor: COLORS.GLASS_BORDER_STRONG,
            },
            '&.Mui-focused fieldset': {
              borderColor: COLORS.ACCENT,
              borderWidth: '2px',
              boxShadow: `0 0 0 3px ${COLORS.ACCENT_BACKGROUND}`,
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
            boxShadow: `0 0 8px ${COLORS.ACCENT}`,
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
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          },
          '&.Mui-selected': {
            backgroundColor: COLORS.TAB_SELECTED_BACKGROUND,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
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
          '&:hover': {
            backgroundColor: COLORS.HOVER,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.NAV_BACKGROUND,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: `1px solid ${COLORS.GLASS_BORDER}`,
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