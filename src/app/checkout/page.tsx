"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createOrder } from "@/app/actions/order";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await createOrder({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        items: cartItems.map(item => ({
          productId: String(item.id),
          productName: item.name || "صنف",
          quantity: Number(item.quantity) || 1,
        }))
      });
      
      setIsSubmitting(false);
      
      if (res.success) {
        // Clear cart explicitly here to ensure localStorage is updated before WhatsApp opens
        localStorage.removeItem("pharmacy_cart");
        clearCart();
        setIsSuccess(true);
        
        // Construct WhatsApp Message
        let message = `مرحباً صيدلية القدس، أود تأكيد طلبي الجديد:\n\n`;
        message += `رقم الطلب: ${res.orderId}\n`;
        message += `👤 الاسم: ${formData.name}\n`;
        message += `📞 الهاتف: ${formData.phone}\n`;
        message += `📍 العنوان: ${formData.address}\n\n`;
        message += `🛍️ تفاصيل الطلب:\n`;
        cartItems.forEach((item, index) => {
          message += `${index + 1}. ${item.name} (الكمية: ${item.quantity})\n`;
        });

        message += `\n⚠️ تنبيه مهم: يُرجى إرسال هذه الرسالة كما هي لضمان معالجة طلبك.\nرقم الطلب المرجعي: ${res.orderId} ✅`;
        
        const whatsappUrl = `https://wa.me/967770709062?text=${encodeURIComponent(message)}`;
        
        // Delay WhatsApp redirect slightly to allow React to render success screen
        setTimeout(() => {
          window.location.href = whatsappUrl;
        }, 800);
      } else {
        alert("حدث خطأ أثناء حفظ الطلب في قاعدة البيانات: " + (res.error || "خطأ غير معروف"));
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      alert("حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">تم تأكيد طلبك بنجاح!</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
          شكراً لثقتك بصيدلية القدس. سنتواصل معك قريباً على الرقم المرفق لتأكيد التوصيل.
        </p>
        <Link 
          href="/"
          className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <ShoppingBag className="w-24 h-24 text-slate-300 dark:text-slate-700 mb-6" />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">السلة فارغة</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">لا يوجد أي أصناف في سلتك حالياً لإتمام الطلب.</p>
        <Link 
          href="/products"
          className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-colors"
        >
          تصفح الأصناف
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/products" className="text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
          <ArrowRight className="w-4 h-4" /> العودة للتصفح
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-8 text-right">إتمام الطلب</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
            <h2 className="text-xl font-bold mb-6 dark:text-white">بيانات التوصيل</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">الاسم الكامل</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  placeholder="أدخل اسمك الكريم"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">رقم الهاتف (للتواصل السريع)</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  placeholder="مثال: 771234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">عنوان التوصيل بالتفصيل</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white resize-none"
                  placeholder="المحافظة، المنطقة، الشارع، أقرب معلم بارز"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-6 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">جاري تأكيد الطلب...</span>
                ) : (
                  <>تأكيد الطلب</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 sticky top-24 border border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-6 dark:text-white">ملخص الطلب</h2>
            <div className="space-y-4 mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 border-b border-slate-200 dark:border-slate-700 pb-4 last:border-0 last:pb-0">
                  <div className="w-16 h-16 relative bg-white rounded-lg overflow-hidden shrink-0 border border-slate-100">
                    <Image src={item.image || '/placeholder.svg'} alt={item.name} fill className="object-contain p-1" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm line-clamp-2 dark:text-slate-200">{item.name}</h3>
                    <div className="text-slate-500 text-sm mt-1">الكمية: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
            
            
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="text-lg">💬</span>
                <span>سيتم التواصل معك عبر واتساب لتأكيد السعر وموعد التوصيل بعد إرسال الطلب.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
