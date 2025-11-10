import React, { useState } from 'react';
import axios from 'axios';

const DietPage = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [customFoodItem, setCustomFoodItem] = useState('');
  const [dietAnalysis, setDietAnalysis] = useState(null);
  const [mealNutrition, setMealNutrition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const foodCategories = {
    Proteins: ['meat', 'fish', 'eggs', 'beans', 'nuts'],
    Carbohydrates: ['rice', 'bread', 'pasta', 'potatoes'],
    Vegetables: ['leafy_greens', 'cruciferous', 'root_vegetables'],
    Fruits: ['citrus', 'berries', 'tropical_fruits'],
    Dairy: ['milk', 'cheese', 'yogurt'],
    Fats: ['oils', 'avocado', 'nuts_and_seeds']
  };

  const pill = (active) => ({
    padding: '8px 14px',
    border: '1px solid #2C786C',
    borderRadius: '999px',
    background: active ? '#2C786C' : 'white',
    color: active ? '#fff' : '#2C786C',
    cursor: 'pointer',
    transition: 'all .2s ease'
  });

  const toggleFoodItem = (item) => {
    setFoodItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const analyzeDiet = async () => {
    try {
      setLoading(true);
      setError('');

      const [dietResponse, nutritionResponse] = await Promise.all([
        axios.post('http://localhost:5001/analyze-diet', { food_items: foodItems }),
        axios.post('http://localhost:5001/analyze-meal', { food_items: foodItems, portions: {} })
      ]);

      setDietAnalysis(dietResponse.data);
      setMealNutrition(nutritionResponse.data);
    } catch (err) {
      setError('Failed to analyze diet: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto', fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif' }}>
      <h1 style={{ color: '#12372A', marginBottom: 12 }}>Diet</h1>
      <p style={{ color: '#6b7280', marginTop: 0 }}>Select your food items and analyze your diet balance.</p>

      <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <h2 style={{ margin: 0, marginBottom: 10, color: '#0f172a' }}>Select Your Food Items</h2>
        <div style={{ display: 'flex', gap: 10, marginTop: 8, marginBottom: 12 }}>
          <input
            type="text"
            value={customFoodItem}
            onChange={(e) => setCustomFoodItem(e.target.value)}
            placeholder="Enter food item (e.g., quinoa, tofu)"
            style={{ flex: 1, padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}
          />
          <button
            onClick={() => {
              if (customFoodItem.trim()) {
                setFoodItems([...foodItems, customFoodItem.trim().toLowerCase()]);
                setCustomFoodItem('');
              }
            }}
            style={{ padding: '10px 14px', background: '#2C786C', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
          >
            Add Food
          </button>
        </div>

        {Object.entries(foodCategories).map(([category, items]) => (
          <div key={category} style={{ marginBottom: 12 }}>
            <h3 style={{ margin: 0, marginBottom: 8, color: '#14532d' }}>{category}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {items.map((item) => (
                <button key={item} onClick={() => toggleFoodItem(item)} style={pill(foodItems.includes(item))}>
                  {item.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        ))}

        {foodItems.length > 0 && (
          <div style={{ marginTop: 10, padding: 12, background: '#F8FAFC', borderRadius: 10, border: '1px dashed #cbd5e1' }}>
            <h4 style={{ margin: 0, marginBottom: 6, color: '#0f766e' }}>Your Selected Foods</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {foodItems.map((item) => (
                <div key={item} style={{ padding: '6px 10px', background: '#E0F2F1', color: '#065F46', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {item.replace('_', ' ')}
                  <button onClick={() => setFoodItems(foodItems.filter((i) => i !== item))} style={{ border: 'none', background: 'transparent', color: '#b91c1c', cursor: 'pointer' }}>×</button>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10 }}>
              <button onClick={analyzeDiet} disabled={loading || foodItems.length === 0}
                style={{ padding: '10px 14px', background: '#14532d', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                Analyze Diet
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

      {dietAnalysis && (
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, color: '#0f172a' }}>Diet Analysis</h2>
            <div style={{ fontWeight: 700, color: '#14532d' }}>{dietAnalysis.balance_score.toFixed(1)}%</div>
          </div>

          {dietAnalysis.missing_nutrients?.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <h3 style={{ margin: 0, marginBottom: 6, color: '#14532d' }}>Missing Nutrients</h3>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {dietAnalysis.recommendations.map((rec) => (
                  <li key={rec.category}>
                    <strong>{rec.category}:</strong> Try adding {rec.suggestions.join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mealNutrition && (
            <div style={{ marginTop: 12 }}>
              <h3 style={{ margin: 0, marginBottom: 6, color: '#14532d' }}>Estimated Nutrition</h3>
              <div style={{ fontSize: 14, color: '#334155' }}>
                Calories: {mealNutrition.total_calories} kcal · Protein: {mealNutrition.total_protein} g · Carbs: {mealNutrition.total_carbs} g · Fat: {mealNutrition.total_fat} g
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DietPage;
