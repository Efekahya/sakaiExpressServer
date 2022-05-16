import { React, useState } from "react";
import Home from "./Components/Home";
import Login from "./Components/Login";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Navbar from "./Components/Navbar";
import LoginContext from "./Context/Login";
import Register from "./Components/Register";
function App() {
  let loginValue = localStorage.getItem("login");
  let emailValue = localStorage.getItem("email");
  if (loginValue === null || loginValue === undefined) {
    loginValue = "false";
  }

  const [loggedIn, setLoggedIn] = useState({
    login: loginValue,
    email: emailValue,
  });
  return (
    <>
      <LoginContext.Provider value={{ loggedIn, setLoggedIn }}>
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
            <Route path="*" element={<div>404</div>} />
          </Routes>
        </BrowserRouter>
      </LoginContext.Provider>
    </>
  );
}
export default App;
