"""
Enhanced nutrition and health database with comprehensive food categories and health conditions
"""

# Expanded food categories with detailed nutritional information
EXPANDED_FOOD_DATABASE = {
    # Proteins
    'chicken_breast': {'calories': 165, 'protein': 31, 'fat': 3.6, 'carbs': 0,
                      'vitamins': ['B6', 'B12', 'Niacin'], 'serving_size': 100,
                      'category': 'protein', 'glycemic_index': 0},
    'salmon': {'calories': 208, 'protein': 22, 'fat': 13, 'carbs': 0,
               'vitamins': ['D', 'B12', 'Omega3'], 'serving_size': 100,
               'category': 'protein', 'glycemic_index': 0},
    'tofu': {'calories': 144, 'protein': 17, 'fat': 8.7, 'carbs': 2.8,
             'vitamins': ['Iron', 'Calcium', 'Magnesium'], 'serving_size': 100,
             'category': 'protein', 'glycemic_index': 15},
    
    # Grains
    'quinoa': {'calories': 120, 'protein': 4.4, 'fat': 1.9, 'carbs': 21.3,
               'vitamins': ['Iron', 'Magnesium', 'Zinc'], 'serving_size': 100,
               'category': 'grain', 'glycemic_index': 53},
    'brown_rice': {'calories': 111, 'protein': 2.6, 'fat': 0.9, 'carbs': 23,
                   'vitamins': ['B1', 'B6', 'Magnesium'], 'serving_size': 100,
                   'category': 'grain', 'glycemic_index': 50},
    'oats': {'calories': 389, 'protein': 16.9, 'fat': 6.9, 'carbs': 66.3,
             'vitamins': ['Iron', 'Zinc', 'B1'], 'serving_size': 100,
             'category': 'grain', 'glycemic_index': 55},
    
    # Vegetables
    'spinach': {'calories': 23, 'protein': 2.9, 'fat': 0.4, 'carbs': 3.6,
                'vitamins': ['K', 'A', 'C'], 'serving_size': 100,
                'category': 'vegetable', 'glycemic_index': 0},
    'broccoli': {'calories': 55, 'protein': 3.7, 'fat': 0.6, 'carbs': 11.2,
                 'vitamins': ['C', 'K', 'Folate'], 'serving_size': 100,
                 'category': 'vegetable', 'glycemic_index': 10},
    'sweet_potato': {'calories': 86, 'protein': 1.6, 'fat': 0.1, 'carbs': 20.1,
                     'vitamins': ['A', 'C', 'B6'], 'serving_size': 100,
                     'category': 'vegetable', 'glycemic_index': 70},
    
    # Fruits
    'blueberries': {'calories': 57, 'protein': 0.7, 'fat': 0.3, 'carbs': 14.5,
                    'vitamins': ['C', 'K', 'Manganese'], 'serving_size': 100,
                    'category': 'fruit', 'glycemic_index': 53},
    'apple': {'calories': 52, 'protein': 0.3, 'fat': 0.2, 'carbs': 14,
              'vitamins': ['C', 'Fiber', 'Potassium'], 'serving_size': 100,
              'category': 'fruit', 'glycemic_index': 36},
    'avocado': {'calories': 160, 'protein': 2, 'fat': 14.7, 'carbs': 8.5,
                'vitamins': ['K', 'Folate', 'C'], 'serving_size': 100,
                'category': 'fruit', 'glycemic_index': 15},
    
    # Dairy
    'greek_yogurt': {'calories': 59, 'protein': 10, 'fat': 0.4, 'carbs': 3.6,
                     'vitamins': ['Calcium', 'B12', 'Probiotics'], 'serving_size': 100,
                     'category': 'dairy', 'glycemic_index': 20},
    'cottage_cheese': {'calories': 98, 'protein': 11, 'fat': 4.3, 'carbs': 3.4,
                      'vitamins': ['Calcium', 'B12', 'Phosphorus'], 'serving_size': 100,
                      'category': 'dairy', 'glycemic_index': 30}
}

# Expanded health conditions database
EXPANDED_HEALTH_CONDITIONS = {
    'diabetes': {
        'recommended': ['quinoa', 'spinach', 'chicken_breast', 'greek_yogurt'],
        'avoid': ['white_bread', 'sugary_foods', 'processed_foods'],
        'advice': 'Focus on low glycemic index foods and regular meal timing.',
        'glycemic_index_limit': 55,
        'meal_timing': {'breakfast': '7-8AM', 'lunch': '12-1PM', 'dinner': '6-7PM'},
        'snack_recommendations': ['nuts', 'greek_yogurt', 'berries']
    },
    'hypertension': {
        'recommended': ['spinach', 'berries', 'salmon', 'oats'],
        'avoid': ['processed_meats', 'canned_foods', 'high_sodium_foods'],
        'advice': 'Limit sodium intake to 2000mg per day and increase potassium-rich foods.',
        'sodium_limit': 2000,
        'potassium_target': 3500,
        'meal_pattern': 'frequent_small_meals'
    },
    'celiac': {
        'recommended': ['quinoa', 'rice', 'sweet_potato', 'chicken_breast'],
        'avoid': ['wheat', 'barley', 'rye', 'processed_foods'],
        'advice': 'Strictly avoid gluten-containing foods.',
        'cross_contamination_warning': True,
        'alternative_grains': ['quinoa', 'rice', 'corn', 'buckwheat']
    },
    'heart_disease': {
        'recommended': ['salmon', 'oats', 'berries', 'nuts'],
        'avoid': ['saturated_fats', 'processed_foods', 'high_sodium_foods'],
        'advice': 'Focus on heart-healthy fats and limit sodium intake.',
        'fat_recommendations': {'saturated': '<7%', 'unsaturated': '20-35%'},
        'exercise_recommendations': '150 minutes moderate activity per week'
    },
    'gout': {
        'recommended': ['cherries', 'low_fat_dairy', 'whole_grains'],
        'avoid': ['red_meat', 'organ_meats', 'high_fructose_foods'],
        'advice': 'Limit purine-rich foods and maintain adequate hydration.',
        'purine_limit': '300mg/day',
        'hydration_target': '3L/day'
    },
    'ibs': {
        'recommended': ['banana', 'rice', 'yogurt', 'lean_meats'],
        'avoid': ['caffeine', 'spicy_foods', 'high_fat_foods'],
        'advice': 'Follow FODMAP guidelines and identify trigger foods.',
        'meal_timing': 'regular_intervals',
        'portion_control': 'small_frequent_meals'
    }
}

# Recipe database with ingredients and instructions
RECIPES_DATABASE = {
    'quinoa_bowl': {
        'name': 'Healthy Quinoa Bowl',
        'ingredients': {
            'quinoa': 100,
            'chicken_breast': 150,
            'spinach': 50,
            'avocado': 50
        },
        'instructions': [
            'Cook quinoa according to package instructions',
            'Grill chicken breast with herbs',
            'Combine with fresh spinach and sliced avocado'
        ],
        'nutrition': {
            'calories': 450,
            'protein': 35,
            'carbs': 40,
            'fat': 20
        },
        'suitable_for': ['diabetes', 'celiac', 'heart_disease']
    },
    'berry_yogurt_parfait': {
        'name': 'Berry Yogurt Parfait',
        'ingredients': {
            'greek_yogurt': 150,
            'blueberries': 100,
            'oats': 30
        },
        'instructions': [
            'Layer greek yogurt in a glass',
            'Add fresh berries',
            'Top with oats'
        ],
        'nutrition': {
            'calories': 300,
            'protein': 20,
            'carbs': 25,
            'fat': 10
        },
        'suitable_for': ['diabetes', 'heart_disease']
    }
}

# Meal timing recommendations
MEAL_TIMING = {
    'breakfast': {
        'ideal_time': '7:00-9:00',
        'calorie_distribution': 0.25,
        'macros': {'protein': 0.25, 'carbs': 0.5, 'fat': 0.25}
    },
    'morning_snack': {
        'ideal_time': '10:00-11:00',
        'calorie_distribution': 0.1,
        'macros': {'protein': 0.3, 'carbs': 0.5, 'fat': 0.2}
    },
    'lunch': {
        'ideal_time': '12:00-14:00',
        'calorie_distribution': 0.3,
        'macros': {'protein': 0.3, 'carbs': 0.4, 'fat': 0.3}
    },
    'afternoon_snack': {
        'ideal_time': '15:00-16:00',
        'calorie_distribution': 0.1,
        'macros': {'protein': 0.3, 'carbs': 0.5, 'fat': 0.2}
    },
    'dinner': {
        'ideal_time': '18:00-20:00',
        'calorie_distribution': 0.25,
        'macros': {'protein': 0.35, 'carbs': 0.35, 'fat': 0.3}
    }
}