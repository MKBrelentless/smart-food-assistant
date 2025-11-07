import React, { useEffect, useState } from "react";
import axios from "axios";

function History() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Please log in to view your history.");
      return;
    }

    async function fetchData() {
    try {
      const { data } = await axios.get("http://localhost:3001/api/food/history", {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });        if (Array.isArray(data)) {
          setHistory(data);
          setError("");
        } else {
          setError("Invalid data format received");
        }
      } catch (err) {
        console.error("History fetch error:", err);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
        } else {
          setError("Unable to load history. Please try again later.");
        }
      }
    }
    fetchData();
  }, [token]);

  const styles = {
    container: {
      fontFamily: "'Ubuntu', sans-serif",
      padding: "32px",
      backgroundColor: "var(--background-light)",
      minHeight: "calc(100vh - 80px)",
      color: "var(--text-dark)",
    },
    header: {
      fontSize: "28px",
      fontWeight: "600",
      marginBottom: "32px",
      color: "#2e7d32",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    error: {
      color: "#e74c3c",
      backgroundColor: "rgba(231, 76, 60, 0.1)",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "24px",
      textAlign: "center",
    },
    historyContainer: {
      maxWidth: "1000px",
      margin: "0 auto",
    },
    historyItem: {
      backgroundColor: "white",
      padding: "24px",
      borderRadius: "12px",
      marginBottom: "16px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      border: "1px solid #f0f0f0",
    },
    statusBadge: (status) => ({
      display: "inline-block",
      padding: "6px 12px",
      borderRadius: "20px",
      fontWeight: "500",
      backgroundColor: status?.toLowerCase().includes("fresh") 
        ? "rgba(39, 174, 96, 0.1)"
        : "rgba(231, 76, 60, 0.1)",
      color: status?.toLowerCase().includes("fresh") ? "#27ae60" : "#e74c3c",
    }),
    infoGrid: {
      display: "grid",
      gap: "16px",
      marginTop: "12px",
    },
    infoItem: {
      backgroundColor: "rgba(44, 120, 108, 0.08)",
      padding: "12px",
      borderRadius: "6px",
    },
    date: {
      color: "#666",
      fontSize: "14px",
      marginBottom: "8px",
    },
    emptyState: {
      textAlign: "center",
      padding: "48px 24px",
      backgroundColor: "white",
      borderRadius: "12px",
      color: "#666",
      border: "1px solid #f0f0f0",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.historyContainer}>
        <h2 style={styles.header}>
          <span role="img" aria-label="history">📜</span>
          Scan History
        </h2>
        
        {error && <p style={styles.error}>{error}</p>}
        
        {history.length === 0 ? (
          <div style={styles.emptyState}>
            <span role="img" aria-label="empty" style={{fontSize: "32px", marginBottom: "16px", display: "block"}}>
              📸
            </span>
            <p style={{margin: 0, fontSize: "15px"}}>
              No scans yet. Try scanning some food!
            </p>
          </div>
        ) : (
          history.map((scan, idx) => (
            <div key={idx} style={styles.historyItem}>
              <p style={styles.date}>
                <span role="img" aria-label="date">📅</span>
                {" "}
                {new Date(scan.createdAt || scan.scanDate || scan.timestamp).toLocaleString()}
              </p>
              
              <div style={styles.infoGrid}>
                <p style={{margin: 0}}>
                  <span style={styles.statusBadge(scan.status || scan.prediction)}>
                    {scan.status || scan.prediction || "Unknown"}
                  </span>
                </p>
                
                <p style={styles.infoItem}>
                  <strong>Confidence:</strong>{" "}
                  {typeof scan.confidence === 'number' 
                    ? `${(scan.confidence).toFixed(2)}%`
                    : "N/A"}
                </p>
                
                <p style={styles.infoItem}>
                  <strong>Advice:</strong>{" "}
                  {scan.advice || scan.recommendation || "No advice available"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;


