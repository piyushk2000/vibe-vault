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
  useTheme,
  Button,
} from '@mui/material';
import { AccountCircle, Logout, Person, Edit, Menu as MenuIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../redux/authSlice';
import { fetchProfile } from '../../redux/profileSlice';
import { fetchMatchRequests } from '../../redux/matchRequestSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { COLORS } from '../../theme/colors';
import { getTouchTargetStyles, createTransition } from '../../theme/utils';
import ProfileModal from '../profile/ProfileModal';
import MobileNavDrawer from '../navigation/MobileNavDrawer';
import AuthModal from '../auth/AuthModal';
import { useIsMobile } from '../../utils/mobile';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useIsMobile();

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

  const handleMobileDrawerOpen = () => {
    setMobileDrawerOpen(true);
  };

  const handleMobileDrawerClose = () => {
    setMobileDrawerOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    if (!user && newValue !== '/explore') {
      setAuthModalOpen(true);
      return;
    }
    navigate(newValue);
  };

  const handleMobileNavigation = (path: string) => {
    if (!user && path !== '/explore') {
      setAuthModalOpen(true);
      setMobileDrawerOpen(false);
      return;
    }
    navigate(path);
    setMobileDrawerOpen(false);
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
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: COLORS.NAV_BACKGROUND,
          borderBottom: `1px solid ${COLORS.BORDER}`,
          boxShadow: theme.customShadows.card,
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            minHeight: { xs: '56px', sm: '64px' },
            px: { xs: theme.customSpacing.md, sm: theme.customSpacing.lg },
          }}
        >
          {/* Mobile Hamburger Menu */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Open navigation menu"
              onClick={handleMobileDrawerOpen}
              sx={{
                ...getTouchTargetStyles(),
                mr: theme.customSpacing.md,
                color: COLORS.TEXT_PRIMARY,
                transition: createTransition(['background-color', 'color'], theme.customAnimations.duration.shorter),
                '&:hover': {
                  backgroundColor: COLORS.HOVER,
                  color: COLORS.ACCENT,
                },
              }}
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
              transition: createTransition(['transform'], theme.customAnimations.duration.shorter),
              '&:hover': {
                transform: 'scale(1.02)',
              },
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
                    height: '3px',
                    borderRadius: '2px',
                  },
                  '& .MuiTab-root': {
                    color: COLORS.NAV_INACTIVE,
                    fontWeight: 500,
                    textTransform: 'none',
                    minHeight: '48px',
                    transition: createTransition(['color', 'background-color'], theme.customAnimations.duration.shorter),
                    '&.Mui-selected': {
                      color: COLORS.NAV_ACTIVE,
                      fontWeight: 600,
                    },
                    '&:hover': {
                      backgroundColor: COLORS.HOVER,
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
            {user ? (
              <>
                <IconButton
                  size="large"
                  aria-label="User account menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{
                    ...getTouchTargetStyles(),
                    transition: createTransition(['transform'], theme.customAnimations.duration.shorter),
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  {profile?.avatar ? (
                    <Avatar
                      src={profile.avatar}
                      sx={{
                        width: { xs: 36, sm: 40 },
                        height: { xs: 36, sm: 40 },
                        border: `2px solid ${COLORS.ACCENT}`,
                        transition: createTransition(['border-color'], theme.customAnimations.duration.shorter),
                        '&:hover': {
                          borderColor: COLORS.ACCENT_LIGHT,
                        },
                      }}
                    />
                  ) : user?.name ? (
                    <Avatar
                      sx={{
                        width: { xs: 36, sm: 40 },
                        height: { xs: 36, sm: 40 },
                        backgroundColor: COLORS.ACCENT,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        border: `2px solid ${COLORS.ACCENT}`,
                        transition: createTransition(['background-color', 'border-color'], theme.customAnimations.duration.shorter),
                        '&:hover': {
                          backgroundColor: COLORS.ACCENT_HOVER,
                          borderColor: COLORS.ACCENT_LIGHT,
                        },
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  ) : (
                    <AccountCircle sx={{ fontSize: { xs: 36, sm: 40 } }} />
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
                      borderRadius: theme.customSpacing.sm,
                      mt: 1,
                      boxShadow: theme.customShadows.dropdown,
                    },
                  }}
                >
                  {user && (
                    <MenuItem
                      disabled
                      sx={{
                        opacity: 1,
                        color: COLORS.TEXT_PRIMARY,
                        fontWeight: 600,
                      }}
                    >
                      <Person sx={{ mr: 1, color: COLORS.ACCENT }} />
                      {user.name}
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => { setProfileModalOpen(true); handleClose(); }}
                    sx={{
                      ...getTouchTargetStyles(),
                      color: COLORS.TEXT_SECONDARY,
                      transition: createTransition(['background-color', 'color'], theme.customAnimations.duration.shorter),
                      '&:hover': {
                        backgroundColor: COLORS.HOVER,
                        color: COLORS.TEXT_PRIMARY,
                      },
                    }}
                  >
                    <Edit sx={{ mr: 1 }} />
                    Edit Profile
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      ...getTouchTargetStyles(),
                      color: COLORS.TEXT_SECONDARY,
                      transition: createTransition(['background-color', 'color'], theme.customAnimations.duration.shorter),
                      '&:hover': {
                        backgroundColor: COLORS.ERROR_BACKGROUND,
                        color: COLORS.ERROR,
                      },
                    }}
                  >
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={() => setAuthModalOpen(true)}
                sx={{
                  background: `linear-gradient(45deg, ${COLORS.ACCENT} 30%, ${COLORS.ACCENT_LIGHT} 90%)`,
                  color: 'white',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  transition: createTransition(['transform', 'box-shadow'], theme.customAnimations.duration.shorter),
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: `0 4px 16px ${COLORS.ACCENT}40`,
                    background: `linear-gradient(45deg, ${COLORS.ACCENT_LIGHT} 30%, ${COLORS.ACCENT} 90%)`,
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerClose}
        currentPath={getCurrentTab()}
        onNavigate={handleMobileNavigation}
        user={user}
        profile={profile}
        matchRequestCount={requests.length}
        onEditProfile={() => setProfileModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Profile Modal */}
      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;