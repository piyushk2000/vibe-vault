import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

interface User {
  id: number;
  name: string;
  bio: string;
  interests: string[];
  avatar: string | null;
  photos: string[];
  location: string | null;
  mbtiType: string | null;
  distance: number | null;
  topMedia: Array<{
    title: string;
    type: string;
    rating: number;
    image: string;
    genres: string[];
  }>;
  mediaCount: number;
}

interface SwipeState {
  discoverUsers: User[];
  pendingSwipes: any[];
  currentUserIndex: number;
  isLoading: boolean;
  error: string | null;
  lastMatch: any | null;
}

const initialState: SwipeState = {
  discoverUsers: [],
  pendingSwipes: [],
  currentUserIndex: 0,
  isLoading: false,
  error: null,
  lastMatch: null,
};

// Async thunks
export const fetchDiscoverUsers = createAsyncThunk(
  'swipe/fetchDiscoverUsers',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/swipes/discover?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const swipeUser = createAsyncThunk(
  'swipe/swipeUser',
  async ({ swipedUserId, action }: { swipedUserId: number; action: 'LIKE' | 'PASS' }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/swipes`, {
        swipedUserId,
        action
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to record swipe');
    }
  }
);

export const fetchPendingSwipes = createAsyncThunk(
  'swipe/fetchPendingSwipes',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/swipes/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending swipes');
    }
  }
);

const swipeSlice = createSlice({
  name: 'swipe',
  initialState,
  reducers: {
    nextUser: (state) => {
      if (state.currentUserIndex < state.discoverUsers.length - 1) {
        state.currentUserIndex += 1;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearLastMatch: (state) => {
      state.lastMatch = null;
    },
    resetDiscovery: (state) => {
      state.discoverUsers = [];
      state.currentUserIndex = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Discover Users
      .addCase(fetchDiscoverUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDiscoverUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.discoverUsers = action.payload.data;
          state.currentUserIndex = 0;
        }
      })
      .addCase(fetchDiscoverUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Swipe User
      .addCase(swipeUser.fulfilled, (state, action) => {
        if (action.payload.success) {
          // Move to next user
          if (state.currentUserIndex < state.discoverUsers.length - 1) {
            state.currentUserIndex += 1;
          }
          
          // Check for match
          if (action.payload.data.isMatch) {
            state.lastMatch = action.payload.data.connection;
          }
        }
      })
      .addCase(swipeUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Fetch Pending Swipes
      .addCase(fetchPendingSwipes.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.pendingSwipes = action.payload.data;
        }
      });
  },
});

export const { nextUser, clearError, clearLastMatch, resetDiscovery } = swipeSlice.actions;
export default swipeSlice.reducer;