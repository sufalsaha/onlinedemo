import {
  AgricultureIcon,
  BabyDressIcon,
  BabyFoodsIcon,
  BeautyIcon,
  BooksEducationIcon,
  DressIcon,
  ElectronicsIcon,
  FoodGroceryIcon,
  FurnitureStoreyIcon,
  HealthIcon,
  OrganicFoodIcon,
  PetproductsIcon,
  ShareeIcon,
  ShirtIcon,
  ShoesIcon,
  TshirtIcon,
  WomanDress,
} from "./icons";

const agriculture = "agriculture";
const babydress = "baby-dress";
const babyfoods = "baby-foods";
const beauty = "beauty";
const bookseducation = "books-education";
const electronics = "electronics";
const foodgrocery = "food-grocery";
const furniturestore = "furniture-store";
const organicfood = "organic-food";
const petproducts = "pet-products";
const sharee = "sharee";
const shoes = "shoes";
const tshirt = "t-shirt";
const womandress = "woman-dress";

export const categoryIconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  [agriculture]: AgricultureIcon,
  [babyfoods]: BabyFoodsIcon,
  [bookseducation]: BooksEducationIcon,
  [electronics]: ElectronicsIcon,
  [foodgrocery]: FoodGroceryIcon,
  [petproducts]: PetproductsIcon,
  [shoes]: ShoesIcon,
  [sharee]: ShareeIcon,
  [tshirt]: TshirtIcon,
  [womandress]: WomanDress,
  [beauty]: BeautyIcon,
  [organicfood]: OrganicFoodIcon,
  [babydress]: BabyDressIcon,
  [furniturestore]: FurnitureStoreyIcon,
};
