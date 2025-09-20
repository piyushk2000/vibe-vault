import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  LinearProgress,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import { Person, Favorite, Movie, Tv, Animation } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { COLORS } from '../../theme/colors';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

interface Match {
  id: number;
  userId: number;
  matchedUserId: number;
  matchPercentage: number;
  commonMediaIds: number[];
  createdAt: string;
  updatedAt: string;
  matchedUser: {
    id: number;
    name: string;
    email: string;
  };
}

interface CommonMedia {
  id: number;
  title: string;
  image: string;
  type: 'ANIME' | 'MOVIE' | 'SHOW';
  userRating: number;
  matchRating: number;
}

const MatchPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [commonMedia, setCommonMedia] = useState<CommonMedia[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchMatches();
  }, [token]);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/matches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setMatches(response.data.data);
      }
    } catch (error) {
      setError('Failed to fetch matches');
      console.error('Failed to fetch matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommonMedia = async (matchId: number) => {
    try {
      setDetailsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/matches/${matchId}/common-media`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setCommonMedia(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch common media:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleViewDetails = (match: Match) => {
    setSelectedMatch(match);
    fetchCommonMedia(match.id);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return COLORS.SUCCESS;
    if (percentage >= 60) return COLORS.WARNING;
    if (percentage >= 40) return COLORS.ACCENT;
    return COLORS.ERROR;
  };

  const getMatchLabel = (percentage: number) => {
    if (percentage >= 80) return 'Perfect Match';
    if (percentage >= 60) return 'Great Match';
    if (percentage >= 40) return 'Good Match';
    return 'Potential Match';
  };

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'ANIME':
        return <Animation />;
      case 'MOVIE':
        return <Movie />;
      case 'SHOW':
        return <Tv />;
      default:
        return <Movie />;
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
          Your Matches
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Find people with similar taste in anime, movies, and shows
        </Typography>
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: COLORS.ACCENT }} />
        </Box>
      )}

      {/* Matches Grid */}
      {!isLoading && (
        <Grid container spacing={3}>
          {matches.length > 0 ? (
            matches.map((match) => (
              <Grid item key={match.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    backgroundColor: COLORS.CARD_BACKGROUND,
                    border: `1px solid ${COLORS.CARD_BORDER}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: COLORS.CARD_HOVER,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 20px ${COLORS.OVERLAY_DARK}`,
                    },
                  }}
                >
                  <CardContent>
                    {/* User Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          backgroundColor: COLORS.ACCENT,
                          mr: 2,
                        }}
                      >
                        {match.matchedUser.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {match.matchedUser.name}
                        </Typography>
                        <Chip
                          label={getMatchLabel(match.matchPercentage)}
                          size="small"
                          sx={{
                            backgroundColor: getMatchColor(match.matchPercentage),
                            color: 'white',
                            mt: 0.5,
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Match Percentage */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                          Compatibility
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {match.matchPercentage}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={match.matchPercentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: COLORS.BACKGROUND_LIGHT,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getMatchColor(match.matchPercentage),
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>

                    {/* Common Media Count */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Favorite sx={{ color: COLORS.ERROR, mr: 1 }} />
                      <Typography variant="body2" color="textSecondary">
                        {match.commonMediaIds.length} shared favorites
                      </Typography>
                    </Box>

                    {/* View Details Button */}
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleViewDetails(match)}
                      sx={{
                        borderColor: COLORS.ACCENT,
                        color: COLORS.ACCENT,
                        '&:hover': {
                          borderColor: COLORS.ACCENT_HOVER,
                          backgroundColor: `${COLORS.ACCENT}20`,
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Person sx={{ fontSize: 64, color: COLORS.TEXT_SECONDARY, mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  No matches found yet
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Rate more anime, movies, and shows to find people with similar taste!
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      {/* Match Details Dialog */}
      <Dialog
        open={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedMatch && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: COLORS.ACCENT,
                  mr: 2,
                }}
              >
                {selectedMatch.matchedUser.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {selectedMatch.matchedUser.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {selectedMatch.matchPercentage}% compatibility
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              {detailsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress sx={{ color: COLORS.ACCENT }} />
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Shared Favorites ({commonMedia.length})
                  </Typography>
                  <List>
                    {commonMedia.map((media) => (
                      <ListItem key={media.id} sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar
                            src={media.image}
                            sx={{ width: 56, height: 56 }}
                          >
                            {getMediaTypeIcon(media.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={media.title}
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <Chip
                                label={media.type}
                                size="small"
                                sx={{ 
                                  backgroundColor: media.type === 'BOOK' ? '#8B4513' : COLORS.ACCENT, 
                                  color: 'white' 
                                }}
                              />
                              <Typography variant="body2" color="textSecondary">
                                Your rating: {media.userRating}/5
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Their rating: {media.matchRating}/5
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedMatch(null)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default MatchPage;