import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signIn, clearError } from '../../redux/authSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { COLORS } from '../../theme/colors';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      navigate('/explore');
    }
  }, [token, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    // Frontend validation
    if (!email && !password) {
      setValidationError('Please enter your email and password');
      return;
    }
    
    if (!email) {
      setValidationError('Please enter your email address');
      return;
    }
    
    if (!password) {
      setValidationError('Please enter your password');
      return;
    }
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setValidationError('Please enter a valid email address');
      return;
    }
    
    dispatch(signIn({ email: email.trim(), password }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${COLORS.ACCENT}40 0%, transparent 70%)`,
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '250px',
          height: '250px',
          background: `radial-gradient(circle, ${COLORS.ACCENT_LIGHT}30 0%, transparent 70%)`,
          filter: 'blur(60px)',
          animation: 'float 10s ease-in-out infinite reverse',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(20px, 20px)' },
        },
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          backgroundColor: COLORS.LOGIN_CARD_BG,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: `1px solid ${COLORS.GLASS_BORDER}`,
          boxShadow: `0 8px 32px ${COLORS.LOGIN_SHADOW}, 0 0 0 1px rgba(255, 255, 255, 0.05) inset`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                background: `linear-gradient(135deg, ${COLORS.ACCENT} 0%, ${COLORS.ACCENT_LIGHT} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                filter: 'drop-shadow(0 0 12px rgba(99, 102, 241, 0.4))',
              }}
            >
              VibeVault
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Welcome back! Sign in to your account
            </Typography>
          </Box>

          {(error || validationError) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {validationError || error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: COLORS.LOGIN_INPUT_BG,
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: COLORS.LOGIN_INPUT_BG,
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
                mb: 3,
                background: `linear-gradient(135deg, ${COLORS.LOGIN_BUTTON_GRADIENT[0]} 0%, ${COLORS.LOGIN_BUTTON_GRADIENT[1]} 100%)`,
                boxShadow: `0 4px 16px ${COLORS.LOGIN_SHADOW}`,
                border: `1px solid ${COLORS.GLASS_BORDER}`,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 8px 24px ${COLORS.LOGIN_HOVER_SHADOW}`,
                  transform: 'translateY(-2px)',
                  background: `linear-gradient(135deg, ${COLORS.LOGIN_BUTTON_GRADIENT[1]} 0%, ${COLORS.LOGIN_BUTTON_GRADIENT[0]} 100%)`,
                },
                '&:disabled': {
                  background: COLORS.BUTTON_DISABLED,
                  color: COLORS.TEXT_INACTIVE,
                },
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{' '}
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate('/signup')}
                  sx={{
                    color: COLORS.ACCENT,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;