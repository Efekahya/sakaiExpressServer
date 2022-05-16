import { React, useContext } from "react";
import Feed from "./Feed";
import Login from "./Login";
import LoginContext from "../Context/Login";

export default function Home() {
  const { loggedIn } = useContext(LoginContext);
  console.log(loggedIn);
  if (loggedIn.login === "false") {
    return (
      <>
        <div className="container">
          <br />
          <br />
          <div className="d-flex justify-content-center">
            <h5>You have to login before using the system</h5>
          </div>
        </div>
        <Login />
      </>
    );
  }
  if (loggedIn.login === "true") {
    if (loggedIn.sakai === "" || loggedIn.sakai === undefined) {
      
    return (
      <>
        <div>
          <Feed />
        </div>
      </>
    );
  }
}
