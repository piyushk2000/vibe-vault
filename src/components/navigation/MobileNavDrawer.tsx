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
          width: 280,
          backgroundColor: COLORS.NAV_BACKGROUND,
          borderRight: `1px solid ${COLORS.BORDER}`,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: theme.customSpacing.md,
          borderBottom: `1px solid ${COLORS.BORDER}`,
          minHeight: '64px',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${COLORS.ACCENT} 30%, ${COLORS.ACCENT_LIGHT} 90%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          VibeVault
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            ...getTouchTargetStyles(),
            color: COLORS.TEXT_SECONDARY,
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
            p: theme.customSpacing.md,
            borderBottom: `1px solid ${COLORS.BORDER}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: theme.customSpacing.sm }}>
            <Avatar
              src={profile?.avatar || undefined}
              sx={{
                width: 48,
                height: 48,
                backgroundColor: COLORS.ACCENT,
                mr: theme.customSpacing.md,
                border: `2px solid ${COLORS.ACCENT}`,
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
                    mx: theme.customSpacing.sm,
                    mb: theme.customSpacing.xs,
                    borderRadius: theme.customSpacing.sm,
                    backgroundColor: isActive ? COLORS.SELECTED : 'transparent',
                    color: isActive ? COLORS.NAV_ACTIVE : COLORS.NAV_INACTIVE,
                    transition: createTransition(['background-color', 'color'], theme.customAnimations.duration.shorter),
                    '&:hover': {
                      backgroundColor: isActive ? COLORS.SELECTED : COLORS.HOVER,
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
            borderTop: `1px solid ${COLORS.BORDER}`,
            p: theme.customSpacing.sm,
          }}
        >
          <List sx={{ py: 0 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleEditProfile}
                sx={{
                  ...getTouchTargetStyles(),
                  minHeight: '48px',
                  borderRadius: theme.customSpacing.sm,
                  color: COLORS.TEXT_SECONDARY,
                  transition: createTransition(['background-color', 'color'], theme.customAnimations.duration.shorter),
                  '&:hover': {
                    backgroundColor: COLORS.HOVER,
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
                  minHeight: '48px',
                  borderRadius: theme.customSpacing.sm,
                  color: COLORS.TEXT_SECONDARY,
                  transition: createTransition(['background-color', 'color'], theme.customAnimations.duration.shorter),
                  '&:hover': {
                    backgroundColor: COLORS.ERROR_BACKGROUND,
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