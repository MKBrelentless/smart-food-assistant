import React, { useState } from 'react';
import axios from 'axios';

const MealPlanPage = () => {
  const [targetCalories, setTargetCalories] = useState(2000);
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateMealPlan = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post('http://localhost:5001/generate-meal-plan', {
        conditions: [],
        target_calories: targetCalories,
      });
      setMealPlan(response.data);
    } catch (err) {
      setError('Failed to generate meal plan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto', fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif' }}>
      <h1 style={{ color: '#12372A', marginBottom: 12 }}>Meal Plan</h1>
      <p style={{ color: '#6b7280', marginTop: 0 }}>Set your daily calorie target and generate a quick meal plan.</p>

      <div style={{ background: '#F5FFF8', border: '1px solid #DCFCE7', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 6, color: '#065F46', fontWeight: 600 }}>Daily Calorie Target</label>
        <input
          type="number"
          value={targetCalories}
          onChange={(e) => setTargetCalories(Number(e.target.value))}
          style={{ padding: '10px 12px', width: 220, border: '1px solid #cbd5e1', borderRadius: 8 }}
        />
        <button onClick={generateMealPlan} disabled={loading}
          style={{ marginLeft: 12, padding: '10px 14px', background: '#2C786C', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          Generate Meal Plan
        </button>
      </div>

      {error && (
        <div style={{ color: '#b91c1c', background: '#FEF2F2', border: '1px solid #FECACA', padding: 12, borderRadius: 10, marginBottom: 12 }}>
          {error}
        </div>
      )}

      {mealPlan && (
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Your Meal Plan</h2>
          {Array.isArray(mealPlan.meal_schedule) ? (
            <ul style={{ marginTop: 8, paddingLeft: 18 }}>
              {mealPlan.meal_schedule.map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>
          ) : (
            <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(mealPlan, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default MealPlanPage;
