"use client";

import React, { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { generateDailyReport } from "@/app/actions/report";

export default function ReportButton({ ordersCount }: { ordersCount: number }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerate() {
    if (ordersCount === 0) return;
    
    const confirmGen = confirm("هل أنت متأكد من توليد تقرير جديد؟ سيتم تجميع كافة الطلبات الحالية في ملف إكسل وحذفها من القائمة.");
    if (!confirmGen) return;

    setIsLoading(true);
    try {
      const result = await generateDailyReport();
      if (result.success) {
        alert("تم توليد التقرير بنجاح ورفعه إلى Cloudinary. تم تصفير قائمة الطلبات.");
        window.location.reload(); // Refresh to show new report
      } else {
        alert(result.error || "حدث خطأ أثناء توليد التقرير");
      }
    } catch (error) {
      alert("حدث خطأ تقني غير متوقع");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button 
        onClick={handleGenerate}
        disabled={ordersCount === 0 || isLoading}
        className="flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            جاري التوليد...
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            توليد تقرير جديد الآن
          </>
        )}
      </button>
      {ordersCount === 0 && (
        <p className="text-[10px] text-red-500 mt-2 font-bold text-center">لا توجد طلبات جديدة لتوليد تقرير</p>
      )}
    </div>
  );
}
