import React from 'react';

const Help = () => {
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
  const list = { marginTop: 8, paddingLeft: 20 };

  return (
    <div style={wrap}>
      <div style={card}>
        <h1 style={title}>Help</h1>
        <p style={lead}>Quick start guide</p>
        <ol style={list}>
          <li>Register an account and login.</li>
          <li>Use Scan to check food freshness via image analysis.</li>
          <li>Use Diet to select foods and analyze your diet balance.</li>
          <li>Use Meal Plan to set a calorie target and generate a plan.</li>
          <li>Use Nutrition Health Conditions to get tailored guidance.</li>
        </ol>

        <h2 style={{ color: '#14532d' }}>Common issues</h2>
        <ul style={list}>
          <li>API not reachable: ensure backend services are running (ports as configured).</li>
          <li>Login fails: verify your credentials or re-register if needed.</li>
          <li>Images don’t show: place static assets in the frontend/public folder.</li>
        </ul>
      </div>
    </div>
  );
};

export default Help;
