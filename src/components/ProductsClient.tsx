"use client";

import { useState, useMemo } from "react";
import ProductFilter from "@/components/ProductFilter";
import ProductGrid from "@/components/ProductGrid";
import { Search, X } from "lucide-react";
import { Product } from "@/constants";


export default function ProductsClient({ 
  initialProducts, 
  categories 
}: { 
  initialProducts: Product[];
  categories: { id: string, name: string, image: string | null }[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedBrand, setSelectedBrand] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const categoryMatch =
        selectedCategory === "الكل" || product.categories.includes(selectedCategory);
      const brandMatch =
        selectedBrand === "الكل" || product.brand === selectedBrand;
      const searchMatch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
      return categoryMatch && brandMatch && searchMatch;
    });
  }, [initialProducts, selectedCategory, selectedBrand, searchQuery]);

  return (
    <main className="min-h-screen flex flex-col pb-6">
      {/* ── Page Header ── */}
      <section className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 py-8 md:py-12 transition-colors duration-300">
        <div className="container mx-auto px-4 text-right" dir="rtl">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 md:mb-4">
            أدويتنا ومستلزماتنا
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-lg max-w-2xl">
            استعرض مجموعتنا الواسعة من الأدوية والمستلزمات الطبية المضمونة.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="container mx-auto px-3 md:px-4 py-6 md:py-12 flex-grow">
        <div className="flex flex-col lg:flex-row-reverse gap-4 md:gap-8">

          {/* Sidebar / Mobile Filter bar */}
          <ProductFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
          />

          {/* Product Listing */}
          <div className="flex-1 min-w-0 space-y-4 md:space-y-6">

            {/* Search + count row */}
            <div className="flex items-center gap-3">
              {/* Search bar */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="ابحث عن دواء أو صنف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 md:py-3 pr-10 pl-4 text-sm md:text-base shadow-sm focus:ring-2 focus:ring-primary/20 dark:focus:ring-teal/20 outline-none dark:text-white transition text-right"
                  dir="rtl"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 md:w-5 md:h-5" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Result count badge */}
              <span className="shrink-0 text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl whitespace-nowrap">
                {filteredProducts.length} صنف
              </span>
            </div>

            {/* Active search filter chip */}
            {searchQuery && (
              <div className="flex gap-2 justify-end">
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                  بحث: {searchQuery}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:text-slate-900 dark:hover:text-white"
                  >
                    ×
                  </button>
                </span>
              </div>
            )}

            {/* Grid */}
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </section>
    </main>
  );
}

