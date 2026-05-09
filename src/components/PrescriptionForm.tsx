"use client";

import { useState } from "react";
import { Upload, Send, Phone, User, FileText, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { createPrescriptionOrder } from "@/app/actions/order";

export default function PrescriptionForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await createPrescriptionOrder(formData);
      
      if (res.success) {
        // Construct WhatsApp Message
        const name = formData.get("name");
        const phone = formData.get("phone");
        const notes = formData.get("notes");
        
        let message = `مرحباً صيدلية القدس، أود إرسال وصفة طبية جديدة:\n\n`;
        message += `👤 الاسم: ${name}\n`;
        message += `📞 الهاتف: ${phone}\n`;
        if (notes) message += `📝 ملاحظات: ${notes}\n`;
        if (res.imageUrl) message += `🖼️ صورة الوصفة مرفقة في الطلب رقم: ${res.orderId}\n`;
        
        const whatsappUrl = `https://wa.me/967770709062?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        setIsSubmitted(true);
      } else {
        alert("فشل في إرسال الوصفة، يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      alert("حدث خطأ غير متوقع.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-primary/5 border border-slate-100 dark:border-slate-800"
          >
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary">
                <FileText className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">إرسال وصفة طبية</h2>
              <p className="text-slate-500 dark:text-slate-400">قم بتحميل صورة الوصفة وسنقوم بتجهيزها لك فوراً</p>
            </div>

            <div className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 mr-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  الاسم الكامل
                </label>
                <input
                  name="name"
                  required
                  type="text"
                  placeholder="أدخل اسمك هنا..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white dark:placeholder-slate-500"
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 mr-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  رقم الهاتف (واتساب)
                </label>
                <input
                  name="phone"
                  required
                  type="tel"
                  placeholder="مثال: 770709062"
                  dir="ltr"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-right dark:text-white dark:placeholder-slate-500"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 mr-2 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-primary" />
                  صورة الوصفة الطبية
                </label>
                <label className="relative flex flex-col items-center justify-center w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 hover:border-primary/30 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className={`w-8 h-8 mb-3 ${fileName ? "text-teal" : "text-slate-400"}`} />
                    <p className="mb-2 text-sm text-slate-500 font-bold">
                      {fileName ? fileName : "انقر لتحميل الصورة أو اسحبها هنا"}
                    </p>
                    <p className="text-xs text-slate-400">PNG, JPG, PDF (حد أقصى 5MB)</p>
                  </div>
                  <input 
                    name="image"
                    type="file" 
                    className="hidden" 
                    accept="image/*,.pdf" 
                    onChange={handleFileChange} 
                    required 
                  />
                </label>
              </div>

              {/* Notes Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 mr-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  ملاحظات إضافية
                </label>
                <textarea
                  name="notes"
                  placeholder="أي معلومات إضافية تود إخبارنا بها..."
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none dark:text-white dark:placeholder-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isSubmitting ? "جاري الإرسال..." : (
                  <>
                    إرسال الآن
                    <Send className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 text-center shadow-xl border border-slate-100 dark:border-slate-800"
          >
            <div className="w-24 h-24 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-8 text-teal">
              <CheckCircle2 className="w-16 h-16" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">تم الإرسال بنجاح!</h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              لقد استلمنا وصفتك الطبية بنجاح. سنقوم بمراجعتها والتواصل معك عبر الواتساب أو الهاتف خلال دقائق لتأكيد الطلب والتوصيل.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-slate-100 text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
            >
              إرسال وصفة أخرى
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
