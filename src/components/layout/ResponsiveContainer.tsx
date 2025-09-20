import React from 'react';
import { Container, ContainerProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getContainerStyles } from '../../theme/utils';

interface ResponsiveContainerProps extends Omit<ContainerProps, 'maxWidth'> {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  maxWidth = 'lg',
  padding = 'medium',
  children,
  sx,
  ...props
}) => {
  const theme = useTheme();

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return {};
      case 'small':
        return {
          px: {
            xs: theme.customSpacing.sm,
            sm: theme.customSpacing.md,
          },
          py: {
            xs: theme.customSpacing.md,
            sm: theme.customSpacing.lg,
          },
        };
      case 'large':
        return {
          px: {
            xs: theme.customSpacing.lg,
            sm: theme.customSpacing.xl,
            md: theme.customSpacing.xxl,
          },
          py: {
            xs: theme.customSpacing.xl,
            sm: theme.customSpacing.xxl,
          },
        };
      default: // medium
        return getContainerStyles(theme);
    }
  };

  return (
    <Container
      maxWidth={maxWidth}
      sx={[
        getPaddingStyles(),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      {children}
    </Container>
  );
};

export default ResponsiveContainer;