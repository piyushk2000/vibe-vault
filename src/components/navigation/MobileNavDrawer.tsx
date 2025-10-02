import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Badge,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Explore,
  Favorite,
  Search,
  Notifications,
  People,
  Close,
  Edit,
  Logout,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { COLORS } from '../../theme/colors';
import { getTouchTargetStyles, createTransition } from '../../theme/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

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

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
  user?: User | null;
  profile?: Profile | null;
  matchRequestCount?: number;
  onEditProfile: () => void;
  onLogout: () => void;
}

const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  open,
  onClose,
  currentPath,
  onNavigate,
  user,
  profile,
  matchRequestCount = 0,
  onEditProfile,
  onLogout,
}) => {
  const theme = useTheme();

  const navigationItems: NavItem[] = [
    {
      label: 'Explore',
      path: '/explore',
      icon: <Explore />,
    },
    {
      label: 'My Vibe',
      path: '/my-vibe',
      icon: <Favorite />,
    },
    {
      label: 'Find Matches',
      path: '/find-matches',
      icon: <Search />,
    },
    {
      label: 'Match Requests',
      path: '/match-requests',
      icon: <Notifications />,
      badge: matchRequestCount,
    },
    {
      label: 'Matched',
      path: '/matched',
      icon: <People />,
    },
  ];

  const handleNavigate = (path: string) => {
    onNavigate(path);
    onClose();
  };

  const handleEditProfile = () => {
    onEditProfile();
    onClose();
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 300,
          backgroundColor: COLORS.GLASS_BACKGROUND_STRONG,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRight: `1px solid ${COLORS.GLASS_BORDER}`,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        },
      }}
      ModalProps={{
        keepMounted: true,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: theme.customSpacing.lg,
          borderBottom: `1px solid ${COLORS.GLASS_BORDER}`,
          minHeight: '72px',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            background: `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_LIGHT} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 8px rgba(124, 58, 237, 0.3))',
          }}
        >
          VibeVault
        </Typography>
        <IconButton
          onClick={onClose}
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
          <Close />
        </IconButton>
      </Box>

      {/* User Profile Section */}
      {user && (
        <Box
          sx={{
            p: theme.customSpacing.lg,
            borderBottom: `1px solid ${COLORS.GLASS_BORDER}`,
            backgroundColor: COLORS.GLASS_BACKGROUND_LIGHT,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.customSpacing.md }}>
            <Avatar
              src={profile?.avatar || undefined}
              sx={{
                width: 56,
                height: 56,
                background: `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_LIGHT} 100%)`,
                border: `2px solid ${COLORS.GLASS_BORDER}`,
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: COLORS.TEXT_PRIMARY,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  mb: 0.25,
                }}
              >
                {user?.name || 'User'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: COLORS.TEXT_SECONDARY,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: '0.875rem',
                }}
              >
                {user?.email || ''}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Navigation Items */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ py: theme.customSpacing.sm }}>
          {navigationItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    ...getTouchTargetStyles(),
                    minHeight: '56px',
                    mx: theme.customSpacing.md,
                    mb: theme.customSpacing.xs,
                    borderRadius: theme.customSpacing.md,
                    backgroundColor: isActive ? COLORS.SELECTED : 'transparent',
                    backdropFilter: isActive ? 'blur(8px)' : 'none',
                    WebkitBackdropFilter: isActive ? 'blur(8px)' : 'none',
                    borderLeft: isActive ? `3px solid ${COLORS.ACCENT}` : '3px solid transparent',
                    color: isActive ? COLORS.NAV_ACTIVE : COLORS.NAV_INACTIVE,
                    transition: createTransition(['background-color', 'color', 'border-color'], theme.customAnimations.duration.shorter),
                    '&:hover': {
                      backgroundColor: COLORS.HOVER,
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      color: COLORS.NAV_ACTIVE,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit',
                      minWidth: '40px',
                    }}
                  >
                    {item.badge && item.badge > 0 ? (
                      <Badge
                        badgeContent={item.badge}
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
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '1rem',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* User Actions */}
      {user && (
        <Box
          sx={{
            borderTop: `1px solid ${COLORS.GLASS_BORDER}`,
            p: theme.customSpacing.md,
            backgroundColor: COLORS.GLASS_BACKGROUND_LIGHT,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <List sx={{ py: 0 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleEditProfile}
                sx={{
                  ...getTouchTargetStyles(),
                  minHeight: '52px',
                  borderRadius: theme.customSpacing.md,
                  color: COLORS.TEXT_SECONDARY,
                  mb: theme.customSpacing.xs,
                  transition: createTransition(['background-color', 'color'], theme.customAnimations.duration.shorter),
                  '&:hover': {
                    backgroundColor: COLORS.HOVER,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    color: COLORS.TEXT_PRIMARY,
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}>
                  <Edit />
                </ListItemIcon>
                <ListItemText primary="Edit Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  ...getTouchTargetStyles(),
                  minHeight: '52px',
                  borderRadius: theme.customSpacing.md,
                  color: COLORS.TEXT_SECONDARY,
                  transition: createTransition(['background-color', 'color'], theme.customAnimations.duration.shorter),
                  '&:hover': {
                    backgroundColor: COLORS.ERROR_BACKGROUND,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    color: COLORS.ERROR,
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      )}
    </Drawer>
  );
};

export default MobileNavDrawer;