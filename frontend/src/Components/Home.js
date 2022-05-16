import React from "react";
import Navbar from "./Navbar";
import Feed from "./Feed";
import Login from "./Login";
import { Link } from "react-router-dom";
export default function Home() {
  if (!localStorage.getItem("token")) {
    return (
      <>
        <Navbar />
        <h1>Please Login</h1>
        <Link to="/login">Login</Link>;
      </>
    );
  }
  return (
    <>
      <div>
        <Navbar />
        <Feed />
      </div>
    </>
  );
}
