import axios from "axios";
import React, { useEffect, useState } from "react";
export default function MeetingCard() {
  const [meetings, setMeetings] = useState({});
  useEffect(() => {
    const getMeetings = async () => {
      await axios
        .get("http://localhost:3000/user/meeting", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.status === "Success") {
            setMeetings(response.data.message);
          }
        });
    };
    getMeetings();
  }, []);
  if (meetings.length > 0) {
    return meetings.map((item) => {
      let d = new Date(item.startTime).toLocaleString();
      let disabled = "primary";
      let joinButton = "Join Meeting";
      if (item.startTime === "") {
        d = "No Meeting Scheduled";
      }
      if (Date.now() - item.startTime > 0) {
        disabled = "secondary disabled";
        joinButton = "Meeting has ended";
      }
      return (
        <div
          key={item.id}
          className="card mb-2 border border-3 border-secondary rounded"
          style={{ width: "18rem" }}
        >
          <div className="card-body text-white-50 bg-dark">
            <h5 className="card-title text-white-50 fw-bold">{item.name}</h5>
            <h6 className="card-subtitle mb-2 text-warning">{d}</h6>
            <div
              className="card-text"
              dangerouslySetInnerHTML={{ __html: item.body }}
            />
            <div className="card-text">{item.ownerDisplayName}</div>
            <a href={item.joinUrl} className={"btn btn-" + disabled}>
              {joinButton}
            </a>
          </div>
        </div>
      );
    });
  } else {
    return <div className="spinner-border text-primary"></div>;
  }
}
