import { React } from "react";
import Feed from "./Feed";
export default function Home() {
  let user = localStorage.getItem("user");
  if (!user) {
    localStorage.setItem("user", JSON.stringify({ loggedIn: false }));
  }
  return (
    <>
      <div>
        <Feed />
      </div>
    </>
  );
}
