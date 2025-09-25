import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RequestServer } from '../config/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// Async thunks
export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      // Validate token by making a request to get user profile or a protected endpoint
      const response = await RequestServer('/profile', 'GET');
      
      if (response && response.success) {
        return response;
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('token');
        return rejectWithValue('Invalid token');
      }
    } catch (error: any) {
      // Token is invalid, remove it
      localStorage.removeItem('token');
      return rejectWithValue(error.message || 'Token validation failed');
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await RequestServer('/users/signup', 'POST', {
        name,
        email,
        password,
      });
      
      // Check if the response indicates failure
      if (response && !response.success) {
        return rejectWithValue(response.message || 'Sign up failed');
      }
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Sign up failed');
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await RequestServer('/users/signin', 'POST', {
        email,
        password,
      });
      
      // Check if the response indicates failure
      if (response && !response.success) {
        return rejectWithValue(response.message || 'Sign in failed');
      }
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Sign in failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize Auth
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success && action.payload?.data) {
          state.user = action.payload.data;
          state.token = localStorage.getItem('token'); // Ensure token is set
          state.error = null;
        } else {
          state.user = null;
          state.token = null;
          state.error = action.payload?.message || 'Auth initialization failed';
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.error = null; // Don't show error for initialization failures
      })
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('SignUp response:', action.payload);
        if (action.payload?.success && action.payload?.data) {
          state.user = action.payload.data.user;
          state.token = action.payload.data.token;
          localStorage.setItem('token', action.payload.data.token);
          state.error = null;
        } else {
          state.error = action.payload?.message || 'Invalid response format';
        }
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || action.error.message || 'Sign up failed';
      })
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('SignIn response:', action.payload);
        if (action.payload?.success && action.payload?.data) {
          state.user = action.payload.data.user;
          state.token = action.payload.data.token;
          localStorage.setItem('token', action.payload.data.token);
          state.error = null;
        } else {
          state.error = action.payload?.message || 'Invalid response format';
        }
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || action.error.message || 'Sign in failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;