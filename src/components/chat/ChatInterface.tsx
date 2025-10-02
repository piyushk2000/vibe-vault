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
  const lastSentMessageTime = useRef<number>(0);
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const inputMinHeight = isMobile ? 44 : 36;
  
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  
  const { messages, messagesLoading, typingUsers } = useSelector(
    (state: RootState) => state.connection
  );
  const { token, user } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.profile);

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
        const currentTime = Date.now();
        const timeSinceLastSent = currentTime - lastSentMessageTime.current;
        const isRecentMessage = timeSinceLastSent < 5000; // 5 seconds window
        
        // If message came back within 5 seconds of sending, assume it's ours
        // Otherwise, check sender ID
        const isFromMe = isRecentMessage || (user ? data.message.sender.id === user.id : false);
        
        const messageWithCorrectFlag = {
          ...data.message,
          isFromMe: isFromMe
        };
        
        console.log('Received message:', {
          senderId: data.message.sender.id,
          currentUserId: user?.id,
          timeSinceLastSent,
          isRecentMessage,
          isFromMe: messageWithCorrectFlag.isFromMe,
          content: data.message.content
        });
        
        dispatch(addMessage(messageWithCorrectFlag));
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
  }, [connection, dispatch, token, user]);

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
      lastSentMessageTime.current = Date.now();
      console.log('Sending message from user:', user?.id, 'at time:', lastSentMessageTime.current);
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
        height: isMobile ? '100vh' : undefined, // Desktop uses natural height from flex
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden', // Prevent the entire chat container from being scrollable
        flex: isMobile ? 'none' : '1', // Desktop flexes to fill container
      }}
    >
      {/* Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: COLORS.GLASS_BACKGROUND_STRONG,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: `1px solid ${COLORS.GLASS_BORDER}`,
          zIndex: theme.zIndex.appBar,
          flexShrink: 0,
        }}
      >
  <Toolbar sx={{ minHeight: { xs: '56px', sm: '64px' }, px: { xs: 2, sm: 2.5 } }}>
          {isMobile && onBack && (
            <IconButton 
              onClick={onBack} 
              sx={{ 
                mr: 0.75,
                minWidth: '40px',
                minHeight: '40px',
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
              background: `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_LIGHT} 100%)`,
              border: `2px solid ${COLORS.GLASS_BORDER}`,
              mr: { xs: 1, sm: 1.5 },
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
            }}
          >
            {connection.user.name.charAt(0).toUpperCase()}
          </Avatar>
          
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="h6"
              sx={{ 
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: { xs: '1rem', sm: '1.125rem' },
                color: COLORS.TEXT_PRIMARY,
              }}
            >
              {connection.user.name}
            </Typography>
            {typingUsers.length > 0 && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: COLORS.ACCENT,
                  fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                  fontWeight: 500,
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
          p: { xs: 1.5, sm: 2 },
          backgroundColor: COLORS.BACKGROUND_DARK,
          position: 'relative',
          minHeight: 0,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {messagesLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography color="textSecondary">Loading messages...</Typography>
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center',
            py: 8,
            px: 2,
            textAlign: 'center',
            minHeight:'65vh',
            height: '100%',
            width: '100%'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: COLORS.TEXT_SECONDARY,
                mb: 1,
                fontWeight: 500
              }}
            >
              No messages yet
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: COLORS.TEXT_SECONDARY,
                opacity: 0.7,
                maxWidth: '280px'
              }}
            >
              Start a conversation by sending the first message!
            </Typography>
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
                      px: 0,
                      py: 0.75,
                      alignItems: 'flex-start',
                    }}
                  >
                    {!msg.isFromMe && (
                      <Avatar
                        src={connection.user.avatar || undefined}
                        sx={{
                          width: { xs: 32, sm: 36 },
                          height: { xs: 32, sm: 36 },
                          background: `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_LIGHT} 100%)`,
                          border: `2px solid ${COLORS.GLASS_BORDER}`,
                          mr: 1,
                          flexShrink: 0,
                        }}
                      >
                        {connection.user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    )}
                    
                    <Paper
                      sx={{
                        maxWidth: { xs: '85%', sm: '75%', md: '60%' },
                        p: { xs: 1.25, sm: 1.5 },
                        background: msg.isFromMe 
                          ? `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_LIGHT} 100%)`
                          : COLORS.GLASS_BACKGROUND_LIGHT,
                        backdropFilter: msg.isFromMe ? 'none' : 'blur(12px) saturate(180%)',
                        WebkitBackdropFilter: msg.isFromMe ? 'none' : 'blur(12px) saturate(180%)',
                        color: msg.isFromMe ? 'white' : COLORS.TEXT_PRIMARY,
                        border: msg.isFromMe ? 'none' : `1px solid ${COLORS.GLASS_BORDER}`,
                        borderRadius: 2.5,
                        borderTopRightRadius: msg.isFromMe ? 0.5 : 2.5,
                        borderTopLeftRadius: msg.isFromMe ? 2.5 : 0.5,
                        alignSelf: msg.isFromMe ? 'flex-end' : 'flex-start',
                        marginLeft: msg.isFromMe ? 'auto' : 0,
                        marginRight: msg.isFromMe ? 0 : 'auto',
                        boxShadow: msg.isFromMe 
                          ? '0 4px 16px rgba(99, 102, 241, 0.3)'
                          : '0 2px 8px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 0.5,
                          fontSize: { xs: '0.9375rem', sm: '1rem' },
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                        }}
                      >
                        {msg.content}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          opacity: 0.75,
                          fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                          display: 'block',
                          textAlign: msg.isFromMe ? 'right' : 'left',
                        }}
                      >
                        {formatMessageTime(msg.createdAt)}
                      </Typography>
                    </Paper>

                    {msg.isFromMe && (
                      <Avatar
                        src={profile?.avatar || undefined}
                        sx={{
                          width: { xs: 32, sm: 36 },
                          height: { xs: 32, sm: 36 },
                          background: `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_LIGHT} 100%)`,
                          border: `2px solid ${COLORS.GLASS_BORDER}`,
                          ml: 1,
                          flexShrink: 0,
                        }}
                      >
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                    )}
                  </ListItem>
                ))}
              </React.Fragment>
            ))}
            
            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <ListItem sx={{ justifyContent: 'flex-start', px: 0, py: 0.75, alignItems: 'flex-start' }}>
                <Avatar
                  src={connection.user.avatar || undefined}
                  sx={{
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                    background: `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_LIGHT} 100%)`,
                    border: `2px solid ${COLORS.GLASS_BORDER}`,
                    mr: 1,
                    flexShrink: 0,
                  }}
                >
                  {connection.user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Paper
                  sx={{
                    p: 1.5,
                    background: COLORS.GLASS_BACKGROUND_LIGHT,
                    backdropFilter: 'blur(12px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                    border: `1px solid ${COLORS.GLASS_BORDER}`,
                    borderRadius: 2.5,
                    borderTopLeftRadius: 0.5,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontStyle: 'italic', 
                      opacity: 0.7,
                      fontSize: { xs: '0.9375rem', sm: '1rem' },
                      color: COLORS.TEXT_SECONDARY,
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
          p: { xs: 1.5, sm: 2 },
          backgroundColor: COLORS.GLASS_BACKGROUND_STRONG,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderTop: `1px solid ${COLORS.GLASS_BORDER}`,
          zIndex: 1000,
          flexShrink: 0,
          paddingBottom: isMobile ? 'max(12px, env(safe-area-inset-bottom))' : undefined,
        }}
      >
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
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
                backgroundColor: COLORS.INPUT_BACKGROUND,
                backdropFilter: 'blur(12px) saturate(180%)',
                WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                borderRadius: 3,
                fontSize: { xs: '0.9375rem', sm: '1rem' },
                '& fieldset': {
                  borderColor: COLORS.GLASS_BORDER,
                },
                '&:hover fieldset': {
                  borderColor: COLORS.GLASS_BORDER_STRONG,
                },
                '&.Mui-focused fieldset': {
                  borderColor: COLORS.ACCENT,
                  borderWidth: '2px',
                  boxShadow: `0 0 0 3px ${COLORS.ACCENT_BACKGROUND}`,
                },
              },
              '& .MuiInputBase-input': {
                padding: { xs: '12px 16px', sm: '14px 18px' },
              },
              '& .MuiInputBase-input::placeholder': {
                color: COLORS.TEXT_SECONDARY,
                opacity: 0.7,
              },
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!message.trim()}
            sx={{
              width: { xs: 44, sm: 48 },
              height: { xs: 44, sm: 48 },
              background: message.trim() 
                ? `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_LIGHT} 100%)`
                : COLORS.DISABLED_BACKGROUND,
              color: 'white',
              transition: 'all 0.2s ease',
              boxShadow: message.trim() ? '0 4px 16px rgba(99, 102, 241, 0.3)' : 'none',
              '&:hover': {
                background: message.trim() 
                  ? `linear-gradient(135deg, ${COLORS.ACCENT_LIGHT} 0%, ${COLORS.ACCENT} 100%)`
                  : COLORS.DISABLED_BACKGROUND,
                transform: message.trim() ? 'scale(1.05)' : 'none',
                boxShadow: message.trim() ? '0 6px 20px rgba(99, 102, 241, 0.4)' : 'none',
              },
              '&:disabled': {
                background: COLORS.DISABLED_BACKGROUND,
                color: COLORS.DISABLED_TEXT,
              },
            }}
          >
            <Send fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatInterface;