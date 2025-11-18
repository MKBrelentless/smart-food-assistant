import React from "react";
import Layout from "../components/Layout";

const Contact = () => {
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
          <h1 style={titleStyle}>Contact Us</h1>
          <p style={leadStyle}>If you need further assistance, feel free to reach out:</p>

          <ul style={leadStyle}>
            <li>Email: <strong>relentlesstechies@gmail.com </strong></li>
           <li>Phone: <strong><a href="tel:+254701850383">+254-701-850-383</a></strong></li>

          </ul>

          <p style={leadStyle}>Our goal is to make you a happy client 😍</p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
