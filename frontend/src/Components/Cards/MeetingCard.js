import React from "react";
export default function MeetingCard(item) {
  let d = new Date(item.item.startTime).toLocaleString();
  let disabled = "primary";
  let joinButton = "Join Meeting";
  if (item.item.startTime === "") {
    d = "No Meeting Scheduled";
  }
  if (Date.now() - item.item.startTime > 0) {
    disabled = "secondary disabled";
    joinButton = "Meeting has ended";
  }

  return (
    <div className="card mb-2">
      <div className="card-body">
        <h5 className="card-title">{item.item.name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{d}</h6>
        <div
          className="card-text"
          dangerouslySetInnerHTML={{ __html: item.item.body }}
        />
        <a href={item.item.joinUrl} className={"btn btn-" + disabled}>
          {joinButton}
        </a>
      </div>
    </div>
  );
}
