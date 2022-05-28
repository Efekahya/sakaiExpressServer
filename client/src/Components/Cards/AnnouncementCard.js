import axios from "axios";
import React, { useEffect, useState } from "react";
export default function AnnouncementCard() {
  const [announcement, setAnnouncement] = useState({});
  useEffect(() => {
    const getAnnouncements = async () => {
      await axios
        .get("https://convenient-sakai.herokuapp.com/user/announcement", {
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("user")).token,
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.status === "Success") {
            setAnnouncement(response.data.message);
          }
        });
    };
    getAnnouncements();
  }, []);
  if (announcement.length > 0) {
    return announcement.map((item) => {
      let d = new Date(item.createdOn).toLocaleString();
      return (
        <div key={item.id} className="card mb-2 border border-3 border-secondary rounded">
          <div className="card-body text-white-50 bg-dark">
            <h5 className="card-title fw-bold">{item.title}</h5>
            <h6 className="card-subtitle mb-2 text-warning">{d}</h6>

            <div className="card-text" dangerouslySetInnerHTML={{ __html: item.body }} />
          </div>
        </div>
      );
    });
  } else {
    return <div className="spinner-border text-primary"></div>;
  }
}
