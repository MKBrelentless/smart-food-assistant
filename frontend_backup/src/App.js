import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Scan from "./pages/Scan";
import History from "./pages/History";

// ✅ Protected Route Wrapper
function ProtectedRoute({ token, children }) {
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const styles = {
    nav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      backgroundColor: "#f1f8e9",
      borderBottom: "2px solid #c8e6c9",
    },
    title: {
      fontSize: "22px",
      fontWeight: "bold",
      color: "#2e7d32",
    },
    navLinks: {
      display: "flex",
      gap: "20px",
    },
    link: {
      textDecoration: "none",
      color: "#1976d2",
      fontWeight: "bold",
    },
    logoutBtn: {
      padding: "8px 16px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#f44336",
      color: "white",
      cursor: "pointer",
    },
  };

  return (
    <>
      {/* ✅ Show navbar only if logged in */}
      {token && (
        <nav style={styles.nav}>
          <div style={styles.title}>Smart Food Safety Assistant</div>
          <div style={styles.navLinks}>
            <Link to="/dashboard" style={styles.link}>
              Dashboard
            </Link>
            <Link to="/scan" style={styles.link}>
              Scan Food
            </Link>
            <Link to="/history" style={styles.link}>
              History
            </Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </nav>
      )}

      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={token}>
              <Dashboard handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scan"
          element={
            <ProtectedRoute token={token}>
              <Scan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute token={token}>
              <History />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
