import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/header/header';
import SearchMedia from './pages/search-media/index.js';
import MyVibe from './pages/my-vibe/index.js';
import { COLORS } from './theme/colors';

function App() {
  return (
    <div
      style={{
        backgroundColor: COLORS.BACKGROUND_DARK,
        color: COLORS.TEXT_PRIMARY,
      }}
    >
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route path="/explore" element={<SearchMedia />} />
            <Route path="/my-vibe" element={<MyVibe />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;