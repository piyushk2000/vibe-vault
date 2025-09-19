import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
  Badge,
} from '@mui/material';
import { PersonAdd, Celebration, Favorite } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { 
  fetchMatchRequests, 
  respondToMatchRequest, 
  clearError 
} from '../../redux/matchRequestSlice';
import MatchRequestCard from '../../components/match-request/MatchRequestCard';
import { COLORS } from '../../theme/colors';

const MatchRequests: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  
  const { requests, isLoading, error } = useSelector(
    (state: RootState) => state.matchRequest
  );
  
  const [matchDialog, setMatchDialog] = useState<{
    open: boolean;
    userName: string;
    userAvatar: string | null;
  }>({
    open: false,
    userName: '',
    userAvatar: null,
  });

  useEffect(() => {
    dispatch(fetchMatchRequests());
  }, [dispatch]);

  const handleRespond = async (swiperId: number, action: 'LIKE' | 'PASS') => {
    const result = await dispatch(respondToMatchRequest({ swiperId, action }));
    
    if (respondToMatchRequest.fulfilled.match(result)) {
      if (action === 'LIKE' && result.payload.data.isMatch) {
        // Show match celebration
        const request = requests.find(r => r.swiperId === swiperId);
        if (request) {
          setMatchDialog({
            open: true,
            userName: request.user.name,
            userAvatar: request.user.avatar,
          });
        }
      }
    }
  };

  const handleCloseMatchDialog = () => {
    setMatchDialog({ open: false, userName: '', userAvatar: null });
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          onClick={() => {
            dispatch(clearError());
            dispatch(fetchMatchRequests());
          }}
          variant="contained"
        >
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
        px: isMobile ? 1 : 3,
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
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
          Match Requests
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
          People who want to match with you
        </Typography>
        
        {/* Request Count Badge */}
        {requests.length > 0 && (
          <Badge
            badgeContent={requests.length}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: COLORS.ACCENT,
                color: 'white',
                fontSize: '0.9rem',
                height: 24,
                minWidth: 24,
              },
            }}
          >
            <PersonAdd sx={{ fontSize: 32, color: COLORS.ACCENT }} />
          </Badge>
        )}
      </Box>

      {/* Loading State */}
      {isLoading && requests.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: COLORS.ACCENT }} />
        </Box>
      )}

      {/* Match Requests Grid */}
      {!isLoading && (
        <>
          {requests.length > 0 ? (
            <Grid container spacing={isMobile ? 2 : 3} justifyContent="center">
              {requests.map((request) => (
                <Grid 
                  item 
                  key={request.id} 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  lg={3}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <MatchRequestCard
                    request={request}
                    onRespond={handleRespond}
                    isLoading={isLoading}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <PersonAdd 
                sx={{ 
                  fontSize: 80, 
                  color: COLORS.TEXT_SECONDARY, 
                  mb: 2,
                  opacity: 0.5,
                }} 
              />
              <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                No match requests yet
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                When someone swipes right on you, they'll appear here waiting for your response!
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Keep swiping to get more visibility and attract potential matches.
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* Match Celebration Dialog */}
      <Dialog
        open={matchDialog.open}
        onClose={handleCloseMatchDialog}
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
            You and {matchDialog.userName} liked each other!
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 3 }}>
            <img
              src={matchDialog.userAvatar || '/default-avatar.png'}
              alt={matchDialog.userName}
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                objectFit: 'cover',
                border: `3px solid ${COLORS.SUCCESS}`,
              }}
            />
            <Favorite sx={{ color: COLORS.SUCCESS, fontSize: 40 }} />
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: COLORS.ACCENT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `3px solid ${COLORS.SUCCESS}`,
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              You
            </Box>
          </Box>
          
          <Typography variant="body2" color="textSecondary">
            You can now start chatting in the Matched tab!
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={handleCloseMatchDialog}
            variant="contained"
            sx={{
              backgroundColor: COLORS.ACCENT,
              '&:hover': {
                backgroundColor: COLORS.ACCENT_HOVER,
              },
            }}
          >
            Continue
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

export default MatchRequests;