import React from "react";
import { Beef, Leaf, Egg, Wheat, Flame, Coffee, Cookie, Package } from "lucide-react";

interface CategoryIconProps {
  category: string;
  className?: string;
  size?: number;
}

export function getCategoryLabel(category: string, isEnglish: boolean): string {
  switch (category) {
    case "Meat & Seafood":
    case "Thịt & Hải sản":
      return isEnglish ? "Meat & Seafood" : "Thịt & Hải sản";
    case "Fruits & Vegetables":
    case "Rau củ & Trái cây":
      return isEnglish ? "Fruits & Vegetables" : "Rau củ & Trái cây";
    case "Dairy & Eggs":
    case "Sữa & Trứng":
      return isEnglish ? "Dairy & Eggs" : "Sữa & Trứng";
    case "Grains & Baking":
    case "Ngũ cốc & Đồ làm bánh":
      return isEnglish ? "Grains & Baking" : "Ngũ cốc & Đồ làm bánh";
    case "Condiments & Sauces":
    case "Gia vị & Nước sốt":
      return isEnglish ? "Condiments & Sauces" : "Gia vị & Nước sốt";
    case "Beverages":
    case "Đồ uống":
      return isEnglish ? "Beverages" : "Đồ uống";
    case "Snacks":
    case "Đồ ăn vặt":
      return isEnglish ? "Snacks" : "Đồ ăn vặt";
    default:
      return isEnglish ? "Other" : "Danh mục khác";
  }
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = "", size = 18 }) => {
  const norm = category.toLowerCase();
  if (norm.includes("meat") || norm.includes("seafood") || norm.includes("thịt") || norm.includes("hải sản")) {
    return (
      <div className={`p-2 bg-rose-50 text-rose-600 rounded-xl inline-flex items-center justify-center ${className}`}>
        <Beef size={size} />
      </div>
    );
  }
  if (norm.includes("fruit") || norm.includes("veg") || norm.includes("rau") || norm.includes("trái")) {
    return (
      <div className={`p-2 bg-emerald-50 text-emerald-600 rounded-xl inline-flex items-center justify-center ${className}`}>
        <Leaf size={size} />
      </div>
    );
  }
  if (norm.includes("dairy") || norm.includes("egg") || norm.includes("sữa") || norm.includes("trứng")) {
    return (
      <div className={`p-2 bg-amber-50 text-amber-500 rounded-xl inline-flex items-center justify-center ${className}`}>
        <Egg size={size} />
      </div>
    );
  }
  if (norm.includes("grain") || norm.includes("bake") || norm.includes("ngũ") || norm.includes("bánh")) {
    return (
      <div className={`p-2 bg-yellow-50 text-yellow-700 rounded-xl inline-flex items-center justify-center ${className}`}>
        <Wheat size={size} />
      </div>
    );
  }
  if (norm.includes("condiment") || norm.includes("sauce") || norm.includes("gia") || norm.includes("sốt") || norm.includes("mắm")) {
    return (
      <div className={`p-2 bg-orange-50 text-orange-600 rounded-xl inline-flex items-center justify-center ${className}`}>
        <Flame size={size} />
      </div>
    );
  }
  if (norm.includes("beverage") || norm.includes("drink") || norm.includes("uống") || norm.includes("coffee")) {
    return (
      <div className={`p-2 bg-teal-50 text-teal-600 rounded-xl inline-flex items-center justify-center ${className}`}>
        <Coffee size={size} />
      </div>
    );
  }
  if (norm.includes("snack") || norm.includes("vặt") || norm.includes("cookie")) {
    return (
      <div className={`p-2 bg-purple-50 text-purple-600 rounded-xl inline-flex items-center justify-center ${className}`}>
        <Cookie size={size} />
      </div>
    );
  }
  return (
    <div className={`p-2 bg-slate-100 text-slate-600 rounded-xl inline-flex items-center justify-center ${className}`}>
      <Package size={size} />
    </div>
  );
};
