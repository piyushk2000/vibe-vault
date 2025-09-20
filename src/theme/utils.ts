import { Theme, SxProps } from '@mui/material/styles';

// Responsive utility functions
export const createResponsiveValue = <T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}) => values;

// Animation utility functions
export const createTransition = (
  properties: string | string[],
  duration: number = 300,
  easing: string = 'cubic-bezier(0.4, 0, 0.2, 1)'
) => {
  const props = Array.isArray(properties) ? properties : [properties];
  return props.map(prop => `${prop} ${duration}ms ${easing}`).join(', ');
};

// Common animation presets
export const animations = {
  fadeIn: {
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    animation: 'fadeIn 300ms ease-in-out',
  },
  slideUp: {
    '@keyframes slideUp': {
      from: { 
        opacity: 0,
        transform: 'translateY(20px)',
      },
      to: { 
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
    animation: 'slideUp 300ms ease-out',
  },
  scaleIn: {
    '@keyframes scaleIn': {
      from: { 
        opacity: 0,
        transform: 'scale(0.9)',
      },
      to: { 
        opacity: 1,
        transform: 'scale(1)',
      },
    },
    animation: 'scaleIn 200ms ease-out',
  },
  bounce: {
    '@keyframes bounce': {
      '0%, 20%, 50%, 80%, 100%': {
        transform: 'translateY(0)',
      },
      '40%': {
        transform: 'translateY(-10px)',
      },
      '60%': {
        transform: 'translateY(-5px)',
      },
    },
    animation: 'bounce 1s infinite',
  },
};

// Responsive spacing utilities
export const getResponsivePadding = (theme: Theme) => ({
  px: {
    xs: theme.customSpacing.md,
    sm: theme.customSpacing.lg,
    md: theme.customSpacing.xl,
  },
  py: {
    xs: theme.customSpacing.md,
    sm: theme.customSpacing.lg,
  },
});

export const getResponsiveMargin = (theme: Theme) => ({
  mx: {
    xs: theme.customSpacing.sm,
    sm: theme.customSpacing.md,
    md: theme.customSpacing.lg,
  },
  my: {
    xs: theme.customSpacing.md,
    sm: theme.customSpacing.lg,
  },
});

// Card responsive utilities
export const getCardColumns = (theme: Theme) => ({
  xs: theme.responsiveConfig.cardColumns.xs,
  sm: theme.responsiveConfig.cardColumns.sm,
  md: theme.responsiveConfig.cardColumns.md,
  lg: theme.responsiveConfig.cardColumns.lg,
  xl: theme.responsiveConfig.cardColumns.xl,
});

// Container responsive utilities
export const getContainerStyles = (theme: Theme): SxProps<Theme> => ({
  maxWidth: 'lg',
  mx: 'auto',
  px: {
    xs: theme.customSpacing.md,
    sm: theme.customSpacing.lg,
    md: theme.customSpacing.xl,
  },
  py: {
    xs: theme.customSpacing.lg,
    sm: theme.customSpacing.xl,
  },
});

// Touch target utilities for accessibility
export const getTouchTargetStyles = (): SxProps<Theme> => ({
  minHeight: '44px',
  minWidth: '44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// Focus styles for accessibility
export const getFocusStyles = (theme: Theme): SxProps<Theme> => ({
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
    borderRadius: theme.customSpacing.xs,
  },
});

// Hover effects
export const getHoverLift = (theme: Theme): SxProps<Theme> => ({
  transition: createTransition(['transform', 'box-shadow'], theme.customAnimations.duration.shorter),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.customShadows.cardHover,
  },
});

// Loading skeleton utilities
export const getSkeletonStyles = (theme: Theme) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.customSpacing.sm,
});

// Responsive grid utilities
export const getResponsiveGrid = (theme: Theme) => ({
  container: true,
  spacing: {
    xs: 2,
    sm: 3,
    md: 3,
  },
  sx: {
    px: {
      xs: theme.customSpacing.md,
      sm: theme.customSpacing.lg,
    },
  },
});

// Media query helpers
export const mediaQueries = {
  mobile: '@media (max-width: 599px)',
  tablet: '@media (min-width: 600px) and (max-width: 899px)',
  desktop: '@media (min-width: 900px)',
  largeDesktop: '@media (min-width: 1200px)',
};

// Z-index scale
export const zIndex = {
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};