USE [db];

-- Seed admin account (password from ADMIN_PASSWORD env variable, defaults to 'root')
INSERT INTO users (email, password_hash, role) VALUES
  ('admin@restaurant.com', '[admin]', 'admin');

-- Seed sample menu items
INSERT INTO menu_items (name, description, price, category) VALUES
  ("Margherita Pizza", "Classic tomato sauce, mozzarella, and fresh basil", 12.99, "Pizza"),
  ("Pepperoni Pizza", "Tomato sauce, mozzarella, and pepperoni", 14.99, "Pizza"),
  ("Caesar Salad", "Romaine lettuce, parmesan, croutons, Caesar dressing", 9.99, "Salads"),
  ("Spaghetti Carbonara", "Pasta with egg, cheese, pancetta, and pepper", 16.99, "Pasta"),
  ("Tiramisu", "Classic Italian coffee-flavored dessert", 7.99, "Desserts"),
  ("Garlic Bread", "Toasted bread with garlic butter and herbs", 5.99, "Starters");