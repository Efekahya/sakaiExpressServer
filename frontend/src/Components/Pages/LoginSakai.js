import axios from "axios";
import React from "react";

export default function LoginSakai() {
  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target.form;
    const data = {
      sakaiEmail: form.email.value,
      sakaiPassword: form.password.value,
    };
    await axios
      .post("http://localhost:3000/user/addSakai", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("user")).token,
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status === "Success") {
          let user = JSON.parse(localStorage.getItem("user"));
          user.hasSakai = true;
          localStorage.setItem("user", JSON.stringify(user));
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  return (
    <>
      <div className="container ">
        <div className="row">
          <div className="mx-auto">
            <div className="card card-body mt-5 bg-secondary mb-3 mt-0">
              <div className="d-flex justify-content-md-around"></div>
              <form action="" method="POST">
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

                <button type="button" className="btn btn-primary" onClick={handleLogin}>
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
