export interface PantryItem {
  id: string;
  name: string;
  category: string;
  expirationDate: string; // ISO date string YYYY-MM-DD
  quantity: string;
  unit: string;
  notes?: string;
}

export interface SuggestedRecipe {
  recipeName: string;
  description: string;
  prepTime: string;
  cookTime: string;
  ingredientsUsedList: string[];
  additionalIngredientsNeeded: string[];
  steps: string[];
  nutritionAlert: string;
}

export type AppLanguage = "en" | "vi";

export interface TranslationSet {
  appName: string;
  pantryList: string;
  addItem: string;
  chefSuggestions: string;
  settings: string;
  
  // Form fields
  itemNameLabel: string;
  itemNamePlaceholder: string;
  categoryLabel: string;
  expirationDateLabel: string;
  quantityLabel: string;
  unitLabel: string;
  notesLabel: string;
  notesPlaceholder: string;
  submitAdd: string;
  cancel: string;

  // Categories
  catMeatAndSeafood: string;
  catFruitsAndVeg: string;
  catDairyAndEggs: string;
  catGrainsAndBaking: string;
  catCondimentsAndSauces: string;
  catBeverages: string;
  catSnacks: string;
  catOther: string;

  // State indicators
  expired: string;
  expiresToday: string;
  expiresInDays: string;
  expiresInOneDay: string;
  noItems: string;
  searchPlaceholder: string;
  filterAll: string;
  filterSoonToExpire: string;
  filterSafe: string;
  
  // Chef section
  chefIntro: string;
  suggestButton: string;
  suggestingRecipe: string;
  noExpiringIngredients: string;
  ingredientsUsed: string;
  neededMore: string;
  prepTime: string;
  cookTime: string;
  instructions: string;
  nutritionTip: string;
  chefPromptNote: string;

  // Settings section
  languageLabel: string;
  vietnamese: string;
  english: string;
  themeLabel: string;
  pantryStats: string;
  totalItems: string;
  expiredItems: string;
  expiringSoon: string;
  appDescription: string;
  quickAddTitle: string;
}

export const translations: Record<AppLanguage, TranslationSet> = {
  en: {
    appName: "Smart Pantry",
    pantryList: "My Pantry",
    addItem: "Add Ingredient",
    chefSuggestions: "Gemini Chef",
    settings: "Settings",

    itemNameLabel: "Ingredient Name",
    itemNamePlaceholder: "e.g., Lemongrass, Pork Ribs, Eggs...",
    categoryLabel: "Category",
    expirationDateLabel: "Expiration Date",
    quantityLabel: "Quantity",
    unitLabel: "Unit",
    notesLabel: "Notes (Optional)",
    notesPlaceholder: "e.g., Keep in freezer, brand name...",
    submitAdd: "Add to Pantry",
    cancel: "Cancel",

    catMeatAndSeafood: "Meat & Seafood",
    catFruitsAndVeg: "Fruits & Vegetables",
    catDairyAndEggs: "Dairy & Eggs",
    catGrainsAndBaking: "Grains & Baking",
    catCondimentsAndSauces: "Condiments & Sauces",
    catBeverages: "Beverages",
    catSnacks: "Snacks",
    catOther: "Other",

    expired: "Expired",
    expiresToday: "Expires today!",
    expiresInDays: "expires in {days} days",
    expiresInOneDay: "expires in 1 day",
    noItems: "No ingredients in your pantry. Start adding!",
    searchPlaceholder: "Search pantry...",
    filterAll: "All Items",
    filterSoonToExpire: "Expiring Soon",
    filterSafe: "Fresh & Long Term",

    chefIntro: "Let Gemini build you an elite, traditional Vietnamese recipe based on pantry items closest to expiration in your smart list.",
    suggestButton: "Suggest Vietnamese Recipe",
    suggestingRecipe: "Consulting Gemini Chef...",
    noExpiringIngredients: "Add ingredients to your pantry first to get custom recipe ideas!",
    ingredientsUsed: "Pantry items used",
    neededMore: "Additional staples needed",
    prepTime: "Prep duration",
    cookTime: "Cook duration",
    instructions: "Cooking Steps",
    nutritionTip: "Chef's Wellness Note",
    chefPromptNote: "Gemini prioritizes items expiring closest to today to reduce your household waste.",

    languageLabel: "Interface Language",
    vietnamese: "Vietnamese (Tiếng Việt)",
    english: "English (Tiếng Anh)",
    themeLabel: "Visual Accent",
    pantryStats: "Pantry Analytics",
    totalItems: "Total Ingredients",
    expiredItems: "Expired Items",
    expiringSoon: "Expiring within 3 days",
    appDescription: "Smart Pantry helps you manage shelf-life and suggest authentic Vietnamese food recipes using Google's Gemini models.",
    quickAddTitle: "Quick presets"
  },
  vi: {
    appName: "Smart Pantry",
    pantryList: "Tủ Bếp Của Tôi",
    addItem: "Thêm Nguyên Liệu",
    chefSuggestions: "Đầu Bếp Gemini",
    settings: "Cài Đặt",

    itemNameLabel: "Tên Nguyên Liệu",
    itemNamePlaceholder: "Ví dụ: Sả, Sườn heo, Trứng...",
    categoryLabel: "Danh mục",
    expirationDateLabel: "Ngày hết hạn",
    quantityLabel: "Số lượng",
    unitLabel: "Đơn vị",
    notesLabel: "Ghi chú (Tùy chọn)",
    notesPlaceholder: "Ví dụ: Cất tủ đông, thương hiệu...",
    submitAdd: "Thêm Vào Tủ",
    cancel: "Hủy",

    catMeatAndSeafood: "Thịt & Hải sản",
    catFruitsAndVeg: "Rau củ & Trái cây",
    catDairyAndEggs: "Sữa & Trứng",
    catGrainsAndBaking: "Gũ cốc & Đồ làm bánh",
    catCondimentsAndSauces: "Gia vị & Nước sốt",
    catBeverages: "Đồ uống",
    catSnacks: "Đồ ăn vặt",
    catOther: "Khác",

    expired: "Đã hết hạn",
    expiresToday: "Hết hạn hôm nay!",
    expiresInDays: "hết hạn sau {days} ngày",
    expiresInOneDay: "hết hạn sau 1 ngày",
    noItems: "Không có nguyên liệu nào trong tủ bếp. Hãy thêm ngay!",
    searchPlaceholder: "Tìm kiếm nguyên liệu...",
    filterAll: "Tất cả đồ",
    filterSoonToExpire: "Sắp hết hạn",
    filterSafe: "Còn hạn dài",

    chefIntro: "Hãy để Gemini thiết kế một công thức ẩm thực Việt Nam tinh tế, truyền thống dựa trên các món sắp hết hạn nhất trong tủ bếp của bạn.",
    suggestButton: "Đề Xuất Món Ăn Việt",
    suggestingRecipe: "Đang hỏi ý kiến Đầu Bếp Gemini...",
    noExpiringIngredients: "Hãy thêm nguyên liệu vào tủ để kích hoạt tính năng đề xuất món ăn!",
    ingredientsUsed: "Nguyên liệu trong tủ được dùng",
    neededMore: "Gia vị & nguyên liệu cần thêm",
    prepTime: "Thời gian sơ chế",
    cookTime: "Thời gian chế biến",
    instructions: "Các bước thực hiện",
    nutritionTip: "Mẹo sức khỏe của đầu bếp",
    chefPromptNote: "Gemini ưu tiên tối đa các sản phẩm hết hạn trước để giúp gia đình bạn giảm thiểu lãng phí đồ ăn.",

    languageLabel: "Ngôn ngữ giao diện",
    vietnamese: "Tiếng Việt",
    english: "English (Tiếng Anh)",
    themeLabel: "Màu chủ đạo",
    pantryStats: "Thống Kê Tủ Bếp",
    totalItems: "Tổng nguyên liệu",
    expiredItems: "Món đã hết hạn",
    expiringSoon: "Sắp hết hạn (dưới 3 ngày)",
    appDescription: "Smart Pantry giúp bạn quản lý thời hạn sử dụng thực phẩm và đề xuất các món ăn Việt Nam truyền thống tuyệt hảo bằng công nghệ Gemini.",
    quickAddTitle: "Gợi ý nhanh"
  }
};
