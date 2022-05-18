import React from "react";
export default function AssignmentCard(item) {
  let d = new Date(item.item.dueDate * 1000).toLocaleString();
  return (
    <div className="card mb-2">
      <div className="card-body">
        <h5 className="card-title">{item.item.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{d}</h6>
        <div
          className="card-text"
          dangerouslySetInnerHTML={{ __html: item.item.instructions }}
        />
        <a href="/" className="btn btn-primary">
          Go somewhere
        </a>
      </div>
    </div>
  );
}
