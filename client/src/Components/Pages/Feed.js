import { React, useEffect } from "react";
import axios from "axios";
import AnnouncementCard from "../Cards/AnnouncementCard";
import AssignmentCard from "../Cards/AssignmentCard";
import MeetingCard from "../Cards/MeetingCard";
import Food from "../Cards/FoodCard";
import LibraryCard from "../Cards/LibraryCard";
import WeatherCard from "../Cards/WeatherCard";
import UserCard from "../Cards/UserCard";
export default function Feed() {
  useEffect(() => {
    const getAll = async () => {
      if (user.loggedIn === false || user.hasSakai === undefined || user.hasSakai === false) {
        return;
      }
      await axios.get(
        "https://convenient-sakai.herokuapp.com/user/getSakaiToken",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("user")).token,
          },
          withCredentials: true,
        }
      );
    };
    getAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let user = JSON.parse(localStorage.getItem("user"));
  if (user.loggedIn === false || user.hasSakai === undefined || user.hasSakai === false) {
    return (
      <div className="container ma-auto w-100 p-0">
        <div className="row">
          <div className="col">
            <h3 className="text-white-50">Yemekhane</h3>
            <Food />
          </div>
          <div className="col">
            <h3 className="text-white-50">Kütüphane</h3>
            <LibraryCard />
            <h3 className="text-white-50">Hava Durumu</h3>
            <WeatherCard />
          </div>
          <div className="col mb-5">
            <h3 className="text-white-50">Profil</h3>
            <UserCard />
          </div>
        </div>
        <hr style={{ borderTop: "3px solid #bbb" }}></hr>
      </div>
    );
  }

  return (
    <div className="container ma-auto w-100 p-0">
      <div className="row">
        <div className="col">
          <h3 className="text-white-50">Yemekhane</h3>
          <Food />
        </div>
        <div className="col">
          <h3 className="text-white-50">Kütüphane</h3>
          <LibraryCard />
          <h3 className="text-white-50">Hava Durumu</h3>
          <WeatherCard />
        </div>
        <div className="col mb-5">
          <h3 className="text-white-50">Profil</h3>
          <UserCard />
        </div>
      </div>
      <hr style={{ borderTop: "3px solid #bbb" }}></hr>
      <div className="row ">
        <div className="col ">
          <h3 className="text-white-50">Duyurular</h3>
          <AnnouncementCard />
        </div>
        <div className="col">
          <h3 className="text-white-50">Ödevler</h3>
          <AssignmentCard />
        </div>
        <div className="col">
          <h3 className="text-white-50">Canlı Dersler</h3>
          <MeetingCard />
        </div>
      </div>
    </div>
  );
}
