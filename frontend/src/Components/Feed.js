import { React, useContext, useEffect, useState } from "react";
import LoginContext from "../Context/Login";
import axios from "axios";
import AnnouncementCard from "./Cards/AnnouncementCard";
import AssignmentCard from "./Cards/AssignmentCard";
import MeetingCard from "./Cards/MeetingCard";

const items = [1, 2, 3, 4, 5];
export default function Feed() {
  const { loggedIn } = useContext(LoginContext);
  const [announcement, setAnnouncement] = useState({});
  const [assignment, setAssignment] = useState({});
  const [meeting, setMeeting] = useState({});

  useEffect(() => {
    const getAll = async () => {
      await axios
        .get("http://localhost:3000/user/announcement", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.status === "Success") {
            console.log(response.data.message);
            setAnnouncement(response.data.message);
          }
        });
      await axios
        .get("http://localhost:3000/user/assignment", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.status === "Success") {
            console.log(response.data.message);
            setAssignment(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      await axios
        .get("http://localhost:3000/user/meeting", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.status === "Success") {
            console.log(response.data.message);
            setMeeting(response.data.message);
          }
        });
    };

    getAll();
  }, []);
  return (
    <div className="container ma-auto w-100 p-0">
      <div className="row ">
        <div className="col ">
          <h3>Duyurular</h3>
          {announcement.length > 0 ? (
            announcement.map((item) => (
              <AnnouncementCard key={item.id} item={item} />
            ))
          ) : (
            <AnnouncementCard
              item={{ title: "Duyuru Yok", id: "", createdOn: "", body: "" }}
            />
          )}
        </div>
        <div className="col">
          <h3>Ödevler</h3>
          {assignment.length > 0 ? (
            assignment.map((item) => (
              <AssignmentCard key={item.id} item={item} />
            ))
          ) : (
            <AssignmentCard
              item={{ title: "Ödev Yok", id: "", createdOn: "", body: "" }}
            />
          )}
        </div>
        <div className="col">
          <h3>Canlı Dersler</h3>
          {meeting.length > 0 ? (
            meeting.map((item) => <MeetingCard key={item.id} item={item} />)
          ) : (
            <MeetingCard
              item={{ title: "Ders Yok", id: "", startTime: "", body: "" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
