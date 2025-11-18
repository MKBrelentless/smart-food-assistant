import React from "react";
import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Navbar */}
      <nav style={{
        padding: "16px 32px",
        backgroundColor: "#2c3e50",
        color: "white",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <div style={{ fontWeight: "bold", fontSize: "20px" }}>Smart Food Assistant</div>
        <div style={{ display: "flex", gap: "20px" }}>
          <Link to="/about" style={{ color: "white", textDecoration: "none" }}>About</Link>
          <Link to="/help" style={{ color: "white", textDecoration: "none" }}>Help</Link>
          <Link to="/contact" style={{ color: "white", textDecoration: "none" }}>Contact</Link>
        </div>
      </nav>

      {/* Main content */}
      <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
        {children} {/* <-- Render your page content here */}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "20px",
        borderTop: "1px solid #ddd",
        marginTop: "40px"
      }}>
        © {new Date().getFullYear()} Smart Food Assistant. All rights reserved.
      </footer>
    </div>
  );
}

export default Layout;
