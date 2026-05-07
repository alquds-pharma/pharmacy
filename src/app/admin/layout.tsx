import Link from "next/link";
import { Package, ShoppingBag, LayoutDashboard, Settings, Layers, Users, Bell, LogOut, Search, BarChart3 } from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-slate-950 font-tajawal" dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-xl hidden lg:block z-30 sticky top-0 h-screen overflow-y-auto transition-all">
        <div className="p-8 pb-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white leading-none">لوحة التحكم</h2>
              <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1">صيدلية القدس</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-4">القائمة الرئيسية</p>
            <SidebarLink href="/adcpanforpharmacyquds" icon={<LayoutDashboard className="w-5 h-5" />} label="نظرة عامة" />
            <SidebarLink href="/adcpanforpharmacyquds/products" icon={<Package className="w-5 h-5" />} label="الأدوية" />
            <SidebarLink href="/adcpanforpharmacyquds/categories" icon={<Layers className="w-5 h-5" />} label="الأصناف" />
            <SidebarLink href="/adcpanforpharmacyquds/orders" icon={<ShoppingBag className="w-5 h-5" />} label="الطلبات" />
            <SidebarLink href="/adcpanforpharmacyquds/reports" icon={<BarChart3 className="w-5 h-5" />} label="التقارير المالية" />
          </div>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-100 dark:border-slate-800">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="بحث سريع..." 
                className="w-full pr-10 pl-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm" 
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl relative transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:border-slate-800 mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 rounded-xl transition-all">
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">أدمن النظام</p>
                <p className="text-[10px] text-slate-500 mt-1">مدير كامل</p>
              </div>
              <div className="w-9 h-9 bg-teal text-white rounded-xl flex items-center justify-center font-black">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-32 lg:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation - Moved to top level for absolute visibility */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t-2 border-primary/20 dark:border-slate-800 px-2 py-3 z-[100] flex justify-around items-center shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <MobileNavLink href="/adcpanforpharmacyquds" icon={<LayoutDashboard className="w-6 h-6" />} label="الرئيسية" />
        <MobileNavLink href="/adcpanforpharmacyquds/products" icon={<Package className="w-6 h-6" />} label="الأدوية" />
        <MobileNavLink href="/adcpanforpharmacyquds/orders" icon={<ShoppingBag className="w-6 h-6" />} label="الطلبات" />
        <MobileNavLink href="/adcpanforpharmacyquds/reports" icon={<BarChart3 className="w-6 h-6" />} label="التقارير" />
      </nav>
    </div>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-primary/5 dark:hover:bg-slate-800 transition-all group font-bold"
    >
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-sm">{label}</span>
    </Link>
  );
}

function MobileNavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1 p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-teal-light transition-colors">
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </Link>
  );
}

