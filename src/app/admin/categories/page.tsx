import prisma from "@/lib/prisma";
import { getCategories, deleteCategory } from "@/app/actions/product";
import { Trash2, FolderPlus, Search, Hash } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  async function addCategory(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const imageFile = formData.get("image") as File;

    if (!name) return;

    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      const { uploadImage } = await import("@/lib/upload");
      imageUrl = await uploadImage(imageFile);
    }

    await prisma.category.create({ 
      data: { 
        name,
        image: imageUrl 
      } 
    });
    revalidatePath("/adcpanforpharmacyquds/categories");
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 text-right" dir="rtl">
      <div>
        <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2">إدارة الأصناف</h1>
        <p className="text-slate-500 dark:text-slate-400">إضافة وحذف الأصناف وتصنيفات الأدوية</p>
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
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white mb-4" 
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

        {/* Categories List */}
        <div className="lg:col-span-2">
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
                  {categories.map(category => (
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
                        <div className="flex justify-center">
                          <form action={async () => {
                            "use server";
                            try {
                              await deleteCategory(category.id);
                            } catch (e: any) {
                              // In a real app we'd handle this with a toast
                            }
                          }}>
                            <button 
                              type="submit" 
                              disabled={category._count.products > 0}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed" 
                              title={category._count.products > 0 ? "لا يمكن حذف صنف يحتوي على أدوية" : "حذف"}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
