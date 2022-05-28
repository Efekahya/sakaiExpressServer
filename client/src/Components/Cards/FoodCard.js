import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Food() {
  const [food, setFood] = useState(undefined);
  useEffect(() => {
    const getFood = async () => {
      await axios
        .get("https://convenient-sakai.herokuapp.com/utils/foodList", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.status === "Success") {
            setFood(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    };
    getFood();
  }, []);
  if (food !== undefined) {
    return (
      <div className="card mb-2 border border-3 border-secondary rounded">
        <img src={food[0].img} className="card-img-top" alt="Food IMG"></img>
        <div className="card-body text-white-50 bg-dark">
          <h5 className="card-title fw-bold">{food[0].date}</h5>
          <div className="card-text"> {food[0].food}</div>
        </div>
        <div className="card-body text-white-50 bg-dark">
          <h5 className="card-title fw-bold">{food[1].date}</h5>
          <div className="card-text"> {food[1].food}</div>
        </div>
      </div>
    );
  }
  return <div className="spinner-border text-primary"></div>;
}
