import axios from "axios";
import React, { useEffect, useState } from "react";
export default function AssignmentCard() {
  const [assignments, setAssignments] = useState({});
  useEffect(() => {
    const getAssignments = async () => {
      await axios
        .get("https://convenient-sakai.herokuapp.com/user/assignment", {
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("user")).token,
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.status === "Success") {
            setAssignments(response.data.message);
          }
        });
    };
    getAssignments();
  }, []);
  if (assignments.length > 0) {
    return assignments.map((item) => {
      let d = new Date(item.dueDate * 1000).toLocaleString();
      return (
        <div key={item.id} className="card mb-2 border border-3 border-secondary rounded">
          <div className="card-body text-white-50 bg-dark">
            <h5 className="card-title fw-bold">{item.title}</h5>
            <h6 className="card-subtitle mb-2 text-warning">{d}</h6>

            <div className="card-text" dangerouslySetInnerHTML={{ __html: item.instructions }} />
          </div>
        </div>
      );
    });
  } else {
    return <div className="spinner-border text-primary"></div>;
  }
}
