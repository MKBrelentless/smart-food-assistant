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
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #ecfeff 0%, #f0fdf4 100%)",
      fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      padding: "24px",
    },
    shell: {
      width: "100%",
      maxWidth: "980px",
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "16px",
    },
    headerBar: {
      textAlign: "center",
      color: "#12372A",
      fontWeight: 800,
      letterSpacing: 1,
      marginBottom: 8,
    },
    box: {
      padding: "28px",
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
      width: "100%",
      maxWidth: "480px",
      margin: "0 auto",
      border: "1px solid #e5e7eb",
    },
    title: {
      textAlign: "center",
      marginBottom: "8px",
      color: "#0f172a",
    },
    subtitle: {
      textAlign: "center",
      marginTop: 0,
      marginBottom: 16,
      color: "#64748b",
      fontSize: 14,
    },
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "12px",
      borderRadius: "10px",
      border: "1px solid #cbd5e1",
      fontSize: "16px",
      outline: "none",
    },
    button: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "none",
      backgroundColor: "#2C786C",
      color: "white",
      fontWeight: 600,
      fontSize: "16px",
      cursor: "pointer",
    },
    error: {
      color: "#b91c1c",
      marginBottom: "12px",
      textAlign: "center",
      padding: "10px",
      backgroundColor: "#FEF2F2",
      borderRadius: "10px",
      fontSize: "14px",
      border: "1px solid #FECACA",
    },
    footer: {
      textAlign: "center",
      marginTop: "10px",
      color: "#334155",
    },
    link: {
      color: "#2C786C",
      fontWeight: 700,
      textDecoration: "none",
    },
    infoBlock: {
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: 12,
      padding: 16,
      textAlign: "center",
      color: "#065F46",
    },
    externalImage: {
      display: "block",
      width: "100%",
      maxWidth: "780px",
      margin: "8px auto 0",
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    },
    quickLinks: {
      textAlign: "center",
      marginTop: "12px",
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
      <div style={styles.shell}>
        {/* Top header retained */}
        <div style={styles.headerBar}>SMART FOOD ASSISTANT</div>

        <div style={styles.box}>
          <h2 style={styles.title}>Login</h2>
          <div style={styles.subtitle}>Access your Smart Food Assistant</div>
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

        {/* Info block below the container */}
        <div style={styles.infoBlock}>
          Diet safety is no longer a problem that will give you restless moments. We are passionate about ensuring you have a secure and healthy diet.
        </div>

        {/* External image after the login container */}
        <img
          src="/meal.webp"
          alt="Healthy meal"
          style={styles.externalImage}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

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
    </div>
  );
}

export default Login;
