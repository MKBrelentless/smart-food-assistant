import React, { useState } from 'react';
import axios from 'axios';

const DietAnalysis = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [customFoodItem, setCustomFoodItem] = useState('');
  const [healthConditions, setHealthConditions] = useState([]);
  const [customCondition, setCustomCondition] = useState('');
  const [dietAnalysis, setDietAnalysis] = useState(null);
  const [healthRecommendations, setHealthRecommendations] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [mealNutrition, setMealNutrition] = useState(null);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [portions, setPortions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('diet');

  // Available food categories and items
  const foodCategories = {
    'Proteins': ['meat', 'fish', 'eggs', 'beans', 'nuts'],
    'Carbohydrates': ['rice', 'bread', 'pasta', 'potatoes'],
    'Vegetables': ['leafy_greens', 'cruciferous', 'root_vegetables'],
    'Fruits': ['citrus', 'berries', 'tropical_fruits'],
    'Dairy': ['milk', 'cheese', 'yogurt'],
    'Fats': ['oils', 'avocado', 'nuts_and_seeds']
  };

  // Available health conditions
  const availableConditions = [
    'diabetes',
    'hypertension',
    'heart_disease',
    'celiac'
  ];

  const analyzeDiet = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [dietResponse, nutritionResponse] = await Promise.all([
        axios.post('http://localhost:5001/analyze-diet', {
          food_items: foodItems
        }),
        axios.post('http://localhost:5001/analyze-meal', {
          food_items: foodItems,
          portions
        })
      ]);
      
      setDietAnalysis(dietResponse.data);
      setMealNutrition(nutritionResponse.data);
    } catch (err) {
      setError('Failed to analyze diet: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateMealPlan = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('http://localhost:5001/generate-meal-plan', {
        conditions: healthConditions,
        target_calories: targetCalories
      });
      
      setMealPlan(response.data);
    } catch (err) {
      setError('Failed to generate meal plan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getHealthAdvice = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('http://localhost:5001/health-recommendations', {
        conditions: healthConditions
      });
      
      setHealthRecommendations(response.data);
    } catch (err) {
      setError('Failed to get health recommendations: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFoodItem = (item) => {
    if (foodItems.includes(item)) {
      setFoodItems(foodItems.filter(i => i !== item));
    } else {
      setFoodItems([...foodItems, item]);
    }
  };

  const toggleHealthCondition = (condition) => {
    if (healthConditions.includes(condition)) {
      setHealthConditions(healthConditions.filter(c => c !== condition));
    } else {
      setHealthConditions([...healthConditions, condition]);
    }
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#2C786C', marginBottom: '2rem' }}>
        Nutrition Assistant
      </h1>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        borderBottom: '2px solid #2C786C'
      }}>
        {['diet', 'meal-plan', 'nutrition'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab ? '3px solid #2C786C' : 'none',
              color: activeTab === tab ? '#2C786C' : '#666',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {/* Calorie Target Input */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Daily Calorie Target:
        </label>
        <input
          type="number"
          value={targetCalories}
          onChange={(e) => setTargetCalories(Number(e.target.value))}
          style={{
            padding: '0.5rem',
            width: '150px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* Food Selection Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>Select Your Food Items</h2>
        
        {/* Custom Food Input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#2C786C', marginBottom: '0.5rem' }}>Add Custom Food Item</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              value={customFoodItem}
              onChange={(e) => setCustomFoodItem(e.target.value)}
              placeholder="Enter food item (e.g., quinoa, tofu)"
              style={{
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                flex: 1
              }}
            />
            <button
              onClick={() => {
                if (customFoodItem.trim()) {
                  setFoodItems([...foodItems, customFoodItem.trim().toLowerCase()]);
                  setCustomFoodItem('');
                }
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#2C786C',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add Food
            </button>
          </div>
        </div>

        {/* Preset Categories */}
        {Object.entries(foodCategories).map(([category, items]) => (
          <div key={category} style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: '#2C786C' }}>{category}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {items.map(item => (
                <button
                  key={item}
                  onClick={() => toggleFoodItem(item)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #2C786C',
                    borderRadius: '20px',
                    background: foodItems.includes(item) ? '#2C786C' : 'white',
                    color: foodItems.includes(item) ? 'white' : '#2C786C',
                    cursor: 'pointer'
                  }}
                >
                  {item.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Selected Food Items Display */}
        {foodItems.length > 0 && (
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
            <h4 style={{ color: '#2C786C', marginBottom: '0.5rem' }}>Your Selected Foods:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {foodItems.map(item => (
                <div
                  key={item}
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#e0f2f1',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {item.replace('_', ' ')}
                  <button
                    onClick={() => setFoodItems(foodItems.filter(i => i !== item))}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#f44336',
                      cursor: 'pointer',
                      padding: '0 0.25rem'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={analyzeDiet}
          disabled={loading || foodItems.length === 0}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2C786C',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Analyze Diet
        </button>
      </div>

      {/* Health Conditions Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>Select Your Health Conditions</h2>
        
        {/* Custom Health Condition Input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#2C786C', marginBottom: '0.5rem' }}>Add Custom Health Condition</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              value={customCondition}
              onChange={(e) => setCustomCondition(e.target.value)}
              placeholder="Enter health condition (e.g., lactose intolerance)"
              style={{
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                flex: 1
              }}
            />
            <button
              onClick={() => {
                if (customCondition.trim()) {
                  setHealthConditions([...healthConditions, customCondition.trim().toLowerCase()]);
                  setCustomCondition('');
                }
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#2C786C',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add Condition
            </button>
          </div>
        </div>

        {/* Preset Conditions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {availableConditions.map(condition => (
            <button
              key={condition}
              onClick={() => toggleHealthCondition(condition)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #2C786C',
                borderRadius: '20px',
                background: healthConditions.includes(condition) ? '#2C786C' : 'white',
                color: healthConditions.includes(condition) ? 'white' : '#2C786C',
                cursor: 'pointer'
              }}
            >
              {condition.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Selected Items Display */}
        {healthConditions.length > 0 && (
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
            <h4 style={{ color: '#2C786C', marginBottom: '0.5rem' }}>Your Health Conditions:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {healthConditions.map(condition => (
                <div
                  key={condition}
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#e0f2f1',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {condition.replace('_', ' ')}
                  <button
                    onClick={() => setHealthConditions(healthConditions.filter(c => c !== condition))}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#f44336',
                      cursor: 'pointer',
                      padding: '0 0.25rem'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={getHealthAdvice}
          disabled={loading || healthConditions.length === 0}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2C786C',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Get Health Recommendations
        </button>
      </div>

      {/* Results Section */}
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {dietAnalysis && (
        <div style={{ 
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '5px'
        }}>
          <h2>Diet Analysis Results</h2>
          <p>Balance Score: {dietAnalysis.balance_score.toFixed(1)}%</p>
          
          {dietAnalysis.missing_nutrients.length > 0 && (
            <div>
              <h3>Missing Nutrients:</h3>
              <ul>
                {dietAnalysis.recommendations.map(rec => (
                  <li key={rec.category}>
                    {rec.category}: Try adding {rec.suggestions.join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {healthRecommendations && healthRecommendations.length > 0 && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '5px'
        }}>
          <h2>Health Recommendations</h2>
          {healthRecommendations.map(rec => (
            <div key={rec.condition} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#2C786C' }}>
                {rec.condition.replace('_', ' ')}
              </h3>
              
              {/* Recommended Foods by Category */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#2C786C', marginBottom: '0.5rem' }}>Recommended Foods:</h4>
                {Object.entries(rec.recommendations_by_category).map(([category, data]) => (
                  <div key={category} style={{ marginBottom: '0.5rem' }}>
                    <strong>{category.replace('_', ' ')}:</strong>{' '}
                    {data.examples.join(', ')}
                  </div>
                ))}
              </div>
              
              {/* Foods to Avoid */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#2C786C', marginBottom: '0.5rem' }}>Foods to Avoid:</h4>
                <p>{rec.foods_to_avoid.join(', ')}</p>
              </div>
              
              {/* Key Advice */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#2C786C', marginBottom: '0.5rem' }}>Key Advice:</h4>
                <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
                  {rec.key_advice.map((advice, index) => (
                    <li key={index}>{advice}</li>
                  ))}
                </ul>
              </div>
              
              {/* Focus Nutrients */}
              <div>
                <h4 style={{ color: '#2C786C', marginBottom: '0.5rem' }}>Nutrients to Focus On:</h4>
                <p>{rec.focus_nutrients.map(n => n.replace('_', ' ')).join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DietAnalysis;