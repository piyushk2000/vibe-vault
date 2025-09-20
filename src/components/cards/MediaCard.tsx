import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  useMediaQuery,
  useTheme,
  Fade,
} from '@mui/material';
import { Add, Info, Close, Star } from '@mui/icons-material';
import { COLORS } from '../../theme/colors';
import { getDefaultMediaImage } from '../../utils/defaultImages';
import { getTouchTargetStyles, createTransition } from '../../theme/utils';

interface Media {
  id?: number;
  apiId: number;
  title: string;
  description: string;
  genres: string[];
  image: string;
  type: 'ANIME' | 'MOVIE' | 'SHOW' | 'BOOK';
  meta?: any;
}

interface MediaCardProps {
  media: Media;
  onAddToLibrary?: (mediaData: {
    mediaId: number;
    rating: number;
    status: string;
    review?: string;
  }) => void;
  showAddButton?: boolean;
  userRating?: number;
  userStatus?: string;
  userReview?: string;
  variant?: 'compact' | 'standard' | 'detailed';
  showQuickActions?: boolean;
  loading?: boolean;
}

const MediaCard: React.FC<MediaCardProps> = ({
  media,
  onAddToLibrary,
  showAddButton = true,
  userRating,
  userStatus,
  userReview,
  variant = 'standard',
  showQuickActions = false,
  loading = false,
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [rating, setRating] = useState<number>(userRating || 0);
  const [status, setStatus] = useState(userStatus || 'PLAN_TO_WATCH');
  const [review, setReview] = useState(userReview || '');
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleAddToLibrary = () => {
    if (onAddToLibrary) {
      onAddToLibrary({
        mediaId: media.id || media.apiId,
        rating: rating > 0 ? rating : 0, // Allow 0 rating (no rating)
        status,
        review: review.trim() || undefined,
      });
      setAddDialogOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WATCHING':
        return COLORS.SUCCESS;
      case 'COMPLETED':
        return COLORS.ACCENT;
      case 'PLAN_TO_WATCH':
        return COLORS.WARNING;
      case 'DROPPED':
        return COLORS.ERROR;
      default:
        return COLORS.TEXT_SECONDARY;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'WATCHING':
        return 'Watching';
      case 'COMPLETED':
        return 'Completed';
      case 'PLAN_TO_WATCH':
        return 'Plan to Watch';
      case 'DROPPED':
        return 'Dropped';
      default:
        return status;
    }
  };

  const getCardDimensions = () => {
    switch (variant) {
      case 'compact':
        return {
          width: isMobile ? '100%' : 200,
          imageHeight: isMobile ? 280 : 280,
        };
      case 'detailed':
        return {
          width: isMobile ? '100%' : 320,
          imageHeight: isMobile ? 400 : 450,
        };
      default: // standard
        return {
          width: isMobile ? '100%' : 280,
          imageHeight: isMobile ? 350 : 400,
        };
    }
  };

  const { width, imageHeight } = getCardDimensions();

  if (loading) {
    return (
      <Card
        sx={{
          width,
          backgroundColor: COLORS.CARD_BACKGROUND,
          border: `1px solid ${COLORS.CARD_BORDER}`,
          borderRadius: theme.customSpacing.md,
        }}
      >
        {/* Loading skeleton would go here */}
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Loading...
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          width,
          maxWidth: '100%',
          backgroundColor: COLORS.CARD_BACKGROUND,
          border: `1px solid ${COLORS.CARD_BORDER}`,
          borderRadius: theme.customSpacing.md,
          position: 'relative',
          overflow: 'hidden',
          transition: createTransition(
            ['transform', 'box-shadow', 'background-color'], 
            theme.customAnimations.duration.standard
          ),
          '&:hover': {
            backgroundColor: COLORS.CARD_HOVER,
            transform: isMobile ? 'none' : 'translateY(-4px)',
            boxShadow: isMobile ? theme.customShadows.card : theme.customShadows.cardHover,
          },
          cursor: 'pointer',
        }}
      >
        {/* Image Container with Overlay */}
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            height={imageHeight}
            image={imageError ? getDefaultMediaImage(media.type) : media.image}
            alt={media.title}
            onError={() => setImageError(true)}
            sx={{
              objectFit: 'cover',
              transition: createTransition(['transform'], theme.customAnimations.duration.standard),
              '&:hover': {
                transform: isMobile ? 'none' : 'scale(1.05)',
              },
            }}
          />
          
          {/* Quick Actions Overlay - Desktop Only */}
          {!isMobile && showQuickActions && (
            <Fade in={isHovered}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.customSpacing.md,
                }}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailsOpen(true);
                  }}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: COLORS.PRIMARY,
                    '&:hover': {
                      backgroundColor: 'white',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <Info />
                </IconButton>
                {showAddButton && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddDialogOpen(true);
                    }}
                    sx={{
                      backgroundColor: COLORS.ACCENT,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: COLORS.ACCENT_HOVER,
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <Add />
                  </IconButton>
                )}
              </Box>
            </Fade>
          )}

          {/* Rating Badge */}
          {userRating && (
            <Box
              sx={{
                position: 'absolute',
                top: theme.customSpacing.sm,
                right: theme.customSpacing.sm,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderRadius: theme.customSpacing.sm,
                px: theme.customSpacing.sm,
                py: theme.customSpacing.xs,
                display: 'flex',
                alignItems: 'center',
                gap: theme.customSpacing.xs,
              }}
            >
              <Star sx={{ fontSize: '1rem', color: COLORS.WARNING }} />
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                {userRating}
              </Typography>
            </Box>
          )}
        </Box>

        <CardContent 
          sx={{ 
            pb: 1,
            px: { xs: theme.customSpacing.md, sm: theme.customSpacing.md },
            pt: theme.customSpacing.md,
          }}
        >
          <Typography
            variant={variant === 'compact' ? 'subtitle1' : 'h6'}
            component="div"
            sx={{
              fontWeight: 'bold',
              mb: theme.customSpacing.sm,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: COLORS.TEXT_PRIMARY,
              fontSize: {
                xs: variant === 'compact' ? '1rem' : '1.125rem',
                sm: variant === 'compact' ? '1rem' : '1.25rem',
              },
            }}
          >
            {media.title}
          </Typography>

          {variant !== 'compact' && (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                mb: theme.customSpacing.md,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: variant === 'detailed' ? 4 : 3,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.4,
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              {media.description}
            </Typography>
          )}

          <Box sx={{ mb: theme.customSpacing.md }}>
            <Chip
              label={media.type}
              size="small"
              sx={{
                backgroundColor: COLORS.ACCENT,
                color: 'white',
                mr: theme.customSpacing.sm,
                mb: theme.customSpacing.sm,
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
            {media.genres.slice(0, variant === 'detailed' ? 3 : 2).map((genre, index) => (
              <Chip
                key={index}
                label={genre}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: COLORS.BORDER,
                  color: COLORS.TEXT_SECONDARY,
                  mr: theme.customSpacing.sm,
                  mb: theme.customSpacing.sm,
                  fontSize: '0.7rem',
                  '&:hover': {
                    borderColor: COLORS.ACCENT,
                    color: COLORS.ACCENT,
                  },
                }}
              />
            ))}
          </Box>

          {userStatus && (
            <Box sx={{ mb: theme.customSpacing.sm }}>
              <Chip
                label={getStatusLabel(userStatus)}
                size="small"
                sx={{
                  backgroundColor: getStatusColor(userStatus),
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            </Box>
          )}
        </CardContent>

        {/* Mobile Actions - Always visible on mobile */}
        {(isMobile || !showQuickActions) && (
          <CardActions 
            sx={{ 
              justifyContent: 'space-between', 
              px: { xs: theme.customSpacing.md, sm: theme.customSpacing.md },
              pb: theme.customSpacing.md,
              pt: 0,
            }}
          >
            <Button
              size="small"
              startIcon={<Info />}
              onClick={() => setDetailsOpen(true)}
              sx={{
                ...getTouchTargetStyles(),
                color: COLORS.ACCENT,
                textTransform: 'none',
                fontWeight: 500,
                transition: createTransition(['color', 'background-color'], theme.customAnimations.duration.shorter),
                '&:hover': {
                  backgroundColor: COLORS.ACCENT_BACKGROUND,
                  color: COLORS.ACCENT_LIGHT,
                },
              }}
            >
              Details
            </Button>

            {showAddButton && (
              <Button
                size="small"
                startIcon={<Add />}
                variant="contained"
                onClick={() => setAddDialogOpen(true)}
                sx={{
                  ...getTouchTargetStyles(),
                  backgroundColor: COLORS.ACCENT,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: theme.customShadows.button,
                  transition: createTransition(
                    ['background-color', 'transform', 'box-shadow'], 
                    theme.customAnimations.duration.shorter
                  ),
                  '&:hover': {
                    backgroundColor: COLORS.ACCENT_HOVER,
                    transform: 'translateY(-1px)',
                    boxShadow: theme.customShadows.buttonHover,
                  },
                }}
              >
                Add
              </Button>
            )}
          </CardActions>
        )}
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
            borderRadius: isMobile ? 0 : theme.customSpacing.md,
            margin: isMobile ? 0 : theme.customSpacing.lg,
          },
        }}
      >
        <DialogTitle 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pb: theme.customSpacing.md,
            borderBottom: `1px solid ${COLORS.BORDER}`,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
            {media.title}
          </Typography>
          <IconButton 
            onClick={() => setDetailsOpen(false)}
            sx={{
              ...getTouchTargetStyles(),
              color: COLORS.TEXT_SECONDARY,
              '&:hover': {
                backgroundColor: COLORS.HOVER,
                color: COLORS.TEXT_PRIMARY,
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: theme.customSpacing.lg }}>
          <Box 
            sx={{ 
              display: 'flex', 
              gap: { xs: theme.customSpacing.md, sm: theme.customSpacing.xl },
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box sx={{ flexShrink: 0, alignSelf: { xs: 'center', sm: 'flex-start' } }}>
              <img
                src={imageError ? getDefaultMediaImage(media.type) : media.image}
                alt={media.title}
                onError={() => setImageError(true)}
                style={{ 
                  width: isMobile ? 200 : 250, 
                  height: isMobile ? 300 : 375, 
                  objectFit: 'cover', 
                  borderRadius: theme.customSpacing.sm 
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: theme.customSpacing.lg,
                  lineHeight: 1.6,
                  color: COLORS.TEXT_PRIMARY,
                }}
              >
                {media.description}
              </Typography>
              <Box sx={{ mb: theme.customSpacing.lg }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: theme.customSpacing.md,
                    fontWeight: 600,
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  Genres:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: theme.customSpacing.sm }}>
                  {media.genres.map((genre, index) => (
                    <Chip
                      key={index}
                      label={genre}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: COLORS.BORDER,
                        color: COLORS.TEXT_SECONDARY,
                        '&:hover': {
                          borderColor: COLORS.ACCENT,
                          color: COLORS.ACCENT,
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
              <Typography 
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: COLORS.TEXT_PRIMARY,
                }}
              >
                Type: {media.type}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Add to Library Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: isMobile ? 0 : theme.customSpacing.md,
            margin: isMobile ? 0 : theme.customSpacing.lg,
          },
        }}
      >
        <DialogTitle 
          sx={{
            borderBottom: `1px solid ${COLORS.BORDER}`,
            pb: theme.customSpacing.md,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
            Add to Your Library
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: theme.customSpacing.lg }}>
          <Box>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: theme.customSpacing.lg,
                fontWeight: 600,
                color: COLORS.TEXT_PRIMARY,
              }}
            >
              {media.title}
            </Typography>

            <Box sx={{ mb: theme.customSpacing.xl }}>
              <Typography 
                component="legend" 
                sx={{ 
                  mb: theme.customSpacing.md,
                  fontWeight: 500,
                  color: COLORS.TEXT_PRIMARY,
                }}
              >
                Rating (Optional)
              </Typography>
              <Rating
                value={rating}
                onChange={(_, newValue) => setRating(newValue || 0)}
                size="large"
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: COLORS.WARNING,
                  },
                  '& .MuiRating-iconHover': {
                    color: COLORS.WARNING,
                  },
                }}
              />
            </Box>

            <FormControl 
              fullWidth 
              sx={{ 
                mb: theme.customSpacing.xl,
                '& .MuiOutlinedInput-root': {
                  borderRadius: theme.customSpacing.sm,
                },
              }}
            >
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="WATCHING">Watching</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="PLAN_TO_WATCH">Plan to Watch</MenuItem>
                <MenuItem value="DROPPED">Dropped</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Review (Optional)"
              multiline
              rows={isMobile ? 4 : 3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about this..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: theme.customSpacing.sm,
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions 
          sx={{ 
            p: theme.customSpacing.lg,
            borderTop: `1px solid ${COLORS.BORDER}`,
            gap: theme.customSpacing.md,
          }}
        >
          <Button 
            onClick={() => setAddDialogOpen(false)}
            sx={{
              ...getTouchTargetStyles(),
              color: COLORS.TEXT_SECONDARY,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: COLORS.HOVER,
                color: COLORS.TEXT_PRIMARY,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddToLibrary}
            variant="contained"
            sx={{
              ...getTouchTargetStyles(),
              backgroundColor: COLORS.ACCENT,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: theme.customShadows.button,
              '&:hover': {
                backgroundColor: COLORS.ACCENT_HOVER,
                boxShadow: theme.customShadows.buttonHover,
              },
            }}
          >
            Add to Library
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MediaCard;