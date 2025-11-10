import React, { useState } from 'react';
import axios from 'axios';

const NutritionConditionsPage = () => {
  const [healthConditions, setHealthConditions] = useState([]);
  const [customCondition, setCustomCondition] = useState('');
  const [healthRecommendations, setHealthRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableConditions = ['diabetes', 'hypertension', 'heart_disease', 'celiac'];

  const pill = (active) => ({
    padding: '8px 14px',
    border: '1px solid #2C786C',
    borderRadius: '999px',
    background: active ? '#2C786C' : 'white',
    color: active ? '#fff' : '#2C786C',
    cursor: 'pointer',
    transition: 'all .2s ease'
  });

  const toggleHealthCondition = (condition) => {
    setHealthConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  const getHealthAdvice = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post('http://localhost:5001/health-recommendations', {
        conditions: healthConditions,
      });
      setHealthRecommendations(response.data);
    } catch (err) {
      setError('Failed to get health recommendations: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto', fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif' }}>
      <h1 style={{ color: '#12372A', marginBottom: 12 }}>Nutrition Health Conditions</h1>
      <p style={{ color: '#6b7280', marginTop: 0 }}>Select or add health conditions and get tailored dietary advice.</p>

      <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, marginTop: 8, marginBottom: 12 }}>
          <input
            type="text"
            value={customCondition}
            onChange={(e) => setCustomCondition(e.target.value)}
            placeholder="Enter health condition (e.g., lactose intolerance)"
            style={{ flex: 1, padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}
          />
          <button
            onClick={() => {
              if (customCondition.trim()) {
                setHealthConditions([...healthConditions, customCondition.trim().toLowerCase()]);
                setCustomCondition('');
              }
            }}
            style={{ padding: '10px 14px', background: '#2C786C', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
          >
            Add Condition
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {availableConditions.map((condition) => (
            <button key={condition} onClick={() => toggleHealthCondition(condition)} style={pill(healthConditions.includes(condition))}>
              {condition.replace('_', ' ')}
            </button>
          ))}
        </div>

        {healthConditions.length > 0 && (
          <div style={{ marginTop: 10, padding: 12, background: '#F8FAFC', borderRadius: 10, border: '1px dashed #cbd5e1' }}>
            <h4 style={{ margin: 0, marginBottom: 6, color: '#0f766e' }}>Your Health Conditions</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {healthConditions.map((c) => (
                <div key={c} style={{ padding: '6px 10px', background: '#E0F2F1', color: '#065F46', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {c.replace('_', ' ')}
                  <button onClick={() => setHealthConditions(healthConditions.filter((i) => i !== c))} style={{ border: 'none', background: 'transparent', color: '#b91c1c', cursor: 'pointer' }}>×</button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 10 }}>
              <button onClick={getHealthAdvice} disabled={loading || healthConditions.length === 0}
                style={{ padding: '10px 14px', background: '#14532d', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                Get Health Recommendations
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{ color: '#b91c1c', background: '#FEF2F2', border: '1px solid #FECACA', padding: 12, borderRadius: 10, marginBottom: 12 }}>
          {error}
        </div>
      )}

      {healthRecommendations && healthRecommendations.length > 0 && (
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Health Recommendations</h2>
          {healthRecommendations.map((rec) => (
            <div key={rec.condition} style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: 0, marginBottom: 6, color: '#14532d' }}>{rec.condition.replace('_', ' ')}</h3>

              <div style={{ marginBottom: 8 }}>
                <h4 style={{ margin: 0, marginBottom: 4, color: '#065F46' }}>Recommended Foods</h4>
                {Object.entries(rec.recommendations_by_category).map(([category, data]) => (
                  <div key={category} style={{ fontSize: 14, color: '#334155', marginBottom: 4 }}>
                    <strong>{category.replace('_', ' ')}:</strong> {data.examples.join(', ')}
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 8 }}>
                <h4 style={{ margin: 0, marginBottom: 4, color: '#9A3412' }}>Foods to Avoid</h4>
                <p style={{ margin: 0 }}>{rec.foods_to_avoid.join(', ')}</p>
              </div>

              <div style={{ marginBottom: 8 }}>
                <h4 style={{ margin: 0, marginBottom: 4, color: '#1D4ED8' }}>Key Advice</h4>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {rec.key_advice.map((advice, index) => (
                    <li key={index}>{advice}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ margin: 0, marginBottom: 4, color: '#581C87' }}>Nutrients to Focus On</h4>
                <p style={{ margin: 0 }}>{rec.focus_nutrients.map((n) => n.replace('_', ' ')).join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NutritionConditionsPage;
