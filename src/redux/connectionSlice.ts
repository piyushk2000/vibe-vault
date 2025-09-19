import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

interface Connection {
  id: number;
  user: {
    id: number;
    name: string;
    bio: string;
    avatar: string | null;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    isFromMe: boolean;
    isRead: boolean;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: number;
  content: string;
  messageType: string;
  isFromMe: boolean;
  sender: {
    id: number;
    name: string;
    avatar: string | null;
  };
  createdAt: string;
  isRead: boolean;
}

interface ConnectionState {
  connections: Connection[];
  currentConnection: Connection | null;
  messages: Message[];
  isLoading: boolean;
  messagesLoading: boolean;
  error: string | null;
  typingUsers: number[];
}

const initialState: ConnectionState = {
  connections: [],
  currentConnection: null,
  messages: [],
  isLoading: false,
  messagesLoading: false,
  error: null,
  typingUsers: [],
};

// Async thunks
export const fetchConnections = createAsyncThunk(
  'connection/fetchConnections',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/connections`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch connections');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'connection/fetchMessages',
  async ({ connectionId, page = 1 }: { connectionId: number; page?: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/connections/${connectionId}/messages?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'connection/sendMessage',
  async ({ connectionId, content, messageType = 'TEXT' }: { 
    connectionId: number; 
    content: string; 
    messageType?: string; 
  }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/connections/${connectionId}/messages`, {
        content,
        messageType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setCurrentConnection: (state, action) => {
      state.currentConnection = action.payload;
      state.messages = [];
    },
    clearCurrentConnection: (state) => {
      state.currentConnection = null;
      state.messages = [];
      state.typingUsers = [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      
      // Update last message in connections list
      const connectionIndex = state.connections.findIndex(c => c.id === action.payload.connectionId);
      if (connectionIndex !== -1) {
        state.connections[connectionIndex].lastMessage = {
          content: action.payload.content,
          createdAt: action.payload.createdAt,
          isFromMe: action.payload.isFromMe,
          isRead: action.payload.isRead
        };
        state.connections[connectionIndex].updatedAt = action.payload.createdAt;
        
        // Move to top of list
        const connection = state.connections.splice(connectionIndex, 1)[0];
        state.connections.unshift(connection);
      }
    },
    addTypingUser: (state, action) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },
    removeTypingUser: (state, action) => {
      state.typingUsers = state.typingUsers.filter(id => id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    updateConnectionLastMessage: (state, action) => {
      const { connectionId, message } = action.payload;
      const connectionIndex = state.connections.findIndex(c => c.id === connectionId);
      if (connectionIndex !== -1) {
        state.connections[connectionIndex].lastMessage = {
          content: message.content,
          createdAt: message.createdAt,
          isFromMe: false,
          isRead: message.isRead
        };
        state.connections[connectionIndex].updatedAt = message.createdAt;
        
        // Move to top of list
        const connection = state.connections.splice(connectionIndex, 1)[0];
        state.connections.unshift(connection);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Connections
      .addCase(fetchConnections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.connections = action.payload.data;
        }
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.messagesLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        if (action.payload.success) {
          state.messages = action.payload.data;
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messagesLoading = false;
        state.error = action.payload as string;
      })
      // Send Message
      .addCase(sendMessage.fulfilled, (state, action) => {
        if (action.payload.success) {
          // Message will be added via socket, so we don't add it here to avoid duplicates
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { 
  setCurrentConnection, 
  clearCurrentConnection, 
  addMessage, 
  addTypingUser, 
  removeTypingUser, 
  clearError,
  updateConnectionLastMessage
} = connectionSlice.actions;
export default connectionSlice.reducer;