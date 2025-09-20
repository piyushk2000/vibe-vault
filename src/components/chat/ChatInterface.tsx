import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  List,
  ListItem,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Fab,
} from '@mui/material';
import { Send, ArrowBack, MoreVert, KeyboardArrowDown } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { 
  fetchMessages, 
  addMessage, 
  addTypingUser, 
  removeTypingUser 
} from '../../redux/connectionSlice';
import { COLORS } from '../../theme/colors';
import socketService from '../../services/socket';
import { format, isToday, isYesterday } from 'date-fns';

interface ChatInterfaceProps {
  connection: any;
  onBack?: () => void;
  isMobile: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ connection, onBack, isMobile }) => {
  const dispatch = useDispatch<AppDispatch>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  
  const { messages, messagesLoading, typingUsers } = useSelector(
    (state: RootState) => state.connection
  );
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (connection) {
      dispatch(fetchMessages({ connectionId: connection.id }));
      
      // Join connection room
      socketService.joinConnection(connection.id);
    }
  }, [connection, dispatch]);

  useEffect(() => {
    // Connect socket if not connected
    if (token && !socketService.getSocket()?.connected) {
      socketService.connect(token);
    }

    // Set up socket listeners
    const handleNewMessage = (data: any) => {
      if (data.connectionId === connection.id) {
        dispatch(addMessage(data.message));
      }
    };

    const handleUserTyping = (data: any) => {
      if (data.connectionId === connection.id) {
        dispatch(addTypingUser(data.userId));
      }
    };

    const handleUserStoppedTyping = (data: any) => {
      if (data.connectionId === connection.id) {
        dispatch(removeTypingUser(data.userId));
      }
    };

    socketService.onNewMessage(handleNewMessage);
    socketService.onUserTyping(handleUserTyping);
    socketService.onUserStoppedTyping(handleUserStoppedTyping);

    return () => {
      socketService.removeAllListeners();
    };
  }, [connection, dispatch, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle scroll to show/hide scroll to bottom button
  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollToBottom(!isNearBottom && messages.length > 0);
      }
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (message.trim() && connection) {
      socketService.sendMessage(connection.id, message.trim());
      setMessage('');
      
      // Stop typing
      if (isTyping) {
        socketService.stopTyping(connection.id);
        setIsTyping(false);
      }
    }
  };

  const handleTyping = (value: string) => {
    setMessage(value);
    
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      socketService.startTyping(connection.id);
    } else if (!value.trim() && isTyping) {
      setIsTyping(false);
      socketService.stopTyping(connection.id);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socketService.stopTyping(connection.id);
      }
    }, 2000);
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [key: string]: any[] } = {};
    
    messages.forEach(msg => {
      const date = new Date(msg.createdAt);
      let dateKey;
      
      if (isToday(date)) {
        dateKey = 'Today';
      } else if (isYesterday(date)) {
        dateKey = 'Yesterday';
      } else {
        dateKey = format(date, 'MMM dd, yyyy');
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <Box 
      sx={{ 
        height: isMobile ? '100vh' : '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: COLORS.CARD_BACKGROUND,
          borderBottom: `1px solid ${COLORS.BORDER}`,
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: '56px', sm: '64px' } }}>
          {isMobile && onBack && (
            <IconButton 
              onClick={onBack} 
              sx={{ 
                mr: 1,
                minWidth: '44px',
                minHeight: '44px',
                color: COLORS.TEXT_PRIMARY,
                '&:hover': {
                  backgroundColor: COLORS.HOVER,
                },
              }}
            >
              <ArrowBack />
            </IconButton>
          )}
          
          <Avatar
            src={connection.user.avatar || undefined}
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              backgroundColor: COLORS.ACCENT,
              mr: { xs: 1.5, sm: 2 },
            }}
          >
            {connection.user.name.charAt(0).toUpperCase()}
          </Avatar>
          
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant={isSmallMobile ? "subtitle1" : "h6"} 
              sx={{ 
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {connection.user.name}
            </Typography>
            {typingUsers.length > 0 && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: COLORS.ACCENT,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                }}
              >
                typing...
              </Typography>
            )}
          </Box>
          
          <IconButton
            sx={{
              minWidth: '44px',
              minHeight: '44px',
              color: COLORS.TEXT_SECONDARY,
              '&:hover': {
                backgroundColor: COLORS.HOVER,
                color: COLORS.TEXT_PRIMARY,
              },
            }}
          >
            <MoreVert />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Messages */}
      <Box 
        ref={messagesContainerRef}
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: { xs: 0.5, sm: 1 },
          backgroundColor: COLORS.BACKGROUND_DARK,
          position: 'relative',
          // Ensure proper scrolling on mobile
          WebkitOverflowScrolling: 'touch',
          // Account for mobile keyboard
          paddingBottom: isMobile ? { xs: '8px', sm: '16px' } : '16px',
        }}
      >
        {messagesLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography color="textSecondary">Loading messages...</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {Object.entries(messageGroups).map(([dateKey, dateMessages]) => (
              <React.Fragment key={dateKey}>
                {/* Date Separator */}
                <Box sx={{ textAlign: 'center', my: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      backgroundColor: COLORS.BACKGROUND_LIGHT,
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    {dateKey}
                  </Typography>
                </Box>

                {/* Messages for this date */}
                {dateMessages.map((msg) => (
                  <ListItem
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.isFromMe ? 'flex-end' : 'flex-start',
                      px: { xs: 0.5, sm: 1 },
                      py: { xs: 0.25, sm: 0.5 },
                    }}
                  >
                    <Paper
                      sx={{
                        maxWidth: { xs: '85%', sm: '80%', md: '70%' },
                        p: { xs: 1, sm: 1.5 },
                        backgroundColor: msg.isFromMe ? COLORS.ACCENT : COLORS.CARD_BACKGROUND,
                        color: msg.isFromMe ? 'white' : COLORS.TEXT_PRIMARY,
                        borderRadius: { xs: 2.5, sm: 2 },
                        borderTopRightRadius: msg.isFromMe ? { xs: 0.5, sm: 0.5 } : { xs: 2.5, sm: 2 },
                        borderTopLeftRadius: msg.isFromMe ? { xs: 2.5, sm: 2 } : { xs: 0.5, sm: 0.5 },
                        borderBottomRightRadius: msg.isFromMe ? { xs: 0.5, sm: 0.5 } : { xs: 2.5, sm: 2 },
                        borderBottomLeftRadius: msg.isFromMe ? { xs: 2.5, sm: 2 } : { xs: 0.5, sm: 0.5 },
                        alignSelf: msg.isFromMe ? 'flex-end' : 'flex-start',
                        marginLeft: msg.isFromMe ? 'auto' : 0,
                        marginRight: msg.isFromMe ? 0 : 'auto',
                        boxShadow: isMobile ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 0.5,
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          lineHeight: 1.4,
                          wordBreak: 'break-word',
                        }}
                      >
                        {msg.content}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          opacity: 0.7,
                          fontSize: { xs: '0.65rem', sm: '0.7rem' },
                          display: 'block',
                          textAlign: msg.isFromMe ? 'right' : 'left',
                        }}
                      >
                        {formatMessageTime(msg.createdAt)}
                      </Typography>
                    </Paper>
                  </ListItem>
                ))}
              </React.Fragment>
            ))}
            
            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <ListItem sx={{ justifyContent: 'flex-start', px: { xs: 0.5, sm: 1 } }}>
                <Paper
                  sx={{
                    p: { xs: 1, sm: 1.5 },
                    backgroundColor: COLORS.CARD_BACKGROUND,
                    borderRadius: { xs: 2.5, sm: 2 },
                    borderTopLeftRadius: { xs: 0.5, sm: 0.5 },
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontStyle: 'italic', 
                      opacity: 0.7,
                      fontSize: { xs: '0.85rem', sm: '0.875rem' },
                    }}
                  >
                    typing...
                  </Typography>
                </Paper>
              </ListItem>
            )}
            
            <div ref={messagesEndRef} />
          </List>
        )}
      </Box>

      {/* Scroll to Bottom Button */}
      {showScrollToBottom && (
        <Fab
          size="small"
          onClick={scrollToBottom}
          sx={{
            position: 'absolute',
            bottom: isMobile ? '80px' : '90px',
            right: '16px',
            backgroundColor: COLORS.ACCENT,
            color: 'white',
            zIndex: 1000,
            '&:hover': {
              backgroundColor: COLORS.ACCENT_HOVER,
            },
            width: { xs: '40px', sm: '48px' },
            height: { xs: '40px', sm: '48px' },
          }}
        >
          <KeyboardArrowDown />
        </Fab>
      )}

      {/* Message Input - Sticky on Mobile */}
      <Box
        sx={{
          position: isMobile ? 'sticky' : 'static',
          bottom: 0,
          left: 0,
          right: 0,
          p: { xs: 1, sm: 2 },
          backgroundColor: COLORS.CARD_BACKGROUND,
          borderTop: `1px solid ${COLORS.BORDER}`,
          zIndex: 1000,
          // Add safe area padding for mobile devices
          paddingBottom: isMobile ? 'max(8px, env(safe-area-inset-bottom))' : undefined,
        }}
      >
        <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={isMobile ? 3 : 4}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: COLORS.BACKGROUND_LIGHT,
                borderRadius: { xs: 3, sm: 3 },
                fontSize: { xs: '16px', sm: '14px' }, // Prevent zoom on iOS
                '& fieldset': {
                  borderColor: COLORS.BORDER,
                },
                '&:hover fieldset': {
                  borderColor: COLORS.ACCENT,
                },
                '&.Mui-focused fieldset': {
                  borderColor: COLORS.ACCENT,
                  borderWidth: '2px',
                },
              },
              '& .MuiInputBase-input': {
                padding: { xs: '12px 14px', sm: '16.5px 14px' },
              },
            }}
            InputProps={{
              endAdornment: isMobile && message.trim() ? (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSendMessage}
                    size="small"
                    sx={{
                      color: COLORS.ACCENT,
                      '&:hover': {
                        backgroundColor: COLORS.ACCENT_BACKGROUND,
                      },
                    }}
                  >
                    <Send fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            }}
          />
          {(!isMobile || !message.trim()) && (
            <IconButton
              onClick={handleSendMessage}
              disabled={!message.trim()}
              sx={{
                minWidth: { xs: '44px', sm: '48px' },
                minHeight: { xs: '44px', sm: '48px' },
                backgroundColor: message.trim() ? COLORS.ACCENT : COLORS.TEXT_INACTIVE,
                color: 'white',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: message.trim() ? COLORS.ACCENT_HOVER : COLORS.TEXT_INACTIVE,
                  transform: message.trim() ? 'scale(1.05)' : 'none',
                },
                '&:disabled': {
                  backgroundColor: COLORS.TEXT_INACTIVE,
                  color: 'white',
                },
              }}
            >
              <Send fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatInterface;