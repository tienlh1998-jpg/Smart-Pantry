import React, { useState, useEffect } from "react";
import { PantryItem, SuggestedRecipe, AppLanguage, translations } from "./types";
import { PantryList } from "./components/PantryList";
import { AddItemForm } from "./components/AddItemForm";
import { calculateDaysLeft } from "./utils/dateUtils";
import {
  Apple,
  Sparkles,
  Settings as SettingsIcon,
  Plus,
  AlertTriangle,
  Clock,
  Check,
  RotateCcw,
  BookOpen,
  UtensilsCrossed,
  Layers,
  ChevronRight,
  Info
} from "lucide-react";

// Initial seed data to make the app interactive on first load
const INITIAL_PANTRY: PantryItem[] = [
  {
    id: "item-1",
    name: "Pork Ribs (Sườn heo)",
    category: "Meat & Seafood",
    expirationDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1); // expires in 1 day
      return d.toISOString().split("T")[0];
    })(),
    quantity: "500",
    unit: "g",
    notes: "Keep in refrigerator lower drawer"
  },
  {
    id: "item-2",
    name: "Lemongrass (Sả tươi)",
    category: "Fruits & Vegetables",
    expirationDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 2); // expires in 2 days
      return d.toISOString().split("T")[0];
    })(),
    quantity: "5",
    unit: "stalks",
    notes: "Perfect for lemongrass pork or dipping sauce"
  },
  {
    id: "item-3",
    name: "Tofu (Đậu phụ)",
    category: "Dairy & Eggs",
    expirationDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1); // expired 1 day ago
      return d.toISOString().split("T")[0];
    })(),
    quantity: "2",
    unit: "blocks",
    notes: "Use immediately or discard if sour"
  },
  {
    id: "item-4",
    name: "Shallots (Hành tím)",
    category: "Fruits & Vegetables",
    expirationDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 8); // expires in 8 days
      return d.toISOString().split("T")[0];
    })(),
    quantity: "150",
    unit: "g"
  },
  {
    id: "item-5",
    name: "Fish Sauce (Nước mắm)",
    category: "Condiments & Sauces",
    expirationDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 180); // long duration
      return d.toISOString().split("T")[0];
    })(),
    quantity: "1",
    unit: "bottle",
    notes: "Phu Quoc 40N traditional sauce"
  }
];

export default function App() {
  const [items, setItems] = useState<PantryItem[]>(() => {
    const saved = localStorage.getItem("smart_pantry_items");
    return saved ? JSON.parse(saved) : INITIAL_PANTRY;
  });

  const [langCode, setLangCode] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem("smart_pantry_lang");
    return (saved === "vi" || saved === "en") ? saved : "en";
  });

  const [themeColor, setThemeColor] = useState<string>(() => {
    return localStorage.getItem("smart_pantry_theme") || "emerald";
  });

  const [activeTab, setActiveTab] = useState<"pantry" | "chef" | "settings">("pantry");
  const [isAddingItem, setIsAddingItem] = useState(false);
  
  // Gemini recipe generator state
  const [recipe, setRecipe] = useState<SuggestedRecipe | null>(() => {
    const saved = localStorage.getItem("smart_pantry_last_recipe");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [chefError, setChefError] = useState<string | null>(null);
  const [loaderMessageIndex, setLoaderMessageIndex] = useState(0);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("smart_pantry_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("smart_pantry_lang", langCode);
  }, [langCode]);

  useEffect(() => {
    localStorage.setItem("smart_pantry_theme", themeColor);
  }, [themeColor]);

  useEffect(() => {
    if (recipe) {
      localStorage.setItem("smart_pantry_last_recipe", JSON.stringify(recipe));
    } else {
      localStorage.removeItem("smart_pantry_last_recipe");
    }
  }, [recipe]);

  const lang = translations[langCode];

  // Cycling message loader for chef suggestions
  const loaderMessages = langCode === "vi" ? [
    "Đang phân tích tủ bếp để tìm nguyên liệu sắp hết hạn...",
    "Đầu bếp Gemini đang cân nhắc các công thức truyền thống...",
    "Đang cân đối gia vị hoàn hảo (nước mắm, đường, hành sả)...",
    "Gia tăng độ giòn ngọt thơm ngon cho món ăn...",
    "Hoàn thiện các bước sơ chế và nấu chi tiết..."
  ] : [
    "Analyzing items closest to expiration in your pantry...",
    "Consulting traditional Vietnamese chefs for options...",
    "Balancing local savory & sweet flavors...",
    "Drafting step-by-step directions for optimal taste...",
    "Injecting smart food-reduction storage tips..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoadingRecipe) {
      interval = setInterval(() => {
        setLoaderMessageIndex((prev) => (prev + 1) % loaderMessages.length);
      }, 3500);
    } else {
      setLoaderMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoadingRecipe, langCode]);

  // Remove individual pantry item
  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Add customized item
  const handleAddItem = (newItem: Omit<PantryItem, "id">) => {
    const item: PantryItem = {
      ...newItem,
      id: "item-" + Date.now()
    };
    setItems((prev) => [item, ...prev]);
    setIsAddingItem(false);
    setActiveTab("pantry");
  };

  // Preset addition support to easily see how the tracking behaves
  const handleQuickAddPreset = (
    name: string,
    category: string,
    relativeDays: number,
    quantity: string,
    unit: string
  ) => {
    const d = new Date();
    d.setDate(d.getDate() + relativeDays);
    const expirationDate = d.toISOString().split("T")[0];

    const preset: PantryItem = {
      id: "item-" + Date.now() + Math.random().toString(36).substr(2, 4),
      name,
      category,
      expirationDate,
      quantity,
      unit,
      notes: langCode === "vi" ? "Gợi ý nhanh một nút chạm" : "Added from fast presets tap"
    };

    setItems((prev) => [preset, ...prev]);
  };

  // Clear or seed pantry to initial default values
  const handleResetPantry = () => {
    if (confirm(langCode === "vi" ? "Bạn có chắc chắn muốn cài lại tủ bếp ban đầu không?" : "Are you sure you want to reset your pantry to demo templates?")) {
      setItems(INITIAL_PANTRY);
      setRecipe(null);
      setChefError(null);
    }
  };

  // Clean whole pantry to blank state
  const handleClearAll = () => {
    if (confirm(langCode === "vi" ? "Xác nhận xóa sạch toàn bộ nguyên liệu trong tủ bếp?" : "Confirm clear entire pantry list?")) {
      setItems([]);
      setRecipe(null);
      setChefError(null);
    }
  };

  // Trigger Gemini smart recipe generation
  const handleSuggestRecipe = async () => {
    if (items.length === 0) {
      setChefError(langCode === "vi" ? "Tủ bếp của bạn đang trống rỗng!" : "Your pantry is empty.");
      return;
    }

    setIsLoadingRecipe(true);
    setChefError(null);
    setRecipe(null);

    // Filter items closest to expiring (expired, or expiring soonest)
    const sortedExpiring = [...items]
      .map(item => ({
        name: item.name,
        daysLeft: calculateDaysLeft(item.expirationDate)
      }))
      // prioritize expired and soonest to expire
      .sort((a, b) => a.daysLeft - b.daysLeft)
      // Cap list to make call efficient and highly practical
      .slice(0, 5);

    try {
      const response = await fetch("/api/suggest-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ingredients: sortedExpiring,
          language: langCode
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Server issue");
      }

      const suggestions = await response.json();
      setRecipe(suggestions);
    } catch (err: any) {
      console.error(err);
      setChefError(
        langCode === "vi"
          ? `Lỗi: ${err.message || "Không thể kết nối đến máy chủ Gemini"}`
          : `Error: ${err.message || "Failed to fetch from Gemini server"}`
      );
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  // Helper stats for dashboard
  const totalCount = items.length;
  const expiredCount = items.filter((item) => calculateDaysLeft(item.expirationDate) < 0).length;
  const expiringSoonCount = items.filter(
    (item) => {
      const d = calculateDaysLeft(item.expirationDate);
      return d >= 0 && d <= 3;
    }
  ).length;

  // Selected theme details
  const getThemeClasses = () => {
    switch (themeColor) {
      case "amber":
        return {
          primary: "bg-amber-600 hover:bg-amber-700",
          text: "text-amber-600",
          accent: "amber",
          ring: "focus:ring-amber-500/20",
          bgActive: "bg-amber-50 text-amber-600",
          gradient: "from-amber-600 to-orange-500",
          pBadge: "bg-amber-100 text-amber-800",
          pBorder: "border-amber-500"
        };
      case "rose":
        return {
          primary: "bg-rose-600 hover:bg-rose-700",
          text: "text-rose-600",
          accent: "rose",
          ring: "focus:ring-rose-500/20",
          bgActive: "bg-rose-50 text-rose-600",
          gradient: "from-rose-600 to-pink-500",
          pBadge: "bg-rose-100 text-rose-800",
          pBorder: "border-rose-500"
        };
      case "indigo":
        return {
          primary: "bg-indigo-600 hover:bg-indigo-700",
          text: "text-indigo-600",
          accent: "indigo",
          ring: "focus:ring-indigo-500/20",
          bgActive: "bg-indigo-50 text-indigo-600",
          gradient: "from-indigo-600 to-blue-500",
          pBadge: "bg-indigo-100 text-indigo-800",
          pBorder: "border-indigo-500"
        };
      case "emerald":
      default:
        return {
          primary: "bg-emerald-600 hover:bg-emerald-700",
          text: "text-emerald-600",
          accent: "emerald",
          ring: "focus:ring-emerald-500/20",
          bgActive: "bg-emerald-50 text-emerald-600",
          gradient: "from-emerald-600 to-teal-500",
          pBadge: "bg-emerald-100 text-emerald-800",
          pBorder: "border-emerald-500"
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex items-center justify-center p-0 md:p-6 transition-colors">
      {/* Simulation frame container to present the app beautifully on desktop */}
      <div className="w-full max-w-md h-screen md:h-[820px] bg-slate-50 md:rounded-[40px] md:shadow-2xl overflow-hidden flex flex-col relative border-0 md:border-8 border-slate-900">
        
        {/* Phone Speaker & Camera cut-out bar for gorgeous visual polish */}
        <div className="hidden md:flex justify-center bg-slate-900 py-1 sticky top-0 z-50">
          <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-around px-2">
            <span className="w-2 h-2 rounded-full bg-slate-800 block"></span>
            <span className="w-10 h-1 bg-slate-800 rounded-full block"></span>
            <span className="w-2 h-2 rounded-full bg-slate-800 block"></span>
          </div>
        </div>

        {/* Global application header */}
        <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 shrink-0 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-400">
                <Apple className="animate-spin-slow" size={20} />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight">{lang.appName}</h1>
                <p className="text-[10px] text-slate-300">
                  {langCode === "vi" ? "Chống lãng phí cùng Gemini" : "Zero Waste with Gemini"}
                </p>
              </div>
            </div>

            {/* Accent colored state button / quick add toggle */}
            {!isAddingItem && activeTab === "pantry" && (
              <button
                onClick={() => setIsAddingItem(true)}
                className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all shadow-sm focus:outline-none"
                id="btn-quick-add"
              >
                <Plus size={18} />
              </button>
            )}
          </div>

          {/* Core Mini Dashboard overview under heading */}
          {!isAddingItem && (
            <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-700/50">
              <div className="text-center bg-slate-850/50 p-1.5 rounded-lg border border-slate-700/30">
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{lang.totalItems}</span>
                <span className="text-xs font-bold text-white">{totalCount}</span>
              </div>
              <div className="text-center bg-slate-850/50 p-1.5 rounded-lg border border-slate-700/30">
                <span className="block text-[10px] text-rose-450 uppercase tracking-wider font-semibold">{lang.expiredItems}</span>
                <span className={`text-xs font-bold ${expiredCount > 0 ? "text-rose-400" : "text-slate-300"}`}>{expiredCount}</span>
              </div>
              <div className="text-center bg-slate-850/50 p-1.5 rounded-lg border border-slate-700/30">
                <span className="block text-[10px] text-amber-455 uppercase tracking-wider font-semibold">{lang.expiringSoon}</span>
                <span className={`text-xs font-bold ${expiringSoonCount > 0 ? "text-amber-450 animate-pulse" : "text-slate-300"}`}>{expiringSoonCount}</span>
              </div>
            </div>
          )}
        </header>

        {/* Core application screen viewport */}
        <main className="flex-1 overflow-hidden p-4 relative bg-slate-50">
          {isAddingItem ? (
            <AddItemForm
              onAddItem={handleAddItem}
              onCancel={() => setIsAddingItem(false)}
              lang={lang}
            />
          ) : (
            <>
              {/* PANTRY TAB */}
              {activeTab === "pantry" && (
                <PantryList
                  items={items}
                  onRemoveItem={handleRemoveItem}
                  lang={lang}
                  isEnglish={langCode === "en"}
                  onNavigateToAdd={() => setIsAddingItem(true)}
                  onQuickAddPreset={handleQuickAddPreset}
                />
              )}

              {/* GEMINI CHEF SUGGESTIONS TAB */}
              {activeTab === "chef" && (
                <div className="flex flex-col h-full space-y-4">
                  {/* Informational intro */}
                  <div className="p-3.5 bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-2xl border border-emerald-500/20 relative overflow-hidden">
                    <div className="absolute right-2 bottom-0 text-emerald-500/10 pointer-events-none">
                      <Sparkles size={80} />
                    </div>
                    <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Sparkles size={14} className="animate-pulse" />
                      {lang.chefSuggestions}
                    </h3>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      {lang.chefIntro}
                    </p>
                    <span className="block text-[9px] text-emerald-300/70 italic mt-1.5">
                      {lang.chefPromptNote}
                    </span>
                  </div>

                  {/* Suggest trigger button section */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={handleSuggestRecipe}
                      disabled={isLoadingRecipe || items.length === 0}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs tracking-tight shadow-md flex items-center justify-center gap-2 transition-all ${
                        isLoadingRecipe || items.length === 0
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/15"
                      }`}
                      id="btn-suggest-recipe"
                    >
                      <UtensilsCrossed size={14} />
                      {isLoadingRecipe ? lang.suggestingRecipe : lang.suggestButton}
                    </button>
                    
                    {items.length === 0 && (
                      <p className="text-[10px] text-rose-500 font-medium mt-1.5">
                        ⚠️ {lang.noExpiringIngredients}
                      </p>
                    )}
                  </div>

                  {/* Error display */}
                  {chefError && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs text-center font-medium">
                      {chefError}
                    </div>
                  )}

                  {/* LOADING STATE VIEW */}
                  {isLoadingRecipe && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-6 bg-white rounded-2xl border border-slate-100 shadow-sm animate-fade-in">
                      {/* Polished custom Vietnamese Chef animate cooking rig */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-emerald-600">
                          🍳
                        </div>
                      </div>
                      <div className="text-center px-6 space-y-1 max-w-sm">
                        <p className="text-xs font-bold text-slate-700 animate-pulse">
                          {loaderMessages[loaderMessageIndex]}
                        </p>
                        <p className="text-[10px] text-slate-450 leading-relaxed">
                          {langCode === "vi" 
                            ? "Mô hình Gemini 3.5 Flash đang sáng tạo món ăn đậm đà bản sắc Việt Nam truyền thống..."
                            : "Gemini 3.5 Flash is tailoring local spices, storage methods & timing..."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* DISPLAY INGREDIENTS LISTS USED AND FULL RECIPE */}
                  {recipe && !isLoadingRecipe && (
                    <div className="flex-1 overflow-y-auto space-y-4 pr-0.5 animate-fade-in card-scroll-container">
                      <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
                        
                        {/* Title and Badge */}
                        <div className="space-y-1 border-b border-slate-100 pb-3">
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold tracking-wider rounded-md uppercase">
                            🇻🇳 {langCode === "vi" ? "Món Việt Đặc Sắc" : "Authentic Vietnamese"}
                          </span>
                          <h2 className="text-base font-bold text-slate-800 mt-1">
                            {recipe.recipeName}
                          </h2>
                          <p className="text-xs text-slate-500 leading-relaxed italic mt-1">
                            "{recipe.description}"
                          </p>
                        </div>

                        {/* Prep & Cook Duration indicators */}
                        <div className="grid grid-cols-2 gap-3 pb-1">
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                            <Clock size={16} className="text-emerald-600" />
                            <div>
                              <span className="block text-[10px] text-slate-400 font-medium">{lang.prepTime}</span>
                              <span className="text-xs font-bold text-slate-700">{recipe.prepTime}</span>
                            </div>
                          </div>
                          
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150 flex items-center gap-2">
                            <Clock size={16} className="text-amber-500" />
                            <div>
                              <span className="block text-[10px] text-slate-400 font-medium">{lang.cookTime}</span>
                              <span className="text-xs font-bold text-slate-700">{recipe.cookTime}</span>
                            </div>
                          </div>
                        </div>

                        {/* Ingredients section */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                            <span className="w-1.5 h-3 bg-emerald-600 rounded"></span>
                            {lang.ingredientsUsed}
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {recipe.ingredientsUsedList.map((ing, k) => (
                              <span
                                key={k}
                                className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-medium rounded-lg border border-emerald-100/50"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>

                          <span className="block text-[10px] text-slate-400 font-bold uppercase mt-3">
                            ⚠️ {lang.neededMore}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {recipe.additionalIngredientsNeeded.map((ing, k) => (
                              <span
                                key={k}
                                className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 font-medium rounded-lg"
                              >
                                + {ing}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Step by step directions */}
                        <div className="space-y-3 pt-2">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                            <span className="w-1.5 h-3 bg-amber-500 rounded"></span>
                            {lang.instructions}
                          </h4>
                          <ol className="space-y-2.5">
                            {recipe.steps.map((st, k) => (
                              <li key={k} className="flex gap-2.5 items-start">
                                <span className="w-5 h-5 bg-slate-900 text-white font-bold text-[10px] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                  {k + 1}
                                </span>
                                <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                                  {st}
                                </p>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Nutrition alert note */}
                        {recipe.nutritionAlert && (
                          <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl space-y-1">
                            <h5 className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                              <Info size={12} />
                              {lang.nutritionTip}
                            </h5>
                            <p className="text-[11px] text-amber-700 leading-relaxed">
                              {recipe.nutritionAlert}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Empty state when no recipe generated yet */}
                  {!recipe && !isLoadingRecipe && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-slate-100">
                      <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl mb-3">
                        <BookOpen size={28} />
                      </div>
                      <h4 className="text-xs font-bold text-slate-700">
                        {langCode === "vi" ? "Chưa có gợi ý món ngon nào" : "No active Vietnamese custom recipe draft"}
                      </h4>
                      <p className="text-[11px] text-slate-450 leading-relaxed mt-1 max-w-xs mx-auto">
                        {langCode === "vi"
                          ? "Chọn nút đề xuất phía trên, Gemini sẽ tìm tòi, phối ngẫu hương vị truyền thống để tạo món ăn dựa trên đồ dùng tủ của bạn."
                          : "Tap Suggest Vietnamese Recipe above! AI will combine expiring ingredients with traditional Southeast Asian seasonings safely."}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* INTERFACE SETTINGS TAB */}
              {activeTab === "settings" && (
                <div className="flex flex-col h-full space-y-4">
                  
                  {/* Lang Config Card */}
                  <div className="bg-white p-4 border border-slate-100 rounded-2xl shadow-sm space-y-3">
                    <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                      ⚙️ {lang.settings}
                    </h3>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">
                        {lang.languageLabel}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setLangCode("en")}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                            langCode === "en"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                          id="btn-lang-en"
                        >
                          🇺🇸 English
                        </button>
                        <button
                          onClick={() => setLangCode("vi")}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                            langCode === "vi"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                          id="btn-lang-vi"
                        >
                          🇻🇳 Tiếng Việt
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Accent Styling Color Theme */}
                  <div className="bg-white p-4 border border-slate-100 rounded-2xl shadow-sm space-y-3">
                    <h4 className="text-xs font-semibold text-slate-700">
                      {lang.themeLabel}
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { key: "emerald", label: "Emerald", color: "bg-emerald-500" },
                        { key: "amber", label: "Amber", color: "bg-amber-500" },
                        { key: "rose", label: "Rose", color: "bg-rose-500" },
                        { key: "indigo", label: "Indigo", color: "bg-indigo-500" },
                      ].map((th) => (
                        <button
                          key={th.key}
                          onClick={() => setThemeColor(th.key)}
                          className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                            themeColor === th.key
                              ? "border-slate-800 bg-slate-50 ring-2 ring-slate-150"
                              : "border-slate-100 hover:bg-slate-50"
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full ${th.color} block`}></span>
                          <span className="text-[9px] text-slate-600 font-bold">{th.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Statistics Analytics Summary Box */}
                  <div className="bg-white p-4 border border-slate-100 rounded-2xl shadow-sm space-y-3">
                    <h4 className="text-xs font-semibold text-slate-700">
                      {lang.pantryStats}
                    </h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-600 border-b border-slate-100 pb-1.5">
                        <span>{lang.totalItems}</span>
                        <span className="font-bold text-slate-800">{totalCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-600 border-b border-slate-100 pb-1.5">
                        <span>{lang.expiredItems}</span>
                        <span className={`font-bold ${expiredCount > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                          {expiredCount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>{lang.expiringSoon}</span>
                        <span className={`font-bold ${expiringSoonCount > 0 ? "text-amber-500" : "text-slate-600"}`}>
                          {expiringSoonCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dev Sandbox controls to easily seed or clean data */}
                  <div className="bg-white p-4 border border-slate-100 rounded-2xl shadow-sm space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700">
                        {langCode === "vi" ? "Dữ liệu & Mô phỏng" : "Sandbox Database Console"}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                        {lang.appDescription}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-4">
                      <button
                        onClick={handleResetPantry}
                        className="py-2 px-3 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-1"
                        id="btn-reset-pantry"
                      >
                        <RotateCcw size={12} />
                        {langCode === "vi" ? "Nạp lại mẫu" : "Demo Templates"}
                      </button>
                      <button
                        onClick={handleClearAll}
                        className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-all"
                        id="btn-clear-all"
                      >
                        {langCode === "vi" ? "Xóa sạch tủ" : "Empty Pantry"}
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </>
          )}
        </main>

        {/* Global application bottom navigation tabs */}
        {!isAddingItem && (
          <nav className="bg-white border-t border-slate-100 py-2.5 px-6 shrink-0 flex items-center justify-between z-40 shadow-lg select-none">
            <button
              onClick={() => {
                setActiveTab("pantry");
                setIsAddingItem(false);
              }}
              className={`flex flex-col items-center gap-1 transition-all focus:outline-none ${
                activeTab === "pantry" ? theme.text : "text-slate-400 hover:text-slate-600"
              }`}
              id="tab-pantry"
            >
              <Layers size={18} />
              <span className="text-[10px] font-bold tracking-tight">{lang.pantryList}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("chef");
                setIsAddingItem(false);
              }}
              className={`flex flex-col items-center gap-1 transition-all focus:outline-none ${
                activeTab === "chef" ? theme.text : "text-slate-400 hover:text-slate-600"
              }`}
              id="tab-chef"
            >
              <div className="relative">
                <Sparkles size={18} />
                {expiringSoonCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                )}
              </div>
              <span className="text-[10px] font-bold tracking-tight">{lang.chefSuggestions}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("settings");
                setIsAddingItem(false);
              }}
              className={`flex flex-col items-center gap-1 transition-all focus:outline-none ${
                activeTab === "settings" ? theme.text : "text-slate-400 hover:text-slate-600"
              }`}
              id="tab-settings"
            >
              <SettingsIcon size={18} />
              <span className="text-[10px] font-bold tracking-tight">{lang.settings}</span>
            </button>
          </nav>
        )}

        {/* Physical mockup Home indicator line for absolute mobile realism */}
        <div className="hidden md:block bg-slate-900 py-1 sticky bottom-0 z-50">
          <div className="w-1/3 h-1 bg-slate-800 rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
