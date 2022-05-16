import React from "react";
import Home from "./Components/Home";
import Login from "./Components/Login";
import { Router, Link, Routes, Route, BrowserRouter } from "react-router-dom";
import Navbar from "./Components/Navbar";

function App() {
  return (
    <>
      <head>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css"
          integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4"
          crossorigin="anonymous"
        ></link>
      </head>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <Login />
              </>
            }
          />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
