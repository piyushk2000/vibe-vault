import React, { useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Favorite, Close, TrendingUp } from '@mui/icons-material';
import { COLORS } from '../../theme/colors';
import { calculateMatchPercentage, getCurrentUserMockData } from '../../utils/matchCalculator';
import { getDefaultMediaImage } from '../../utils/defaultImages';

interface User {
  id: number;
  name: string;
  bio: string;
  interests: string[];
  avatar: string | null;
  topMedia: Array<{
    title: string;
    type: string;
    rating: number;
    image: string;
    genres: string[];
  }>;
  mediaCount: number;
}

interface SwipeCardProps {
  user: User;
  onSwipe: (direction: 'left' | 'right') => void;
  isActive: boolean;
  style?: any;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ user, onSwipe, isActive, style }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});
  
  // Calculate match percentage
  // TODO: Replace getCurrentUserMockData with actual current user data from Redux store
  const currentUser = getCurrentUserMockData();
  const matchPercentage = calculateMatchPercentage(currentUser, {
    interests: user.interests,
    topMedia: user.topMedia
  });

  const [{ x, y, rotate, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
  }));

  const bind = useDrag(
    ({ active, movement: [mx, my], direction: [xDir], velocity: [vx] }) => {
      if (!isActive) return;

      const trigger = vx > 0.2 || Math.abs(mx) > 100;
      const dir = xDir < 0 ? -1 : 1;

      if (!active && trigger) {
        // Trigger swipe
        api.start({
          x: (200 + window.innerWidth) * dir,
          rotate: mx / 100 + (dir * 10),
          scale: 1.1,
          config: { friction: 50, tension: 200 },
        });
        
        setTimeout(() => {
          onSwipe(dir === 1 ? 'right' : 'left');
        }, 200);
      } else {
        // Follow drag
        api.start({
          x: active ? mx : 0,
          y: active ? my : 0,
          rotate: active ? mx / 100 : 0,
          scale: active ? 1.05 : 1,
          immediate: active,
        });
      }
    },
    {
      axis: 'x',
      bounds: { left: -200, right: 200, top: -50, bottom: 50 },
      rubberband: true,
    }
  );

  const getSwipeIndicator = () => {
    const xValue = x.get();
    if (Math.abs(xValue) < 50) return null;
    
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: xValue > 0 ? 20 : 'auto',
          right: xValue < 0 ? 20 : 'auto',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 2,
          backgroundColor: xValue > 0 ? COLORS.SUCCESS : COLORS.ERROR,
          color: 'white',
          fontWeight: 'bold',
          transform: `rotate(${xValue > 0 ? -15 : 15}deg)`,
        }}
      >
        {xValue > 0 ? <Favorite /> : <Close />}
        {xValue > 0 ? 'LIKE' : 'PASS'}
      </Box>
    );
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return COLORS.SUCCESS;
    if (percentage >= 60) return COLORS.WARNING;
    if (percentage >= 40) return COLORS.ACCENT;
    return COLORS.ERROR;
  };

  return (
    <animated.div
      {...bind()}
      style={{
        x,
        y,
        rotate,
        scale,
        touchAction: 'none',
        cursor: isActive ? 'grab' : 'default',
        ...style,
      }}
    >
      <Card
        sx={{
          width: isMobile ? '90vw' : 400,
          height: isMobile ? '70vh' : 600,
          maxWidth: 400,
          position: 'relative',
          backgroundColor: COLORS.CARD_BACKGROUND,
          border: `1px solid ${COLORS.CARD_BORDER}`,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: `0 8px 32px ${COLORS.OVERLAY_DARK}`,
        }}
      >
        {getSwipeIndicator()}
        
        {/* Match Percentage Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <TrendingUp sx={{ fontSize: 16, color: getMatchColor(matchPercentage) }} />
          <Typography
            variant="caption"
            sx={{
              color: getMatchColor(matchPercentage),
              fontWeight: 'bold',
              fontSize: '0.8rem',
            }}
          >
            {matchPercentage}%
          </Typography>
        </Box>
        
        {/* Main Image/Avatar */}
        <Box
          sx={{
            height: '50%',
            background: user.avatar 
              ? `url(${user.avatar}) center/cover`
              : `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_LIGHT} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!user.avatar && (
            <Avatar
              sx={{
                width: 120,
                height: 120,
                backgroundColor: 'rgba(255,255,255,0.2)',
                fontSize: '3rem',
                color: 'white',
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
          )}
        </Box>

        <CardContent sx={{ height: '50%', overflow: 'auto', p: 2 }}>
          {/* User Info */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {user.name}
            </Typography>
          </Box>
          
          {/* Match Compatibility Bar */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" color="textSecondary">
                Compatibility
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 'bold', color: getMatchColor(matchPercentage) }}>
                {matchPercentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={matchPercentage}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: COLORS.BACKGROUND_LIGHT,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getMatchColor(matchPercentage),
                  borderRadius: 3,
                },
              }}
            />
          </Box>
          
          {user.bio && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {user.bio}
            </Typography>
          )}

          {/* Interests */}
          {user.interests.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Interests:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {user.interests.slice(0, 6).map((interest, index) => (
                  <Chip
                    key={index}
                    label={interest}
                    size="small"
                    sx={{
                      backgroundColor: COLORS.ACCENT,
                      color: 'white',
                      fontSize: '0.75rem',
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Top Media */}
          {user.topMedia.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Favorite Media ({user.mediaCount} total):
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {user.topMedia.slice(0, 3).map((media, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      backgroundColor: COLORS.BACKGROUND_LIGHT,
                      borderRadius: 1,
                    }}
                  >
                    <img
                      src={imageErrors[index] ? getDefaultMediaImage(media.type) : media.image}
                      alt={media.title}
                      onError={() => setImageErrors(prev => ({...prev, [index]: true}))}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: 'cover',
                        borderRadius: 4,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 'bold',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {media.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={media.type}
                          size="small"
                          sx={{
                            backgroundColor: media.type === 'BOOK' ? '#8B4513' : COLORS.TEXT_SECONDARY,
                            color: 'white',
                            fontSize: '0.7rem',
                            height: 20,
                          }}
                        />
                        <Typography variant="caption" color="textSecondary">
                          ⭐ {media.rating}/5
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </animated.div>
  );
};

export default SwipeCard;