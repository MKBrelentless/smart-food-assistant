import React, { useState } from "react";
import { scanFood } from "../api";

function Scan() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const token = localStorage.getItem("token");

  const handleScan = async () => {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await scanFood(formData, token);
    setResult(`Prediction: ${data.prediction}, Confidence: ${data.confidence}, Advice: ${data.recommendation}`);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleScan}>Scan</button>
      <p>{result}</p>
    </div>
  );
}

export default Scan;
