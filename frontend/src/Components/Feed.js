import { React, useEffect } from "react";
import axios from "axios";
import AnnouncementCard from "./Cards/AnnouncementCard";
import AssignmentCard from "./Cards/AssignmentCard";
import MeetingCard from "./Cards/MeetingCard";
import Food from "./Cards/FoodCard";
import LibraryCard from "./Cards/LibraryCard";
import WeatherCard from "./Cards/WeatherCard";
export default function Feed() {
  useEffect(() => {
    const getAll = async () => {
      await axios.get("http://localhost:3000/user/getSakai", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    };

    getAll();
  }, []);
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
          <WeatherCard />
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
