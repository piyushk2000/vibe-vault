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
import { Edit, Delete, Close } from '@mui/icons-material';
import { COLORS } from '../../theme/colors';
import { getDefaultMediaImage } from '../../utils/defaultImages';

interface UserMedia {
  id: number;
  userId: number;
  mediaId: number;
  type: 'ANIME' | 'MOVIE' | 'SHOW' | 'BOOK';
  status: 'WATCHING' | 'COMPLETED' | 'PLAN_TO_WATCH' | 'DROPPED';
  rating: number;
  review?: string;
  progress?: number;
  createdAt: string;
  updatedAt: string;
  media: {
    id: number;
    apiId: number;
    title: string;
    description: string;
    genres: string[];
    image: string;
    type: 'ANIME' | 'MOVIE' | 'SHOW' | 'BOOK';
    meta: any;
  };
}

interface EditableMediaCardProps {
  userMedia: UserMedia;
  onUpdate?: (mediaData: {
    id: number;
    rating: number;
    status: string;
    review?: string;
  }) => void;
  onDelete?: (id: number) => void;
}

const EditableMediaCard: React.FC<EditableMediaCardProps> = ({
  userMedia,
  onUpdate,
  onDelete,
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rating, setRating] = useState<number>(userMedia.rating || 0);
  const [status, setStatus] = useState(userMedia.status);
  const [review, setReview] = useState(userMedia.review || '');
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate({
        id: userMedia.id,
        rating,
        status,
        review: review.trim() || undefined,
      });
      setEditDialogOpen(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(userMedia.id);
      setDeleteDialogOpen(false);
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
        return userMedia.type === 'BOOK' ? 'Reading' : 'Watching';
      case 'COMPLETED':
        return 'Completed';
      case 'PLAN_TO_WATCH':
        return userMedia.type === 'BOOK' ? 'Plan to Read' : 'Plan to Watch';
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
          height: 'auto',
          backgroundColor: COLORS.CARD_BACKGROUND,
          border: `1px solid ${COLORS.CARD_BORDER}`,
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: COLORS.CARD_HOVER,
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 32px ${COLORS.OVERLAY_DARK}`,
          },
        }}
        onClick={handleCardClick}
      >
        <CardMedia
          component="img"
          height="400"
          image={imageError ? getDefaultMediaImage(userMedia.media.type) : userMedia.media.image}
          alt={userMedia.media.title}
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
            {userMedia.media.title}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Chip
              label={userMedia.media.type}
              size="small"
              sx={{
                backgroundColor: userMedia.media.type === 'BOOK' ? '#8B4513' : COLORS.ACCENT,
                color: 'white',
                mr: 1,
                mb: 1,
              }}
            />
            <Chip
              label={getStatusLabel(userMedia.status)}
              size="small"
              sx={{
                backgroundColor: getStatusColor(userMedia.status),
                color: 'white',
                mb: 1,
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Rating:
            </Typography>
            <Rating
              value={userMedia.rating}
              readOnly
              size="small"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: COLORS.ACCENT,
                },
              }}
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({userMedia.rating}/5)
            </Typography>
          </Box>



          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {userMedia.review || userMedia.media.description}
          </Typography>
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Button
            size="small"
            startIcon={<Edit />}
            onClick={(e) => {
              e.stopPropagation();
              setEditDialogOpen(true);
            }}
            sx={{ color: COLORS.ACCENT }}
          >
            Edit
          </Button>
          <Button
            size="small"
            startIcon={<Delete />}
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDialogOpen(true);
            }}
            sx={{ color: COLORS.ERROR }}
          >
            Remove
          </Button>
        </CardActions>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: COLORS.CARD_BACKGROUND,
            border: `1px solid ${COLORS.BORDER}`,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Edit {userMedia.media.title}
          <IconButton onClick={() => setEditDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            <Box sx={{ flexShrink: 0 }}>
              <img
                src={imageError ? getDefaultMediaImage(userMedia.media.type) : userMedia.media.image}
                alt={userMedia.media.title}
                onError={() => setImageError(true)}
                style={{ width: 150, height: 200, objectFit: 'cover', borderRadius: 8 }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {userMedia.media.description}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {userMedia.media.genres.map((genre, index) => (
                  <Chip
                    key={index}
                    label={genre}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: COLORS.BORDER }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <MenuItem value="WATCHING">
                  {userMedia.media.type === 'BOOK' ? 'Reading' : 'Watching'}
                </MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="PLAN_TO_WATCH">
                  {userMedia.media.type === 'BOOK' ? 'Plan to Read' : 'Plan to Watch'}
                </MenuItem>
                <MenuItem value="DROPPED">Dropped</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Typography component="legend" sx={{ mb: 1 }}>
                Rating
              </Typography>
              <Rating
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue || 0);
                }}
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: COLORS.ACCENT,
                  },
                }}
              />
            </Box>



            <TextField
              label="Review (Optional)"
              multiline
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              fullWidth
              placeholder="Share your thoughts about this..."
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate}
            variant="contained"
            sx={{
              backgroundColor: COLORS.ACCENT,
              '&:hover': {
                backgroundColor: COLORS.ACCENT_HOVER,
              },
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: COLORS.CARD_BACKGROUND,
            border: `1px solid ${COLORS.BORDER}`,
          },
        }}
      >
        <DialogTitle>Remove from Library</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove "{userMedia.media.title}" from your library?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete}
            color="error"
            variant="contained"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditableMediaCard;