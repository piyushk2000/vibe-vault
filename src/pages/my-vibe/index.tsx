import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import EditableMediaCard from '../../components/cards/EditableMediaCard';
import { COLORS } from '../../theme/colors';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

interface UserMedia {
  id: number;
  userId: number;
  mediaId: number;
  type: 'ANIME' | 'MOVIE' | 'SHOW';
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
    type: 'ANIME' | 'MOVIE' | 'SHOW';
    meta: any;
  };
}

const MyVibe: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [userMedia, setUserMedia] = useState<UserMedia[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<UserMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchUserMedia();
  }, [token]);

  useEffect(() => {
    filterMedia();
  }, [currentTab, statusFilter, userMedia]);

  const fetchUserMedia = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/myMedia`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUserMedia(response.data.data);
      }
    } catch (error) {
      setError('Failed to fetch your library');
      console.error('Failed to fetch user media:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterMedia = () => {
    let filtered = userMedia;

    // Filter by media type based on current tab
    switch (currentTab) {
      case 0:
        // All media
        break;
      case 1:
        filtered = filtered.filter(item => item.type === 'ANIME');
        break;
      case 2:
        filtered = filtered.filter(item => item.type === 'MOVIE');
        break;
      case 3:
        filtered = filtered.filter(item => item.type === 'SHOW');
        break;
    }

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredMedia(filtered);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getTabLabel = (index: number) => {
    const counts = {
      all: userMedia.length,
      anime: userMedia.filter(item => item.type === 'ANIME').length,
      movies: userMedia.filter(item => item.type === 'MOVIE').length,
      shows: userMedia.filter(item => item.type === 'SHOW').length,
    };

    switch (index) {
      case 0:
        return `All (${counts.all})`;
      case 1:
        return `Anime (${counts.anime})`;
      case 2:
        return `Movies (${counts.movies})`;
      case 3:
        return `Shows (${counts.shows})`;
      default:
        return '';
    }
  };

  const getStatusStats = () => {
    const stats = {
      WATCHING: userMedia.filter(item => item.status === 'WATCHING').length,
      COMPLETED: userMedia.filter(item => item.status === 'COMPLETED').length,
      PLAN_TO_WATCH: userMedia.filter(item => item.status === 'PLAN_TO_WATCH').length,
      DROPPED: userMedia.filter(item => item.status === 'DROPPED').length,
    };
    return stats;
  };

  const getAverageRating = () => {
    if (userMedia.length === 0) return 0;
    const totalRating = userMedia.reduce((sum, item) => sum + item.rating, 0);
    return (totalRating / userMedia.length).toFixed(1);
  };

  const handleUpdateMedia = async (mediaData: {
    id: number;
    rating: number;
    status: string;
    review?: string;
  }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/myMedia/${mediaData.id}`,
        {
          rating: mediaData.rating,
          status: mediaData.status,
          review: mediaData.review,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Update the local state
        setUserMedia(prevMedia =>
          prevMedia.map(item =>
            item.id === mediaData.id
              ? {
                  ...item,
                  rating: mediaData.rating,
                  status: mediaData.status as any,
                  review: mediaData.review,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Failed to update media:', error);
      setError('Failed to update media');
    }
  };

  const handleDeleteMedia = async (id: number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/myMedia/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Remove from local state
        setUserMedia(prevMedia => prevMedia.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete media:', error);
      setError('Failed to remove media from library');
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            background: `linear-gradient(45deg, ${COLORS.ACCENT} 30%, ${COLORS.ACCENT_LIGHT} 90%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          My Vibe
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Your personal collection of rated anime, movies, and shows
        </Typography>
      </Box>

      {/* Stats */}
      {!isLoading && userMedia.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: COLORS.CARD_BACKGROUND,
                  borderRadius: 2,
                  border: `1px solid ${COLORS.BORDER}`,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: COLORS.ACCENT }}>
                  {userMedia.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Items
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: COLORS.CARD_BACKGROUND,
                  borderRadius: 2,
                  border: `1px solid ${COLORS.BORDER}`,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: COLORS.SUCCESS }}>
                  {getStatusStats().COMPLETED}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Completed
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: COLORS.CARD_BACKGROUND,
                  borderRadius: 2,
                  border: `1px solid ${COLORS.BORDER}`,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: COLORS.WARNING }}>
                  {getStatusStats().WATCHING}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Watching
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: COLORS.CARD_BACKGROUND,
                  borderRadius: 2,
                  border: `1px solid ${COLORS.BORDER}`,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: COLORS.ACCENT }}>
                  {getAverageRating()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Avg Rating
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: COLORS.ACCENT,
            },
            '& .MuiTab-root': {
              color: COLORS.TAB_INACTIVE,
              '&.Mui-selected': {
                color: COLORS.TAB,
              },
            },
          }}
        >
          <Tab label={getTabLabel(0)} />
          <Tab label={getTabLabel(1)} />
          <Tab label={getTabLabel(2)} />
          <Tab label={getTabLabel(3)} />
        </Tabs>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="ALL">All Status</MenuItem>
            <MenuItem value="WATCHING">Watching</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="PLAN_TO_WATCH">Plan to Watch</MenuItem>
            <MenuItem value="DROPPED">Dropped</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: COLORS.ACCENT }} />
        </Box>
      )}

      {/* Media Grid */}
      {!isLoading && (
        <Grid container spacing={3}>
          {filteredMedia.length > 0 ? (
            filteredMedia.map((userMediaItem) => (
              <Grid item key={userMediaItem.id} xs={12} sm={6} md={4} lg={3}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <EditableMediaCard
                    userMedia={userMediaItem}
                    onUpdate={handleUpdateMedia}
                    onDelete={handleDeleteMedia}
                  />
                </Box>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="textSecondary">
                  {userMedia.length === 0 
                    ? "You haven't added any media to your library yet"
                    : "No media matches your current filters"
                  }
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {userMedia.length === 0 
                    ? "Start exploring and rating your favorite anime, movies, and shows!"
                    : "Try adjusting your filters to see more content"
                  }
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default MyVibe;