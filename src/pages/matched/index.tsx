import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Divider,
  Paper,
} from '@mui/material';
import { Message, Circle } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchConnections, setCurrentConnection } from '../../redux/connectionSlice';
import { COLORS } from '../../theme/colors';
import ChatInterface from '../../components/chat/ChatInterface';
import { formatDistanceToNow } from 'date-fns';

const Matched: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  
  const { connections, currentConnection, isLoading, error } = useSelector(
    (state: RootState) => state.connection
  );
  const [selectedConnectionId, setSelectedConnectionId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchConnections());
  }, [dispatch]);

  const handleConnectionSelect = (connection: any) => {
    setSelectedConnectionId(connection.id);
    dispatch(setCurrentConnection(connection));
  };

  const handleBackToList = () => {
    setSelectedConnectionId(null);
    dispatch(setCurrentConnection(null));
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

  // Mobile: Show chat if connection selected, otherwise show list
  if (isMobile) {
    if (selectedConnectionId && currentConnection) {
      return (
        <Box sx={{ height: '100vh', overflow: 'hidden' }}>
          <ChatInterface
            connection={currentConnection}
            onBack={handleBackToList}
            isMobile={true}
          />
        </Box>
      );
    }

    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ py: 2, px: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3, flexShrink: 0 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                background: `linear-gradient(45deg, ${COLORS.ACCENT} 30%, ${COLORS.ACCENT_LIGHT} 90%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Your Matches
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {connections.length} connections
            </Typography>
          </Box>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: COLORS.ACCENT }} />
          </Box>
        )}

          {/* Connections List */}
          {!isLoading && (
            <Paper
              sx={{
                backgroundColor: COLORS.CARD_BACKGROUND,
                border: `1px solid ${COLORS.BORDER}`,
                borderRadius: 2,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {connections.length > 0 ? (
                <List sx={{ p: 0, flex: 1, overflow: 'auto' }}>
                  {connections.map((connection, index) => (
                    <React.Fragment key={connection.id}>
                      <ListItem
                        onClick={() => handleConnectionSelect(connection)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: COLORS.CARD_HOVER,
                          },
                          '&:active': {
                            backgroundColor: COLORS.PRESSED,
                          },
                          py: 2,
                          px: 2,
                          minHeight: '80px',
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              connection.lastMessage && !connection.lastMessage.isFromMe && !connection.lastMessage.isRead ? (
                                <Circle sx={{ color: COLORS.ACCENT, fontSize: 12 }} />
                              ) : null
                            }
                          >
                            <Avatar
                              src={connection.user.avatar || undefined}
                              sx={{
                                width: { xs: 50, sm: 56 },
                                height: { xs: 50, sm: 56 },
                                backgroundColor: COLORS.ACCENT,
                              }}
                            >
                              {connection.user.name.charAt(0).toUpperCase()}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 'bold',
                                fontSize: { xs: '1rem', sm: '1.125rem' },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {connection.user.name}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              {connection.lastMessage ? (
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontWeight: !connection.lastMessage.isFromMe && !connection.lastMessage.isRead ? 'bold' : 'normal',
                                    fontSize: { xs: '0.875rem', sm: '0.875rem' },
                                    mb: 0.5,
                                  }}
                                >
                                  {connection.lastMessage.isFromMe ? 'You: ' : ''}
                                  {connection.lastMessage.content}
                                </Typography>
                              ) : (
                                <Typography 
                                  variant="body2" 
                                  color="textSecondary"
                                  sx={{
                                    fontSize: { xs: '0.875rem', sm: '0.875rem' },
                                    mb: 0.5,
                                  }}
                                >
                                  Say hello! 👋
                                </Typography>
                              )}
                              <Typography 
                                variant="caption" 
                                color="textSecondary"
                                sx={{
                                  fontSize: { xs: '0.75rem', sm: '0.75rem' },
                                }}
                              >
                                {formatDistanceToNow(new Date(connection.updatedAt), { addSuffix: true })}
                              </Typography>
                            </Box>
                          }
                        />
                        <Message 
                          sx={{ 
                            color: COLORS.TEXT_SECONDARY,
                            fontSize: { xs: '20px', sm: '24px' },
                          }} 
                        />
                    </ListItem>
                      {index < connections.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                    No matches yet
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Start swiping to find your perfect match!
                  </Typography>
                </Box>
              )}
            </Paper>
          )}
        </Container>
      </Box>
    );
  }

  // Desktop: Split view
  return (
    <Container maxWidth="xl" sx={{ py: 3, height: 'calc(100vh - 80px)' }}>
      <Box sx={{ display: 'flex', height: '100%', gap: 2 }}>
        {/* Left Panel - Connections List */}
        <Paper
          sx={{
            width: 360,
            backgroundColor: COLORS.CARD_BACKGROUND,
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            border: `1px solid ${COLORS.GLASS_BORDER}`,
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2.5, borderBottom: `1px solid ${COLORS.GLASS_BORDER}` }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_LIGHT} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
                filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))',
              }}
            >
              Messages
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.TEXT_SECONDARY, fontSize: '0.875rem' }}>
              {connections.length} {connections.length === 1 ? 'conversation' : 'conversations'}
            </Typography>
          </Box>

          {/* Loading State */}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: COLORS.ACCENT }} />
            </Box>
          )}

          {/* Connections List */}
          {!isLoading && (
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {connections.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {connections.map((connection, index) => (
                    <React.Fragment key={connection.id}>
                      <ListItem
                        onClick={() => handleConnectionSelect(connection)}
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: selectedConnectionId === connection.id ? COLORS.SELECTED : 'transparent',
                          backdropFilter: selectedConnectionId === connection.id ? 'blur(8px)' : 'none',
                          WebkitBackdropFilter: selectedConnectionId === connection.id ? 'blur(8px)' : 'none',
                          borderLeft: selectedConnectionId === connection.id ? `3px solid ${COLORS.ACCENT}` : '3px solid transparent',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: COLORS.HOVER,
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                          },
                          py: 2,
                          px: 2,
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              connection.lastMessage && !connection.lastMessage.isFromMe && !connection.lastMessage.isRead ? (
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_LIGHT} 100%)`,
                                    border: `2px solid ${COLORS.CARD_BACKGROUND}`,
                                    boxShadow: `0 0 8px ${COLORS.ACCENT}`,
                                  }}
                                />
                              ) : null
                            }
                          >
                            <Avatar
                              src={connection.user.avatar || undefined}
                              sx={{
                                width: 56,
                                height: 56,
                                background: `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_LIGHT} 100%)`,
                                border: `2px solid ${COLORS.GLASS_BORDER}`,
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                              }}
                            >
                              {connection.user.name.charAt(0).toUpperCase()}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 600,
                                fontSize: '1rem',
                                color: COLORS.TEXT_PRIMARY,
                                mb: 0.5,
                              }}
                            >
                              {connection.user.name}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              {connection.lastMessage ? (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontWeight: !connection.lastMessage.isFromMe && !connection.lastMessage.isRead ? 600 : 400,
                                    color: !connection.lastMessage.isFromMe && !connection.lastMessage.isRead ? COLORS.TEXT_PRIMARY : COLORS.TEXT_SECONDARY,
                                    fontSize: '0.875rem',
                                    mb: 0.5,
                                  }}
                                >
                                  {connection.lastMessage.isFromMe ? 'You: ' : ''}
                                  {connection.lastMessage.content}
                                </Typography>
                              ) : (
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: COLORS.TEXT_SECONDARY,
                                    fontSize: '0.875rem',
                                    mb: 0.5,
                                  }}
                                >
                                  Say hello! 👋
                                </Typography>
                              )}
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: COLORS.TEXT_TERTIARY,
                                  fontSize: '0.75rem',
                                }}
                              >
                                {formatDistanceToNow(new Date(connection.updatedAt), { addSuffix: true })}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < connections.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                    No matches yet
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Start swiping to find your perfect match!
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Paper>

        {/* Right Panel - Chat */}
        <Paper
          sx={{
            flex: 1,
            backgroundColor: COLORS.CARD_BACKGROUND,
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            border: `1px solid ${COLORS.GLASS_BORDER}`,
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
          }}
        >
          {currentConnection ? (
            <ChatInterface
              connection={currentConnection}
              onBack={handleBackToList}
              isMobile={false}
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Message sx={{ fontSize: 64, color: COLORS.TEXT_SECONDARY, mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                Select a conversation
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Choose a match to start chatting
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Matched;