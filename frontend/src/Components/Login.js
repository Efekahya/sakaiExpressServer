import { React, useState } from "react";
import Register from "./Register";
import axios from "axios";
const handleRegister = (e) => {
  e.preventDefault();
  const form = e.target.form;
  console.log(form);
  const data = {
    email: form.email.value,
    password: form.password.value,
  };
  axios
    .post("http://localhost:3000/user/login", data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      if (response.data.status == "Success") {
        localStorage.setItem("token", response.data.token);
        window.location.href = "/";
      }
    });
};

export default function Login() {
  let [user, setUser] = useState({ status: "logged" });
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card card-body mt-5">
              <h2>Login</h2>
              <form action="" method="POST">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    id="email"
                    required
                  />
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
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleRegister}
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
