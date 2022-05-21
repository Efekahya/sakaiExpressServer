import axios from "axios";
import React, { useEffect, useState } from "react";
export default function WeatherCard() {
  const [weather, setWeather] = useState(undefined);
  useEffect(() => {
    const getWeather = async () => {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Izmir&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}&units=metric`
      );
      setWeather(response.data);
    };
    getWeather();
  }, []);
  console.log(weather);
  if (weather !== undefined) {
    var date = new Date(weather.dt * 1000);
    return (
      <div
        className="card mb-2 border border-3 border-secondary rounded bg-dark"
        style={{ width: "15rem" }}
      >
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
          className="card-img-top"
          alt="Weather icon"
        ></img>

        <div className="card-body text-white-50 bg-dark">
          <h5 className="card-title fw-bold">{weather.name}</h5>
          <h6 className="card-subtitle">{date.toLocaleString()}</h6>
          <div className="card-text"> {weather.main.temp} °C</div>
        </div>
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}
