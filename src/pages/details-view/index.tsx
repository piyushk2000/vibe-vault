import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, useTheme } from '@mui/material';
import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { COLORS } from '../../theme/colors';

interface DetailDialogProps {
  open: boolean;
  onClose: () => void;
  item: any;
  imageUrl: string; // Accept imageUrl as a prop
}

const DetailDialog = ({ open, onClose, item, imageUrl }: DetailDialogProps) => {
  const [status, setStatus] = useState('');
  const [score, setScore] = useState<number | ''>('');
  const [shortlisted, setShortlisted] = useState(false);

  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatus(event.target.value as string);
  };

  const handleScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScore(Number(event.target.value));
  };

  const handleShortlistedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShortlisted(event.target.checked);
  };

  const theme = useTheme();

  return (
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
              {item.overview || item.description}
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
                <MenuItem value="Plan to Watch">Plan to Watch</MenuItem>
                <MenuItem value="Watching">Watching</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>

            {/* Score Input */}
            <TextField
              fullWidth
              margin="normal"
              label="Score"
              type="number"
              value={score}
              onChange={handleScoreChange}
              inputProps={{ min: 0, max: 10 }}
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

            {/* Shortlisted Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={shortlisted}
                  onChange={handleShortlistedChange}
                  sx={{
                    color: COLORS.TEXT_PRIMARY,
                    '&.Mui-checked': {
                      color: COLORS.ACCENT,
                    },
                  }}
                />
              }
              label="Shortlisted"
              sx={{ color: COLORS.TEXT_PRIMARY }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: COLORS.DIALOG_BACKGROUND }}>
        <Button onClick={onClose} sx={{ color: COLORS.ACCENT }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailDialog;
