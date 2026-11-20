import butterChicken from "@/assets/food/butter-chicken.webp";
import paneerButterMasala from "@/assets/food/paneer-butter-masala.webp";
import masalaDosa from "@/assets/food/masala-dosa.webp";
import choleBhature from "@/assets/food/chole-bhature.webp";
import margherita from "@/assets/food/margherita.webp";
import farmhousePizza from "@/assets/food/farmhouse-pizza.webp";
import pepperoniPizza from "@/assets/food/pepperoni-pizza.webp";
import vegBurger from "@/assets/food/veg-burger.webp";
import chickenBurger from "@/assets/food/chicken-burger.webp";
import cheeseBurger from "@/assets/food/cheese-burger.webp";
import chickenBiryani from "@/assets/food/chicken-biryani.webp";
import vegBiryani from "@/assets/food/veg-biryani.webp";
import muttonBiryani from "@/assets/food/mutton-biryani.webp";
import samosa from "@/assets/food/samosa.webp";
import paneerTikka from "@/assets/food/paneer-tikka.webp";
import frenchFries from "@/assets/food/french-fries.webp";
import pavBhaji from "@/assets/food/pav-bhaji.webp";
import gulabJamun from "@/assets/food/gulab-jamun.webp";
import brownie from "@/assets/food/brownie.webp";
import rasmalai from "@/assets/food/rasmalai.webp";
import mangoLassi from "@/assets/food/mango-lassi.webp";
import masalaChai from "@/assets/food/masala-chai.webp";
import coldCoffee from "@/assets/food/cold-coffee.webp";
import limeSoda from "@/assets/food/lime-soda.webp";

export type CategoryId =
  | "indian"
  | "pizza"
  | "burgers"
  | "biryani"
  | "snacks"
  | "desserts"
  | "beverages";

export interface Category {
  id: CategoryId;
  label: string;
  tagline: string;
  image: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  image: string;
  veg: boolean;
  rating: number;
  featured?: boolean;
}

export const CATEGORIES: Category[] = [
  { id: "indian", label: "Indian", tagline: "Rich curries & classics", image: butterChicken },
  { id: "pizza", label: "Pizza", tagline: "Stone-baked & cheesy", image: margherita },
  { id: "burgers", label: "Burgers", tagline: "Stacked & juicy", image: cheeseBurger },
  { id: "biryani", label: "Biryani", tagline: "Slow-cooked dum", image: chickenBiryani },
  { id: "snacks", label: "Snacks", tagline: "Crispy bites", image: samosa },
  { id: "desserts", label: "Desserts", tagline: "Sweet endings", image: gulabJamun },
  { id: "beverages", label: "Beverages", tagline: "Cool & refreshing", image: mangoLassi },
];

export const FOOD_ITEMS: FoodItem[] = [
  { id: "butter-chicken", name: "Butter Chicken", description: "Tandoori chicken simmered in a velvety tomato, butter and cream gravy.", price: 320, category: "indian", image: butterChicken, veg: false, rating: 4.8, featured: true },
  { id: "paneer-butter-masala", name: "Paneer Butter Masala", description: "Soft paneer cubes in a mildly spiced, creamy makhani gravy.", price: 260, category: "indian", image: paneerButterMasala, veg: true, rating: 4.7 },
  { id: "masala-dosa", name: "Masala Dosa", description: "Crispy rice crêpe stuffed with spiced potato, with sambar and chutney.", price: 140, category: "indian", image: masalaDosa, veg: true, rating: 4.6 },
  { id: "chole-bhature", name: "Chole Bhature", description: "Two fluffy bhature with spicy Punjabi chickpea curry and pickle.", price: 160, category: "indian", image: choleBhature, veg: true, rating: 4.5 },
  { id: "margherita-pizza", name: "Margherita Pizza", description: "Classic tomato sauce, fresh mozzarella and basil on a blistered crust.", price: 249, category: "pizza", image: margherita, veg: true, rating: 4.5 },
  { id: "farmhouse-pizza", name: "Farmhouse Veg Pizza", description: "Capsicum, onion, tomato, mushroom and sweet corn with extra cheese.", price: 349, category: "pizza", image: farmhousePizza, veg: true, rating: 4.6, featured: true },
  { id: "pepperoni-pizza", name: "Pepperoni Pizza", description: "Loaded with crispy chicken pepperoni and stretchy mozzarella.", price: 399, category: "pizza", image: pepperoniPizza, veg: false, rating: 4.7 },
  { id: "veg-burger", name: "Classic Veg Burger", description: "Crispy aloo tikki patty, lettuce, tomato and house sauce.", price: 129, category: "burgers", image: vegBurger, veg: true, rating: 4.3 },
  { id: "chicken-burger", name: "Crispy Chicken Burger", description: "Crunchy fried chicken fillet, coleslaw, pickles and spicy mayo.", price: 179, category: "burgers", image: chickenBurger, veg: false, rating: 4.6 },
  { id: "cheese-burger", name: "Double Cheese Burger", description: "Two juicy grilled patties with melted cheddar in a toasted bun.", price: 219, category: "burgers", image: cheeseBurger, veg: false, rating: 4.7, featured: true },
  { id: "chicken-biryani", name: "Hyderabadi Chicken Biryani", description: "Fragrant basmati and marinated chicken slow-cooked dum style, with raita.", price: 299, category: "biryani", image: chickenBiryani, veg: false, rating: 4.9, featured: true },
  { id: "veg-biryani", name: "Veg Dum Biryani", description: "Saffron rice layered with seasonal vegetables, paneer and cashews.", price: 229, category: "biryani", image: vegBiryani, veg: true, rating: 4.4 },
  { id: "mutton-biryani", name: "Lucknowi Mutton Biryani", description: "Tender mutton and aromatic rice, sealed and cooked on slow fire.", price: 379, category: "biryani", image: muttonBiryani, veg: false, rating: 4.8 },
  { id: "samosa", name: "Punjabi Samosa (2 pcs)", description: "Flaky pastry filled with spiced potato and peas, with two chutneys.", price: 60, category: "snacks", image: samosa, veg: true, rating: 4.5 },
  { id: "paneer-tikka", name: "Paneer Tikka", description: "Chargrilled paneer, capsicum and onion in a smoky tandoori marinade.", price: 240, category: "snacks", image: paneerTikka, veg: true, rating: 4.7 },
  { id: "french-fries", name: "Salted French Fries", description: "Golden, crispy fries tossed in sea salt, served with ketchup.", price: 110, category: "snacks", image: frenchFries, veg: true, rating: 4.3 },
  { id: "pav-bhaji", name: "Mumbai Pav Bhaji", description: "Buttery mashed vegetable bhaji with toasted pav, onion and lemon.", price: 150, category: "snacks", image: pavBhaji, veg: true, rating: 4.6 },
  { id: "gulab-jamun", name: "Gulab Jamun (4 pcs)", description: "Warm milk dumplings soaked in rose-cardamom sugar syrup.", price: 90, category: "desserts", image: gulabJamun, veg: true, rating: 4.7 },
  { id: "brownie", name: "Brownie with Ice Cream", description: "Fudgy chocolate brownie topped with vanilla ice cream and fudge.", price: 140, category: "desserts", image: brownie, veg: true, rating: 4.8 },
  { id: "rasmalai", name: "Rasmalai (2 pcs)", description: "Soft chenna discs in chilled saffron milk with pistachios.", price: 120, category: "desserts", image: rasmalai, veg: true, rating: 4.6 },
  { id: "mango-lassi", name: "Mango Lassi", description: "Thick, chilled yoghurt shake blended with Alphonso mango.", price: 99, category: "beverages", image: mangoLassi, veg: true, rating: 4.6 },
  { id: "masala-chai", name: "Masala Chai", description: "Kulhad chai brewed with ginger, cardamom and cinnamon.", price: 40, category: "beverages", image: masalaChai, veg: true, rating: 4.5 },
  { id: "cold-coffee", name: "Cold Coffee", description: "Creamy iced coffee with whipped cream and chocolate drizzle.", price: 129, category: "beverages", image: coldCoffee, veg: true, rating: 4.5 },
  { id: "lime-soda", name: "Fresh Lime Soda", description: "Sparkling soda with fresh lime and mint — sweet or salted.", price: 79, category: "beverages", image: limeSoda, veg: true, rating: 4.4 },
];

const ITEMS_BY_ID = new Map(FOOD_ITEMS.map((item) => [item.id, item]));

export function getFoodById(id: string): FoodItem | undefined {
  return ITEMS_BY_ID.get(id);
}

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === "string" && CATEGORIES.some((c) => c.id === value);
}

export function filterMenu(query: string, category: CategoryId | "all"): FoodItem[] {
  const q = query.trim().toLowerCase();
  return FOOD_ITEMS.filter(
    (item) =>
      (category === "all" || item.category === category) &&
      (q === "" || item.name.toLowerCase().includes(q)),
  );
}
