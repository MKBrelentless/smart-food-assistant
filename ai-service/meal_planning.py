import numpy as np
from datetime import datetime
from nutrition_database import EXPANDED_HEALTH_CONDITIONS, FOOD_NUTRITION_DATA

# Use the food database from nutrition_database module
FOOD_DATABASE = FOOD_NUTRITION_DATA

# Daily recommended values
DAILY_RECOMMENDATIONS = {
    'calories': {'min': 1800, 'max': 2500},
    'protein': {'min': 50, 'max': 100},  # grams
    'fat': {'min': 44, 'max': 78},      # grams
    'carbs': {'min': 225, 'max': 325},  # grams
}

def calculate_meal_nutrition(food_items, portions=None):
    """
    Calculate nutritional content of a meal
    portions: dictionary of food_item: portion_size (in grams)
    """
    if portions is None:
        portions = {food: 100 for food in food_items}  # Default 100g portions
        
    total_nutrients = {
        'calories': 0,
        'protein': 0,
        'fat': 0,
        'carbs': 0,
        'vitamins': set()
    }
    
    meal_analysis = []
    
    for food in food_items:
        if food in FOOD_DATABASE:
            portion = portions.get(food, 100)
            multiplier = portion / 100.0
            
            # Calculate nutrients for this portion
            calories = FOOD_DATABASE[food]['calories'] * multiplier
            protein = FOOD_DATABASE[food]['protein'] * multiplier
            fat = FOOD_DATABASE[food]['fat'] * multiplier
            carbs = FOOD_DATABASE[food]['carbs'] * multiplier
            
            # Add to totals
            total_nutrients['calories'] += calories
            total_nutrients['protein'] += protein
            total_nutrients['fat'] += fat
            total_nutrients['carbs'] += carbs
            total_nutrients['vitamins'].update(FOOD_DATABASE[food]['vitamins'])
            
            # Add individual food analysis
            meal_analysis.append({
                'food': food,
                'portion': portion,
                'calories': calories,
                'protein': protein,
                'fat': fat,
                'carbs': carbs,
                'vitamins': FOOD_DATABASE[food]['vitamins']
            })
        else:
            # Handle unknown foods with default values
            portion = portions.get(food, 100)
            meal_analysis.append({
                'food': food,
                'portion': portion,
                'calories': 100,  # Default calories
                'protein': 5,     # Default protein
                'fat': 2,         # Default fat
                'carbs': 15,      # Default carbs
                'vitamins': ['Unknown']
            })
            total_nutrients['calories'] += 100
            total_nutrients['protein'] += 5
            total_nutrients['fat'] += 2
            total_nutrients['carbs'] += 15
    
    # Calculate percentage of daily recommendations
    daily_percentages = {
        'calories': (total_nutrients['calories'] / DAILY_RECOMMENDATIONS['calories']['max']) * 100,
        'protein': (total_nutrients['protein'] / DAILY_RECOMMENDATIONS['protein']['max']) * 100,
        'fat': (total_nutrients['fat'] / DAILY_RECOMMENDATIONS['fat']['max']) * 100,
        'carbs': (total_nutrients['carbs'] / DAILY_RECOMMENDATIONS['carbs']['max']) * 100
    }
    
    # Convert vitamins set to list for JSON serialization
    total_nutrients['vitamins'] = list(total_nutrients['vitamins'])
    
    return {
        'total_nutrients': total_nutrients,
        'total_calories': total_nutrients['calories'],
        'total_protein': total_nutrients['protein'],
        'total_fat': total_nutrients['fat'],
        'total_carbs': total_nutrients['carbs'],
        'daily_percentages': daily_percentages,
        'meal_analysis': meal_analysis,
        'timestamp': datetime.now().isoformat()
    }

def generate_meal_plan(health_conditions=None, target_calories=2000):
    """
    Generate a balanced meal plan considering health conditions
    """
    if health_conditions is None:
        health_conditions = []
        
    # Basic meal structure
    meal_plan = {
        'breakfast': [],
        'lunch': [],
        'dinner': [],
        'snacks': []
    }
    
    # Adjust food selections based on health conditions
    restricted_foods = set()
    recommended_foods = set()
    
    for condition in health_conditions:
        if condition in EXPANDED_HEALTH_CONDITIONS:
            restricted_foods.update(EXPANDED_HEALTH_CONDITIONS[condition]['avoid'])
            recommended_foods.update(EXPANDED_HEALTH_CONDITIONS[condition]['recommended'])
    
    # Generate meals
    available_foods = set(FOOD_DATABASE.keys()) - restricted_foods
    
    # Breakfast (25% of daily calories)
    breakfast_calories = target_calories * 0.25
    breakfast_foods = select_foods_for_calories(available_foods, breakfast_calories, recommended_foods)
    meal_plan['breakfast'] = breakfast_foods
    
    # Lunch (35% of daily calories)
    lunch_calories = target_calories * 0.35
    lunch_foods = select_foods_for_calories(available_foods, lunch_calories, recommended_foods)
    meal_plan['lunch'] = lunch_foods
    
    # Dinner (30% of daily calories)
    dinner_calories = target_calories * 0.30
    dinner_foods = select_foods_for_calories(available_foods, dinner_calories, recommended_foods)
    meal_plan['dinner'] = dinner_foods
    
    # Snacks (10% of daily calories)
    snack_calories = target_calories * 0.10
    snack_foods = select_foods_for_calories(available_foods, snack_calories, recommended_foods)
    meal_plan['snacks'] = snack_foods
    
    # Calculate nutrition for each meal
    meal_nutrition = {}
    for meal, foods in meal_plan.items():
        meal_nutrition[meal] = calculate_meal_nutrition(foods)
    
    return {
        'meal_plan': meal_plan,
        'nutrition_analysis': meal_nutrition,
        'health_considerations': {
            'restricted_foods': list(restricted_foods),
            'recommended_foods': list(recommended_foods)
        }
    }

def select_foods_for_calories(available_foods, target_calories, recommended_foods, tolerance=100):
    """
    Select a combination of foods that approximately match the target calories
    """
    selected_foods = []
    current_calories = 0
    available_foods = list(available_foods)
    
    # Prioritize recommended foods
    for food in recommended_foods:
        if food in available_foods and current_calories < target_calories:
            selected_foods.append(food)
            current_calories += FOOD_DATABASE[food]['calories']
            available_foods.remove(food)
    
    # Add other foods to reach target calories
    np.random.shuffle(available_foods)
    for food in available_foods:
        if current_calories < target_calories - tolerance:
            selected_foods.append(food)
            current_calories += FOOD_DATABASE[food]['calories']
    
    return selected_foods

# Example usage
if __name__ == "__main__":
    # Test meal nutrition calculation
    meal = ['fish', 'rice', 'leafy_greens']
    portions = {'fish': 150, 'rice': 200, 'leafy_greens': 100}
    print("Meal Analysis:", calculate_meal_nutrition(meal, portions))
    
    # Test meal plan generation
    conditions = ['diabetes']
    print("Meal Plan:", generate_meal_plan(conditions, target_calories=1800))