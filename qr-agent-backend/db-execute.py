import pandas as pd

# Sample data
data = [
    {
        'name': 'Margherita Pizza',
        'description': 'Classic pizza with fresh mozzarella and basil.',
        'price': 9.99,
        'image_url': None,
        'category': 'main',
        'dietary_preference': 'vegetarian',
        'available_times': 'lunch,dinner',
        'is_vegetarian': True,
        'is_available': True
    },
    {
        'name': 'Pepperoni Pizza',
        'description': 'Spicy pepperoni and cheese on tomato base.',
        'price': 11.99,
        'image_url': None,
        'category': 'main',
        'dietary_preference': None,
        'available_times': 'lunch,dinner',
        'is_vegetarian': False,
        'is_available': True
    },
    {
        'name': 'Caesar Salad',
        'description': 'Crisp romaine with Caesar dressing.',
        'price': 6.50,
        'image_url': None,
        'category': 'starter',
        'dietary_preference': 'gluten-free',
        'available_times': 'all-day',
        'is_vegetarian': False,
        'is_available': True
    },
    {
        'name': 'Vegan Buddha Bowl',
        'description': 'Brown rice, chickpeas, and veggies.',
        'price': 10.50,
        'image_url': None,
        'category': 'main',
        'dietary_preference': 'vegan',
        'available_times': 'lunch',
        'is_vegetarian': True,
        'is_available': True
    },
    {
        'name': 'Tomato Soup',
        'description': 'Rich and creamy tomato soup.',
        'price': 5.00,
        'image_url': None,
        'category': 'starter',
        'dietary_preference': 'vegetarian',
        'available_times': 'lunch,dinner',
        'is_vegetarian': True,
        'is_available': True
    },
    {
        'name': 'Chicken Burger',
        'description': 'Grilled chicken with fresh lettuce.',
        'price': 8.50,
        'image_url': None,
        'category': 'main',
        'dietary_preference': None,
        'available_times': 'lunch,dinner',
        'is_vegetarian': False,
        'is_available': True
    },
    {
        'name': 'French Fries',
        'description': 'Crispy golden fries.',
        'price': 3.99,
        'image_url': None,
        'category': 'side',
        'dietary_preference': 'vegan',
        'available_times': 'all-day',
        'is_vegetarian': True,
        'is_available': True
    },
    {
        'name': 'Veggie Wrap',
        'description': 'Grilled veggies wrapped in tortilla.',
        'price': 7.00,
        'image_url': None,
        'category': 'main',
        'dietary_preference': 'vegetarian',
        'available_times': 'all-day',
        'is_vegetarian': True,
        'is_available': True
    },
    {
        'name': 'Mango Smoothie',
        'description': 'Fresh mango blended with yogurt.',
        'price': 4.75,
        'image_url': None,
        'category': 'beverage',
        'dietary_preference': 'vegetarian',
        'available_times': 'breakfast,all-day',
        'is_vegetarian': True,
        'is_available': True
    },
    {
        'name': 'Butter Chicken',
        'description': 'Creamy tomato-based chicken curry.',
        'price': 12.99,
        'image_url': None,
        'category': 'main',
        'dietary_preference': None,
        'available_times': 'dinner',
        'is_vegetarian': False,
        'is_available': True
    },
    {
        'name': 'Greek Salad',
        'description': 'Cucumber, tomato, olives & feta.',
        'price': 6.75,
        'image_url': None,
        'category': 'starter',
        'dietary_preference': 'vegetarian',
        'available_times': 'all-day',
        'is_vegetarian': True,
        'is_available': True
    },
    {
        'name': 'Iced Tea',
        'description': 'Chilled brewed tea with lemon.',
        'price': 2.99,
        'image_url': None,
        'category': 'beverage',
        'dietary_preference': 'vegan',
        'available_times': 'all-day',
        'is_vegetarian': True,
        'is_available': True
    },
    {
        'name': 'Chocolate Cake',
        'description': 'Rich layered chocolate cake.',
        'price': 5.25,
        'image_url': None,
        'category': 'dessert',
        'dietary_preference': 'vegetarian',
        'available_times': 'all-day',
        'is_vegetarian': True,
        'is_available': True
    },
    {
        'name': 'Pasta Alfredo',
        'description': 'Creamy alfredo sauce pasta.',
        'price': 11.00,
        'image_url': None,
        'category': 'main',
        'dietary_preference': 'vegetarian',
        'available_times': 'lunch,dinner',
        'is_vegetarian': True,
        'is_available': True
    },
    {
        'name': 'Fruit Salad',
        'description': 'Seasonal fresh fruits.',
        'price': 4.50,
        'image_url': None,
        'category': 'dessert',
        'dietary_preference': 'vegan',
        'available_times': 'breakfast,all-day',
        'is_vegetarian': True,
        'is_available': True
    },
    {
        'name': 'Grilled Salmon',
        'description': 'Salmon fillet with herbs.',
        'price': 14.99,
        'image_url': None,
        'category': 'main',
        'dietary_preference': None,
        'available_times': 'dinner',
        'is_vegetarian': False,
        'is_available': True
    },
    {
        'name': 'Veggie Omelette',
        'description': 'Omelette with mixed veggies.',
        'price': 6.25,
        'image_url': None,
        'category': 'breakfast',
        'dietary_preference': 'vegetarian',
        'available_times': 'breakfast',
        'is_vegetarian': True,
        'is_available': True
    },
    {
        'name': 'Lemonade',
        'description': 'Freshly squeezed lemonade.',
        'price': 2.50,
        'image_url': None,
        'category': 'beverage',
        'dietary_preference': 'vegan',
        'available_times': 'all-day',
        'is_vegetarian': True,
        'is_available': True
    },
    {
        'name': 'Garlic Bread',
        'description': 'Toasted bread with garlic butter.',
        'price': 3.50,
        'image_url': None,
        'category': 'starter',
        'dietary_preference': 'vegetarian',
        'available_times': 'lunch,dinner',
        'is_vegetarian': True,
        'is_available': True
    },
    {
        'name': 'Espresso',
        'description': 'Strong Italian coffee shot.',
        'price': 2.00,
        'image_url': None,
        'category': 'beverage',
        'dietary_preference': 'vegan',
        'available_times': 'all-day',
        'is_vegetarian': True,
        'is_available': True
    }
]

# Create DataFrame
df = pd.DataFrame(data)

# Save to Excel
df.to_excel('menu_items_template.xlsx', index=False)

print("Excel file 'menu_items_template.xlsx' created successfully!")
