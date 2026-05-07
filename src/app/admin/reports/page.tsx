import prisma from "@/lib/prisma";
import { generateDailyReport, getReports } from "@/app/actions/report";
import { FileText, Download, TrendingUp, Calendar, Trash2, Plus, ArrowUpRight, BarChart3 } from "lucide-react";
import { revalidatePath } from "next/cache";

import ReportButton from "@/components/admin/ReportButton";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const reports = await getReports();
  const ordersCount = await prisma.order.count();

  return (
    <div className="space-y-10 animate-in fade-in duration-500 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2">التقارير المالية</h1>
          <p className="text-slate-500 dark:text-slate-400">إدارة وتوليد تقارير المبيعات اليومية والأسبوعية</p>
        </div>

        <ReportButton ordersCount={ordersCount} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mb-1">طلبات بانتظار التقرير</p>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">{ordersCount} طلب</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-4">
            <BarChart3 className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mb-1">إجمالي التقارير</p>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">{reports.length} تقرير</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mb-1">حالة النظام المحاسبي</p>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">نشط ومؤمن</h3>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            سجل التقارير المُصدرة
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-5 font-bold text-sm">عنوان التقرير</th>
                <th className="p-5 font-bold text-sm">التاريخ</th>
                <th className="p-5 font-bold text-sm">عدد الطلبات</th>
                <th className="p-5 font-bold text-sm">الإجمالي</th>
                <th className="p-5 font-bold text-sm text-center">التقرير (PDF)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {reports.map((report: any) => (
                <tr key={report.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-white">{report.title}</span>
                    </div>
                  </td>
                  <td className="p-5 text-slate-600 dark:text-slate-400 text-sm font-bold">
                    {new Date(report.createdAt).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold">
                      {report.ordersCount} طلبات
                    </span>
                  </td>
                  <td className="p-5 font-black text-slate-800 dark:text-white">
                    {report.totalAmount.toLocaleString()} ريال
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center">
                      <a 
                        href={report.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <Download className="w-4 h-4" />
                        تحميل / عرض
                      </a>
                    </div>
                  </td>
                </tr>
              ))}

              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-10 h-10 text-slate-200" />
                      </div>
                      <p className="font-bold">لا توجد تقارير مُصدرة حتى الآن</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper icons
function ShoppingBag({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}
