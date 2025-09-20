import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tabs,
  Tab,
  Badge,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { AccountCircle, Logout, Person, Edit, Menu as MenuIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../redux/authSlice';
import { fetchProfile } from '../../redux/profileSlice';
import { fetchMatchRequests } from '../../redux/matchRequestSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { COLORS } from '../../theme/colors';
import ProfileModal from '../profile/ProfileModal';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.profile);
  const { requests } = useSelector((state: RootState) => state.matchRequest);

  useEffect(() => {
    if (user) {
      dispatch(fetchProfile());
      dispatch(fetchMatchRequests());
    }
  }, [user, dispatch]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
    handleMobileMenuClose();
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  const handleMobileNavigation = (path: string) => {
    navigate(path);
    handleMobileMenuClose();
  };

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === '/explore') return '/explore';
    if (path === '/my-vibe') return '/my-vibe';
    if (path === '/find-matches') return '/find-matches';
    if (path === '/match-requests') return '/match-requests';
    if (path === '/matched') return '/matched';
    return '/explore';
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: COLORS.NAV_BACKGROUND,
        borderBottom: `1px solid ${COLORS.BORDER}`,
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Mobile Hamburger Menu */}
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${COLORS.ACCENT} 30%, ${COLORS.ACCENT_LIGHT} 90%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
            flexGrow: isMobile ? 1 : 0,
          }}
          onClick={() => navigate('/explore')}
        >
          VibeVault
        </Typography>

        {/* Navigation Tabs - Hidden on mobile */}
        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Tabs
              value={getCurrentTab()}
              onChange={handleTabChange}
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: COLORS.ACCENT,
                },
                '& .MuiTab-root': {
                  color: COLORS.NAV_INACTIVE,
                  '&.Mui-selected': {
                    color: COLORS.NAV_ACTIVE,
                  },
                },
              }}
            >
              <Tab label="Explore" value="/explore" />
              <Tab label="My Vibe" value="/my-vibe" />
              <Tab label="Find Matches" value="/find-matches" />
              <Tab 
                label={
                  <Badge 
                    badgeContent={requests.length} 
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: COLORS.ERROR,
                        color: 'white',
                        fontSize: '0.7rem',
                        minWidth: 16,
                        height: 16,
                      },
                    }}
                  >
                    Match Requests
                  </Badge>
                } 
                value="/match-requests" 
              />
              <Tab label="Matched" value="/matched" />
            </Tabs>
          </Box>
        )}

        {/* User Menu */}
        <Box>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            {profile?.avatar ? (
              <Avatar
                src={profile.avatar}
                sx={{
                  width: 32,
                  height: 32,
                  border: `2px solid ${COLORS.ACCENT}`,
                }}
              />
            ) : user?.name ? (
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: COLORS.ACCENT,
                  fontSize: '0.875rem',
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <AccountCircle />
            )}
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: COLORS.CARD_BACKGROUND,
                border: `1px solid ${COLORS.BORDER}`,
                mt: 1,
              },
            }}
          >
            {user && (
              <MenuItem disabled sx={{ opacity: 1 }}>
                <Person sx={{ mr: 1 }} />
                {user.name}
              </MenuItem>
            )}
            <MenuItem onClick={() => { setProfileModalOpen(true); handleClose(); }}>
              <Edit sx={{ mr: 1 }} />
              Edit Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>

          {/* Mobile Navigation Menu */}
          <Menu
            id="mobile-menu"
            anchorEl={mobileMenuAnchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(mobileMenuAnchorEl)}
            onClose={handleMobileMenuClose}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: COLORS.CARD_BACKGROUND,
                border: `1px solid ${COLORS.BORDER}`,
                mt: 1,
                minWidth: 200,
              },
            }}
          >
            <MenuItem onClick={() => handleMobileNavigation('/explore')}>
              Explore
            </MenuItem>
            <MenuItem onClick={() => handleMobileNavigation('/my-vibe')}>
              My Vibe
            </MenuItem>
            <MenuItem onClick={() => handleMobileNavigation('/find-matches')}>
              Find Matches
            </MenuItem>
            <MenuItem onClick={() => handleMobileNavigation('/match-requests')}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                Match Requests
                {requests.length > 0 && (
                  <Badge
                    badgeContent={requests.length}
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: COLORS.ERROR,
                        color: 'white',
                        fontSize: '0.7rem',
                        minWidth: 16,
                        height: 16,
                      },
                    }}
                  />
                )}
              </Box>
            </MenuItem>
            <MenuItem onClick={() => handleMobileNavigation('/matched')}>
              Matched
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
      
      {/* Profile Modal */}
      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </AppBar>
  );
};

export default Navbar;