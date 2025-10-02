import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
} from '@mui/material';
import { COLORS } from '../../theme/colors';

interface SimpleMediaCardProps {
  imageUrl: string;
  showName: string;
}

const SimpleMediaCard: React.FC<SimpleMediaCardProps> = ({ imageUrl, showName }) => {
  return (
    <Card
      sx={{
        width: 200,
        height: 320,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundColor: COLORS.CARD_BACKGROUND,
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        border: `1px solid ${COLORS.GLASS_BORDER}`,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
          borderColor: COLORS.GLASS_BORDER_STRONG,
        },
      }}
    >
      <CardMedia
        component="img"
        height="240"
        image={imageUrl}
        alt={showName}
        sx={{
          objectFit: 'cover',
        }}
      />
      <CardContent sx={{ p: 2, height: 80, overflow: 'hidden' }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: COLORS.TEXT_PRIMARY,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.2,
          }}
        >
          {showName}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SimpleMediaCard;