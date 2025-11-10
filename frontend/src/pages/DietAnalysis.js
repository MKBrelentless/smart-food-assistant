import React, { useState } from 'react';
import axios from 'axios';

const tabs = [
  { key: 'diet', label: 'Diet' },
  { key: 'meal-plan', label: 'Meal Plan' },
  { key: 'nutrition', label: 'Nutrition Health Conditions' }
];

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
    Proteins: ['meat', 'fish', 'eggs', 'beans', 'nuts'],
    Carbohydrates: ['rice', 'bread', 'pasta', 'potatoes'],
    Vegetables: ['leafy_greens', 'cruciferous', 'root_vegetables'],
    Fruits: ['citrus', 'berries', 'tropical_fruits'],
    Dairy: ['milk', 'cheese', 'yogurt'],
    Fats: ['oils', 'avocado', 'nuts_and_seeds']
  };

  // Available health conditions
  const availableConditions = ['diabetes', 'hypertension', 'heart_disease', 'celiac'];

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
      setActiveTab('diet');
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
      setActiveTab('meal-plan');
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
      setActiveTab('nutrition');
    } catch (err) {
      setError('Failed to get health recommendations: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFoodItem = (item) => {
    setFoodItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleHealthCondition = (condition) => {
    setHealthConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
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

  return (
    <div style={{
      padding: '24px',
      maxWidth: '1100px',
      margin: '0 auto',
      fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <h1 style={{ color: '#12372A', margin: 0 }}>Nutrition Assistant</h1>
        <div style={{ color: '#6b7280', fontSize: '14px' }}>Analyze diet, plan meals, and tailor for conditions</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '20px' }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === t.key ? '3px solid #2C786C' : '3px solid transparent',
              color: activeTab === t.key ? '#2C786C' : '#6b7280',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr', gap: '20px' }}>
        {/* Left: Inputs */}
        <div>
          {/* Calorie Target */}
          <div style={{ marginBottom: '18px', background: '#F5FFF8', border: '1px solid #DCFCE7', borderRadius: 12, padding: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#065F46', fontWeight: 600 }}>Daily Calorie Target</label>
            <input
              type="number"
              value={targetCalories}
              onChange={(e) => setTargetCalories(Number(e.target.value))}
              style={{ padding: '10px 12px', width: 180, border: '1px solid #cbd5e1', borderRadius: 8 }}
            />
            <button onClick={generateMealPlan} disabled={loading}
              style={{ marginLeft: 12, padding: '10px 14px', background: '#2C786C', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              Generate Meal Plan
            </button>
          </div>

          {/* Food Selection */}
          <div style={{ marginBottom: '18px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
            <h2 style={{ margin: 0, marginBottom: 10, color: '#0f172a' }}>Select Your Food Items</h2>

            {/* Custom Food */}
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

          {/* Health Conditions */}
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
            <h2 style={{ margin: 0, marginBottom: 10, color: '#0f172a' }}>Nutrition Health Conditions</h2>

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
        </div>

        {/* Right: Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{ color: '#b91c1c', background: '#FEF2F2', border: '1px solid #FECACA', padding: 12, borderRadius: 10 }}>
              {error}
            </div>
          )}

          {/* Diet Analysis Card */}
          {dietAnalysis && (
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
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

          {/* Meal Plan Card */}
          {mealPlan && (
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
              <h2 style={{ margin: 0, color: '#0f172a' }}>Meal Plan</h2>
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

          {/* Health Recommendations Card */}
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
      </div>

      {/* Auto switch to show relevant card */}
      {activeTab === 'diet' && dietAnalysis && null}
      {activeTab === 'meal-plan' && mealPlan && null}
      {activeTab === 'nutrition' && healthRecommendations && null}
    </div>
  );
};

export default DietAnalysis;