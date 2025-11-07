import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ add useNavigate
import { register } from "../api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ initialize navigate

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const response = await register({ name, email, password });
      setSuccess("Registration successful! Redirecting to login...");
      // ✅ Redirect to login after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#fde0e0",
      fontFamily: "Arial, sans-serif",
    },
    box: {
      padding: "20px",
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "400px",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    button: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#ff4d4d",
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
    },
    success: {
      color: "green",
      marginBottom: "10px",
      textAlign: "center",
    },
    error: {
      color: "red",
      marginBottom: "10px",
      textAlign: "center",
    },
    link: {
      color: "#ff4d4d",
      fontWeight: "bold",
      textDecoration: "none",
    },
    footer: {
      textAlign: "center",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form onSubmit={handleRegister}>
          <input
            style={styles.input}
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={styles.button} type="submit">
            Register
          </button>
        </form>
        <p style={styles.footer}>
          Already have an account?{" "}
          <Link style={styles.link} to="/login">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
