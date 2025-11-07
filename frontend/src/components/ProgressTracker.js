import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProgressTracker = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  useEffect(() => {
    fetchProgress();
  }, [selectedTimeframe]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError('');

      // Example meal logs - in production, these would come from your database
      const mealLogs = {
        '2025-11-01': [
          {
            total_calories: 2100,
            macros: { protein: 80, carbs: 250, fat: 70 }
          }
        ],
        '2025-11-02': [
          {
            total_calories: 1950,
            macros: { protein: 85, carbs: 230, fat: 65 }
          }
        ]
        // Add more days as needed
      };

      const response = await axios.post('http://localhost:5001/track-progress', {
        meal_logs: mealLogs,
        target_calories: 2000
      });

      setProgress(response.data);
    } catch (err) {
      setError('Failed to fetch progress: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderNutrientChart = (nutrientData) => {
    const maxValue = Math.max(...nutrientData);
    const height = 200;

    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', height: `${height}px`, gap: '4px' }}>
        {nutrientData.map((value, index) => (
          <div
            key={index}
            style={{
              width: '20px',
              height: `${(value / maxValue) * height}px`,
              backgroundColor: '#2C786C',
              position: 'relative'
            }}
            title={`Day ${index + 1}: ${value.toFixed(1)}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#2C786C', marginBottom: '2rem' }}>Nutrition Progress</h2>

      {/* Timeframe Selection */}
      <div style={{ marginBottom: '2rem' }}>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          style={{
            padding: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        >
          <option value="week">Past Week</option>
          <option value="month">Past Month</option>
          <option value="year">Past Year</option>
        </select>
      </div>

      {loading && <div>Loading progress data...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {progress && (
        <div>
          {/* Calorie Tracking */}
          <div style={{ marginBottom: '2rem' }}>
            <h3>Calorie Intake</h3>
            {renderNutrientChart(progress.trends.calories)}
            <div style={{ marginTop: '1rem' }}>
              Target: 2000 calories/day
            </div>
          </div>

          {/* Macronutrient Tracking */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h3>Protein</h3>
              {renderNutrientChart(progress.trends.protein)}
            </div>
            <div>
              <h3>Carbohydrates</h3>
              {renderNutrientChart(progress.trends.carbs)}
            </div>
            <div>
              <h3>Fat</h3>
              {renderNutrientChart(progress.trends.fat)}
            </div>
          </div>

          {/* Weekly Averages */}
          <div>
            <h3>Weekly Averages</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              {Object.entries(progress.weekly_averages).map(([week, averages]) => (
                <div
                  key={week}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px'
                  }}
                >
                  <h4>Week {week}</h4>
                  <p>Calories: {averages.calories.toFixed(1)}</p>
                  <p>Protein: {averages.protein.toFixed(1)}g</p>
                  <p>Carbs: {averages.carbs.toFixed(1)}g</p>
                  <p>Fat: {averages.fat.toFixed(1)}g</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;