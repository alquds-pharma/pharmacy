import prisma from "@/lib/prisma";
import AddProductForm from "@/components/AddProductForm";
import ProductsList from "@/components/admin/ProductsList";
import { getCategories } from "@/app/actions/product";
import { Search, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { categories: true },
    orderBy: { createdAt: 'desc' }
  });

  const categories = await getCategories();

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2">إدارة الأدوية</h1>
          <p className="text-slate-500 dark:text-slate-400">إضافة، تعديل، وحذف الأدوية من الصيدلية</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="بحث عن دواء..." className="pr-10 pl-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm w-64" />
          </div>
          <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
      
      <AddProductForm categories={categories} />

      <ProductsList initialProducts={products} categories={categories} />
    </div>
  );
}


