import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ Needed for redirect

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    try {
      const { data } = await login({ email, password });

      // ✅ Save token and update app state
      if (data && data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        // ✅ Redirect to dashboard after successful login
        navigate("/dashboard");
      } else {
        throw new Error("No token received from server");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #d0f0fd 0%, #e8f5fd 100%)",
      fontFamily: "'Ubuntu', Arial, sans-serif",
      position: "relative",
      overflow: "hidden",
    },
    topBanner: {
      position: "absolute",
      top: "30px",
      width: "100%",
      textAlign: "center",
      color: "#333",
    },
    box: {
      padding: "30px",
      backgroundColor: "white",
      borderRadius: "15px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "400px",
      zIndex: 2,
      transition: "transform 0.2s ease-in-out",
      "&:hover": {
        transform: "translateY(-5px)",
      },
    },
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "15px",
      borderRadius: "8px",
      border: "2px solid #e0e0e0",
      fontSize: "16px",
      transition: "border-color 0.3s ease",
      outline: "none",
      "&:focus": {
        borderColor: "#4CAF50",
      },
    },
    button: {
      width: "100%",
      padding: "14px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: "#4CAF50",
      color: "white",
      fontWeight: "600",
      fontSize: "16px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "#45a049",
        transform: "translateY(-2px)",
      },
      "&:active": {
        transform: "translateY(0)",
      },
    },
    error: {
      color: "#e53935",
      marginBottom: "15px",
      textAlign: "center",
      padding: "10px",
      backgroundColor: "#ffebee",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
    },
    link: {
      color: "#4CAF50",
      fontWeight: "bold",
      textDecoration: "none",
    },
    footer: {
      textAlign: "center",
      marginTop: "10px",
    },
    infoSection: {
      position: "absolute",
      bottom: "80px",
      width: "80%",
      textAlign: "center",
      color: "#06643b",
      fontSize: "18px",
      fontWeight: "500",
      lineHeight: "1.5",
    },
    imageSection: {
      position: "absolute",
      bottom: "0",
      right: "0",
      opacity: 0.15,
      zIndex: 1,
    },
    image: {
      width: "500px",
      height: "auto",
    },
    quickLinks: {
      position: "absolute",
      bottom: "20px",
      textAlign: "center",
      width: "100%",
    },
    quickLink: {
      margin: "0 10px",
      color: "#00796b",
      fontWeight: "bold",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBanner}>
        <h1>WELCOME TO THE SMART FOOD ASSISTANT MODEL</h1>
      </div>

      <div style={styles.imageSection}>
        <img src="/images/food-bg.png" alt="Healthy food" style={styles.image} />
      </div>

      <div style={styles.box}>
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin}>
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
            Login
          </button>
        </form>

        <p style={styles.footer}>
          Don’t have an account?{" "}
          <Link style={styles.link} to="/register">
            Register here
          </Link>
        </p>
      </div>

      <div style={styles.infoSection}>
        <p>
          Diet safety is no longer a problem that will give you restless
          moments. We are passionate about ensuring you have a secure and
          healthy diet.
        </p>
      </div>

      <div style={styles.quickLinks}>
        <Link style={styles.quickLink} to="/about">
          About
        </Link>
        |
        <Link style={styles.quickLink} to="/help">
          Help
        </Link>
        |
        <Link style={styles.quickLink} to="/contact">
          Contact
        </Link>
      </div>
    </div>
  );
}

export default Login;
