import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

interface Media {
  id: number;
  apiId: number;
  title: string;
  description: string;
  genres: string[];
  image: string;
  type: 'ANIME' | 'MOVIE' | 'SHOW' | 'BOOK';
  meta: any;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number | null;
  totalResults?: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface MediaState {
  anime: Media[];
  movies: Media[];
  shows: Media[];
  books: Media[];
  currentMedia: Media | null;
  isLoading: boolean;
  error: string | null;
  animePagination: PaginationInfo;
  moviesPagination: PaginationInfo;
  showsPagination: PaginationInfo;
  booksPagination: PaginationInfo;
}

const initialState: MediaState = {
  anime: [],
  movies: [],
  shows: [],
  books: [],
  currentMedia: null,
  isLoading: false,
  error: null,
  animePagination: {
    currentPage: 1,
    totalPages: null,
    hasNextPage: false,
    hasPrevPage: false,
  },
  moviesPagination: {
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
  showsPagination: {
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
  booksPagination: {
    currentPage: 1,
    totalPages: null,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

// Async thunks
export const fetchAnime = createAsyncThunk(
  'media/fetchAnime', 
  async ({ page = 1, search = '', sort = 'popularity', append = false }: { 
    page?: number; 
    search?: string; 
    sort?: string;
    append?: boolean;
  }) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('sort', sort);
    if (search.trim()) {
      params.append('search', search.trim());
    }
    
    const response = await axios.get(`${API_BASE_URL}/media/anime?${params}`);
    return { ...response.data, append };
  }
);

export const fetchMovies = createAsyncThunk(
  'media/fetchMovies', 
  async ({ page = 1, search = '', sort = 'popularity.desc', append = false }: { 
    page?: number; 
    search?: string; 
    sort?: string;
    append?: boolean;
  }) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('sort', sort);
    if (search.trim()) {
      params.append('search', search.trim());
    }
    
    const response = await axios.get(`${API_BASE_URL}/media/movies?${params}`);
    return { ...response.data, append };
  }
);

export const fetchShows = createAsyncThunk(
  'media/fetchShows', 
  async ({ page = 1, search = '', sort = 'popularity.desc', append = false }: { 
    page?: number; 
    search?: string; 
    sort?: string;
    append?: boolean;
  }) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('sort', sort);
    if (search.trim()) {
      params.append('search', search.trim());
    }
    
    const response = await axios.get(`${API_BASE_URL}/media/series?${params}`);
    return { ...response.data, append };
  }
);

export const fetchBooks = createAsyncThunk(
  'media/fetchBooks', 
  async ({ page = 1, search = '', sort = 'new', append = false }: { 
    page?: number; 
    search?: string; 
    sort?: string;
    append?: boolean;
  }) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('sort', sort);
    if (search.trim()) {
      params.append('search', search.trim());
    }
    
    const response = await axios.get(`${API_BASE_URL}/books?${params}`);
    return { ...response.data, append };
  }
);

export const fetchMediaById = createAsyncThunk(
  'media/fetchById',
  async ({ type, id }: { type: string; id: number }) => {
    const response = await axios.get(`${API_BASE_URL}/media/${type}/${id}`);
    return response.data;
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    clearCurrentMedia: (state) => {
      state.currentMedia = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAnime: (state) => {
      state.anime = [];
      state.animePagination = {
        currentPage: 1,
        totalPages: null,
        hasNextPage: false,
        hasPrevPage: false,
      };
    },
    clearMovies: (state) => {
      state.movies = [];
      state.moviesPagination = initialState.moviesPagination;
    },
    clearShows: (state) => {
      state.shows = [];
      state.showsPagination = initialState.showsPagination;
    },
    clearBooks: (state) => {
      state.books = [];
      state.booksPagination = {
        currentPage: 1,
        totalPages: null,
        hasNextPage: false,
        hasPrevPage: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Anime
      .addCase(fetchAnime.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnime.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          if (action.payload.append) {
            state.anime = [...state.anime, ...action.payload.data.data];
          } else {
            state.anime = action.payload.data.data;
          }
          state.animePagination = action.payload.data.pagination;
        }
      })
      .addCase(fetchAnime.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch anime';
      })
      // Fetch Movies
      .addCase(fetchMovies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          if (action.payload.append) {
            state.movies = [...state.movies, ...action.payload.data.data];
          } else {
            state.movies = action.payload.data.data;
          }
          state.moviesPagination = action.payload.data.pagination;
        }
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      })
      // Fetch Shows
      .addCase(fetchShows.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShows.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          if (action.payload.append) {
            state.shows = [...state.shows, ...action.payload.data.data];
          } else {
            state.shows = action.payload.data.data;
          }
          state.showsPagination = action.payload.data.pagination;
        }
      })
      .addCase(fetchShows.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch shows';
      })
      // Fetch Books
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          if (action.payload.append) {
            state.books = [...state.books, ...action.payload.data.data];
          } else {
            state.books = action.payload.data.data;
          }
          state.booksPagination = action.payload.data.pagination;
        }
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch books';
      })
      // Fetch Media by ID
      .addCase(fetchMediaById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMediaById.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.currentMedia = action.payload.data;
        }
      })
      .addCase(fetchMediaById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch media details';
      });
  },
});

export const { clearCurrentMedia, clearError, clearAnime, clearMovies, clearShows, clearBooks } = mediaSlice.actions;
export default mediaSlice.reducer;