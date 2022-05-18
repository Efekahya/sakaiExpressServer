import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
export default function Navbar() {
  const handleLogout = async () => {
    localStorage.setItem("login", "false");
    await axios
      .get("http://localhost:3000/user/logout")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
    window.location.reload();
  };
  if (localStorage.getItem("login") === "true") {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <ul className="navbar-nav mr-auto">
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
            <Link className="nav-link" to="#" onClick={handleLogout}>
              Çıkış Yap
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}
