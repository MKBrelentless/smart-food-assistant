import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function Scan() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  
  // Refs to manage DOM elements and the stream object
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null); // CRUCIAL: Holds the active MediaStream object

  const token = localStorage.getItem("token");

  // --------------------------
  // Camera Control Functions
  // --------------------------

  // 🛑 Stop camera stream safely
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null; // Clear the stream reference
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  };

  // Start camera stream
  const startCamera = async () => {
    setCameraError("");
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera API is not supported by your browser. Try Chrome, Firefox, or Edge.");
      return;
    }

    try {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment" // Use back camera on mobile
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Store the stream globally (in the ref) and assign it to the video element
      streamRef.current = stream; 
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      let errorMessage = "Unable to access camera. ";
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage += "Permission denied. Please allow camera access in your browser settings.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorMessage += "No camera found. Please connect a camera and try again.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        errorMessage += "Camera is already in use by another application.";
      } else if (err.name === "SecurityError") {
        errorMessage += "Security error. Make sure you're using HTTPS or localhost.";
      } else {
        errorMessage += `Error: ${err.message}`;
      }
      
      setCameraError(errorMessage);
    }
  };

  // CRITICAL FIX: Stop camera when component unmounts
  React.useEffect(() => {
    return () => {
      // Safely calls the stop function when the component is removed
      stopCamera();
    };
  }, []); // Run only on mount and unmount

  // --------------------------
  // Image Capture and Scan
  // --------------------------

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current) return;
    stopCamera(); // Stop streaming after capture
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) setFile(new File([blob], "capture.jpg", { type: "image/jpeg" }));
    }, "image/jpeg");
  };

  // Scan image (send to backend)
  const handleScan = async () => {
    if (!file) {
      setFeedback("❌ Please select or capture an image first.");
      return;
    }
    setLoading(true);
    setFeedback("");

    const formData = new FormData();
    formData.append("file", file); // Backend (predict_api.py) expects 'file', not 'image'

    // Use environment variable for the Backend URL
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001"; 

    try {
      const { data } = await axios.post(
        `${API_URL}/api/food/scan`, // Use the variable
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const processedResult = {
        status: data.status || 'Unknown',
        confidence: data.confidence || 0,
        advice: data.advice || 'No advice available',
        timestamp: data.timestamp || new Date().toLocaleString()
      };
      
      setPrediction(processedResult);
      setFeedback("✅ Scan successful!");
      // Optionally keep the file for display, but clear it if needed
      // setFile(null); 
      
    } catch (err) {
      console.error("Error scanning image:", err);
      setFeedback(err.message || "❌ Scan failed. Please try again.");
      
      if (err.code === "ERR_NETWORK") {
        setFeedback("❌ Cannot connect to API server. Check network connection and server status.");
      } else if (err.response && err.response.data && err.response.data.error) {
        setFeedback(`❌ Scan failed: ${err.response.data.error}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // Component Rendering
  // --------------------------

  return (
    <div style={{
      fontFamily: "'Ubuntu', sans-serif",
      padding: "32px",
      backgroundColor: "var(--background-light)",
      minHeight: "calc(100vh - 80px)",
      color: "var(--text-dark)",
    }}>
      {/* Upload Section */}
      <div style={{
        backgroundColor: "white",
        padding: "32px",
        borderRadius: "12px",
        maxWidth: "600px",
        margin: "0 auto",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}>
        <h2 style={{
          fontSize: "24px",
          fontWeight: "600",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <span role="img" aria-label="camera">📸</span>
          Scan Food
        </h2>
        
        {/* File Upload */}
        <div style={{
          border: "2px dashed #e0e0e0",
          borderRadius: "8px",
          padding: "32px 24px",
          textAlign: "center",
          marginBottom: "24px",
        }}>
          <input
            type="file"
            onChange={(e) => {
                setFile(e.target.files[0]);
                stopCamera(); // Stop camera if user uploads a file
            }}
            accept="image/*"
            style={{
              width: "100%",
              marginBottom: "20px",
              padding: "10px 12px",
            }}
          />
        </div>
        
        {cameraError && <p style={{ color: 'red', marginBottom: '16px' }}>{cameraError}</p>}

        {/* Camera Section */}
        {!streaming ? (
          <button onClick={startCamera} style={{
            padding: "12px 24px",
            backgroundColor: "var(--primary-color)",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span role="img" aria-label="camera">📷</span>
            Start Camera
          </button>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: "100%",
                marginBottom: "16px",
                borderRadius: "8px",
                border: "1px solid #f0f0f0",
              }}
            />
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={capturePhoto} style={{
                padding: "12px 24px",
                backgroundColor: "var(--primary-color)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
              }}>
                <span role="img" aria-label="capture">📸</span>
                Capture
              </button>
              <button onClick={stopCamera} style={{
                padding: "12px 24px",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
              }}>
                <span role="img" aria-label="stop">⏹️</span>
                Stop
              </button>
            </div>
          </>
        )}

        {/* Scan Button */}
        <button
          onClick={handleScan}
          disabled={loading || !file}
          style={{
            width: "100%",
            marginTop: "24px",
            padding: "14px",
            backgroundColor: loading ? "#ccc" : "var(--primary-color)",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: file ? "pointer" : "not-allowed",
            opacity: file ? 1 : 0.7,
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          <span role="img" aria-label="scan" style={{ marginRight: "8px" }}>🔍</span>
          {loading ? "Analyzing..." : (file ? "Scan Food" : "Select an image first")}
        </button>

        {feedback && (
          <p style={{
            textAlign: "center",
            fontWeight: "500",
            color: feedback.startsWith("❌") ? "#e74c3c" : "var(--primary-color)",
            marginTop: "16px",
            padding: "12px 16px",
            backgroundColor: feedback.startsWith("❌") ? "rgba(231, 76, 60, 0.08)" : "rgba(44, 120, 108, 0.08)",
            borderRadius: "6px",
          }}>
            {feedback}
          </p>
        )}

        {/* Hidden Canvas for capture */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      {/* Prediction Result */}
      {prediction && (
        <div style={{
          backgroundColor: "white",
          borderLeft: "4px solid var(--primary-color)",
          padding: "24px",
          borderRadius: "8px",
          margin: "32px auto",
          maxWidth: "600px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}>
          <h3 style={{
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span role="img" aria-label="result">🔍</span>
            Analysis Result
          </h3>
          <div style={{
            display: "grid",
            gap: "16px",
            fontSize: "15px",
          }}>
            <p style={{
              padding: "12px",
              backgroundColor: prediction.status.toLowerCase() === "fresh" ? "rgba(39, 174, 96, 0.1)" : "rgba(231, 76, 60, 0.1)",
              borderRadius: "6px",
              color: prediction.status.toLowerCase() === "fresh" ? "#27ae60" : "#e74c3c",
              fontWeight: "500",
            }}>
              <strong>Status:</strong> {prediction.status}
            </p>
            <p style={{
              backgroundColor: "rgba(44, 120, 108, 0.08)",
              padding: "12px",
              borderRadius: "6px",
            }}>
              <strong>Confidence:</strong> {prediction.confidence}%
            </p>
            <p style={{
              backgroundColor: "rgba(44, 120, 108, 0.08)",
              padding: "12px",
              borderRadius: "6px",
            }}>
              <strong>Advice:</strong> {prediction.advice}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Scan;