import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NotificationCard from "../Cards/NotificationCard"
export default function Notification() {
const [notifications,setNotifications] = useState()
    useEffect(() => {
  const getNotifications = async() =>{
    await axios
      .get("https://convenient-sakai.herokuapp.com/user/getNotifications", {
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("user")).token,
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status === "Success") {
          setNotifications(response.data.message);
        }
      });
    };


    
    getNotifications()
}, [])
if (notifications){
      return(
        <>
        <div className="row">
          <div className="col">
          <h5 className='text-white-50 text-center'>Ödevler</h5>
          <br />
          <NotificationCard item={notifications.assignments} />
          </div>
          <div className="col">
          <h5 className='text-white-50 text-center'>Duyurular</h5>
          <br />
          <NotificationCard item={notifications.announcements} />

          </div>
        </div>
      </>
      )


    }
  
}
