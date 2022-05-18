import { React, useContext } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import LoginContext from "../Context/Login";
export default function Login() {
  const { setLoggedIn } = useContext(LoginContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target.form;
    const data = {
      email: form.email.value,
      password: form.password.value,
    };
    await axios
      .post("http://localhost:3000/user/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status === "Success") {
          console.log("Succes login");
          localStorage.setItem("login", "true");
          localStorage.setItem("email", response.data.message.email);
          setLoggedIn({
            login: "true",
            email: response.data.message.email,
          });

          // redirect to home page
          if (window.location.pathname === "/login") {
            window.location.replace("/");
          } else {
            window.location.reload();
          }
        }
      })
      .catch((error) => {
        console.log(error.response.data);
      });
    await axios
      .get("http://localhost:3000/user/getSakai", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status === "Success") {
          console.log(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card card-body mt-5">
              <div className="d-flex justify-content-md-around">
                <b>
                  <NavLink to="/login" className="btn btn-primary">
                    {" "}
                    Login{" "}
                  </NavLink>
                </b>{" "}
                <NavLink to="/register" className="btn btn-secondary">
                  {" "}
                  Register{" "}
                </NavLink>
              </div>
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
                  onClick={handleLogin}
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
