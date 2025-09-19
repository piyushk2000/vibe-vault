import { Dialog, DialogContent, DialogActions, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Slider } from '@mui/material';
import { COLORS } from '../../theme/colors';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../redux/loadingSlice';
import { post, put } from '../../services/api';

interface DetailDialogProps {
  open: boolean;
  onClose: () => void;
  item: any;
  imageUrl: string;
  discription?: string;
  existingUserMedia?: any; // For editing existing entries
}

const DetailDialog = ({ open, onClose, item, imageUrl, discription, existingUserMedia }: DetailDialogProps) => {
  const [status, setStatus] = useState<string>('PLAN_TO_WATCH');
  const [rating, setRating] = useState<number | null>(null);
  const [progress, setProgress] = useState<number | null>(0);
  const [totalEpisodes, setTotalEpisodes] = useState<number | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  
  const dispatch = useDispatch();
  
  // Determine media type based on item properties
  const getMediaType = () => {
    if (item.media_type === 'movie' || item.title) {
      return 'MOVIE';
    } else if (item.media_type === 'tv' || item.name) {
      return 'SHOW';
    } else {
      return 'ANIME';
    }
  };

  // Set initial values if we're editing an existing userMedia entry
  useEffect(() => {
    if (existingUserMedia) {
      setStatus(existingUserMedia.status);
      setRating(existingUserMedia.rating);
      setProgress(existingUserMedia.progress);
    }
    
    // Get total episodes for anime or seasons for shows if available
    if (item.episodes) {
      setTotalEpisodes(item.episodes);
    } else if (item.number_of_episodes) {
      setTotalEpisodes(item.number_of_episodes);
    } else if (item.data?.episodes) {
      setTotalEpisodes(item.data.episodes);
    }
  }, [existingUserMedia, item]);

  const handleStatusChange = (event: any) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    
    // If status is COMPLETED, set progress to total episodes
    if (newStatus === 'COMPLETED' && totalEpisodes) {
      setProgress(totalEpisodes);
    }
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (Number(value) > 10) {
      setRating(10);
    } else {
      setRating(value === '' ? null : Number(value));
    }
  };

  const handleProgressChange = (_: Event, newValue: number | number[]) => {
    setProgress(newValue as number);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const saveMedia = async () => {
    dispatch(setLoading(true));
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showAlert('You must be logged in to add media to your collection', 'error');
        return;
      }

      const mediaType = getMediaType();
      const title = item.title || item.name;
      
      // Prepare media data
      const mediaData = {
        apiId: item.id || item.mal_id,
        title: title,
        description: discription || item.overview || item.synopsis || '',
        genres: item.genres ? item.genres.map((g: any) => g.name) : [],
        image: mediaType === 'ANIME' ? imageUrl.replace('https://shikimori.one', '') : item.poster_path,
        type: mediaType,
        meta: item,
        totalEpisodes: totalEpisodes || null,
      };

      // If we're updating an existing entry
      if (existingUserMedia) {
        await put(`myMedia/${existingUserMedia.id}`, {
          status,
          rating,
          progress,
          type: mediaType
        });
        
        showAlert('Media updated successfully!', 'success');
      } 
      // If we're adding a new entry
      else {
        await post('myMedia', {
          mediaData,
          status,
          rating,
          progress
        });
        
        showAlert('Media added to your collection!', 'success');
      }
    } catch (error) {
      console.error('Error saving media:', error);
      showAlert('Error saving media. Please try again.', 'error');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ backgroundColor: COLORS.DIALOG_BACKGROUND }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ flex: '0 0 auto', marginRight: 2 }}>
              <img
                src={imageUrl}
                alt={item.title || item.name}
                style={{ width: '100%', maxWidth: 300, borderRadius: 8 }}
              />
            </Box>
            <Box sx={{ flex: '1 1 auto', color: COLORS.DIALOG_TEXT }}>
              <Typography variant="h5" sx={{ color: COLORS.DIALOG_TITLE, marginBottom: 1 }}>
                {item.title || item.name}
              </Typography>
              {item.tagline && (
                <Typography variant="subtitle1" sx={{ fontStyle: 'italic', marginBottom: 2 }}>
                  {item.tagline}
                </Typography>
              )}
              {item.genres && (
                <Typography variant="body2" gutterBottom>
                  <strong>Genres:</strong> {item.genres.map((genre: any) => genre.name).join(', ')}
                </Typography>
              )}
              <Typography variant="body1" gutterBottom>
                {discription || item.overview || item.description}
              </Typography>

              {/* Status Dropdown */}
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label" sx={{ color: COLORS.TEXT_PRIMARY }}>Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={status}
                  onChange={handleStatusChange}
                  label="Status"
                  sx={{
                    color: COLORS.TEXT_PRIMARY,
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.BORDER,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.ACCENT,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.ACCENT,
                    },
                  }}
                >
                  <MenuItem value="PLAN_TO_WATCH">Plan to Watch</MenuItem>
                  <MenuItem value="WATCHING">Watching</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="DROPPED">Dropped</MenuItem>
                </Select>
              </FormControl>

              {/* Rating Input */}
              <TextField
                fullWidth
                margin="normal"
                label="Rating (0-10)"
                type="number"
                value={rating === null ? '' : rating}
                onChange={handleRatingChange}
                inputProps={{ min: 0, max: 10, step: 0.5 }}
                sx={{
                  color: COLORS.TEXT_PRIMARY,
                  '.MuiInputLabel-root': { color: COLORS.TEXT_SECONDARY },
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.BORDER,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.ACCENT,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.ACCENT,
                  },
                }}
              />

              {/* Progress Slider (only show for WATCHING status) */}
              {status === 'WATCHING' && totalEpisodes && (
                <Box sx={{ mt: 2 }}>
                  <Typography id="progress-slider" gutterBottom sx={{ color: COLORS.TEXT_PRIMARY }}>
                    Progress: {progress} / {totalEpisodes} {getMediaType() === 'ANIME' ? 'episodes' : 'episodes'}
                  </Typography>
                  <Slider
                    value={progress || 0}
                    onChange={handleProgressChange}
                    aria-labelledby="progress-slider"
                    min={0}
                    max={totalEpisodes}
                    sx={{
                      color: COLORS.ACCENT,
                      '& .MuiSlider-thumb': {
                        backgroundColor: COLORS.ACCENT,
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: COLORS.ACCENT,
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: COLORS.DIALOG_BACKGROUND, justifyContent: 'space-between', px: 3 }}>
          <Button 
            onClick={saveMedia} 
            variant="contained" 
            sx={{ 
              backgroundColor: COLORS.ACCENT,
              '&:hover': {
                backgroundColor: COLORS.ACCENT_HOVER,
              }
            }}
          >
            {existingUserMedia ? 'Update' : 'Add to Collection'}
          </Button>
          <Button onClick={onClose} sx={{ color: COLORS.TEXT_PRIMARY }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DetailDialog;
