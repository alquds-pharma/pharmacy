"use client";

import { BRANDS } from "@/constants";
import { ChevronLeft, Filter, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface FilterProps {
  categories: { id: string, name: string, image: string | null }[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
}

// Icon mapping for each category
const CATEGORY_META: Record<string, { emoji: string; bg: string; darkBg: string }> = {
  "أجهزة قياس الضغط":           { emoji: "🩺", bg: "bg-red-50",      darkBg: "dark:bg-red-900/20"      },
  "أجهزة قياس السكر":           { emoji: "🩸", bg: "bg-rose-50",     darkBg: "dark:bg-rose-900/20"     },
  "علاجات السكري":               { emoji: "💉", bg: "bg-blue-50",     darkBg: "dark:bg-blue-900/20"     },
  "مستلزمات الشعر":             { emoji: "💇‍♀️", bg: "bg-purple-50",   darkBg: "dark:bg-purple-900/20"   },
  "الأحزمة الطبية":             { emoji: "🩹", bg: "bg-teal-50",     darkBg: "dark:bg-teal-900/20"     },
  "كبار السن":                  { emoji: "🧓", bg: "bg-amber-50",    darkBg: "dark:bg-amber-900/20"    },
  "الأطفال":                    { emoji: "👶", bg: "bg-yellow-50",   darkBg: "dark:bg-yellow-900/20"   },
  "الفيتامينات":                 { emoji: "🍋", bg: "bg-green-50",    darkBg: "dark:bg-green-900/20"    },
  "العناية بالبشرة":             { emoji: "🧴🫧", bg: "bg-pink-50",     darkBg: "dark:bg-pink-900/20"     },
  "العناية بالحوامل":            { emoji: "🤰", bg: "bg-orange-50",   darkBg: "dark:bg-orange-900/20"   },
  "أجهزة التدليك":               { emoji: "💆", bg: "bg-violet-50",   darkBg: "dark:bg-violet-900/20"   },
  "ارسال وصفة طبية واستشارات":  { emoji: "📋", bg: "bg-sky-50",      darkBg: "dark:bg-sky-900/20"      },
  "علاجات الضغط":                { emoji: "❤️‍🩹", bg: "bg-red-50",     darkBg: "dark:bg-red-900/20"     },
  "علاجات التنفس":               { emoji: "🫁", bg: "bg-cyan-50",     darkBg: "dark:bg-cyan-900/20"     },
  "علاجات القلب":                { emoji: "🫀", bg: "bg-rose-50",     darkBg: "dark:bg-rose-900/20"     },
  "الفوارات":                    { emoji: "🫧", bg: "bg-lime-50",     darkBg: "dark:bg-lime-900/20"     },
  "المراهم":                     { emoji: "🧴", bg: "bg-orange-50",   darkBg: "dark:bg-orange-900/20"   },
  "العناية بالأسنان":            { emoji: "🦷", bg: "bg-slate-50",    darkBg: "dark:bg-slate-800"       },
  "أصناف شركة NOW":              { emoji: "🍊", bg: "bg-orange-50",   darkBg: "dark:bg-orange-900/20"   },
  "شركة بيوبلانس (BioBalance)":  { emoji: "⚖️", bg: "bg-emerald-50",  darkBg: "dark:bg-emerald-900/20"  },
  "شركة بيودرما (Bioderma)":     { emoji: "💧", bg: "bg-sky-50",      darkBg: "dark:bg-sky-900/20"      },
  "شركة ديرما (Derma)":          { emoji: "🌸", bg: "bg-fuchsia-50",  darkBg: "dark:bg-fuchsia-900/20"  },
  "منتجات إزالة الشعر النسائية":  { emoji: "🪒", bg: "bg-pink-50",     darkBg: "dark:bg-pink-900/20"     },
  "العناية بالجهاز الهضمي":      { emoji: "🦠", bg: "bg-teal-50",     darkBg: "dark:bg-teal-900/20"     },
};

const DEFAULT_META = { emoji: "💊", bg: "bg-slate-50", darkBg: "dark:bg-slate-800" };

export default function ProductFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount =
    (selectedCategory !== "الكل" ? 1 : 0) +
    (selectedBrand !== "الكل" ? 1 : 0);

  // ── Desktop sidebar list ────────────────────────────────────────
  const FilterContent = () => (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          الأقسام الطبية
        </h3>
        <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory("الكل")}
            className={`w-full text-right px-4 py-3 rounded-xl transition-all text-sm font-medium flex items-center gap-3 ${
              selectedCategory === "الكل"
                ? "bg-primary text-white shadow-md font-bold"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <span className="text-xl">🔠</span>
            جميع الأصناف
          </button>
          {categories.map((category) => {
            const meta = CATEGORY_META[category.name] ?? DEFAULT_META;
            const isActive = selectedCategory === category.name;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`w-full text-right px-4 py-3 rounded-xl transition-all flex items-center gap-3 group text-sm ${
                  isActive
                    ? "bg-primary text-white shadow-md font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0 overflow-hidden ${
                    isActive ? "bg-white/20" : `${meta.bg} ${meta.darkBg}`
                  }`}
                >
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  ) : (
                    meta.emoji
                  )}
                </span>
                <span className="flex-1 text-right">{category.name}</span>
                <ChevronLeft
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? "rotate-180" : "group-hover:-translate-x-1"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands Filter (Only show if BRANDS has items) */}
      {BRANDS.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-teal rounded-full" />
            الشركات والماركات
          </h3>
          <div className="space-y-1.5">
            <button
              onClick={() => setSelectedBrand("الكل")}
              className={`w-full text-right px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                selectedBrand === "الكل"
                  ? "bg-teal text-white shadow-md font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              جميع الشركات
            </button>
            {BRANDS.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`w-full text-right px-4 py-3 rounded-xl transition-all text-sm ${
                  selectedBrand === brand
                    ? "bg-teal text-white shadow-md font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:block w-72 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 h-fit sticky top-28 transition-colors duration-300">
        <FilterContent />
      </aside>

      {/* ── Mobile: filter bar ── */}
      <div className="lg:hidden w-full space-y-3" dir="rtl">

        {/* Row 1: Filter button + "الكل" */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-2xl font-bold text-sm shadow-sm relative shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            تصفية
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { setSelectedCategory("الكل"); setSelectedBrand("الكل"); }}
            className={`flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all border ${
              selectedCategory === "الكل" && selectedBrand === "الكل"
                ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
            }`}
          >
            🔠 الكل
          </button>
        </div>

        {/* Row 2: Category circles (horizontal scroll) */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((category) => {
            const meta = CATEGORY_META[category.name] ?? DEFAULT_META;
            const isActive = selectedCategory === category.name;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className="flex flex-col items-center gap-1.5 shrink-0 group"
              >
                {/* Circle image */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-200 border-2 overflow-hidden ${
                    isActive
                      ? "border-primary bg-primary/10 dark:bg-primary/20 scale-105 shadow-lg shadow-primary/20"
                      : `border-transparent ${meta.bg} ${meta.darkBg} group-active:scale-95`
                  }`}
                >
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  ) : (
                    prefixEmoji(category.name, meta.emoji)
                  )}
                </div>
                {/* Label */}
                <span
                  className={`text-[10px] font-bold text-center leading-tight max-w-[60px] transition-colors ${
                    isActive
                      ? "text-primary dark:text-teal-light"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active brand chip */}
        {selectedBrand !== "الكل" && (
          <div className="flex gap-2">
            <span className="bg-teal/10 text-teal px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
              {selectedBrand}
              <button onClick={() => setSelectedBrand("الكل")}>×</button>
            </span>
          </div>
        )}
      </div>

      {/* ── Mobile Full Filter Drawer (bottom sheet) ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-0 right-0 left-0 max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-[2rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-slate-100 dark:border-slate-800" dir="rtl">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                تصفية الأصناف
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"
              >
                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-6 py-5">
              <FilterContent />
            </div>

            {/* Action buttons */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex gap-3" dir="rtl">
              <button
                onClick={() => { setSelectedCategory("الكل"); setSelectedBrand("الكل"); }}
                className="flex-1 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-3.5 rounded-2xl font-bold text-sm"
              >
                إعادة ضبط
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-[2] bg-primary text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20"
              >
                عرض النتائج
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function prefixEmoji(category: string, defaultEmoji: string) {
  return defaultEmoji;
}
