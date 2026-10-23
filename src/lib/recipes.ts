import type { Category } from "./mock-data";

export interface Recipe { title: string; ingredients: string[]; steps: string[] }

const BY_CODE: Record<string, Recipe> = {
  "890100001": { title: "Masala Chai & Kheer Cup", ingredients: ["2 cups milk", "3 tbsp poha", "2 tbsp sugar", "Cardamom"], steps: ["Boil milk 5 min.", "Add rinsed poha and sugar, simmer 7 min.", "Add cardamom, serve warm or chilled."] },
  "890100002": { title: "Quick Fruit Yogurt Parfait", ingredients: ["1 cup greek yogurt", "1 banana", "Honey", "Granola or nuts"], steps: ["Slice the banana.", "Layer yogurt, fruit and granola in a glass.", "Drizzle honey and serve."] },
  "890200002": { title: "Croissant Cheese Toastie", ingredients: ["2 croissants", "Cheese slices", "Tomato", "Butter"], steps: ["Split croissants, add cheese and tomato.", "Toast in a buttered pan 3 min each side.", "Serve hot."] },
  "890200003": { title: "Mini Veg Sliders", ingredients: ["Multigrain buns", "1 boiled potato", "Onion", "Chaat masala"], steps: ["Mash potato with onion and masala, shape patties.", "Pan-fry 3 min each side.", "Toast buns, assemble and serve."] },
  "890300001": { title: "10-min Palak Paneer Bhurji", ingredients: ["250g spinach", "100g paneer", "1 onion", "Garlic, salt, cumin"], steps: ["Sauté cumin, garlic and onion 3 min.", "Add chopped spinach, cook 4 min.", "Crumble in paneer, season and cook 3 min."] },
  "890300003": { title: "Garlic Butter Broccoli", ingredients: ["1 broccoli", "2 tbsp butter", "3 garlic cloves", "Salt, pepper, lemon"], steps: ["Cut florets, blanch 3 min.", "Sauté garlic in butter 1 min.", "Toss broccoli 4 min, finish with lemon."] },
  "890500001": { title: "Orange Sunrise Smoothie", ingredients: ["1 cup orange juice", "1 banana", "½ cup yogurt", "Ice"], steps: ["Add everything to a blender.", "Blend 1 minute until smooth.", "Serve chilled."] },
  "890500003": { title: "Coconut Mint Cooler", ingredients: ["Coconut water", "Mint leaves", "Lemon juice", "Ice"], steps: ["Crush mint with lemon juice.", "Add coconut water and ice.", "Stir and serve."] },
  "890600002": { title: "Pan-fried Chilli Momos", ingredients: ["12 momos", "1 onion, 1 capsicum", "Soy & chilli sauce", "Oil"], steps: ["Steam or microwave momos 5 min.", "Stir-fry onion and capsicum 3 min.", "Toss momos with sauces 3 min."] },
};

const BY_CATEGORY: Record<Category, Recipe> = {
  Dairy: { title: "Creamy Veg Sandwich", ingredients: ["Bread", "Dairy item", "Cucumber, tomato", "Salt, pepper"], steps: ["Spread or layer the dairy item on bread.", "Add veggies and seasoning.", "Grill 4 min and serve."] },
  Bakery: { title: "Sweet Bread Pudding Cup", ingredients: ["Bakery item", "1 cup milk", "1 egg or 2 tbsp custard powder", "Sugar"], steps: ["Tear the bakery item into a mug.", "Whisk milk, egg and sugar, pour over.", "Microwave 3–4 min and serve."] },
  Vegetables: { title: "Quick Veg Stir-fry", ingredients: ["Vegetable", "Garlic", "Soy sauce", "Oil"], steps: ["Chop the vegetable.", "Stir-fry with garlic on high heat 6 min.", "Add soy sauce, toss and serve."] },
  Snacks: { title: "Crunchy Chaat Bowl", ingredients: ["Snack", "Onion, tomato", "Lemon", "Chaat masala"], steps: ["Crush the snack into a bowl.", "Add chopped onion and tomato.", "Season with lemon and masala."] },
  Beverages: { title: "Fresh Fruit Cooler", ingredients: ["Beverage", "Ice", "Lemon", "Mint"], steps: ["Fill a glass with ice and mint.", "Pour the beverage, squeeze lemon.", "Stir and serve."] },
  Frozen: { title: "Easy Veg Fried Rice", ingredients: ["Frozen item", "1 cup cooked rice", "Soy sauce", "Spring onion"], steps: ["Heat oil, cook the frozen item 5 min.", "Add rice and soy sauce, toss 4 min.", "Garnish with spring onion."] },
};

export const recipeFor = (code: string, category: Category): Recipe => BY_CODE[code] ?? BY_CATEGORY[category];
