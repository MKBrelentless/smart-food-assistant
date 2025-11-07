import React, { useState } from 'react';
import axios from 'axios';

const ShoppingList = ({ mealPlan }) => {
  const [shoppingList, setShoppingList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkedItems, setCheckedItems] = useState({});

  const generateList = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.post('http://localhost:5001/shopping-list', {
        meal_plan: mealPlan
      });

      setShoppingList(response.data);
    } catch (err) {
      setError('Failed to generate shopping list: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (category, itemIndex) => {
    const key = `${category}-${itemIndex}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const downloadList = () => {
    let content = "Shopping List\n\n";
    
    Object.entries(shoppingList).forEach(([category, items]) => {
      content += `${category.toUpperCase()}\n`;
      items.forEach(item => {
        content += `- ${item.amount}${item.unit} ${item.item.replace('_', ' ')}\n`;
      });
      content += '\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem' 
      }}>
        <h2 style={{ color: '#2C786C' }}>Shopping List</h2>
        <div>
          <button
            onClick={generateList}
            disabled={loading || !mealPlan}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2C786C',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginRight: '1rem',
              cursor: mealPlan ? 'pointer' : 'not-allowed'
            }}
          >
            Generate List
          </button>
          {shoppingList && (
            <button
              onClick={downloadList}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Download List
            </button>
          )}
        </div>
      </div>

      {loading && <div>Generating shopping list...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {shoppingList && (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {Object.entries(shoppingList).map(([category, items]) => (
            <div
              key={category}
              style={{
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                padding: '1rem'
              }}
            >
              <h3 style={{ 
                color: '#2C786C',
                marginBottom: '1rem',
                textTransform: 'capitalize'
              }}>
                {category}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {items.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.5rem 0',
                      borderBottom: '1px solid #ddd'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems[`${category}-${index}`] || false}
                      onChange={() => toggleItem(category, index)}
                      style={{ marginRight: '1rem' }}
                    />
                    <span style={{
                      textDecoration: checkedItems[`${category}-${index}`] ? 'line-through' : 'none'
                    }}>
                      {item.amount}{item.unit} {item.item.replace('_', ' ')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingList;