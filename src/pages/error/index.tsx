import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { ErrorOutline, Home, ArrowBack } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { COLORS } from '../../theme/colors';

interface ErrorPageProps {
  errorCode?: string;
  errorMessage?: string;
  showBackButton?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  errorCode = '404',
  errorMessage = 'Page Not Found',
  showBackButton = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get error details from location state if available
  const stateError = location.state?.error;
  const stateErrorCode = location.state?.errorCode;
  const stateErrorMessage = location.state?.errorMessage;

  const displayErrorCode = stateErrorCode || errorCode;
  const displayErrorMessage = stateErrorMessage || errorMessage;

  const getErrorDescription = (code: string) => {
    switch (code) {
      case '404':
        return "The page you're looking for doesn't exist or has been moved.";
      case '403':
        return "You don't have permission to access this resource.";
      case '500':
        return "Something went wrong on our end. Please try again later.";
      case '401':
        return "You need to be logged in to access this page.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  const handleGoHome = () => {
    const isLoggedIn = localStorage.getItem('token') !== null;
    navigate(isLoggedIn ? '/explore' : '/login');
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      handleGoHome();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${COLORS.LOGIN_GRADIENT_START} 0%, ${COLORS.LOGIN_GRADIENT_END} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            backgroundColor: COLORS.LOGIN_CARD_BG,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${COLORS.BORDER}`,
            boxShadow: `0 8px 32px ${COLORS.LOGIN_SHADOW}`,
            textAlign: 'center',
          }}
        >
          <CardContent sx={{ p: 6 }}>
            <Box sx={{ mb: 4 }}>
              <ErrorOutline
                sx={{
                  fontSize: 80,
                  color: COLORS.ACCENT,
                  mb: 2,
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: '4rem',
                  fontWeight: 'bold',
                  background: `linear-gradient(45deg, ${COLORS.ACCENT} 30%, ${COLORS.ACCENT_LIGHT} 90%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                {displayErrorCode}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: COLORS.TEXT_PRIMARY,
                  mb: 2,
                }}
              >
                {displayErrorMessage}
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}
              >
                {getErrorDescription(displayErrorCode)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              {showBackButton && (
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={handleGoBack}
                  sx={{
                    borderColor: COLORS.ACCENT,
                    color: COLORS.ACCENT,
                    '&:hover': {
                      borderColor: COLORS.ACCENT_LIGHT,
                      backgroundColor: `${COLORS.ACCENT}10`,
                    },
                  }}
                >
                  Go Back
                </Button>
              )}
              
              <Button
                variant="contained"
                startIcon={<Home />}
                onClick={handleGoHome}
                sx={{
                  background: `linear-gradient(45deg, ${COLORS.LOGIN_BUTTON_GRADIENT[0]} 30%, ${COLORS.LOGIN_BUTTON_GRADIENT[1]} 90%)`,
                  boxShadow: `0 4px 16px ${COLORS.LOGIN_SHADOW}`,
                  '&:hover': {
                    boxShadow: `0 6px 20px ${COLORS.LOGIN_HOVER_SHADOW}`,
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Go Home
              </Button>
            </Box>

            {stateError && (
              <Box sx={{ mt: 4, p: 2, backgroundColor: `${COLORS.ACCENT}10`, borderRadius: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  Error Details: {stateError}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ErrorPage;