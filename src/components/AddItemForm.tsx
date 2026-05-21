import React, { useState } from "react";
import { PantryItem, TranslationSet } from "../types";
import { Plus, ArrowLeft, Calendar, FileText, ShoppingBag, FolderOpen } from "lucide-react";

interface AddItemFormProps {
  onAddItem: (item: Omit<PantryItem, "id">) => void;
  onCancel: () => void;
  lang: TranslationSet;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem, onCancel, lang }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Fruits & Vegetables");
  
  // Set default expiration date to 5 days from today
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 5);
  const defaultDateStr = defaultDate.toISOString().split("T")[0];
  const [expirationDate, setExpirationDate] = useState(defaultDateStr);
  
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("pcs");
  const [notes, setNotes] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");

  const categories = [
    { value: "Fruits & Vegetables", label: lang.catFruitsAndVeg },
    { value: "Meat & Seafood", label: lang.catMeatAndSeafood },
    { value: "Dairy & Eggs", label: lang.catDairyAndEggs },
    { value: "Grains & Baking", label: lang.catGrainsAndBaking },
    { value: "Condiments & Sauces", label: lang.catCondimentsAndSauces },
    { value: "Beverages", label: lang.catBeverages },
    { value: "Snacks", label: lang.catSnacks },
    { value: "Other", label: lang.catOther },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg(lang.itemNameLabel + " is required.");
      return;
    }
    if (!quantity.trim()) {
      setErrorMsg(lang.quantityLabel + " is required.");
      return;
    }
    if (!expirationDate) {
      setErrorMsg(lang.expirationDateLabel + " is required.");
      return;
    }

    onAddItem({
      name: name.trim(),
      category,
      expirationDate,
      quantity,
      unit: unit.trim(),
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Back button header */}
      <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
        <button
          onClick={onCancel}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-sm font-semibold text-slate-800">
          {lang.addItem}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4 overflow-y-auto pb-4 pr-0.5">
        
        {/* Ingredient name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <ShoppingBag size={14} className="text-emerald-600" />
            {lang.itemNameLabel} *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrorMsg("");
            }}
            placeholder={lang.itemNamePlaceholder}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Category & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <FolderOpen size={14} className="text-emerald-600" />
              {lang.categoryLabel}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Calendar size={14} className="text-emerald-600" />
              {lang.expirationDateLabel} *
            </label>
            <input
              type="date"
              required
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Quantity & Unit block */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              {lang.quantityLabel} *
            </label>
            <input
              type="text"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 500, 3, 1/2"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              {lang.unitLabel}
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="pcs, g, kg, pack..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Notes (Optional) */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <FileText size={14} className="text-emerald-600" />
            {lang.notesLabel}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={lang.notesPlaceholder}
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all resize-none"
          />
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg">
            ⚠️ {errorMsg}
          </p>
        )}

        {/* Buttons */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
          >
            {lang.cancel}
          </button>
          
          <button
            type="submit"
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 py:2.5 text-white text-sm font-semibold rounded-xl shadow-sm shadow-emerald-600/10 transition-all inline-flex items-center justify-center gap-1"
          >
            <Plus size={16} />
            {lang.submitAdd}
          </button>
        </div>
      </form>
    </div>
  );
};
