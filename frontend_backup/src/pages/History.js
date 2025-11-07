import React, { useEffect, useState } from "react";
import { getHistory } from "../api";

function History() {
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchData() {
      const { data } = await getHistory(token);
      setHistory(data);
    }
    fetchData();
  }, [token]);

  return (
    <div>
      <h2>Scan History</h2>
      {history.map((h, i) => (
        <div key={i}>
          <p>{h.prediction} ({(h.confidence*100).toFixed(2)}%)</p>
          <p>{h.recommendation}</p>
          <p>{new Date(h.scanDate).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default History;
