import { Login } from './LoginScreen';
import './App.css';
import { Routes, Route, HashRouter, Outlet } from 'react-router-dom';
import { Registration } from './RegistrationScreen';
import { MainPage } from './MainPage';
import { Advertisement } from './Advertisement';

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
