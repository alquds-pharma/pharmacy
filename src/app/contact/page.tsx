"use client";

import { motion } from "framer-motion";
import {
  Phone,
  MapPin,
  Clock,
  Mail,
  MessageCircle,
  Send,
  Facebook,
  Instagram,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1 },
  }),
};

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      
      // Send via WhatsApp
      const msg = `مرحباً صيدلية القدس، لدي استفسار:\n\nالاسم: ${formState.name}\nالهاتف: ${formState.phone}\nالرسالة:\n${formState.message}`;
      const url = `https://wa.me/967770709062?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-medical-clean dark:bg-slate-950 transition-colors duration-300">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-primary py-20 md:py-28">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] bg-white rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-block bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-5"
          >
            تواصل معنا
          </motion.span>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-5"
          >
            نحن هنا من أجلكم
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto"
          >
            فريقنا الصيدلاني المتخصص جاهز لخدمتكم والإجابة على جميع
            استفساراتكم على مدار اليوم.
          </motion.p>
        </div>
      </section>

      {/* ── Info Cards + Form ── */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact Info */}
          <div className="space-y-6">
            {/* Card: Phone */}
            <motion.div
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800 flex gap-5 items-start"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                <Phone className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                  اتصل بنا
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
                  متاحون للرد على مدار اليوم
                </p>
                <a
                  href="tel:770709062"
                  className="block text-primary font-bold text-lg hover:underline"
                >
                  770 709 062
                </a>
                <a
                  href="tel:781116769"
                  className="block text-primary font-bold text-lg hover:underline"
                >
                  781 116 769
                </a>
              </div>
            </motion.div>

            {/* Card: WhatsApp */}
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800 flex gap-5 items-start"
            >
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                  واتساب
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                  تحدث معنا مباشرةً أو أرسل وصفتك الطبية
                </p>
                <a
                  href="https://wa.me/967770709062"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-green-500/20 hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-5 h-5" />
                  ابدأ المحادثة
                </a>
              </div>
            </motion.div>

            {/* Card: Email */}
            <motion.div
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800 flex gap-5 items-start"
            >
              <div className="w-14 h-14 bg-teal/10 rounded-2xl flex items-center justify-center text-teal shrink-0">
                <Mail className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                  البريد الإلكتروني
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
                  للاستفسارات والشراكات
                </p>
                <a
                  href="mailto:info@quds-pharma.com"
                  className="text-teal font-bold hover:underline"
                >
                  info@quds-pharma.com
                </a>
              </div>
            </motion.div>

            {/* Card: Address & Hours */}
            <motion.div
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800 flex gap-5 items-start"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                <MapPin className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                  موقعنا
                </h3>
                <p className="text-slate-600 dark:text-slate-300 font-medium mb-4">
                  صنعاء - دار سلم - نهاية الجسر باتجاه الحثيلي
                </p>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">
                    يومياً: 7:30 صباحاً – 1:00 بعد منتصف الليل
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              custom={4}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800"
            >
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">
                تابعونا على السوشيال ميديا
              </h3>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/share/1E1m9XYrMs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-600/20"
                >
                  <Facebook className="w-5 h-5" />
                  فيسبوك
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white px-5 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-lg shadow-pink-500/20"
                >
                  <Instagram className="w-5 h-5" />
                  إنستجرام
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right: Message Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100 dark:border-slate-800 sticky top-24"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                  تم الإرسال بنجاح!
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                  شكراً لتواصلكم معنا. سيقوم فريقنا بالرد عليكم في أقرب وقت
                  ممكن.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormState({ name: "", phone: "", message: "" });
                  }}
                  className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary-dark transition-all"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                    أرسل لنا رسالة
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    سنرد عليكم في أقرب وقت ممكن خلال ساعات العمل
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      الاسم الكامل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      placeholder="مثال: محمد علي"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 px-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      رقم الهاتف <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formState.phone}
                      onChange={(e) =>
                        setFormState({ ...formState, phone: e.target.value })
                      }
                      placeholder="مثال: 770123456"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 px-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                      dir="ltr"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      رسالتكم <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      placeholder="اكتب استفسارك أو طلبك هنا..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 px-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        إرسال الرسالة
                      </>
                    )}
                  </button>

                  <p className="text-center text-slate-400 text-xs">
                    أو تواصل معنا مباشرةً عبر{" "}
                    <a
                      href="https://wa.me/967770709062"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 font-bold hover:underline"
                    >
                      واتساب
                    </a>
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Map Section ── */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800"
        >
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white">
                موقع الصيدلية
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                صنعاء - دار سلم - نهاية الجسر باتجاه الحثيلي
              </p>
            </div>
          </div>
          {/* Map Embed Placeholder */}
          <div className="h-72 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              خريطة الموقع
            </p>
            <a
              href="https://maps.app.goo.gl/69CLAtYuntC72XWz9?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-all"
            >
              فتح في خرائط جوجل
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            هل تحتاج إلى وصفة طبية؟
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            يمكنك إرسال وصفتك الطبية مباشرةً وسيقوم فريقنا بتجهيز طلبك وتوصيله
            إليك.
          </p>
          <Link
            href="/upload-prescription"
            className="inline-block bg-white text-primary px-10 py-4 rounded-2xl font-black text-lg hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            إرسال وصفة طبية
          </Link>
        </div>
      </section>
    </main>
  );
}
