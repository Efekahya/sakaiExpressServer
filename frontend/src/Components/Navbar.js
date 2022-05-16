import React from "react";
export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item active">
          <a className="nav-link" href="/">
            {" "}
            Ana Sayfa
          </a>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a className="nav-link" href="/login">
            {" "}
            login
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/profil">
            {" "}
            Profil
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/logout">
            {" "}
            Çıkış Yap
          </a>
        </li>
      </ul>
    </nav>
  );
}
