"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { updateOrderStatus } from "@/app/actions/order";
import { Filter } from "lucide-react";

export default function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert("فشل تحديث حالة الطلب");
      }
    } catch (error) {
      alert("حدث خطأ أثناء التحديث");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(o => filter === "ALL" ? true : o.status === filter);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold dark:text-white">الطلبات الحديثة ({filteredOrders.length})</h2>
        
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto scrollbar-none">
          {[
            { id: "ALL", label: "جميع الطلبات" },
            { id: "PENDING", label: "قيد الانتظار" },
            { id: "COMPLETED", label: "مكتمل" },
            { id: "CANCELLED", label: "ملغي" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                filter === tab.id
                  ? "bg-white dark:bg-slate-600 text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="p-4 font-medium">رقم الطلب</th>
              <th className="p-4 font-medium">النوع</th>
              <th className="p-4 font-medium">العميل</th>
              <th className="p-4 font-medium">الهاتف</th>
              <th className="p-4 font-medium">العنوان/الملاحظات</th>
              <th className="p-4 font-medium">التفاصيل</th>

              <th className="p-4 font-medium">التاريخ</th>
              <th className="p-4 font-medium">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 align-middle">
                  <code 
                    className="block bg-slate-100 dark:bg-slate-800 px-2 py-1.5 rounded text-[11px] font-mono text-slate-700 dark:text-slate-300 max-w-[120px] overflow-x-auto whitespace-nowrap select-all custom-scrollbar cursor-text" 
                    dir="ltr"
                    title="انقر للتحديد والنسخ"
                  >
                    {order.id}
                  </code>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                    order.type === 'PRESCRIPTION' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {order.type === 'PRESCRIPTION' ? 'وصفة طبية' : 'سلة شراء'}
                  </span>
                </td>
                <td className="p-4 font-bold dark:text-white">{order.customerName}</td>
                <td className="p-4 text-slate-600 dark:text-slate-300" dir="ltr">{order.customerPhone}</td>
                <td className="p-4 text-slate-600 dark:text-slate-300 max-w-[200px] truncate" title={order.customerAddress || ""}>
                  {order.customerAddress}
                </td>
                <td className="p-4">
                  {order.type === 'PRESCRIPTION' ? (
                    order.image ? (
                      <a href={order.image} target="_blank" rel="noreferrer" className="text-primary underline text-xs font-bold">عرض صورة الوصفة</a>
                    ) : (
                      <span className="text-slate-400 text-xs italic">لا توجد صورة</span>
                    )
                  ) : (
                    <ul className="list-disc list-inside text-xs text-slate-500 dark:text-slate-400">
                      {order.items.map((item: any) => (
                        <li key={item.id}>
                          {item.product ? item.product.name : item.productName} (×{item.quantity})
                        </li>
                      ))}
                    </ul>
                  )}
                </td>

                <td className="p-4 text-slate-500">
                  {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: ar })}
                </td>
                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    className={`px-2 py-1 rounded-md text-xs font-bold outline-none cursor-pointer border transition-colors ${
                      order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500 dark:border-yellow-900/50' :
                      order.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-500 dark:border-green-900/50' :
                      'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-500 dark:border-red-900/50'
                    } ${updatingId === order.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="PENDING" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">قيد الانتظار</option>
                    <option value="COMPLETED" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">مكتمل</option>
                    <option value="CANCELLED" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">ملغي</option>
                  </select>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">لا يوجد طلبات بهذه الحالة حالياً.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
