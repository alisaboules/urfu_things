import { Login } from './LoginScreen';
import './App.css';
import { Routes, Route, HashRouter, Outlet } from 'react-router-dom';
import { Registration } from './RegistrationScreen';
import { MainPage } from './MainPage';
import { Advertisement } from './Advertisement';
import './index.css';
import { Appeal } from './Appeal';
import { Appeals } from './Appeals';
import { Magazine } from './Magazine';
import { Profile } from './Profile/Profile';

function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/main" element={<OutletWrapper />}>
            {/* <Route index element={<Sidebar />} /> */}
          </Route>
          <Route path="/ad" element={<Advertisement />} />
          <Route path="/appeal" element={<Appeal />} />
          <Route path="/appeals" element={<Appeals />} />
          <Route path="/magazine" element={<Magazine />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </HashRouter>
    </>
  );
}

function OutletWrapper() {
  return (
    <div>
      <MainPage />
      <Outlet />
    </div>
  );
}

export default App;
