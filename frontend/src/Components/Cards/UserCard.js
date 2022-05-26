import axios from "axios";
import React, { useEffect, useState } from "react";
import LoginSakai from "../Pages/LoginSakai";
export default function UserCard() {
  let user = JSON.parse(localStorage.getItem("user"));
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const getAll = async () => {
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
            setUserData(response.data.message);
          }
        });
    };
    if (user.loggedIn === true && user.hasSakai === true) {
      getAll();
    }
  }, []);

  if (user.loggedIn === false) {
    return (
      <div className="card mb-2 border border-3 border-secondary rounded">
        <div className="card-body text-white-50 bg-dark">
          <div className="card-text text-white-50">
            Sisteme giriş yapar ve sakai bilgilerinizi ekler iseniz duyurularınızı görüntüleyebilirsiniz.
          </div>
          <br />
          <a href="/login" className="btn btn-primary">
            Giriş Yap
          </a>
        </div>
      </div>
    );
  }
  if (user.hasSakai === false) {
    return (
      <div className="card mb-2 border border-3 border-secondary rounded">
        <div className="card-body text-white-50 bg-dark">
          <div className="card-text text-white-50">
            Sakai bilgilerinizi ekleyerek "duyurularınızı", "Canlı derslerinizi" ve "Ödevlerinizi"
            görüntüleyebilirsiniz.
          </div>
          <LoginSakai />
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="card mb-2 border border-3 border-secondary rounded">
        <div className="card-body text-white-50 bg-dark">
          <h5 className="card-title fw-bold">{userData.name}</h5>

          <div className="card-text">
            {userData.email}
            <br />
          </div>
        </div>
      </div>
    </>
  );
}
