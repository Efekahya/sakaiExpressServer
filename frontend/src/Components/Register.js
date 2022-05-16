import React from "react";
import axios from "axios";
const handleRegister = (e) => {
  e.preventDefault();
  const form = e.target.form;
  console.log(form);
  const data = {
    email: form.email.value,
    password: form.password.value,
    name: form.name.value,
  };
  axios
    .post("http://localhost:3000/user/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log(response.data);
    });
};

export default function Register() {
  return (
    <div>
      <h1>Register</h1>
      <form action="" method="POST">
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" />
        <button type="button" onClick={handleRegister}>
          Register
        </button>
      </form>
    </div>
  );
}
