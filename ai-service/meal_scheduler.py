from datetime import datetime, timedelta
from nutrition_database import (
    EXPANDED_FOOD_DATABASE,
    EXPANDED_HEALTH_CONDITIONS,
    RECIPES_DATABASE,
    MEAL_TIMING
)

def generate_weekly_meal_plan(health_conditions=None, target_calories=2000):
    """
    Generate a weekly meal plan considering health conditions and calorie targets
    """
    if health_conditions is None:
        health_conditions = []

    weekly_plan = {}
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    # Get suitable recipes for the conditions
    suitable_recipes = {}
    for recipe_id, recipe in RECIPES_DATABASE.items():
        if all(condition in recipe['suitable_for'] for condition in health_conditions):
            suitable_recipes[recipe_id] = recipe

    for day in days:
        daily_plan = {
            'breakfast': None,
            'morning_snack': None,
            'lunch': None,
            'afternoon_snack': None,
            'dinner': None,
            'total_calories': 0,
            'nutrition_summary': {'protein': 0, 'carbs': 0, 'fat': 0}
        }

        # Assign meals based on timing and calorie distribution
        for meal_type, timing in MEAL_TIMING.items():
            calorie_target = target_calories * timing['calorie_distribution']
            
            # Select appropriate recipe or food combinations
            if suitable_recipes:
                # Try to find a suitable recipe
                for recipe_id, recipe in suitable_recipes.items():
                    if abs(recipe['nutrition']['calories'] - calorie_target) < 100:
                        daily_plan[meal_type] = {
                            'recipe': recipe_id,
                            'details': recipe
                        }
                        daily_plan['total_calories'] += recipe['nutrition']['calories']
                        break

            # If no suitable recipe found, create a food combination
            if daily_plan[meal_type] is None:
                meal = create_meal_combination(
                    calorie_target,
                    health_conditions,
                    timing['macros']
                )
                daily_plan[meal_type] = meal
                daily_plan['total_calories'] += meal['total_calories']

        weekly_plan[day] = daily_plan

    return weekly_plan

def create_meal_combination(target_calories, health_conditions, macro_targets):
    """
    Create a balanced meal combination meeting calorie and macro targets
    """
    # Filter foods based on health conditions
    suitable_foods = {}
    for food_id, food_info in EXPANDED_FOOD_DATABASE.items():
        is_suitable = True
        for condition in health_conditions:
            if condition in EXPANDED_HEALTH_CONDITIONS:
                if food_id in EXPANDED_HEALTH_CONDITIONS[condition]['avoid']:
                    is_suitable = False
                    break
        if is_suitable:
            suitable_foods[food_id] = food_info

    # Create meal combination
    meal = {
        'foods': {},
        'total_calories': 0,
        'macros': {'protein': 0, 'carbs': 0, 'fat': 0}
    }

    # Add foods until reaching target calories
    categories_needed = ['protein', 'grain', 'vegetable', 'fruit']
    for category in categories_needed:
        category_foods = {k: v for k, v in suitable_foods.items() 
                        if v.get('category') == category}
        
        if category_foods:
            selected_food = list(category_foods.items())[0]
            portion = calculate_portion(
                selected_food[1],
                target_calories * 0.25  # Distribute calories evenly
            )
            
            meal['foods'][selected_food[0]] = {
                'portion': portion,
                'calories': selected_food[1]['calories'] * (portion/100)
            }
            meal['total_calories'] += meal['foods'][selected_food[0]]['calories']
            
            # Update macros
            meal['macros']['protein'] += selected_food[1]['protein'] * (portion/100)
            meal['macros']['carbs'] += selected_food[1]['carbs'] * (portion/100)
            meal['macros']['fat'] += selected_food[1]['fat'] * (portion/100)

    return meal

def calculate_portion(food_info, target_calories):
    """
    Calculate portion size needed to meet target calories
    """
    calories_per_100g = food_info['calories']
    return (target_calories / calories_per_100g) * 100

def generate_shopping_list(meal_plan):
    """
    Generate a shopping list from a meal plan
    """
    shopping_list = {}
    
    for day, meals in meal_plan.items():
        for meal_type, meal in meals.items():
            if meal is None:
                continue
                
            if 'recipe' in meal:
                # Add recipe ingredients
                recipe = meal['details']
                for ingredient, amount in recipe['ingredients'].items():
                    if ingredient in shopping_list:
                        shopping_list[ingredient] += amount
                    else:
                        shopping_list[ingredient] = amount
            else:
                # Add individual foods
                for food, details in meal['foods'].items():
                    if food in shopping_list:
                        shopping_list[food] += details['portion']
                    else:
                        shopping_list[food] = details['portion']
    
    # Convert to list format with categories
    categorized_list = {}
    for item, amount in shopping_list.items():
        if item in EXPANDED_FOOD_DATABASE:
            category = EXPANDED_FOOD_DATABASE[item]['category']
            if category not in categorized_list:
                categorized_list[category] = []
            categorized_list[category].append({
                'item': item,
                'amount': round(amount, 2),
                'unit': 'g'
            })
    
    return categorized_list

def track_nutrition_progress(meal_logs, target_calories):
    """
    Track nutrition progress over time
    """
    progress = {
        'daily_summaries': {},
        'weekly_averages': {},
        'trends': {
            'calories': [],
            'protein': [],
            'carbs': [],
            'fat': []
        }
    }
    
    # Calculate daily summaries
    for date, meals in meal_logs.items():
        daily_total = {
            'calories': 0,
            'protein': 0,
            'carbs': 0,
            'fat': 0
        }
        
        for meal in meals:
            daily_total['calories'] += meal['total_calories']
            daily_total['protein'] += meal['macros']['protein']
            daily_total['carbs'] += meal['macros']['carbs']
            daily_total['fat'] += meal['macros']['fat']
        
        progress['daily_summaries'][date] = {
            'total': daily_total,
            'target_met': (daily_total['calories'] >= target_calories * 0.9 and 
                         daily_total['calories'] <= target_calories * 1.1)
        }
        
        # Add to trends
        progress['trends']['calories'].append(daily_total['calories'])
        progress['trends']['protein'].append(daily_total['protein'])
        progress['trends']['carbs'].append(daily_total['carbs'])
        progress['trends']['fat'].append(daily_total['fat'])
    
    # Calculate weekly averages
    weeks = {}
    for date, summary in progress['daily_summaries'].items():
        week_num = datetime.strptime(date, '%Y-%m-%d').isocalendar()[1]
        if week_num not in weeks:
            weeks[week_num] = []
        weeks[week_num].append(summary['total'])
    
    for week_num, days in weeks.items():
        progress['weekly_averages'][week_num] = {
            'calories': sum(day['calories'] for day in days) / len(days),
            'protein': sum(day['protein'] for day in days) / len(days),
            'carbs': sum(day['carbs'] for day in days) / len(days),
            'fat': sum(day['fat'] for day in days) / len(days)
        }
    
    return progress

if __name__ == "__main__":
    # Test weekly meal plan generation
    plan = generate_weekly_meal_plan(['diabetes'], 2000)
    print("Weekly Meal Plan:", plan)
    
    # Test shopping list generation
    shopping_list = generate_shopping_list(plan)
    print("\nShopping List:", shopping_list)