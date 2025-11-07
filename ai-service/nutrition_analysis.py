import tensorflow as tf
import numpy as np
from sklearn.preprocessing import MultiLabelBinarizer
import json
import logging
from typing import List, Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Enhanced nutrition data structure
NUTRITION_CATEGORIES = {
    'proteins': {
        'meat': ['chicken', 'turkey', 'beef', 'pork', 'lamb'],
        'fish': ['salmon', 'tuna', 'cod', 'tilapia', 'sardines'],
        'plant_based': ['beans', 'lentils', 'tofu', 'tempeh', 'chickpeas'],
        'eggs_and_dairy': ['eggs', 'greek_yogurt', 'cottage_cheese']
    },
    'carbohydrates': {
        'whole_grains': ['brown_rice', 'quinoa', 'oats', 'whole_wheat_bread', 'barley'],
        'starchy_vegetables': ['sweet_potatoes', 'potatoes', 'corn', 'peas'],
        'legumes': ['black_beans', 'kidney_beans', 'chickpeas', 'lentils']
    },
    'vegetables': {
        'leafy_greens': ['spinach', 'kale', 'lettuce', 'swiss_chard', 'arugula'],
        'cruciferous': ['broccoli', 'cauliflower', 'brussels_sprouts', 'cabbage'],
        'root_vegetables': ['carrots', 'beets', 'turnips', 'radishes'],
        'others': ['tomatoes', 'peppers', 'cucumbers', 'zucchini', 'mushrooms']
    },
    'fruits': {
        'berries': ['blueberries', 'strawberries', 'raspberries', 'blackberries'],
        'citrus': ['oranges', 'lemons', 'limes', 'grapefruits'],
        'tropical': ['bananas', 'mangoes', 'pineapple', 'papaya'],
        'tree_fruits': ['apples', 'pears', 'peaches', 'plums']
    },
    'dairy': {
        'milk_products': ['milk', 'yogurt', 'kefir'],
        'cheese': ['cheddar', 'mozzarella', 'feta', 'cottage_cheese'],
        'alternatives': ['almond_milk', 'soy_milk', 'oat_milk']
    },
    'healthy_fats': {
        'oils': ['olive_oil', 'avocado_oil', 'coconut_oil'],
        'nuts': ['almonds', 'walnuts', 'cashews', 'pistachios'],
        'seeds': ['chia_seeds', 'flax_seeds', 'pumpkin_seeds'],
        'other_fats': ['avocados', 'coconut']
    }
}

# Expanded health conditions and recommendations
HEALTH_RECOMMENDATIONS = {
    'diabetes': {
        'recommended': {
            'proteins': ['fish', 'chicken', 'turkey', 'tofu', 'eggs'],
            'carbs': ['quinoa', 'brown_rice', 'sweet_potatoes'],
            'vegetables': ['leafy_greens', 'broccoli', 'cauliflower'],
            'fruits': ['berries', 'citrus_fruits', 'apples'],
            'fats': ['olive_oil', 'avocados', 'nuts']
        },
        'avoid': ['sugary_foods', 'white_bread', 'pasta', 'processed_foods'],
        'advice': [
            'Focus on low glycemic index foods',
            'Maintain regular meal timing',
            'Balance carbohydrates throughout the day',
            'Include protein with each meal',
            'Monitor portion sizes'
        ],
        'nutrients_to_focus': ['fiber', 'protein', 'healthy_fats']
    },
    'hypertension': {
        'recommended': {
            'proteins': ['fish', 'lean_poultry', 'legumes'],
            'carbs': ['whole_grains', 'oats', 'quinoa'],
            'vegetables': ['leafy_greens', 'beets', 'garlic'],
            'fruits': ['berries', 'bananas', 'pomegranate'],
            'fats': ['olive_oil', 'flax_seeds', 'walnuts']
        },
        'avoid': ['salt', 'processed_foods', 'red_meat', 'alcohol'],
        'advice': [
            'Reduce sodium intake',
            'Increase potassium-rich foods',
            'Choose fresh over processed foods',
            'Include foods rich in omega-3',
            'Stay hydrated with water'
        ],
        'nutrients_to_focus': ['potassium', 'magnesium', 'calcium']
    },
    'heart_disease': {
        'recommended': {
            'proteins': ['fish', 'legumes', 'skinless_poultry'],
            'carbs': ['whole_grains', 'oats', 'quinoa'],
            'vegetables': ['leafy_greens', 'cruciferous_vegetables'],
            'fruits': ['berries', 'citrus_fruits', 'pomegranate'],
            'fats': ['olive_oil', 'nuts', 'seeds']
        },
        'avoid': ['saturated_fats', 'trans_fats', 'excessive_salt', 'processed_foods'],
        'advice': [
            'Choose heart-healthy fats',
            'Increase fiber intake',
            'Limit sodium',
            'Include omega-3 rich foods',
            'Control portion sizes'
        ],
        'nutrients_to_focus': ['omega_3', 'fiber', 'potassium']
    },
    'celiac': {
        'recommended': {
            'proteins': ['meat', 'fish', 'eggs', 'legumes'],
            'carbs': ['rice', 'quinoa', 'corn', 'potatoes'],
            'vegetables': ['all_fresh_vegetables'],
            'fruits': ['all_fresh_fruits'],
            'fats': ['nuts', 'seeds', 'oils']
        },
        'avoid': ['wheat', 'barley', 'rye', 'regular_oats', 'processed_foods'],
        'advice': [
            'Strictly avoid all gluten sources',
            'Check labels carefully',
            'Use certified gluten-free products',
            'Be aware of cross-contamination',
            'Focus on naturally gluten-free foods'
        ],
        'nutrients_to_focus': ['iron', 'b_vitamins', 'fiber']
    }
}

def categorize_food_item(food_item: str) -> List[str]:
    """
    Categorize a food item into its main and sub categories
    """
    categories = []
    for main_category, subcategories in NUTRITION_CATEGORIES.items():
        for subcategory, items in subcategories.items():
            if food_item.lower() in [item.lower() for item in items]:
                categories.extend([main_category, subcategory])
    return list(set(categories))

def analyze_diet_balance(food_items: List[str]) -> Dict[str, Any]:
    """
    Analyze if a diet is balanced based on food items
    """
    try:
        logger.info(f"Analyzing diet balance for {len(food_items)} items")
        
        # Initialize tracking dictionaries
        composition = {category: 0 for category in NUTRITION_CATEGORIES.keys()}
        categorization = {}
        subcategory_counts = {}
        
        # Track food categorization
        for food in food_items:
            categories = categorize_food_item(food)
            categorization[food] = categories
            
            # Update category counts
            for category in categories:
                if category in composition:
                    composition[category] += 1
                    
                # Track subcategory presence
                for main_cat, subcats in NUTRITION_CATEGORIES.items():
                    if food.lower() in [item.lower() for sublist in subcats.values() for item in sublist]:
                        if main_cat not in subcategory_counts:
                            subcategory_counts[main_cat] = set()
                        subcategory_counts[main_cat].add(next(
                            subcat for subcat, items in subcats.items() 
                            if food.lower() in [item.lower() for item in items]
                        ))
        
        # Calculate nutritional completeness
        total_main_categories = len(NUTRITION_CATEGORIES)
        covered_main_categories = sum(1 for count in composition.values() if count > 0)
        
        # Calculate subcategory coverage
        subcategory_coverage = {
            category: len(subcats) / len(NUTRITION_CATEGORIES[category])
            for category, subcats in subcategory_counts.items()
        }
        
        # Generate nutrition summary
        nutrition_summary = {
            'completeness': round((covered_main_categories / total_main_categories) * 100, 2),
            'category_distribution': {
                category: round(count / len(food_items) * 100, 2)
                for category, count in composition.items() if count > 0
            },
            'subcategory_coverage': {
                category: round(coverage * 100, 2)
                for category, coverage in subcategory_coverage.items()
            }
        }
        
        logger.info("Diet analysis completed successfully")
        return {
            'composition': composition,
            'categorization': categorization,
            'nutrition_summary': nutrition_summary
        }
        
    except Exception as e:
        logger.error(f"Error in diet analysis: {str(e)}")
        raise

def get_health_recommendations(conditions: List[str]) -> List[Dict[str, Any]]:
    """
    Get detailed food recommendations based on health conditions, including custom conditions
    """
    try:
        logger.info(f"Getting health recommendations for conditions: {conditions}")
        recommendations = []
        
        for condition in conditions:
            # For known conditions, use predefined recommendations
            if condition in HEALTH_RECOMMENDATIONS:
                condition_data = HEALTH_RECOMMENDATIONS[condition]
                
                # Format recommendations by category
                formatted_recommendations = {}
                for category, items in condition_data['recommended'].items():
                    formatted_recommendations[category] = {
                        'items': items,
                        'examples': [
                            item for item in items 
                            if isinstance(item, str)
                        ][:3]  # Limit to 3 examples
                    }
                
                recommendation = {
                    'condition': condition,
                    'recommendations_by_category': formatted_recommendations,
                    'foods_to_avoid': condition_data['avoid'],
                    'key_advice': condition_data['advice'],
                    'focus_nutrients': condition_data['nutrients_to_focus']
                }
            else:
                # For custom conditions, provide general healthy eating recommendations
                logger.info(f"Generating general recommendations for custom condition: {condition}")
                
                formatted_recommendations = {
                    'proteins': {
                        'items': ['lean meats', 'fish', 'legumes', 'eggs'],
                        'examples': ['chicken breast', 'salmon', 'lentils']
                    },
                    'vegetables': {
                        'items': ['leafy greens', 'cruciferous vegetables', 'colorful vegetables'],
                        'examples': ['spinach', 'broccoli', 'bell peppers']
                    },
                    'fruits': {
                        'items': ['berries', 'citrus fruits', 'apples'],
                        'examples': ['blueberries', 'oranges', 'apples']
                    },
                    'whole_grains': {
                        'items': ['quinoa', 'brown rice', 'oats'],
                        'examples': ['quinoa', 'brown rice', 'oatmeal']
                    },
                    'healthy_fats': {
                        'items': ['olive oil', 'avocados', 'nuts and seeds'],
                        'examples': ['olive oil', 'avocados', 'almonds']
                    }
                }
                
                recommendation = {
                    'condition': condition,
                    'recommendations_by_category': formatted_recommendations,
                    'foods_to_avoid': [
                        'processed foods',
                        'excessive sugar',
                        'artificial additives',
                        'excessive salt'
                    ],
                    'key_advice': [
                        'Eat a balanced diet with plenty of whole foods',
                        'Stay hydrated by drinking plenty of water',
                        'Consider consulting with a healthcare provider or registered dietitian',
                        'Pay attention to how different foods affect your condition',
                        'Keep a food diary to track any reactions or symptoms'
                    ],
                    'focus_nutrients': [
                        'vitamins',
                        'minerals',
                        'fiber',
                        'antioxidants'
                    ]
                }
            
            recommendations.append(recommendation)
        
        logger.info("Health recommendations generated successfully")
        return recommendations
        
    except Exception as e:
        logger.error(f"Error generating health recommendations: {str(e)}")
        raise

# Example usage and testing
if __name__ == "__main__":
    # Test diet analysis
    sample_diet = [
        'salmon', 'quinoa', 'spinach', 
        'blueberries', 'greek_yogurt', 'almonds'
    ]
    print("\nDiet Analysis:", json.dumps(
        analyze_diet_balance(sample_diet), 
        indent=2
    ))
    
    # Test health recommendations
    sample_conditions = ['diabetes', 'heart_disease']
    print("\nHealth Recommendations:", json.dumps(
        get_health_recommendations(sample_conditions), 
        indent=2
    ))