import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Favorite, Close, Refresh, Celebration } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchDiscoverUsers, swipeUser, clearLastMatch, resetDiscovery } from '../../redux/swipeSlice';
import SwipeCard from '../../components/swipe/SwipeCard';
import { COLORS } from '../../theme/colors';

const FindMatches: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  
  const { 
    discoverUsers, 
    currentUserIndex, 
    isLoading, 
    error, 
    lastMatch 
  } = useSelector((state: RootState) => state.swipe);

  const [showMatchDialog, setShowMatchDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchDiscoverUsers(10));
  }, [dispatch]);

  useEffect(() => {
    if (lastMatch) {
      setShowMatchDialog(true);
    }
  }, [lastMatch]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    const currentUser = discoverUsers[currentUserIndex];
    if (!currentUser) return;

    const action = direction === 'right' ? 'LIKE' : 'PASS';
    await dispatch(swipeUser({ swipedUserId: currentUser.id, action }));

    // Load more users if running low
    if (currentUserIndex >= discoverUsers.length - 3) {
      dispatch(fetchDiscoverUsers(10));
    }
  };

  const handleButtonSwipe = (action: 'LIKE' | 'PASS') => {
    handleSwipe(action === 'LIKE' ? 'right' : 'left');
  };

  const handleRefresh = () => {
    dispatch(resetDiscovery());
    dispatch(fetchDiscoverUsers(10));
  };

  const handleMatchDialogClose = () => {
    setShowMatchDialog(false);
    dispatch(clearLastMatch());
  };

  const currentUser = discoverUsers[currentUserIndex];
  const hasMoreUsers = currentUserIndex < discoverUsers.length;

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button onClick={handleRefresh} variant="contained">
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: isMobile ? 2 : 4,
        height: isMobile ? '100vh' : 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: isMobile ? 2 : 4 }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: 'bold',
            mb: 1,
            background: `linear-gradient(45deg, ${COLORS.ACCENT} 30%, ${COLORS.ACCENT_LIGHT} 90%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Find Your Match
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Swipe right to like, left to pass
        </Typography>
      </Box>

      {/* Loading State */}
      {isLoading && discoverUsers.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: COLORS.ACCENT }} />
        </Box>
      )}

      {/* Card Stack */}
      {!isLoading && hasMoreUsers && currentUser && (
        <Box 
          sx={{ 
            flex: 1,
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            minHeight: isMobile ? '60vh' : '600px',
          }}
        >
          {/* Card Stack - Show current and next card */}
          <Box sx={{ position: 'relative', mb: isMobile ? 2 : 4 }}>
            {/* Next card (behind) */}
            {discoverUsers[currentUserIndex + 1] && (
              <SwipeCard
                user={discoverUsers[currentUserIndex + 1]}
                onSwipe={() => {}}
                isActive={false}
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 5,
                  zIndex: 1,
                  opacity: 0.5,
                  scale: 0.95,
                }}
              />
            )}
            
            {/* Current card (front) */}
            <SwipeCard
              user={currentUser}
              onSwipe={handleSwipe}
              isActive={true}
              style={{
                position: 'relative',
                zIndex: 2,
              }}
            />
          </Box>

          {/* Action Buttons */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: isMobile ? 3 : 4,
              justifyContent: 'center',
              mt: 'auto',
            }}
          >
            <IconButton
              onClick={() => handleButtonSwipe('PASS')}
              sx={{
                width: isMobile ? 60 : 70,
                height: isMobile ? 60 : 70,
                backgroundColor: COLORS.ERROR,
                color: 'white',
                '&:hover': {
                  backgroundColor: '#d32f2f',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <Close sx={{ fontSize: isMobile ? 30 : 35 }} />
            </IconButton>

            <IconButton
              onClick={handleRefresh}
              sx={{
                width: isMobile ? 50 : 60,
                height: isMobile ? 50 : 60,
                backgroundColor: COLORS.TEXT_SECONDARY,
                color: 'white',
                '&:hover': {
                  backgroundColor: COLORS.TEXT_PRIMARY,
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <Refresh sx={{ fontSize: isMobile ? 25 : 30 }} />
            </IconButton>

            <IconButton
              onClick={() => handleButtonSwipe('LIKE')}
              sx={{
                width: isMobile ? 60 : 70,
                height: isMobile ? 60 : 70,
                backgroundColor: COLORS.SUCCESS,
                color: 'white',
                '&:hover': {
                  backgroundColor: '#2e7d32',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <Favorite sx={{ fontSize: isMobile ? 30 : 35 }} />
            </IconButton>
          </Box>

          {/* Instructions for mobile */}
          {isMobile && (
            <Typography 
              variant="caption" 
              color="textSecondary" 
              sx={{ mt: 2, textAlign: 'center' }}
            >
              Swipe the card or use buttons below
            </Typography>
          )}
        </Box>
      )}

      {/* No More Users */}
      {!isLoading && !hasMoreUsers && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
            No more users to discover
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Check back later for new people to match with!
          </Typography>
          <Button
            onClick={handleRefresh}
            variant="contained"
            startIcon={<Refresh />}
            sx={{
              backgroundColor: COLORS.ACCENT,
              '&:hover': {
                backgroundColor: COLORS.ACCENT_HOVER,
              },
            }}
          >
            Refresh
          </Button>
        </Box>
      )}

      {/* Match Dialog */}
      <Dialog
        open={showMatchDialog}
        onClose={handleMatchDialogClose}
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
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Celebration 
            sx={{ 
              fontSize: 80, 
              color: COLORS.SUCCESS, 
              mb: 2,
              animation: 'bounce 1s infinite',
            }} 
          />
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: COLORS.SUCCESS }}>
            It's a Match! 🎉
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            You and {lastMatch?.user2?.name || lastMatch?.user1?.name} liked each other!
          </Typography>
          {lastMatch && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src={lastMatch.user1?.avatar || '/default-avatar.png'}
                  alt={lastMatch.user1?.name}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `3px solid ${COLORS.SUCCESS}`,
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {lastMatch.user1?.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Favorite sx={{ color: COLORS.SUCCESS, fontSize: 40 }} />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src={lastMatch.user2?.avatar || '/default-avatar.png'}
                  alt={lastMatch.user2?.name}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `3px solid ${COLORS.SUCCESS}`,
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {lastMatch.user2?.name}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={handleMatchDialogClose}
            variant="contained"
            sx={{
              backgroundColor: COLORS.ACCENT,
              '&:hover': {
                backgroundColor: COLORS.ACCENT_HOVER,
              },
            }}
          >
            Continue Swiping
          </Button>
        </DialogActions>
      </Dialog>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </Container>
  );
};

export default FindMatches;