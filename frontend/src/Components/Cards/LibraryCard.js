import axios from "axios";
import React, { useEffect, useState } from "react";
export default function LibraryCard() {
  const [library, setLibrary] = useState(undefined);
  useEffect(() => {
    const getLibrary = async () => {
      await axios
        .get("http://localhost:3000/utils/library", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.status === "Success") {
            setLibrary(response.data.message);
          }
        });
    };
    getLibrary();
  }, []);
  console.log(library);
  if (library !== undefined) {
    return (
      <>
        <div className="card mb-2 border border-3 border-secondary rounded w-50 p-0 m-0">
          <div className="card-body text-white-50 bg-dark fs-5">
            <div dangerouslySetInnerHTML={{ __html: library.text }} />

            <div
              className="progress"
              dangerouslySetInnerHTML={{ __html: library.bar }}
            />
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="card" style={{ width: "18rem" }}>
      Loading
    </div>
  );
}
