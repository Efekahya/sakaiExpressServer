import { React, useContext } from "react";
import LoginContext from "../Context/Login";
import axios from "axios";
const items = [1, 2, 3, 4, 5];
export default function Feed() {
  const { loggedIn } = useContext(LoginContext);
  console.log(loggedIn.email);
  axios
    .post("http://localhost:3000/user/announcement", {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      if (response.data.status === "Success") {
        console.log(response.data.message);
      }
    });

  return (
    <div className="container ma-auto w-100 p-0">
      <div className="row ">
        <div className="col ">
          <h3>Duyurular</h3>

          {items.map((item) => (
            <div className="card mb-2" key={item}>
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <a href="/" className="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="col">
          <h3>Ödevler</h3>
          {items.map((item) => (
            <div className="card mb-2" key={item}>
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <a href="/" className="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="col">
          <h3>Canlı Dersler</h3>
          {items.map((item) => (
            <div className="card mb-2" key={item}>
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <a href="/" className="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
