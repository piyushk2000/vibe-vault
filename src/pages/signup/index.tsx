import { Box, Button, Container, TextField, Typography, Paper, Divider } from '@mui/material';
import { COLORS } from '../../theme/colors';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import axios from 'axios';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users/signup', {
        name,
        email,
        password
      });
      const { token } = response.data.data;
      localStorage.setItem('token', token);
      navigate('/explore');
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const handleGoogleSignup = () => {
    // TODO: Implement Google signup logic
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${COLORS.LOGIN_GRADIENT_START}, ${COLORS.LOGIN_GRADIENT_END})`,
        display: 'flex',
        alignItems: 'center',
        pt: -8
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: COLORS.LOGIN_CARD_BG,
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            boxShadow: `0 8px 32px ${COLORS.LOGIN_SHADOW}`,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              color: COLORS.TEXT_PRIMARY,
              mb: 4,
              fontWeight: 600,
              background: `linear-gradient(135deg, ${COLORS.LOGIN_BUTTON_GRADIENT[0]}, ${COLORS.LOGIN_BUTTON_GRADIENT[1]})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Create Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ /* ... existing TextField styles ... */ }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ /* ... existing TextField styles ... */ }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ /* ... existing TextField styles ... */ }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ /* ... existing Button styles ... */ }}
            >
              Sign Up
            </Button>
          </Box>

          <Divider sx={{ width: '100%', my: 3 }}>
            <Typography sx={{ color: COLORS.DIVIDER_TEXT }}>or</Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignup}
            sx={{
              mb: 3,
              color: COLORS.GOOGLE_BUTTON_TEXT,
              backgroundColor: COLORS.GOOGLE_BUTTON_BG,
              borderColor: COLORS.GOOGLE_BUTTON_BORDER,
              '&:hover': {
                backgroundColor: COLORS.GOOGLE_BUTTON_HOVER,
                borderColor: COLORS.GOOGLE_BUTTON_BORDER,
              }
            }}
          >
            Sign up with Google
          </Button>
          
          <Typography sx={{ mt: 2, color: COLORS.TEXT_SECONDARY, fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: COLORS.ACCENT }}>
              Sign in
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignupPage;