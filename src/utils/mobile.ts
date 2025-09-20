import { useMediaQuery, useTheme } from '@mui/material';

/**
 * Custom hook to detect if the current device is mobile
 * Uses Material-UI's useMediaQuery with theme breakpoints
 * @returns boolean - true if mobile (below md breakpoint), false otherwise
 */
export const useIsMobile = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
};

/**
 * Utility function to get responsive values based on mobile state
 * @param mobileValue - Value to return on mobile
 * @param desktopValue - Value to return on desktop
 * @param isMobile - Mobile state (from useIsMobile hook)
 * @returns The appropriate value based on device type
 */
export const getResponsiveValue = <T>(
  mobileValue: T,
  desktopValue: T,
  isMobile: boolean
): T => {
  return isMobile ? mobileValue : desktopValue;
};

/**
 * Get responsive spacing values
 * @param isMobile - Mobile state
 * @returns Object with responsive spacing values
 */
export const getResponsiveSpacing = (isMobile: boolean) => ({
  container: isMobile ? 2 : 4,
  section: isMobile ? 2 : 4,
  card: isMobile ? 1.5 : 2,
  grid: isMobile ? 2 : 3,
});

/**
 * Get responsive typography variants
 * @param isMobile - Mobile state
 * @returns Object with responsive typography variants
 */
export const getResponsiveTypography = (isMobile: boolean) => ({
  h1: isMobile ? 'h3' : 'h1',
  h2: isMobile ? 'h4' : 'h2',
  h3: isMobile ? 'h5' : 'h3',
  h4: isMobile ? 'h5' : 'h4',
  h5: isMobile ? 'h6' : 'h5',
  h6: isMobile ? 'subtitle1' : 'h6',
});

/**
 * Get responsive grid breakpoints for stats cards
 * @param isMobile - Mobile state
 * @returns Grid breakpoint configuration
 */
export const getStatsCardBreakpoints = (isMobile: boolean) => ({
  xs: 6, // 2 cards per row on mobile
  sm: isMobile ? 6 : 6, // 2 cards per row on small screens
  md: 3, // 4 cards per row on medium and up
});