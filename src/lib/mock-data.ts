export type Category = "Dairy" | "Bakery" | "Vegetables" | "Snacks" | "Beverages" | "Frozen";
export const CATEGORIES: Category[] = ["Dairy", "Bakery", "Vegetables", "Snacks", "Beverages", "Frozen"];
export const CATEGORY_EMOJI: Record<Category, string> = {
  Dairy: "🥛", Bakery: "🥖", Vegetables: "🥦", Snacks: "🍪", Beverages: "🧃", Frozen: "🧊",
};

export interface Product {
  code: string;
  name: string;
  category: Category;
  emoji: string;
  price: number;
  stock: number;
  weightKg: number;
  mfg: string;
  expiry: string;
}

const iso = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

// [code, name, category, emoji, price, stock, kg, mfgOffset, expiryOffset]
const raw: [string, string, Category, string, number, number, number, number, number][] = [
  ["890100001", "Amul Taaza Milk 1L", "Dairy", "🥛", 68, 48, 1, -3, 1],
  ["890100002", "Greek Yogurt 400g", "Dairy", "🥣", 120, 22, 0.4, -10, 2],
  ["890100003", "Paneer 200g", "Dairy", "🧀", 95, 64, 0.2, -4, 3],
  ["890100004", "Salted Butter 500g", "Dairy", "🧈", 275, 30, 0.5, -20, 25],
  ["890100005", "Cheddar Slices", "Dairy", "🧀", 160, 12, 0.2, -15, 6],
  ["890200001", "Whole Wheat Bread", "Bakery", "🍞", 55, 52, 0.4, -2, 3],
  ["890200002", "Butter Croissant x4", "Bakery", "🥐", 180, 18, 0.3, -1, 1],
  ["890200003", "Multigrain Buns", "Bakery", "🍔", 70, 9, 0.3, -2, 2],
  ["890200004", "Chocolate Muffins", "Bakery", "🧁", 150, 26, 0.3, -3, 5],
  ["890300001", "Fresh Spinach 250g", "Vegetables", "🥬", 40, 70, 0.25, -1, 2],
  ["890300002", "Tomatoes 1kg", "Vegetables", "🍅", 60, 85, 1, -2, 4],
  ["890300003", "Broccoli", "Vegetables", "🥦", 90, 14, 0.4, -2, 1],
  ["890300004", "Carrots 500g", "Vegetables", "🥕", 45, 40, 0.5, -3, 9],
  ["890300005", "Bell Peppers Mix", "Vegetables", "🫑", 120, 45, 0.5, -2, 3],
  ["890400001", "Masala Potato Chips", "Snacks", "🥔", 30, 120, 0.1, -60, 40],
  ["890400002", "Digestive Biscuits", "Snacks", "🍪", 85, 6, 0.25, -30, 7],
  ["890400003", "Roasted Peanuts", "Snacks", "🥜", 110, 33, 0.3, -40, 4],
  ["890400004", "Granola Bars x6", "Snacks", "🍫", 199, 11, 0.2, -50, 12],
  ["890500001", "Orange Juice 1L", "Beverages", "🧃", 140, 58, 1, -6, 2],
  ["890500002", "Cold Coffee 250ml", "Beverages", "🥤", 65, 75, 0.25, -10, 3],
  ["890500003", "Coconut Water", "Beverages", "🥥", 50, 20, 0.3, -5, 1],
  ["890500004", "Green Tea 25 bags", "Beverages", "🍵", 175, 40, 0.1, -90, 180],
  ["890600001", "Frozen Peas 500g", "Frozen", "🫛", 95, 44, 0.5, -30, 4],
  ["890600002", "Veg Momos 12pc", "Frozen", "🥟", 160, 8, 0.4, -20, 2],
  ["890600003", "Vanilla Ice Cream 1L", "Frozen", "🍨", 240, 27, 0.6, -25, 6],
  ["890600004", "Chicken Nuggets", "Frozen", "🍗", 260, 62, 0.5, -15, 3],
];

export const seedProducts = (): Product[] =>
  raw.map(([code, name, category, emoji, price, stock, weightKg, m, e]) => ({
    code, name, category, emoji, price, stock, weightKg, mfg: iso(m), expiry: iso(e),
  }));

export interface Ngo { id: string; name: string; location: string; contact: string; distanceKm: number }
export const NGOS: Ngo[] = [
  { id: "n1", name: "Feeding Hands Foundation", location: "Andheri East", contact: "+91 98200 11223", distanceKm: 2.4 },
  { id: "n2", name: "Roti Bank", location: "Dadar", contact: "+91 98190 44556", distanceKm: 5.1 },
  { id: "n3", name: "Annapurna Seva Trust", location: "Bandra West", contact: "+91 99300 77889", distanceKm: 3.8 },
  { id: "n4", name: "No Hunger Collective", location: "Powai", contact: "+91 98670 22110", distanceKm: 6.7 },
  { id: "n5", name: "Smile Meals", location: "Goregaon", contact: "+91 90040 33445", distanceKm: 4.2 },
];

export interface Wholesaler { id: string; name: string; supplies: string[]; contact: string }
export const WHOLESALERS: Wholesaler[] = [
  { id: "w1", name: "GreenValley Dairy Distributors", supplies: ["Dairy", "Frozen"], contact: "+91 22 4000 1100" },
  { id: "w2", name: "Sunrise Bakers Supply", supplies: ["Bakery"], contact: "+91 22 4000 2200" },
  { id: "w3", name: "FarmFresh Agro Traders", supplies: ["Vegetables"], contact: "+91 22 4000 3300" },
  { id: "w4", name: "Metro FMCG Wholesale", supplies: ["Snacks", "Beverages"], contact: "+91 22 4000 4400" },
];

export const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
export const monthlySales = MONTHS.map((m, i) => ({ month: m, sales: [182000, 196500, 175300, 210400, 228900, 241200][i] }));
export const customerSpend = MONTHS.map((m, i) => ({ month: m, spend: [1840, 2210, 1560, 2680, 2390, 2950][i] }));
export const dailySales = (days: number) =>
  Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return { day: `${d.getDate()}/${d.getMonth() + 1}`, sales: 5200 + ((i * 7919) % 4300) + (d.getDay() % 6 === 0 ? 2500 : 0) };
  });
