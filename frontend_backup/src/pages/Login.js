import React, { useState } from "react";
import { login } from "../api";

function Login({ setToken }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await login(form);
    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Email" onChange={(e) => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={(e) => setForm({...form, password: e.target.value})} />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
