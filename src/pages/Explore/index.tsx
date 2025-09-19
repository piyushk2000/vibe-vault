import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Grid,
  Alert,
  CircularProgress,
  Pagination,
  Button,
  IconButton,
} from '@mui/material';
import { Search, Clear, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchAnime, fetchMovies, fetchShows, clearAnime, clearMovies, clearShows } from '../../redux/mediaSlice';
import { setSearch } from '../../redux/searchSlice';
import MediaCard from '../../components/cards/MediaCard';
import { COLORS } from '../../theme/colors';
import axios from 'axios';
import { debounce } from 'lodash';

const API_BASE_URL = 'http://localhost:3000';

const SearchMedia: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const dispatch = useDispatch<AppDispatch>();
  const { 
    anime, 
    movies, 
    shows, 
    isLoading, 
    error, 
    animePagination, 
    moviesPagination, 
    showsPagination 
  } = useSelector((state: RootState) => state.media);
  const { token } = useSelector((state: RootState) => state.auth);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string, tab: number, page: number) => {
      switch (tab) {
        case 0:
          dispatch(fetchAnime({ page, search: query, append: false }));
          break;
        case 1:
          dispatch(fetchMovies({ page, search: query, append: false }));
          break;
        case 2:
          dispatch(fetchShows({ page, search: query, append: false }));
          break;
      }
    }, 500),
    [dispatch]
  );

  // Initial load
  useEffect(() => {
    dispatch(fetchAnime({ page: 1, search: '', append: false }));
    dispatch(fetchMovies({ page: 1, search: '', append: false }));
    dispatch(fetchShows({ page: 1, search: '', append: false }));
  }, [dispatch]);

  // Handle search changes
  useEffect(() => {
    setCurrentPage(1);
    debouncedSearch(searchQuery, currentTab, 1);
  }, [searchQuery, currentTab, debouncedSearch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    dispatch(setSearch(event.target.value));
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    dispatch(setSearch(''));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    fetchPageData(page);
  };

  const handlePrevPage = () => {
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    fetchPageData(newPage);
  };

  const handleNextPage = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    fetchPageData(newPage);
  };

  const fetchPageData = (page: number) => {
    switch (currentTab) {
      case 0:
        dispatch(fetchAnime({ page, search: searchQuery, append: false }));
        break;
      case 1:
        dispatch(fetchMovies({ page, search: searchQuery, append: false }));
        break;
      case 2:
        dispatch(fetchShows({ page, search: searchQuery, append: false }));
        break;
    }
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToLibrary = async (mediaData: {
    mediaId: number;
    rating: number;
    status: string;
    review?: string;
  }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/myMedia`,
        {
          ...mediaData,
          type: currentTab === 0 ? 'ANIME' : currentTab === 1 ? 'MOVIE' : 'SHOW',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Show success message or update UI
        console.log('Added to library successfully');
      }
    } catch (error) {
      console.error('Failed to add to library:', error);
    }
  };

  const getCurrentMedia = () => {
    switch (currentTab) {
      case 0:
        return anime;
      case 1:
        return movies;
      case 2:
        return shows;
      default:
        return [];
    }
  };

  const getCurrentPagination = () => {
    switch (currentTab) {
      case 0:
        return animePagination;
      case 1:
        return moviesPagination;
      case 2:
        return showsPagination;
      default:
        return { currentPage: 1, totalPages: null, hasNextPage: false, hasPrevPage: false };
    }
  };

  const getTabLabel = (index: number) => {
    switch (index) {
      case 0:
        return `Anime`;
      case 1:
        return `Movies`;
      case 2:
        return `Shows`;
      default:
        return '';
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            background: `linear-gradient(45deg, ${COLORS.ACCENT} 30%, ${COLORS.ACCENT_LIGHT} 90%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Discover Your Next Favorite
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Explore anime, movies, and TV shows. Rate them to find your perfect matches!
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder={`Search ${getTabLabel(currentTab).toLowerCase()}...`}
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{
            maxWidth: 600,
            '& .MuiOutlinedInput-root': {
              backgroundColor: COLORS.SEARCH_BOX_BACKGROUND,
              '& fieldset': {
                borderColor: COLORS.BORDER,
              },
              '&:hover fieldset': {
                borderColor: COLORS.ACCENT,
              },
              '&.Mui-focused fieldset': {
                borderColor: COLORS.ACCENT,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: COLORS.TEXT_SECONDARY }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <Button
                  onClick={handleClearSearch}
                  sx={{ 
                    minWidth: 'auto', 
                    p: 0.5,
                    color: COLORS.TEXT_SECONDARY,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: COLORS.ACCENT,
                    }
                  }}
                >
                  <Clear />
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: COLORS.ACCENT,
            },
            '& .MuiTab-root': {
              color: COLORS.TAB_INACTIVE,
              '&.Mui-selected': {
                color: COLORS.TAB,
              },
            },
          }}
        >
          <Tab label={getTabLabel(0)} />
          <Tab label={getTabLabel(1)} />
          <Tab label={getTabLabel(2)} />
        </Tabs>
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: COLORS.ACCENT }} />
        </Box>
      )}

      {/* Media Grid */}
      {!isLoading && (
        <>
          <Grid container spacing={3}>
            {getCurrentMedia().length > 0 ? (
              getCurrentMedia().map((media, index) => (
                <Grid item key={`${media.apiId}-${index}`} xs={12} sm={6} md={4} lg={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <MediaCard
                      media={media}
                      onAddToLibrary={handleAddToLibrary}
                      showAddButton={!!token}
                    />
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="textSecondary">
                    {searchQuery.trim() 
                      ? `No results found for "${searchQuery}"`
                      : 'No media available'
                    }
                  </Typography>
                  {searchQuery.trim() && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Try adjusting your search terms
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Pagination */}
          {getCurrentMedia().length > 0 && (getCurrentPagination().hasNextPage || getCurrentPagination().hasPrevPage) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, mb: 2, gap: 2 }}>
              {/* For Anime (no total pages) - use prev/next buttons */}
              {currentTab === 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ChevronLeft />}
                    onClick={handlePrevPage}
                    disabled={!getCurrentPagination().hasPrevPage}
                    sx={{
                      borderColor: COLORS.ACCENT,
                      color: COLORS.ACCENT,
                      '&:hover': {
                        borderColor: COLORS.ACCENT_HOVER,
                        backgroundColor: `${COLORS.ACCENT}20`,
                      },
                      '&:disabled': {
                        borderColor: COLORS.TEXT_INACTIVE,
                        color: COLORS.TEXT_INACTIVE,
                      },
                    }}
                  >
                    Previous
                  </Button>
                  
                  <Typography variant="body1" sx={{ mx: 2, color: COLORS.TEXT_PRIMARY }}>
                    Page {getCurrentPagination().currentPage}
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    endIcon={<ChevronRight />}
                    onClick={handleNextPage}
                    disabled={!getCurrentPagination().hasNextPage}
                    sx={{
                      borderColor: COLORS.ACCENT,
                      color: COLORS.ACCENT,
                      '&:hover': {
                        borderColor: COLORS.ACCENT_HOVER,
                        backgroundColor: `${COLORS.ACCENT}20`,
                      },
                      '&:disabled': {
                        borderColor: COLORS.TEXT_INACTIVE,
                        color: COLORS.TEXT_INACTIVE,
                      },
                    }}
                  >
                    Next
                  </Button>
                </Box>
              ) : (
                /* For Movies/Shows (with total pages) - use full pagination */
                getCurrentPagination().totalPages && getCurrentPagination().totalPages > 1 && (
                  <Pagination
                    count={getCurrentPagination().totalPages}
                    page={getCurrentPagination().currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: COLORS.TEXT_PRIMARY,
                        '&:hover': {
                          backgroundColor: COLORS.CARD_HOVER,
                        },
                        '&.Mui-selected': {
                          backgroundColor: COLORS.ACCENT,
                          color: 'white',
                          '&:hover': {
                            backgroundColor: COLORS.ACCENT_HOVER,
                          },
                        },
                      },
                    }}
                  />
                )
              )}
            </Box>
          )}

          {/* Results Info */}
          {getCurrentMedia().length > 0 && (
            <Box sx={{ textAlign: 'center', mt: 2, mb: 4 }}>
              <Typography variant="body2" color="textSecondary">
                {currentTab === 0 ? (
                  /* Anime - no total pages */
                  `Page ${getCurrentPagination().currentPage}`
                ) : (
                  /* Movies/Shows - with total pages */
                  <>
                    Page {getCurrentPagination().currentPage} of {getCurrentPagination().totalPages}
                    {getCurrentPagination().totalResults && (
                      <> • {getCurrentPagination().totalResults} total results</>
                    )}
                  </>
                )}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default SearchMedia;