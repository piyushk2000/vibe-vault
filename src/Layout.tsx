import { Outlet, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./App";
import Navbar from "./components/header/header";
import SearchMedia from "./pages/Explore";
import LoginPage from "./pages/login";
import MyVibe from "./pages/my-vibe";
import SignupPage from "./pages/signup";
import MatchPage from "./pages/match";
import FindMatches from "./pages/find-matches";
import MatchRequests from "./pages/match-requests";
import Matched from "./pages/matched";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import socketService from "./services/socket";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("token") !== null;
  const { token } = useSelector((state: RootState) => state.auth);

  // Initialize socket connection when user is logged in
  useEffect(() => {
    if (token && !socketService.getSocket()?.connected) {
      socketService.connect(token);
    } else if (!token && socketService.getSocket()?.connected) {
      socketService.disconnect();
    }
  }, [token]);
  
  // Check authentication and redirect if needed
  useEffect(() => {
    // Public routes that don't require redirection
    const publicRoutes = ['/login', '/signup'];
    
    // If user is not logged in and not on a public route, redirect to login
    if (!isLoggedIn && !publicRoutes.includes(location.pathname)) {
      navigate('/login');
    }
    
    // If user is logged in and on login/signup page, redirect to explore
    if (isLoggedIn && publicRoutes.includes(location.pathname)) {
      navigate('/explore');
    }
    
    // If user is at root, redirect appropriately
    if (location.pathname === '/') {
      navigate(isLoggedIn ? '/explore' : '/login');
    }
  }, [isLoggedIn, location.pathname, navigate]);

  return (
    <>
      {/* Only show navbar if user is logged in or on explore page */}
      {(isLoggedIn || location.pathname === '/explore') && <Navbar />}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Outlet />}>
          <Route path="/explore" element={<SearchMedia />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
        
        <Route path="*" element={<h1>Not Found</h1>} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/my-vibe" element={<MyVibe />} />
          <Route path="/match" element={<MatchPage />} />
          <Route path="/find-matches" element={<FindMatches />} />
          <Route path="/match-requests" element={<MatchRequests />} />
          <Route path="/matched" element={<Matched />} />
        </Route>
      </Routes>
    </>
  );
}
