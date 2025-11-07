import React, { useState, useEffect } from "react";
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  Link, 
  useLocation,
  useNavigate
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Scan from "./pages/Scan";
import History from "./pages/History";
import DietAnalysis from "./pages/DietAnalysis";

/* ✅ Protected Route */
const ProtectedRoute = ({ token, children }) => {
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

/* ✅ Navbar Component */
function Navbar({ handleLogout }) {
  const location = useLocation();
  const linkStyle = (isActive) => ({
    textDecoration: "none",
    color: isActive ? "#1b5e20" : "#1976d2",
    fontWeight: isActive ? "bold" : "normal",
    borderBottom: isActive ? "2px solid #1b5e20" : "none",
    paddingBottom: "4px",
  });

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: "#f1f8e9",
        borderBottom: "2px solid #c8e6c9",
      }}
    >
      <div style={{ fontSize: "22px", fontWeight: "bold", color: "#2e7d32" }}>
        Smart Food Safety Assistant
      </div>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/dashboard" style={linkStyle(location.pathname === "/dashboard")}>
          Dashboard
        </Link>
        <Link to="/scan" style={linkStyle(location.pathname === "/scan")}>
          Scan
        </Link>
        <Link to="/history" style={linkStyle(location.pathname === "/history")}>
          History
        </Link>
        <Link to="/diet-analysis" style={linkStyle(location.pathname === "/diet-analysis")}>
          Diet Analysis
        </Link>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#f44336",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

/* ✅ Main App Component */
function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {token && <Navbar handleLogout={handleLogout} />}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Login setToken={setToken} />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Register />
          } 
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={token}>
              <Dashboard />
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

        <Route
          path="/diet-analysis"
          element={
            <ProtectedRoute token={token}>
              <DietAnalysis />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
