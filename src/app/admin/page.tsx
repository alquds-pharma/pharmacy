import prisma from "@/lib/prisma";
import { Package, ShoppingBag, Layers, BarChart3, ClipboardList, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productsCount, ordersCount, categoriesCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.category.count(),
  ]);

  const sections = [
    {
      href: "/adcpanforpharmacyquds/products",
      icon: <Package className="w-7 h-7" />,
      label: "إدارة الأدوية",
      desc: "إضافة، تعديل، وحذف الأدوية",
      count: productsCount,
      unit: "دواء",
      color: "teal",
      bg: "bg-teal/10",
      text: "text-teal",
      border: "hover:border-teal/40",
    },
    {
      href: "/adcpanforpharmacyquds/categories",
      icon: <Layers className="w-7 h-7" />,
      label: "إدارة الأصناف",
      desc: "إضافة وتنظيم أصناف المنتجات",
      count: categoriesCount,
      unit: "صنف",
      color: "orange",
      bg: "bg-orange-500/10",
      text: "text-orange-500",
      border: "hover:border-orange-400/40",
    },
    {
      href: "/adcpanforpharmacyquds/orders",
      icon: <ShoppingBag className="w-7 h-7" />,
      label: "الطلبات الواردة",
      desc: "متابعة وإدارة طلبات العملاء",
      count: ordersCount,
      unit: "طلب",
      color: "primary",
      bg: "bg-primary/10",
      text: "text-primary",
      border: "hover:border-primary/40",
    },
    {
      href: "/adcpanforpharmacyquds/reports",
      icon: <BarChart3 className="w-7 h-7" />,
      label: "التقارير",
      desc: "توليد وتنزيل تقارير الطلبات",
      count: null,
      unit: "",
      color: "purple",
      bg: "bg-purple-500/10",
      text: "text-purple-500",
      border: "hover:border-purple-400/40",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white">نظرة عامة</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">مرحباً بك في لوحة تحكم صيدلية القدس</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 text-center">
          <p className="text-3xl font-black text-teal">{productsCount}</p>
          <p className="text-xs text-slate-500 mt-1">إجمالي الأدوية</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 text-center">
          <p className="text-3xl font-black text-orange-500">{categoriesCount}</p>
          <p className="text-xs text-slate-500 mt-1">الأصناف</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 text-center">
          <p className="text-3xl font-black text-primary">{ordersCount}</p>
          <p className="text-xs text-slate-500 mt-1">الطلبات</p>
        </div>
      </div>

      {/* All Sections */}
      <div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">الأقسام</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map((s) => (
            <Link key={s.href} href={s.href} className="group block">
              <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 ${s.border} dark:hover:border-slate-600 hover:shadow-lg transition-all duration-300 flex items-center gap-5`}>
                <div className={`w-14 h-14 ${s.bg} ${s.text} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-black text-slate-800 dark:text-white group-hover:${s.text} transition-colors`}>{s.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
                  {s.count !== null && (
                    <p className={`text-sm font-bold ${s.text} mt-1`}>{s.count} {s.unit}</p>
                  )}
                </div>
                <ArrowLeft className="w-5 h-5 text-slate-300 group-hover:text-slate-500 group-hover:-translate-x-1 transition-all shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
