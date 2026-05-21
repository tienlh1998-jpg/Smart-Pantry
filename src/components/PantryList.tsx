import React, { useState } from "react";
import { PantryItem, TranslationSet } from "../types";
import { CategoryIcon, getCategoryLabel } from "./CategoryIcon";
import { getExpiryStatus, calculateDaysLeft } from "../utils/dateUtils";
import { Trash2, Search, Filter, AlertTriangle, Sparkles, PlusCircle } from "lucide-react";

interface PantryListProps {
  items: PantryItem[];
  onRemoveItem: (id: string) => void;
  lang: TranslationSet;
  isEnglish: boolean;
  onNavigateToAdd: () => void;
  onQuickAddPreset: (name: string, category: string, relativeDays: number, quantity: string, unit: string) => void;
}

export const PantryList: React.FC<PantryListProps> = ({
  items,
  onRemoveItem,
  lang,
  isEnglish,
  onNavigateToAdd,
  onQuickAddPreset,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "soon" | "safe">("all");

  const filteredItems = items.filter((item) => {
    // Search match
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const daysLeft = calculateDaysLeft(item.expirationDate);
    if (filterType === "soon") {
      return matchesSearch && daysLeft <= 3; // Expired or expiring within 3 days
    }
    if (filterType === "safe") {
      return matchesSearch && daysLeft > 3;
    }
    return matchesSearch;
  });

  // Sort items so expired/soon-to-expire are listed at the very top
  const sortedItems = [...filteredItems].sort((a, b) => {
    return calculateDaysLeft(a.expirationDate) - calculateDaysLeft(b.expirationDate);
  });

  const soonExpiringCount = items.filter((item) => calculateDaysLeft(item.expirationDate) <= 3).length;

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Search & Statistics */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={lang.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              filterType === "all"
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {lang.filterAll} ({items.length})
          </button>
          <button
            onClick={() => setFilterType("soon")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all flex items-center gap-1 ${
              filterType === "soon"
                ? "bg-amber-500 text-white"
                : "bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100"
            }`}
          >
            <AlertTriangle size={12} />
            {lang.filterSoonToExpire} ({soonExpiringCount})
          </button>
          <button
            onClick={() => setFilterType("safe")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              filterType === "safe"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            {lang.filterSafe} ({items.length - soonExpiringCount})
          </button>
        </div>
      </div>

      {/* Expiry Warning Alert Panel */}
      {soonExpiringCount > 0 && filterType !== "safe" && (
        <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl flex items-start gap-2.5">
          <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg shrink-0">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-amber-800">
              {isEnglish ? "Chef Suggestions Active!" : "Đầu Bếp Đã Sẵn Sàng!"}
            </h4>
            <p className="text-[11px] text-amber-600 leading-relaxed mt-0.5">
              {isEnglish
                ? `You have ${soonExpiringCount} ingredient(s) expiring soon. Head to 'Gemini Chef' to transform them into delicious Vietnamese dishes!`
                : `Bạn đang có ${soonExpiringCount} nguyên liệu sắp hết hạn. Chuyển qua 'Đầu Bếp Gemini' để hóa phép chúng thành món Việt hảo hạng!`}
            </p>
          </div>
        </div>
      )}

      {/* Items list container */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
        {sortedItems.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
            <p className="text-sm text-slate-500 mb-4">{lang.noItems}</p>
            
            {/* Quick add suggestions if pantry is empty */}
            <div className="max-w-xs mx-auto space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                {lang.quickAddTitle}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onQuickAddPreset(isEnglish ? "Pork Ribs" : "Sườn heo", "Meat & Seafood", 1, "400", "g")}
                  className="p-2 text-left bg-white border border-slate-200 hover:border-emerald-500 rounded-xl hover:bg-emerald-50/30 transition-all group"
                >
                  <p className="text-xs font-medium text-slate-700 group-hover:text-emerald-700">🍖 {isEnglish ? "Pork Ribs" : "Sườn heo"}</p>
                  <p className="text-[10px] text-rose-500">{isEnglish ? "1 day left" : "Còn 1 ngày"}</p>
                </button>
                <button
                  onClick={() => onQuickAddPreset(isEnglish ? "Lemongrass" : "Sả tươi", "Fruits & Vegetables", 2, "3", "pcs")}
                  className="p-2 text-left bg-white border border-slate-200 hover:border-emerald-500 rounded-xl hover:bg-emerald-50/30 transition-all group"
                >
                  <p className="text-xs font-medium text-slate-700 group-hover:text-emerald-700">🌱 {isEnglish ? "Lemongrass" : "Sả tươi"}</p>
                  <p className="text-[10px] text-amber-500">{isEnglish ? "2 days left" : "Còn 2 ngày"}</p>
                </button>
                <button
                  onClick={() => onQuickAddPreset(isEnglish ? "Beef Fillet" : "Thịt bò thăn", "Meat & Seafood", 3, "250", "g")}
                  className="p-2 text-left bg-white border border-slate-200 hover:border-emerald-500 rounded-xl hover:bg-emerald-50/30 transition-all group"
                >
                  <p className="text-xs font-medium text-slate-700 group-hover:text-emerald-700">🥩 {isEnglish ? "Beef Fillet" : "Thịt bò thăn"}</p>
                  <p className="text-[10px] text-amber-500">{isEnglish ? "3 days left" : "Còn 3 ngày"}</p>
                </button>
                <button
                  onClick={() => onQuickAddPreset(isEnglish ? "Tomatoes" : "Cà chua", "Fruits & Vegetables", -1, "4", "pcs")}
                  className="p-2 text-left bg-white border border-slate-200 hover:border-emerald-500 rounded-xl hover:bg-emerald-50/30 transition-all group"
                >
                  <p className="text-xs font-medium text-slate-700 group-hover:text-emerald-700">🍅 {isEnglish ? "Tomatoes" : "Cà chua"}</p>
                  <p className="text-[10px] text-rose-600 font-bold">{isEnglish ? "Expired" : "Hết hạn"}</p>
                </button>
              </div>
            </div>

            <button
              onClick={onNavigateToAdd}
              className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-xl shadow-sm transition-all shadow-emerald-600/10"
            >
              <PlusCircle size={14} />
              {lang.addItem}
            </button>
          </div>
        ) : (
          sortedItems.map((item) => {
            const status = getExpiryStatus(item.expirationDate, isEnglish);
            const isDanger = status.daysLeft <= 1;

            return (
              <div
                key={item.id}
                className={`p-3 bg-white border rounded-xl flex items-center justify-between gap-3 group transition-all hover:shadow-sm ${
                  isDanger ? "border-amber-200 bg-amber-50/10" : "border-slate-100"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CategoryIcon category={item.category} />
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-sm font-semibold text-slate-800 truncate">
                        {item.name}
                      </h4>
                      <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-500 font-medium rounded">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isEnglish ? getCategoryLabel(item.category, true) : getCategoryLabel(item.category, false)}
                      {item.notes && ` • "${item.notes}"`}
                    </p>

                    <div className="flex items-center gap-1 mt-1">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border ${status.badgeClass}`}>
                        {status.text}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center shrink-0">
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
