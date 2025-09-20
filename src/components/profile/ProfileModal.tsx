import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  Box,
  Typography,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import { PhotoCamera, Close, Add, Delete, LocationOn, Psychology } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { updateProfile, updateUser } from '../../redux/profileSlice';
import { COLORS } from '../../theme/colors';

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  const { profile, isLoading } = useSelector((state: RootState) => state.profile);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [mbtiType, setMbtiType] = useState<string>('');
  const [loadingLocations, setLoadingLocations] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);

  const mbtiTypes = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];

  useEffect(() => {
    if (profile) {
      setName(profile.User.name || '');
      setBio(profile.bio || '');
      setInterests(profile.interests || []);
      setAvatar(profile.avatar);
      setPhotos(profile.photos || []);
      setLocation(profile.location || '');
      setMbtiType(profile.mbtiType || '');
    }
  }, [profile]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handlePhotosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: string[] = [];
      const remainingSlots = 10 - photos.length;
      const filesToProcess = Math.min(files.length, remainingSlots);

      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          newPhotos.push(e.target?.result as string);
          if (newPhotos.length === filesToProcess) {
            setPhotos([...photos, ...newPhotos]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setLocationOptions([]);
      return;
    }

    setLoadingLocations(true);
    try {
      // Mock location data for now since GeoNames API requires setup
      const mockLocations = [
        { displayName: 'New York, NY, USA', latitude: 40.7128, longitude: -74.0060 },
        { displayName: 'Los Angeles, CA, USA', latitude: 34.0522, longitude: -118.2437 },
        { displayName: 'London, UK', latitude: 51.5074, longitude: -0.1278 },
        { displayName: 'Tokyo, Japan', latitude: 35.6762, longitude: 139.6503 },
        { displayName: 'Paris, France', latitude: 48.8566, longitude: 2.3522 },
        { displayName: 'Mumbai, India', latitude: 19.0760, longitude: 72.8777 },
        { displayName: 'Delhi, India', latitude: 28.7041, longitude: 77.1025 },
        { displayName: 'Bangalore, India', latitude: 12.9716, longitude: 77.5946 },
      ].filter(location =>
        location.displayName.toLowerCase().includes(query.toLowerCase())
      );

      setLocationOptions(mockLocations);
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
    setLocation(location?.displayName || '');
  };

  const handleSave = async () => {
    try {
      // Update user name if changed
      if (name !== profile?.User.name) {
        await dispatch(updateUser({ name }));
      }

      // Update profile
      await dispatch(updateProfile({
        bio,
        interests,
        avatar: avatar !== profile?.avatar ? avatar || undefined : undefined,
        photos: photos.length !== profile?.photos?.length || photos.some((photo, i) => photo !== profile?.photos?.[i]) ? photos : undefined,
        location: selectedLocation?.displayName || location || undefined,
        latitude: selectedLocation?.latitude || undefined,
        longitude: selectedLocation?.longitude || undefined,
        mbtiType: mbtiType || undefined
      }));

      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
        <Typography variant="h6">Edit Profile</Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        {/* Avatar Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Avatar
              src={avatar || undefined}
              sx={{
                width: 120,
                height: 120,
                backgroundColor: COLORS.ACCENT,
                fontSize: '2rem',
              }}
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: COLORS.ACCENT,
                color: 'white',
                '&:hover': {
                  backgroundColor: COLORS.ACCENT_HOVER,
                },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <PhotoCamera />
            </IconButton>
          </Box>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <input
            type="file"
            ref={photosInputRef}
            onChange={handlePhotosChange}
            accept="image/*"
            multiple
            style={{ display: 'none' }}
          />
        </Box>
        {/* Name Field */}
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* Bio Field */}
        <TextField
          fullWidth
          label="Bio"
          multiline
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell others about yourself..."
          sx={{ mb: 3 }}
        />

        {/* Location Field */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn fontSize="small" />
            Location
          </Typography>
          <Autocomplete
            options={locationOptions}
            getOptionLabel={(option) => option.displayName || ''}
            loading={loadingLocations}
            onInputChange={(_, newInputValue) => {
              setLocation(newInputValue);
              searchLocations(newInputValue);
            }}
            onChange={(_, newValue) => handleLocationSelect(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search for your city..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingLocations ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Box>

        {/* MBTI Type */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Psychology fontSize="small" />
            MBTI Personality Type
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Select your MBTI type</InputLabel>
            <Select
              value={mbtiType}
              label="Select your MBTI type"
              onChange={(e) => setMbtiType(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {mbtiTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Additional Photos */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhotoCamera fontSize="small" />
            Additional Photos ({photos.length}/10)
          </Typography>

          {photos.length < 10 && (
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => photosInputRef.current?.click()}
              sx={{ mb: 2 }}
            >
              Add Photos
            </Button>
          )}

          {photos.length > 0 && (
            <ImageList sx={{ width: '100%', height: 200 }} cols={3} rowHeight={120}>
              {photos.map((photo, index) => (
                <ImageListItem key={index}>
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    loading="lazy"
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                  <ImageListItemBar
                    actionIcon={
                      <IconButton
                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                        onClick={() => handleRemovePhoto(index)}
                      >
                        <Delete />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </Box>

        {/* Interests Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Interests
          </Typography>

          {/* Add Interest */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              size="small"
              placeholder="Add an interest"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
              sx={{ flex: 1 }}
            />
            <Button
              variant="outlined"
              onClick={handleAddInterest}
              startIcon={<Add />}
              disabled={!newInterest.trim()}
            >
              Add
            </Button>
          </Box>

          {/* Interest Chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {interests.map((interest, index) => (
              <Chip
                key={index}
                label={interest}
                onDelete={() => handleRemoveInterest(interest)}
                sx={{
                  backgroundColor: COLORS.ACCENT,
                  color: 'white',
                  '& .MuiChip-deleteIcon': {
                    color: 'white',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isLoading}
          sx={{
            backgroundColor: COLORS.ACCENT,
            '&:hover': {
              backgroundColor: COLORS.ACCENT_HOVER,
            },
          }}
        >
          {isLoading ? <CircularProgress size={20} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileModal;