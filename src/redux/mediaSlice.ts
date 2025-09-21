import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RequestServer } from '../config/api';

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
  animeError: string | null;
  moviesError: string | null;
  showsError: string | null;
  booksError: string | null;
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
  animeError: null,
  moviesError: null,
  showsError: null,
  booksError: null,
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
    
    const response = await RequestServer(`/media/anime?${params}`, 'GET');
    return { ...response, append };
  }
);

export const fetchMovies = createAsyncThunk(
  'media/fetchMovies', 
  async ({ page = 1, search = '', sort = 'popularity.desc', append = false }: { 
    page?: number; 
    search?: string; 
    sort?: string;
    append?: boolean;
  }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('sort', sort);
      if (search.trim()) {
        params.append('search', search.trim());
      }
      
      const response = await RequestServer(`/media/movies?${params}`, 'GET');
      
      // If the response indicates failure, return it so we can handle it in fulfilled
      if (!response.success) {
        return { ...response, append };
      }
      
      return { ...response, append };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch movies');
    }
  }
);

export const fetchShows = createAsyncThunk(
  'media/fetchShows', 
  async ({ page = 1, search = '', sort = 'popularity.desc', append = false }: { 
    page?: number; 
    search?: string; 
    sort?: string;
    append?: boolean;
  }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('sort', sort);
      if (search.trim()) {
        params.append('search', search.trim());
      }
      
      const response = await RequestServer(`/media/series?${params}`, 'GET');
      
      // If the response indicates failure, return it so we can handle it in fulfilled
      if (!response.success) {
        return { ...response, append };
      }
      
      return { ...response, append };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch shows');
    }
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
    
    const response = await RequestServer(`/books?${params}`, 'GET');
    return { ...response, append };
  }
);

export const fetchMediaById = createAsyncThunk(
  'media/fetchById',
  async ({ type, id }: { type: string; id: number }) => {
    const response = await RequestServer(`/media/${type}/${id}`, 'GET');
    return response;
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
      state.animeError = null;
      state.moviesError = null;
      state.showsError = null;
      state.booksError = null;
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
        state.animeError = null;
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
          state.animeError = null; 
        }
      })
      .addCase(fetchAnime.rejected, (state, action) => {
        state.isLoading = false;
        state.animeError = action.error.message || 'Failed to fetch anime';
      })
      // Fetch Movies
      .addCase(fetchMovies.pending, (state) => {
        state.isLoading = true;
        state.moviesError = null;
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
          state.moviesError = null; // Clear error on success
        } else {
          // Handle API error responses
          state.moviesError = action.payload.message || 'Failed to fetch movies';
        }
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.moviesError = action.error.message || 'Failed to fetch movies';
      })
      // Fetch Shows
      .addCase(fetchShows.pending, (state) => {
        state.isLoading = true;
        state.showsError = null;
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
          state.showsError = null; // Clear error on success
        } else {
          // Handle API error responses
          state.showsError = action.payload.message || 'Failed to fetch shows';
        }
      })
      .addCase(fetchShows.rejected, (state, action) => {
        state.isLoading = false;
        state.showsError = action.error.message || 'Failed to fetch shows';
      })
      // Fetch Books
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
        state.booksError = null;
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
          state.booksError = null; // Clear error on success
        }
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.booksError = action.error.message || 'Failed to fetch books';
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
          state.error = null; // Clear error on success
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