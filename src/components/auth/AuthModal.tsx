import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, signUp, clearError } from '../../redux/authSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { COLORS } from '../../theme/colors';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, defaultTab = 'login' }) => {
  const [tabValue, setTabValue] = useState<'login' | 'signup'>(defaultTab);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      onClose();
    }
  }, [token, onClose]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      setValidationError('');
      setPasswordError('');
    };
  }, [dispatch]);

  useEffect(() => {
    setTabValue(defaultTab);
  }, [defaultTab]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'login' | 'signup') => {
    setTabValue(newValue);
    setValidationError('');
    setPasswordError('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!loginData.email && !loginData.password) {
      setValidationError('Please enter your email and password');
      return;
    }

    if (!loginData.email) {
      setValidationError('Please enter your email address');
      return;
    }

    if (!loginData.password) {
      setValidationError('Please enter your password');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email.trim())) {
      setValidationError('Please enter a valid email address');
      return;
    }

    dispatch(signIn({ email: loginData.email.trim(), password: loginData.password }));
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setValidationError('');

    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setValidationError('Please fill in all fields');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email.trim())) {
      setValidationError('Please enter a valid email address');
      return;
    }

    dispatch(signUp({
      name: signupData.name.trim(),
      email: signupData.email.trim(),
      password: signupData.password
    }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: COLORS.DIALOG_BACKGROUND,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: `1px solid ${COLORS.GLASS_BORDER}`,
          borderRadius: 2,
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            background: `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_LIGHT} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 12px rgba(99, 102, 241, 0.4))',
          }}
        >
          VibeVault
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            '& .MuiTabs-indicator': {
              backgroundColor: COLORS.ACCENT,
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              '&.Mui-selected': {
                color: COLORS.ACCENT,
              },
            },
          }}
        >
          <Tab label="Sign In" value="login" />
          <Tab label="Sign Up" value="signup" />
        </Tabs>

        {(error || validationError || passwordError) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {validationError || passwordError || error}
          </Alert>
        )}

        {tabValue === 'login' ? (
          <Box component="form" onSubmit={handleLoginSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: COLORS.INPUT_BACKGROUND,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: COLORS.TEXT_SECONDARY }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={loginData.password}
              onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: COLORS.INPUT_BACKGROUND,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: COLORS.TEXT_SECONDARY }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: COLORS.TEXT_SECONDARY }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 1.5,
                background: `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_LIGHT} 100%)`,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: `1px solid ${COLORS.GLASS_BORDER}`,
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.2)',
                '&:hover': {
                  background: `linear-gradient(135deg, ${COLORS.ACCENT_LIGHT} 0%, ${COLORS.ACCENT} 100%)`,
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
                },
                '&:disabled': {
                  background: COLORS.BUTTON_DISABLED,
                },
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSignupSubmit}>
            <TextField
              fullWidth
              label="Name"
              value={signupData.name}
              onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: COLORS.INPUT_BACKGROUND,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: COLORS.TEXT_SECONDARY }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={signupData.email}
              onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: COLORS.INPUT_BACKGROUND,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: COLORS.TEXT_SECONDARY }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={signupData.password}
              onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: COLORS.INPUT_BACKGROUND,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: COLORS.TEXT_SECONDARY }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: COLORS.TEXT_SECONDARY }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={signupData.confirmPassword}
              onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: COLORS.INPUT_BACKGROUND,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: COLORS.TEXT_SECONDARY }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                      sx={{ color: COLORS.TEXT_SECONDARY }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 1.5,
                background: `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_LIGHT} 100%)`,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: `1px solid ${COLORS.GLASS_BORDER}`,
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.2)',
                '&:hover': {
                  background: `linear-gradient(135deg, ${COLORS.ACCENT_LIGHT} 0%, ${COLORS.ACCENT} 100%)`,
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
                },
                '&:disabled': {
                  background: COLORS.BUTTON_DISABLED,
                },
              }}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;