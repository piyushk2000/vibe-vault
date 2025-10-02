import React from 'react';
import { Card, CardContent, Skeleton, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { COLORS } from '../../theme/colors';

interface MediaCardSkeletonProps {
  variant?: 'compact' | 'standard' | 'detailed';
  count?: number;
}

const MediaCardSkeleton: React.FC<MediaCardSkeletonProps> = ({
  variant = 'standard',
  count = 1,
}) => {
  const theme = useTheme();

  const getCardDimensions = () => {
    switch (variant) {
      case 'compact':
        return {
          width: 200,
          imageHeight: 280,
        };
      case 'detailed':
        return {
          width: 320,
          imageHeight: 450,
        };
      default: // standard
        return {
          width: 280,
          imageHeight: 400,
        };
    }
  };

  const { width, imageHeight } = getCardDimensions();

  const SingleSkeleton = () => (
    <Card
      sx={{
        width,
        backgroundColor: COLORS.CARD_BACKGROUND,
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        border: `1px solid ${COLORS.GLASS_BORDER}`,
        borderRadius: theme.customSpacing.md,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Image Skeleton */}
      <Skeleton
        variant="rectangular"
        height={imageHeight}
        sx={{
          backgroundColor: COLORS.SKELETON_BASE,
          '&::after': {
            background: `linear-gradient(90deg, transparent, ${COLORS.SKELETON_HIGHLIGHT}, transparent)`,
          },
        }}
      />

      <CardContent sx={{ pb: 1 }}>
        {/* Title Skeleton */}
        <Skeleton
          variant="text"
          width="80%"
          height={28}
          sx={{
            mb: 1,
            backgroundColor: COLORS.SKELETON_BASE,
            '&::after': {
              background: `linear-gradient(90deg, transparent, ${COLORS.SKELETON_HIGHLIGHT}, transparent)`,
            },
          }}
        />

        {/* Description Skeleton */}
        <Box sx={{ mb: 2 }}>
          <Skeleton
            variant="text"
            width="100%"
            height={20}
            sx={{
              mb: 0.5,
              backgroundColor: COLORS.SKELETON_BASE,
              '&::after': {
                background: `linear-gradient(90deg, transparent, ${COLORS.SKELETON_HIGHLIGHT}, transparent)`,
              },
            }}
          />
          <Skeleton
            variant="text"
            width="90%"
            height={20}
            sx={{
              mb: 0.5,
              backgroundColor: COLORS.SKELETON_BASE,
              '&::after': {
                background: `linear-gradient(90deg, transparent, ${COLORS.SKELETON_HIGHLIGHT}, transparent)`,
              },
            }}
          />
          <Skeleton
            variant="text"
            width="60%"
            height={20}
            sx={{
              backgroundColor: COLORS.SKELETON_BASE,
              '&::after': {
                background: `linear-gradient(90deg, transparent, ${COLORS.SKELETON_HIGHLIGHT}, transparent)`,
              },
            }}
          />
        </Box>

        {/* Chips Skeleton */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Skeleton
            variant="rounded"
            width={60}
            height={24}
            sx={{
              backgroundColor: COLORS.SKELETON_BASE,
              '&::after': {
                background: `linear-gradient(90deg, transparent, ${COLORS.SKELETON_HIGHLIGHT}, transparent)`,
              },
            }}
          />
          <Skeleton
            variant="rounded"
            width={80}
            height={24}
            sx={{
              backgroundColor: COLORS.SKELETON_BASE,
              '&::after': {
                background: `linear-gradient(90deg, transparent, ${COLORS.SKELETON_HIGHLIGHT}, transparent)`,
              },
            }}
          />
          <Skeleton
            variant="rounded"
            width={70}
            height={24}
            sx={{
              backgroundColor: COLORS.SKELETON_BASE,
              '&::after': {
                background: `linear-gradient(90deg, transparent, ${COLORS.SKELETON_HIGHLIGHT}, transparent)`,
              },
            }}
          />
        </Box>

        {/* Buttons Skeleton */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton
            variant="rounded"
            width={80}
            height={36}
            sx={{
              backgroundColor: COLORS.SKELETON_BASE,
              '&::after': {
                background: `linear-gradient(90deg, transparent, ${COLORS.SKELETON_HIGHLIGHT}, transparent)`,
              },
            }}
          />
          <Skeleton
            variant="rounded"
            width={60}
            height={36}
            sx={{
              backgroundColor: COLORS.SKELETON_BASE,
              '&::after': {
                background: `linear-gradient(90deg, transparent, ${COLORS.SKELETON_HIGHLIGHT}, transparent)`,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  if (count === 1) {
    return <SingleSkeleton />;
  }

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <SingleSkeleton key={index} />
      ))}
    </>
  );
};

export default MediaCardSkeleton;