import { Login } from "./LoginScreen";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Registration } from "./RegistrationScreen";
import { MainPage } from "./MainPage";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<OutletWrapper />}> */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/main" element={<MainPage />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
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
