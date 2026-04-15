import { Login } from "./LoginScreen";
import './App.css';
import { Routes, Route, HashRouter } from "react-router-dom";
import { Registration } from "./RegistrationScreen";
import { MainPage } from "./MainPage";

function App() {
  return (
    <>
    <HashRouter basename="/urfu_things">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </HashRouter>
    </>
  )
}

// function OutletWrapper() {
//   return (
//     <div>
//       <Login />
//       <Outlet />
//     </div>
//   )
// }

export default App;
