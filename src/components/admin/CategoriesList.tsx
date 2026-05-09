"use client";

import { useState } from "react";
import { Trash2, Edit3, Hash } from "lucide-react";
import { deleteCategory } from "@/app/actions/product";
import EditCategoryModal from "./EditCategoryModal";

type Category = {
  id: string;
  name: string;
  image: string | null;
  _count: { products: number };
};

export default function CategoriesList({ categories }: { categories: Category[] }) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-5 font-bold text-sm">اسم الصنف</th>
                <th className="p-5 font-bold text-sm">عدد الأدوية</th>
                <th className="p-5 font-bold text-sm text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary relative overflow-hidden">
                        {category.image ? (
                          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                        ) : (
                          <Hash className="w-5 h-5" />
                        )}
                      </div>
                      <span className="font-bold text-slate-800 dark:text-white">{category.name}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-bold">
                      {category._count.products} دواء
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center gap-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        title="تعديل"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={async () => {
                          if (!confirm("هل أنت متأكد من حذف هذا الصنف؟")) return;
                          const result = await deleteCategory(category.id);
                          if (result && !result.success) alert(result.error);
                        }}
                        disabled={category._count.products > 0}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title={category._count.products > 0 ? "لا يمكن حذف صنف يحتوي على أدوية" : "حذف"}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-16 text-center text-slate-400 font-bold">
                    لا توجد أصناف حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </>
  );
}
