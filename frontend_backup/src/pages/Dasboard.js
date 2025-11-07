import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch user’s scan history when page loads
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT token from login
        const res = await axios.get("http://localhost:5000/api/scans/history", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Upload image for AI prediction
  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select an image first.");

    const formData = new FormData();
    formData.append("foodImage", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/scans/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      setPrediction(res.data); // { prediction, confidence, recommendation }
      setHistory([res.data, ...history]); // Add new scan to top of history
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  return (
    <div className="dashboard">
      <h1>📊 Smart Food Safety Assistant</h1>

      {/* Upload Section */}
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button onClick={handleUpload}>Scan Food</button>
      </div>

      {/* Prediction Result */}
      {prediction && (
        <div className="result">
          <h2>🔍 Scan Result</h2>
          <p><strong>Prediction:</strong> {prediction.prediction}</p>
          <p><strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(2)}%</p>
          <p><strong>Recommendation:</strong> {prediction.recommendation}</p>
        </div>
      )}

      {/* History Section */}
      <div className="history">
        <h2>📜 Scan History</h2>
        {history.length === 0 ? (
          <p>No scans yet. Upload an image to get started!</p>
        ) : (
          <ul>
            {history.map((scan, idx) => (
              <li key={idx}>
                <p><strong>Date:</strong> {new Date(scan.scanDate).toLocaleString()}</p>
                <p><strong>Prediction:</strong> {scan.prediction}</p>
                <p><strong>Recommendation:</strong> {scan.recommendation}</p>
                <img src={`http://localhost:5000/${scan.foodImage}`} alt="Scanned Food" width="150" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
