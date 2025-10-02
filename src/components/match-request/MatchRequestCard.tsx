import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Favorite, Close, Info, PersonAdd, TrendingUp } from '@mui/icons-material';
import { COLORS } from '../../theme/colors';
import { formatDistanceToNow } from 'date-fns';
import { calculateMatchPercentage, getCurrentUserMockData } from '../../utils/matchCalculator';
import { getDefaultMediaImage } from '../../utils/defaultImages';

interface MatchRequest {
  id: number;
  swiperId: number;
  user: {
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
  };
  createdAt: string;
}

interface MatchRequestCardProps {
  request: MatchRequest;
  onRespond: (swiperId: number, action: 'LIKE' | 'PASS') => void;
  isLoading?: boolean;
}

const MatchRequestCard: React.FC<MatchRequestCardProps> = ({ 
  request, 
  onRespond, 
  isLoading = false 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});
  
  // Calculate match percentage
  // TODO: Replace getCurrentUserMockData with actual current user data from Redux store
  const currentUser = getCurrentUserMockData();
  const matchPercentage = calculateMatchPercentage(currentUser, {
    interests: request.user.interests,
    topMedia: request.user.topMedia
  });

  const handleAccept = () => {
    onRespond(request.swiperId, 'LIKE');
  };

  const handleDecline = () => {
    onRespond(request.swiperId, 'PASS');
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return COLORS.SUCCESS;
    if (percentage >= 60) return COLORS.WARNING;
    if (percentage >= 40) return COLORS.ACCENT;
    return COLORS.ERROR;
  };

  return (
    <>
      <Card
        sx={{
          width: isMobile ? '100%' : 320,
          backgroundColor: COLORS.CARD_BACKGROUND,
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          border: `1px solid ${COLORS.GLASS_BORDER}`,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: COLORS.CARD_HOVER,
            borderColor: COLORS.GLASS_BORDER_STRONG,
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
          },
        }}
      >
        {/* Header with Avatar and Name */}
        <CardContent sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={request.user.avatar || undefined}
              sx={{
                width: 56,
                height: 56,
                backgroundColor: COLORS.ACCENT,
                mr: 2,
              }}
            >
              {request.user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {request.user.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
              </Box>
              <Typography variant="caption" color="textSecondary">
                <PersonAdd sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
              </Typography>
            </Box>
          </Box>

          {/* Bio */}
          {request.user.bio && (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                mb: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {request.user.bio}
            </Typography>
          )}

          {/* Interests */}
          {request.user.interests.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.8rem' }}>
                Interests:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {request.user.interests.slice(0, 3).map((interest, index) => (
                  <Chip
                    key={index}
                    label={interest}
                    size="small"
                    sx={{
                      background: `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_LIGHT} 100%)`,
                      color: 'white',
                      fontSize: '0.7rem',
                      height: 24,
                      border: `1px solid ${COLORS.GLASS_BORDER}`,
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                    }}
                  />
                ))}
                {request.user.interests.length > 3 && (
                  <Chip
                    label={`+${request.user.interests.length - 3}`}
                    size="small"
                    sx={{
                      backgroundColor: COLORS.TEXT_SECONDARY,
                      color: 'white',
                      fontSize: '0.7rem',
                      height: 24,
                    }}
                  />
                )}
              </Box>
            </Box>
          )}

          {/* Top Media Preview */}
          {request.user.topMedia.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.8rem' }}>
                Favorite Media:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, overflow: 'hidden' }}>
                {request.user.topMedia.slice(0, 3).map((media, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: 60,
                    }}
                  >
                    <img
                      src={imageErrors[index] ? getDefaultMediaImage(media.type) : media.image}
                      alt={media.title}
                      onError={() => setImageErrors(prev => ({...prev, [index]: true}))}
                      style={{
                        width: 50,
                        height: 70,
                        objectFit: 'cover',
                        borderRadius: 4,
                        marginBottom: 4,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.65rem',
                        textAlign: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                      }}
                    >
                      ⭐ {media.rating}/5
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </CardContent>

        {/* Action Buttons */}
        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Button
            size="small"
            startIcon={<Info />}
            onClick={() => setDetailsOpen(true)}
            sx={{ color: COLORS.ACCENT }}
          >
            Details
          </Button>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon={<Close />}
              onClick={handleDecline}
              disabled={isLoading}
              sx={{
                color: COLORS.ERROR,
                borderColor: COLORS.ERROR,
                '&:hover': {
                  backgroundColor: `${COLORS.ERROR}20`,
                  borderColor: COLORS.ERROR,
                },
              }}
              variant="outlined"
            >
              Pass
            </Button>
            
            <Button
              size="small"
              startIcon={<Favorite />}
              onClick={handleAccept}
              disabled={isLoading}
              variant="contained"
              sx={{
                background: `linear-gradient(135deg, ${COLORS.SUCCESS} 0%, #059669 100%)`,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: `1px solid ${COLORS.GLASS_BORDER}`,
                '&:hover': {
                  background: `linear-gradient(135deg, #059669 0%, ${COLORS.SUCCESS} 100%)`,
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                },
              }}
            >
              Accept
            </Button>
          </Box>
        </CardActions>
      </Card>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: COLORS.CARD_BACKGROUND,
            border: `1px solid ${COLORS.BORDER}`,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={request.user.avatar || undefined}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: COLORS.ACCENT,
                mr: 2,
              }}
            >
              {request.user.name.charAt(0).toUpperCase()}
            </Avatar>
            {request.user.name}
          </Box>
          <IconButton onClick={() => setDetailsOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          {request.user.bio && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                About
              </Typography>
              <Typography variant="body1">
                {request.user.bio}
              </Typography>
            </Box>
          )}

          {request.user.interests.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Interests
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {request.user.interests.map((interest, index) => (
                  <Chip
                    key={index}
                    label={interest}
                    sx={{
                      backgroundColor: COLORS.ACCENT,
                      color: 'white',
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {request.user.topMedia.length > 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Favorite Media
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {request.user.topMedia.map((media, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      backgroundColor: COLORS.BACKGROUND_LIGHT,
                      borderRadius: 2,
                    }}
                  >
                    <img
                    //@ts-ignore
                      src={imageErrors[`dialog-${index}`] ? getDefaultMediaImage(media.type) : media.image}
                      alt={media.title}
                      onError={() => setImageErrors(prev => ({...prev, [`dialog-${index}`]: true}))}
                      style={{
                        width: 60,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 4,
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {media.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Chip
                          label={media.type}
                          size="small"
                          sx={{
                            backgroundColor: media.type === 'BOOK' ? '#8B4513' : COLORS.TEXT_SECONDARY,
                            color: 'white',
                            fontSize: '0.7rem',
                          }}
                        />
                        <Typography variant="body2" color="textSecondary">
                          ⭐ {media.rating}/5
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {media.genres.slice(0, 3).map((genre, genreIndex) => (
                          <Chip
                            key={genreIndex}
                            label={genre}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: '0.65rem',
                              height: 20,
                              borderColor: COLORS.BORDER,
                              color: COLORS.TEXT_SECONDARY,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDecline} startIcon={<Close />} color="error">
            Pass
          </Button>
          <Button 
            onClick={handleAccept} 
            startIcon={<Favorite />} 
            variant="contained"
            sx={{
              backgroundColor: COLORS.SUCCESS,
              '&:hover': {
                backgroundColor: '#2e7d32',
              },
            }}
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MatchRequestCard;