import './App.css';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/header/header';
import SearchMedia from './pages/Explore/index.js';
import MyVibe from './pages/my-vibe/index.js';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import CircularProgress from '@mui/material/CircularProgress';
import { COLORS } from './theme/colors';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';

export function PrivateRoute() {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to='/login' />;
}

function App() {
  const isLoading = useSelector((state: any) => state.loading.isLoading);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <>
        {isLoading && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
          }}>
            <CircularProgress style={{ color: COLORS.ACCENT }} />
          </div>
        )}
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Outlet />}>
              <Route path="/explore" element={<SearchMedia />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/my-vibe" element={<MyVibe />} />
            </Route>
            <Route path='*' element={<h1>Not Found</h1>} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/my-vibe" element={<MyVibe />} />
              {/* ...other protected routes... */}
            </Route>
          </Routes>
        </BrowserRouter>
      </>
    </ThemeProvider>
  );
}

export default App;