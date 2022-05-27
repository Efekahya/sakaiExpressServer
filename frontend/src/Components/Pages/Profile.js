import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(undefined);
  const [alert,setAlert] = useState({alertText:"",alertClass:"primary"})
  useEffect(() => {
    const getUser = async () => {
      await axios
        .get("http://localhost:3000/user/getUser", {
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("user")).token,
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.status === "Success") {
            setUser(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    };
    getUser();
  }, []);
  const handleSubmit = async (e) => {
    const form = e.target.form;
    if (form.checkValidity()) {
      e.preventDefault();
      const data = {
        name: form.name.value,
        lastName: form.lastName.value,
        email: form.email.value,
        sakaiEmail: form.sakaiEmail.value,
        sakaiPassword: form.sakaiPassword.value,
      };
      await axios
        .put("http://localhost:3000/user/updateUser", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("user")).token,
          },
          withCredentials: true,
        })
        .then((response) => {
            window.location.href = "/"
        })
        .catch((error) => {
          setAlert({alertText:"alert",alertClass:"danger"})
          console.log(error.response.data);
        });
    }
  };

  if (user !== undefined) {
    return (
      <>
        <div className="row">
          <div className="col-xl-4">
            <div className="card mb-4 mb-xl-0 border border-3 border-secondary rounded bg-dark text-white-50">
              <div className="card-header">Profile Picture</div>
              <div className="card-body text-center">
                <img src={user.profilePicture} alt="profile" className="rounded-5" />
                <br />
                <br />
                <div className="small font-italic text-white-50 mb-4 border border-1 border-secondary border-top-0 border-end-0 border-start-0">
                  {user.name} {user.lastName}
                </div>
                <div className="small font-italic text-white-50 mb-4 border border-1 border-secondary border-top-0 border-end-0 border-start-0">
                  {user.email}
                </div>
                <div className="small font-italic text-white-50 mb-4 border border-1 border-secondary border-top-0 border-end-0 border-start-0">
                  {user.sakaiEmail}
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-8">
            <div className="card mb-4 mb-xl-0 border border-3 border-secondary rounded bg-dark text-white-50">
              <div className="card-header">Account Details</div>
              <div className="card-body">
                <form>
                  <div className="row gx-3 mb-3">
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="name">
                        First name
                      </label>
                      <input
                        className="form-control"
                        required
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your first name"
                        value={user.name}
                        onChange={(e) => {
                          setUser({ ...user, name: e.target.value });
                        }}
                      ></input>
                    </div>
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="lastName">
                        Last name
                      </label>
                      <input
                        className="form-control"
                        required
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        value={user.lastName}
                        onChange={(e) => {
                          setUser({ ...user, lastName: e.target.value });
                        }}
                      ></input>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="small mb-1" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="form-control"
                      required
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email "
                      value={user.email}
                      onChange={(e) => {
                        setUser({ ...user, email: e.target.value });
                      }}
                    ></input>
                  </div>
                  <div className="row gx-3 mb-3">
                    <div className="mb-3 col-md-6">
                      <label className="small mb-1" htmlFor="sakaiEmail">
                        Sakai Email
                      </label>
                      <input
                        className="form-control"
                        required
                        id="sakaiEmail"
                        name="sakaiEmail"
                        type="email"
                        placeholder="Enter your email "
                        value={user.sakaiEmail}
                        onChange={(e) => {
                          setUser({ ...user, sakaiEmail: e.target.value });
                        }}
                      ></input>
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="small mb-1" htmlFor="sakaiPassword">
                        Sakai Password
                      </label>
                      <input
                        className="form-control"
                        id="sakaiPassword"
                        name="sakaiPassword"
                        type="password"
                        placeholder="Enter your sakai password "
                        value={user.sakaiPassword}
                        onChange={(e) => {
                          setUser({ ...user, sakaiPassword: e.target.value });
                        }}
                        required
                      ></input>
                    </div>
                  </div>
                  <button className={"btn btn-"+alert.alertClass} type="submit" onClick={handleSubmit}>
                    {(alert.alertText.length > 1) ? "Sakai is not valid": "Save Changes" }
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <div className="text-white-50">Loading...</div>;
  }
}
