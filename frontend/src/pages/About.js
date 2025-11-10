import React from 'react';

const About = () => {
  const wrap = {
    padding: 24,
    maxWidth: 900,
    margin: '0 auto',
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif'
  };
  const card = {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
  };
  const title = { marginTop: 0, color: '#0f172a' };
  const lead = { color: '#334155' };

  return (
    <div style={wrap}>
      <div style={card}>
        <h1 style={title}>About</h1>
        <p style={lead}>
          Smart Food Assistant is designed to help you analyze your diet, generate balanced meal plans,
          and receive nutrition guidance tailored to your health conditions.
        </p>
        <h2 style={{ color: '#14532d' }}>Developer</h2>
        <p style={lead}>
          Built by <strong>Austine Mukabwa</strong>. Passionate about building AI-driven tools that make
          everyday health decisions simpler, safer, and more data‑driven.
        </p>
        <p style={lead}>
          This project blends computer vision and nutrition intelligence to deliver practical insights and
          actionable meal planning.
        </p>
      </div>
    </div>
  );
};

export default About;
