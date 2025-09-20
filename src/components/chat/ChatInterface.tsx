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
} from '@mui/material';
import { Send, ArrowBack, MoreVert } from '@mui/icons-material';
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
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: COLORS.CARD_BACKGROUND,
          borderBottom: `1px solid ${COLORS.BORDER}`,
        }}
      >
        <Toolbar>
          {isMobile && onBack && (
            <IconButton onClick={onBack} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
          )}
          
          <Avatar
            src={connection.user.avatar || undefined}
            sx={{
              width: 40,
              height: 40,
              backgroundColor: COLORS.ACCENT,
              mr: 2,
            }}
          >
            {connection.user.name.charAt(0).toUpperCase()}
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {connection.user.name}
            </Typography>
            {typingUsers.length > 0 && (
              <Typography variant="caption" sx={{ color: COLORS.ACCENT }}>
                typing...
              </Typography>
            )}
          </Box>
          
          <IconButton>
            <MoreVert />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Messages */}
      <Box 
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 1,
          backgroundColor: COLORS.BACKGROUND_DARK,
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
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    <Paper
                      sx={{
                        maxWidth: isMobile ? '80%' : '70%',
                        p: 1.5,
                        backgroundColor: msg.isFromMe ? COLORS.ACCENT : COLORS.CARD_BACKGROUND,
                        color: msg.isFromMe ? 'white' : COLORS.TEXT_PRIMARY,
                        borderRadius: 2,
                        borderTopRightRadius: msg.isFromMe ? 0.5 : 2,
                        borderTopLeftRadius: msg.isFromMe ? 2 : 0.5,
                        borderBottomRightRadius: msg.isFromMe ? 0.5 : 2,
                        borderBottomLeftRadius: msg.isFromMe ? 2 : 0.5,
                        alignSelf: msg.isFromMe ? 'flex-end' : 'flex-start',
                        marginLeft: msg.isFromMe ? 'auto' : 0,
                        marginRight: msg.isFromMe ? 0 : 'auto',
                      }}
                    >
                      <Typography variant="body1" sx={{ mb: 0.5 }}>
                        {msg.content}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          opacity: 0.7,
                          fontSize: '0.7rem',
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
              <ListItem sx={{ justifyContent: 'flex-start', px: 1 }}>
                <Paper
                  sx={{
                    p: 1.5,
                    backgroundColor: COLORS.CARD_BACKGROUND,
                    borderRadius: 2,
                    borderTopLeftRadius: 0.5,
                  }}
                >
                  <Typography variant="body2" sx={{ fontStyle: 'italic', opacity: 0.7 }}>
                    typing...
                  </Typography>
                </Paper>
              </ListItem>
            )}
            
            <div ref={messagesEndRef} />
          </List>
        )}
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          p: 2,
          backgroundColor: COLORS.CARD_BACKGROUND,
          borderTop: `1px solid ${COLORS.BORDER}`,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
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
                backgroundColor: COLORS.BACKGROUND_LIGHT,
                borderRadius: 3,
              },
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!message.trim()}
            sx={{
              backgroundColor: message.trim() ? COLORS.ACCENT : COLORS.TEXT_INACTIVE,
              color: 'white',
              '&:hover': {
                backgroundColor: message.trim() ? COLORS.ACCENT_HOVER : COLORS.TEXT_INACTIVE,
              },
              '&:disabled': {
                backgroundColor: COLORS.TEXT_INACTIVE,
                color: 'white',
              },
            }}
          >
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatInterface;