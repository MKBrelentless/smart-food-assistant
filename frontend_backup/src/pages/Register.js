import React, { useState } from "react";
import { register } from "../api";

function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form);
    alert("Registered successfully! Please login.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Username" onChange={(e) => setForm({...form, username: e.target.value})} />
      <input placeholder="Email" onChange={(e) => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={(e) => setForm({...form, password: e.target.value})} />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
