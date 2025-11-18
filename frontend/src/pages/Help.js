import React from "react";
import Layout from "../components/Layout";

const Help = () => {
  const cardStyle = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
  };

  const titleStyle = { marginTop: 0, color: "#0f172a" };
  const leadStyle = { color: "#334155" };

  return (
    <Layout>
      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto", fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" }}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Help & Support</h1>
          <h2 style={{ color: "#14532d" }}>Login Issues</h2>
          <p style={leadStyle}>Make sure your email and password are correct. Try resetting your password.</p>

          <h2 style={{ color: "#14532d" }}>Page Not Loading</h2>
          <p style={leadStyle}>Refresh the page or check your internet connection.</p>

          <h2 style={{ color: "#14532d" }}>Need More Assistance?</h2>
          <p style={leadStyle}>Reach out to our support team anytime—we’re here to help you stay safe and healthy.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
