import { React } from "react";
import Home from "./Components/Pages/Home";
import Login from "./Components/Pages/Login";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from "./Components/Pages/Register";
import Profile from "./Components/Pages/Profile";
import Navbar from "./Components/Pages/Navbar";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route
            path="/login"
            element={
              <>
                <Login />
              </>
            }
          />
          <Route path="/" exact element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
