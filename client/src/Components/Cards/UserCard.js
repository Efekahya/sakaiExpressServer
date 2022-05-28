import axios from "axios";
import React, { useEffect, useState } from "react";
import LoginSakai from "../Pages/LoginSakai";
export default function UserCard() {
  let user = JSON.parse(localStorage.getItem("user"));
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const getAll = async () => {
      await axios
        .get("https://convenient-sakai.herokuapp.com/user/getUser", {
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

  const seeNotifications = () => {
    window.location.href = "/notifications"
  }

const deleteNotifications = () => {
  
}

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
      <div className="card mb-4 mb-xl-0 border border-3 border-secondary rounded bg-dark text-white-50">
        <div className="card-body text-center">
          <img src={userData.profilePicture} alt="profile" className="rounded-5" />
          <br />
          <br />
          <div className="card-body text-white-50 bg-dark">
            <h5 className="card-title fw-bold">
              {userData.name} {userData.lastName}
            </h5>

            <div className="card-text">
              {userData.sakaiEmail}
              </div>
              <br />
            <div className="card-text text-start">
              Okunmamış Mesajlar :<span className="text-warning"> {userData.unreadMessagesCount}</span>
              </div>
            <div className="card-text text-start">
              Okunmamış Bildirimler :<span className="text-warning"> {userData.bullhornAlertCount}</span>
              </div>
              <br />
              <br />
              <button className="btn btn-primary text-start" onClick={seeNotifications}>Okunmamış Bildirimleri Gör</button>
              <br /><br />
              <button className="btn btn-warning text-start" onClick={deleteNotifications}>Okunmamış Bildirimleri Sil</button>
            </div>
        </div>
      </div>
    </>
  );
}
