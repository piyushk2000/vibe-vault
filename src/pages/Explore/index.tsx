import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  SelectChangeEvent,
  MenuItem,
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
import { useIsMobile } from '../../utils/mobile';
import AuthModal from '../../components/auth/AuthModal';

const SearchMedia: React.FC = () => {
  const isMobile = useIsMobile();
  const [currentTab, setCurrentTab] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Store filter state per tab
  const [tabStates, setTabStates] = useState({
    0: { searchQuery: '', currentPage: 1, sortBy: 'popularity' }, // Anime
    1: { searchQuery: '', currentPage: 1, sortBy: 'popularity.desc' }, // Movies
    2: { searchQuery: '', currentPage: 1, sortBy: 'popularity.desc' }, // Shows
    3: { searchQuery: '', currentPage: 1, sortBy: 'new' }, // Books
  });

  // Track what filters were last used to load data for each tab
  const [lastLoadedFilters, setLastLoadedFilters] = useState({
    0: { searchQuery: '', currentPage: 1, sortBy: 'popularity' }, // Anime
    1: null, // Movies - not loaded yet
    2: null, // Shows - not loaded yet  
    3: null, // Books - not loaded yet
  });

  // Get current tab's state
  const currentTabState = tabStates[currentTab as keyof typeof tabStates];
  const { searchQuery, currentPage, sortBy } = currentTabState;
  
  const dispatch = useDispatch<AppDispatch>();
  const { 
    anime, 
    movies, 
    shows, 
    books,
    isLoading, 
    error, 
    animeError,
    moviesError,
    showsError,
    booksError,
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

  // Initial load - only load anime first
  useEffect(() => {
    dispatch(fetchAnime({ page: 1, search: '', sort: 'popularity', append: false }));
    // Update last loaded filters for initial anime load
    setLastLoadedFilters(prev => ({
      ...prev,
      0: { searchQuery: '', currentPage: 1, sortBy: 'popularity' }
    }));
    // Don't load movies, shows, books initially to avoid rate limiting
  }, [dispatch]);

  // Handle search changes - trigger debounced search when search query changes
  const prevTabRef = useRef(currentTab);
  useEffect(() => {
    const isTabSwitch = prevTabRef.current !== currentTab;
    prevTabRef.current = currentTab;
    
    if (isTabSwitch) {
      // Don't fetch on tab switch - handleTabChange will handle it
      return;
    }
    
    debouncedSearch(searchQuery, currentTab, currentPage, sortBy);
    // Update last loaded filters when search/sort changes
    setLastLoadedFilters(prev => ({
      ...prev,
      [currentTab]: { searchQuery, currentPage, sortBy }
    }));
  }, [searchQuery, currentTab, sortBy, debouncedSearch, currentPage]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);

    // Load data for the tab if not already loaded or if filters don't match
    const currentMedia = getCurrentMediaForTab(newValue);
    const tabState = tabStates[newValue as keyof typeof tabStates];
    const lastFilters = lastLoadedFilters[newValue as keyof typeof lastLoadedFilters];
    
    // Check if we need to fetch new data
    const hasData = currentMedia.length > 0;
    const filtersMatch = lastFilters && 
      lastFilters.searchQuery === tabState.searchQuery &&
      lastFilters.currentPage === tabState.currentPage &&
      lastFilters.sortBy === tabState.sortBy;
    
    if (!hasData || !filtersMatch) {
      // Small delay to avoid overwhelming the API
      setTimeout(() => {
        const sortParam = getSortParam(newValue, tabState.sortBy);
        switch (newValue) {
          case 0:
            dispatch(fetchAnime({ page: tabState.currentPage, search: tabState.searchQuery, sort: sortParam, append: false }));
            break;
          case 1:
            dispatch(fetchMovies({ page: tabState.currentPage, search: tabState.searchQuery, sort: sortParam, append: false }));
            break;
          case 2:
            dispatch(fetchShows({ page: tabState.currentPage, search: tabState.searchQuery, sort: sortParam, append: false }));
            break;
          case 3:
            dispatch(fetchBooks({ page: tabState.currentPage, search: tabState.searchQuery, sort: sortParam, append: false }));
            break;
        }
        // Update last loaded filters
        setLastLoadedFilters(prev => ({
          ...prev,
          [newValue]: { ...tabState }
        }));
      }, 500); // 500ms delay
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = event.target.value;
    setTabStates(prev => ({
      ...prev,
      [currentTab]: {
        ...prev[currentTab as keyof typeof prev],
        searchQuery: newSearchQuery,
        currentPage: 1, // Reset to page 1 when searching
      }
    }));
    dispatch(setSearch(newSearchQuery));
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const newSortBy = event.target.value;
    setTabStates(prev => ({
      ...prev,
      [currentTab]: {
        ...prev[currentTab as keyof typeof prev],
        sortBy: newSortBy,
        currentPage: 1, // Reset to page 1 when sorting
      }
    }));
  };

  const handleClearSearch = () => {
    setTabStates(prev => ({
      ...prev,
      [currentTab]: {
        ...prev[currentTab as keyof typeof prev],
        searchQuery: '',
        currentPage: 1, // Reset to page 1 when clearing search
      }
    }));
    dispatch(setSearch(''));
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    // Validate page number for TMDB API (Movies/Shows)
    if ((currentTab === 1 || currentTab === 2) && (page < 1 || page > 500)) {
      return; // Don't navigate to invalid pages
    }
    
    setTabStates(prev => ({
      ...prev,
      [currentTab]: {
        ...prev[currentTab as keyof typeof prev],
        currentPage: page,
      }
    }));
    fetchPageData(page);
  };

  const handlePrevPage = () => {
    const newPage = currentPage - 1;
    setTabStates(prev => ({
      ...prev,
      [currentTab]: {
        ...prev[currentTab as keyof typeof prev],
        currentPage: newPage,
      }
    }));
    fetchPageData(newPage);
  };

  const handleNextPage = () => {
    const newPage = currentPage + 1;
    
    // Validate page number for TMDB API (Movies/Shows)
    if ((currentTab === 1 || currentTab === 2) && newPage > 500) {
      return; // Don't navigate beyond page 500
    }
    
    setTabStates(prev => ({
      ...prev,
      [currentTab]: {
        ...prev[currentTab as keyof typeof prev],
        currentPage: newPage,
      }
    }));
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
    if (!token) {
      setAuthModalOpen(true);
      return;
    }

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

  const getCurrentMediaForTab = (tab: number) => {
    switch (tab) {
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

  const getCurrentError = () => {
    switch (currentTab) {
      case 0:
        return animeError;
      case 1:
        return moviesError;
      case 2:
        return showsError;
      case 3:
        return booksError;
      default:
        return null;
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

  return (
    <>
      <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
        {/* Header */}
        <Box sx={{ mb: isMobile ? 2 : 4 }}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: 'bold',
              mb: isMobile ? 1 : 2,
            background: `linear-gradient(45deg, ${COLORS.ACCENT} 30%, ${COLORS.ACCENT_LIGHT} 90%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: isMobile ? '1.75rem' : undefined,
          }}
        >
          Discover Your Next Favorite
        </Typography>
        <Typography 
          variant={isMobile ? "body2" : "body1"} 
          color="textSecondary"
          sx={{ fontSize: isMobile ? '0.875rem' : undefined }}
        >
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
              endAdornment: (
                <InputAdornment position="end">
                  {searchQuery && (
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
                  )}
                  <Button
                    onClick={() => debouncedSearch(searchQuery, currentTab, 1, sortBy)}
                    sx={{ 
                      minWidth: 'auto', 
                      p: 0.5,
                      ml: searchQuery ? 0.5 : 0,
                      color: COLORS.TEXT_SECONDARY,
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: COLORS.ACCENT,
                      }
                    }}
                  >
                    <Search />
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
              onChange={handleSortChange}
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
      <Box sx={{ mb: isMobile ? 2 : 4 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: COLORS.ACCENT,
            },
            '& .MuiTab-root': {
              color: COLORS.TAB_INACTIVE,
              fontSize: isMobile ? '0.875rem' : undefined,
              minWidth: isMobile ? 'auto' : undefined,
              padding: isMobile ? '8px 16px' : undefined,
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
          {getCurrentError() && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={() => {
                    const sortParam = getSortParam(currentTab, sortBy);
                    switch (currentTab) {
                      case 0:
                        dispatch(fetchAnime({ page: currentPage, search: searchQuery, sort: sortParam, append: false }));
                        break;
                      case 1:
                        dispatch(fetchMovies({ page: currentPage, search: searchQuery, sort: sortParam, append: false }));
                        break;
                      case 2:
                        dispatch(fetchShows({ page: currentPage, search: searchQuery, sort: sortParam, append: false }));
                        break;
                      case 3:
                        dispatch(fetchBooks({ page: currentPage, search: searchQuery, sort: sortParam, append: false }));
                        break;
                    }
                  }}
                >
                  Retry
                </Button>
              }
            >
              {getCurrentError()}
            </Alert>
          )}
          <Grid container spacing={isMobile ? 2 : 3}>
            {getCurrentMedia().length > 0 ? (
              getCurrentMedia().map((media, index) => (
                <Grid item key={`${media.apiId}-${index}`} xs={12} sm={6} md={4} lg={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <MediaCard
                      media={media}
                      onAddToLibrary={handleAddToLibrary}
                      showAddButton={true}
                    />
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: isMobile ? 4 : 8 }}>
                  <Typography 
                    variant={isMobile ? "body1" : "h6"} 
                    color="textSecondary"
                    sx={{ fontSize: isMobile ? '1rem' : undefined }}
                  >
                    {searchQuery.trim() 
                      ? `No results found for "${searchQuery}"`
                      : 'No media available'
                    }
                  </Typography>
                  {searchQuery.trim() && (
                    <Typography 
                      variant="body2" 
                      color="textSecondary" 
                      sx={{ 
                        mt: 1,
                        fontSize: isMobile ? '0.875rem' : undefined,
                      }}
                    >
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
                    {getCurrentPagination().currentPage >= 500 && (
                      <Typography variant="caption" display="block" sx={{ mt: 1, color: COLORS.WARNING }}>
                        Note: API limits results to 500 pages maximum
                      </Typography>
                    )}
                  </>
                )}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>

    <AuthModal
      open={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
    />
    </>
  );
};

export default SearchMedia;