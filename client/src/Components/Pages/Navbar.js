import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
export default function Navbar() {
  const handleLogout = async () => {
    await axios
      .get("http://localhost:3000/user/logout")
      .then((response) => {
        localStorage.removeItem("user");
        // redirect to home page
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  if (JSON.parse(localStorage.getItem("user")).loggedIn === true) {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark m-3 mt-0 mb-0">
        <ul className="navbar-nav me-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/">
              Ana Sayfa
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/profil">
              Profil
            </Link>
          </li>
          <li className="nav-item">
            <Link className="btn btn-primary" to="#" onClick={handleLogout}>
              Çıkış Yap
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark m-3 mt-0 mb-0">
      <ul className="navbar-nav me-auto">
        <li className="nav-item active">
          <Link className="nav-link" to="/">
            Ana Sayfa
          </Link>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Giriş Yap
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link btn btn-primary" to="/register" onClick={handleLogout}>
            Kayıt Ol
          </Link>
        </li>
      </ul>
    </nav>
  );
}
