import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div style={{
      padding: '32px',
      fontFamily: "'Ubuntu', sans-serif",
      backgroundColor: 'var(--background-light)',
      minHeight: 'calc(100vh - 80px)',
      color: 'var(--text-dark)',
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: '600',
        marginBottom: '32px',
        color: '#2e7d32',
        textAlign: 'center',
      }}>
        Welcome to Smart Food Assistant
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <Link to="/scan" style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          border: '1px solid #e0e0e0',
          cursor: 'pointer',
        }}>
          <span role="img" aria-label="scan" style={{ fontSize: '48px', marginBottom: '16px' }}>
            🔍
          </span>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#1b5e20' }}>
            Scan Food
          </h2>
          <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
            Upload or capture a photo to check food freshness
          </p>
        </Link>

        <Link to="/history" style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          border: '1px solid #e0e0e0',
          cursor: 'pointer',
        }}>
          <span role="img" aria-label="history" style={{ fontSize: '48px', marginBottom: '16px' }}>
            📜
          </span>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#1b5e20' }}>
            View History
          </h2>
          <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
            See your past food scan results and analysis
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;