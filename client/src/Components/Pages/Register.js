import React from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

const handleRegister = (e) => {
  e.preventDefault();
  const form = e.target.form;
  const data = {
    email: form.email.value,
    password: form.password.value,
    name: form.name.value,
    lastName: form.lastName.value,
  };
  axios
    .post("https://convenient-sakai.herokuapp.com/user/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      // redirect to login page
      if (window.location.pathname === "/register") {
        window.location.replace("/login");
      }
    })
    .catch((error) => {
      console.log(error.response.data);
    });
};

export default function Register() {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card card-body mt-5">
              <div className="d-flex justify-content-md-around">
                <b>
                  <NavLink to="/login" className="btn btn-secondary">
                    {" "}
                    Login{" "}
                  </NavLink>
                </b>{" "}
                <NavLink to="/register" className="btn btn-primary">
                  {" "}
                  Register{" "}
                </NavLink>
              </div>
              <form action="" method="POST">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="name" className="form-control" placeholder="Name" name="name" id="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="name"
                    className="form-control"
                    placeholder="Name"
                    name="lastName"
                    id="lastName"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" className="form-control" placeholder="Email" name="email" id="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    id="password"
                    required
                  />
                </div>
                <br />
                <button type="button" className="btn btn-primary" onClick={handleRegister}>
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
