import React from 'react';
import { Grid2 as Grid, Grid2Props } from '@mui/material';

interface ResponsiveGridProps extends Omit<Grid2Props, 'container' | 'spacing'> {
  spacing?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

interface ResponsiveGridItemProps extends Grid2Props {
  children: React.ReactNode;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  spacing = 'medium',
  children,
  sx,
  ...props
}) => {

  const getSpacing = () => {
    switch (spacing) {
      case 'small':
        return {
          xs: 1,
          sm: 2,
        };
      case 'large':
        return {
          xs: 3,
          sm: 4,
          md: 4,
        };
      default: // medium
        return {
          xs: 2,
          sm: 3,
          md: 3,
        };
    }
  };

  return (
    <Grid
      container
      spacing={getSpacing()}
      sx={{
        width: '100%',
        margin: 0,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Grid>
  );
};

const ResponsiveGridItem: React.FC<ResponsiveGridItemProps> = ({
  children,
  sx,
  ...props
}) => {
  return (
    <Grid
      sx={{
        display: 'flex',
        justifyContent: 'center',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Grid>
  );
};

export { ResponsiveGrid, ResponsiveGridItem };