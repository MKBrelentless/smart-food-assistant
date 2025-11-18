import React from "react";
import Layout from "../components/Layout";

const About = () => {
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
          <h1 style={titleStyle}>About</h1>
          <p style={leadStyle}>
           <strong>Smart Food Assistant </strong> is designed to help you analyze your diet, generate balanced meal plans,
            and receive nutrition guidance tailored to your health conditions.
          </p>
          <h2 style={{ color: "#14532d" }}>Developer</h2>
          <p style={leadStyle}>
            Built by <strong>RELENTLESS TECHNOLOGIES LTD</strong>. Passionate about building AI-driven tools that make
            everyday health decisions simpler, safer, and more data‑driven.
          </p>
          <p style={leadStyle}>
            This project blends computer vision and nutrition intelligence to deliver practical insights and
            actionable meal planning.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
