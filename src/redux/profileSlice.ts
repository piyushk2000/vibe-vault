import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

interface Profile {
  id: number;
  bio: string;
  interests: string[];
  avatar: string | null;
  photos?: string[];
  location?: string;
  latitude?: number;
  longitude?: number;
  mbtiType?: string;
  userId: number;
  User: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
  };
}

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData: { 
    bio?: string; 
    interests?: string[]; 
    avatar?: string;
    photos?: string[];
    location?: string;
    latitude?: number;
    longitude?: number;
    mbtiType?: string;
  }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const updateUser = createAsyncThunk(
  'profile/updateUser',
  async (userData: { name: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/profile/user`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.profile = action.payload.data;
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.profile = action.payload.data;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        if (action.payload.success && state.profile) {
          state.profile.User = { ...state.profile.User, ...action.payload.data };
        }
      });
  },
});

export const { clearError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;