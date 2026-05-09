import prisma from "@/lib/prisma";
import { addCategory } from "@/app/actions/product";
import { FolderPlus } from "lucide-react";
import CategoriesList from "@/components/admin/CategoriesList";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-500 text-right" dir="rtl">
      <div>
        <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2">إدارة الأصناف</h1>
        <p className="text-slate-500 dark:text-slate-400">إضافة، تعديل، وحذف أصناف الأدوية</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Category Form */}
        <div className="lg:col-span-1">
          <form action={addCategory} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 sticky top-10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
              <FolderPlus className="w-5 h-5 text-primary" />
              إضافة صنف جديد
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 dark:text-slate-300">اسم الصنف</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="مثال: أدوية الأطفال"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 dark:text-slate-300">صورة القسم</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
              >
                حفظ الصنف
              </button>
            </div>
          </form>
        </div>

        {/* Categories List with Edit support */}
        <div className="lg:col-span-2">
          <CategoriesList categories={categories} />
        </div>
      </div>
    </div>
  );
}
