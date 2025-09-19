import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

interface MatchRequest {
  id: number;
  swiperId: number;
  user: {
    id: number;
    name: string;
    bio: string;
    interests: string[];
    avatar: string | null;
    topMedia: Array<{
      title: string;
      type: string;
      rating: number;
      image: string;
      genres: string[];
    }>;
  };
  createdAt: string;
}

interface MatchRequestState {
  requests: MatchRequest[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MatchRequestState = {
  requests: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchMatchRequests = createAsyncThunk(
  'matchRequest/fetchMatchRequests',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/swipes/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch match requests');
    }
  }
);

export const respondToMatchRequest = createAsyncThunk(
  'matchRequest/respondToMatchRequest',
  async ({ swiperId, action }: { swiperId: number; action: 'LIKE' | 'PASS' }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/swipes`, {
        swipedUserId: swiperId,
        action
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { ...response.data, swiperId, action };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to respond to match request');
    }
  }
);

const matchRequestSlice = createSlice({
  name: 'matchRequest',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    removeRequest: (state, action) => {
      state.requests = state.requests.filter(request => request.swiperId !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Match Requests
      .addCase(fetchMatchRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMatchRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.requests = action.payload.data;
        }
      })
      .addCase(fetchMatchRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Respond to Match Request
      .addCase(respondToMatchRequest.fulfilled, (state, action) => {
        if (action.payload.success) {
          // Remove the request from the list
          state.requests = state.requests.filter(
            request => request.swiperId !== action.payload.swiperId
          );
        }
      })
      .addCase(respondToMatchRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, removeRequest } = matchRequestSlice.actions;
export default matchRequestSlice.reducer;