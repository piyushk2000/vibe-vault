import './App.css';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/header/header';
import SearchMedia from './pages/Explore/index.js';
import MyVibe from './pages/my-vibe/index.js';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
// import { COLORS } from './theme/colors';

export function PrivateRoute() {
  //@ts-ignore
  const {currentUser} = useSelector(state => state.user) //ToDo 
return currentUser ? <Outlet/> : <Navigate to='/sign-in'/>
}



function App() {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Outlet />}>
              <Route path="/explore" element={<SearchMedia />} />
              <Route path="/my-vibe" element={<MyVibe />} />
            </Route>
            <Route path='*' element={<h1>Not Found</h1>} />

            <Route element={<PrivateRoute />} >
            {/* <Route path='/profile' element={<Profile />} />
            <Route path="/anime/:id" element={<AnimeDetails />} />
            <Route path="/vibematch" element={<VibeMatch />} /> */}
            {/* <Route path="/my-vibe" element={<MyVibe />} /> */}
            </Route>

          </Routes>
          

        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;