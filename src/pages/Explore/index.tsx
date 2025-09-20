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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Search, Clear, ChevronLeft, ChevronRight, Sort } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchAnime, fetchMovies, fetchShows, fetchBooks } from '../../redux/mediaSlice';
import { setSearch } from '../../redux/searchSlice';
import MediaCard from '../../components/cards/MediaCard';
import { COLORS } from '../../theme/colors';
import { RequestServer } from '../../config/api';
import { debounce } from 'lodash';

const SearchMedia: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('popularity');
  
  const dispatch = useDispatch<AppDispatch>();
  const { 
    anime, 
    movies, 
    shows, 
    books,
    isLoading, 
    error, 
    animePagination, 
    moviesPagination, 
    showsPagination,
    booksPagination
  } = useSelector((state: RootState) => state.media);
  const { token } = useSelector((state: RootState) => state.auth);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string, tab: number, page: number, sort: string) => {
      const sortParam = getSortParam(tab, sort);
      switch (tab) {
        case 0:
          dispatch(fetchAnime({ page, search: query, sort: sortParam, append: false }));
          break;
        case 1:
          dispatch(fetchMovies({ page, search: query, sort: sortParam, append: false }));
          break;
        case 2:
          dispatch(fetchShows({ page, search: query, sort: sortParam, append: false }));
          break;
        case 3:
          dispatch(fetchBooks({ page, search: query, sort: sortParam, append: false }));
          break;
      }
    }, 500),
    [dispatch]
  );

  // Get sort parameter based on tab and sort option
  const getSortParam = (tab: number, sort: string) => {
    if (tab === 0) {
      // Anime - Shikimori API
      return sort; // popularity, ranked, name, aired_on, episodes, status
    } else if (tab === 3) {
      // Books - Open Library API
      return sort; // new, old, random, title, rating
    } else {
      // Movies/Shows - TMDB API
      return sort; // popularity.desc, release_date.desc, vote_average.desc, vote_count.desc
    }
  };

  // Initial load
  useEffect(() => {
    dispatch(fetchAnime({ page: 1, search: '', sort: 'popularity', append: false }));
    dispatch(fetchMovies({ page: 1, search: '', sort: 'popularity.desc', append: false }));
    dispatch(fetchShows({ page: 1, search: '', sort: 'popularity.desc', append: false }));
    dispatch(fetchBooks({ page: 1, search: '', sort: 'new', append: false }));
  }, [dispatch]);

  // Handle search and sort changes
  useEffect(() => {
    setCurrentPage(1);
    debouncedSearch(searchQuery, currentTab, 1, sortBy);
  }, [searchQuery, currentTab, sortBy, debouncedSearch]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setCurrentPage(1);
    // Reset sort to default for new tab
    if (newValue === 0) {
      setSortBy('popularity'); // Anime
    } else if (newValue === 3) {
      setSortBy('new'); // Books
    } else {
      setSortBy('popularity.desc'); // Movies/Shows
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    dispatch(setSearch(event.target.value));
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    dispatch(setSearch(''));
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
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
    const sortParam = getSortParam(currentTab, sortBy);
    switch (currentTab) {
      case 0:
        dispatch(fetchAnime({ page, search: searchQuery, sort: sortParam, append: false }));
        break;
      case 1:
        dispatch(fetchMovies({ page, search: searchQuery, sort: sortParam, append: false }));
        break;
      case 2:
        dispatch(fetchShows({ page, search: searchQuery, sort: sortParam, append: false }));
        break;
      case 3:
        dispatch(fetchBooks({ page, search: searchQuery, sort: sortParam, append: false }));
        break;
    }
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSortOptions = () => {
    if (currentTab === 0) {
      // Anime options (Shikimori API)
      return [
        { value: 'popularity', label: 'Most Popular' },
        { value: 'ranked', label: 'Highest Rated' },
        { value: 'name', label: 'A-Z' },
        { value: 'aired_on', label: 'Release Date' },
        { value: 'episodes', label: 'Episode Count' },
        { value: 'status', label: 'Status' },
      ];
    } else if (currentTab === 3) {
      // Books options (Open Library API)
      return [
        { value: 'new', label: 'Newest First' },
        { value: 'old', label: 'Oldest First' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'title', label: 'A-Z' },
        { value: 'random', label: 'Random' },
      ];
    } else {
      // Movies/Shows options (TMDB API)
      return [
        { value: 'popularity.desc', label: 'Most Popular' },
        { value: 'vote_average.desc', label: 'Highest Rated' },
        { value: 'release_date.desc', label: 'Newest First' },
        { value: 'vote_count.desc', label: 'Most Voted' },
      ];
    }
  };

  const handleAddToLibrary = async (mediaData: {
    mediaId: number;
    rating: number;
    status: string;
    review?: string;
  }) => {
    try {
      const response = await RequestServer(
        '/myMedia',
        'POST',
        {
          ...mediaData,
          type: currentTab === 0 ? 'ANIME' : currentTab === 1 ? 'MOVIE' : currentTab === 2 ? 'SHOW' : 'BOOK',
        },
        false,
        token
      );

      if (response?.success) {
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
      case 3:
        return books;
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
      case 3:
        return booksPagination;
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
      case 3:
        return `Books`;
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
          Explore anime, movies, TV shows, and books. Rate them to find your perfect matches!
        </Typography>
      </Box>

      {/* Search Bar and Sort */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          maxWidth: 800,
          mx: 'auto'
        }}>
          <TextField
            fullWidth
            placeholder={`Search ${getTabLabel(currentTab).toLowerCase()}...`}
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              flex: 1,
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
          
          <FormControl 
            size="medium" 
            sx={{ 
              minWidth: isMobile ? '100%' : 200,
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
          >
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <Sort sx={{ color: COLORS.TEXT_SECONDARY, mr: 1 }} />
                </InputAdornment>
              }
            >
              {getSortOptions().map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
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
          <Tab label={getTabLabel(3)} />
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
              {/* For Anime and Books (no total pages) - use prev/next buttons */}
              {(currentTab === 0 || currentTab === 3) ? (
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
                getCurrentPagination().totalPages && getCurrentPagination().totalPages! > 1 && (
                  <Pagination
                    count={getCurrentPagination().totalPages || 1}
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
                {(currentTab === 0 || currentTab === 3) ? (
                  /* Anime/Books - no total pages */
                  <>
                    Page {getCurrentPagination().currentPage}
                    {getCurrentPagination().totalResults && (
                      <> • {getCurrentPagination().totalResults?.toLocaleString()} total results</>
                    )}
                  </>
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