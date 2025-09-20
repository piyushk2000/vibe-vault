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
} from '@mui/material';
import { Add, Info, Close } from '@mui/icons-material';
import { COLORS } from '../../theme/colors';
import { getDefaultMediaImage } from '../../utils/defaultImages';

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
}

const MediaCard: React.FC<MediaCardProps> = ({
  media,
  onAddToLibrary,
  showAddButton = true,
  userRating,
  userStatus,
  userReview,
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [rating, setRating] = useState<number>(userRating || 0);
  const [status, setStatus] = useState(userStatus || 'PLAN_TO_WATCH');
  const [review, setReview] = useState(userReview || '');
  const [imageError, setImageError] = useState(false);

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

  return (
    <>
      <Card
        sx={{
          width: 280,
          backgroundColor: COLORS.CARD_BACKGROUND,
          border: `1px solid ${COLORS.CARD_BORDER}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: COLORS.CARD_HOVER,
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 25px ${COLORS.OVERLAY_DARK}`,
          },
        }}
      >
        <CardMedia
          component="img"
          height="400"
          image={imageError ? getDefaultMediaImage(media.type) : media.image}
          alt={media.title}
          onError={() => setImageError(true)}
          sx={{
            objectFit: 'cover',
          }}
        />

        <CardContent sx={{ pb: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {media.title}
          </Typography>

          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {media.description}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Chip
              label={media.type}
              size="small"
              sx={{
                backgroundColor: COLORS.ACCENT,
                color: 'white',
                mr: 1,
                mb: 1,
              }}
            />
            {media.genres.slice(0, 2).map((genre, index) => (
              <Chip
                key={index}
                label={genre}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: COLORS.BORDER,
                  color: COLORS.TEXT_SECONDARY,
                  mr: 1,
                  mb: 1,
                }}
              />
            ))}
          </Box>

          {userRating && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating value={userRating} readOnly size="small" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({userRating}/5)
              </Typography>
            </Box>
          )}

          {userStatus && (
            <Chip
              label={getStatusLabel(userStatus)}
              size="small"
              sx={{
                backgroundColor: getStatusColor(userStatus),
                color: 'white',
              }}
            />
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Button
            size="small"
            startIcon={<Info />}
            onClick={() => setDetailsOpen(true)}
            sx={{ color: COLORS.ACCENT }}
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
                backgroundColor: COLORS.ACCENT,
                '&:hover': {
                  backgroundColor: COLORS.ACCENT_HOVER,
                },
              }}
            >
              Add
            </Button>
          )}
        </CardActions>
      </Card>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {media.title}
          <IconButton onClick={() => setDetailsOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flexShrink: 0 }}>
              <img
                src={imageError ? getDefaultMediaImage(media.type) : media.image}
                alt={media.title}
                onError={() => setImageError(true)}
                style={{ width: 200, height: 300, objectFit: 'cover', borderRadius: 8 }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {media.description}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Genres:
                </Typography>
                {media.genres.map((genre, index) => (
                  <Chip
                    key={index}
                    label={genre}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
              <Typography variant="subtitle2">
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
      >
        <DialogTitle>Add to Your Library</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {media.title}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography component="legend" sx={{ mb: 1 }}>
                Rating (Optional)
              </Typography>
              <Rating
                value={rating}
                onChange={(_, newValue) => setRating(newValue || 0)}
                size="large"
              />
            </Box>

            <FormControl fullWidth sx={{ mb: 3 }}>
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
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about this..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddToLibrary}
            variant="contained"
            disabled={false}
            sx={{
              backgroundColor: COLORS.ACCENT,
              '&:hover': {
                backgroundColor: COLORS.ACCENT_HOVER,
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