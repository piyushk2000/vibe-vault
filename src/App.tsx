import './App.css';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/header/header';
import SearchMedia from './pages/search-media/index.js';
import MyVibe from './pages/my-vibe/index.js';
import { useSelector } from 'react-redux';
// import { COLORS } from './theme/colors';

export function PrivateRoute() {
  //@ts-ignore
  const {currentUser} = useSelector(state => state.user) //ToDo 
return currentUser ? <Outlet/> : <Navigate to='/sign-in'/>
}



function App() {
  return (
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
          {/* <Route path="/my-vibe" element={<MyVibe />} /> */}
          </Route>

        </Routes>
        

      </BrowserRouter>
    </div>
  );
}

export default App;