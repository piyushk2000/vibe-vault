import { Outlet, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./App";
import Navbar from "./components/header/header";
import SearchMedia from "./pages/Explore";
import LoginPage from "./pages/login";
import MyVibe from "./pages/my-vibe";
import SignupPage from "./pages/signup";

export default function Layout() {
  return (
    <>
      <Navbar />
      {/* TODO: hide nav bar on login page */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Outlet />}>
          <Route path="/explore" element={<SearchMedia />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/my-vibe" element={<MyVibe />} />
        </Route>
        <Route path="*" element={<h1>Not Found</h1>} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/my-vibe" element={<MyVibe />} />
          {/* ...other protected routes... */}
        </Route>
      </Routes>
    </>
  );
}
