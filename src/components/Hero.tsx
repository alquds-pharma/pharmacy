"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-medical-clean dark:bg-slate-950 py-16 md:py-24 transition-colors duration-300">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-right">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                صيدلية القدس - صنعاء
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-6">
                صيدلية <span className="text-primary dark:text-primary-light">القدس</span>.. <br />
                رعاية صحية <span className="text-teal dark:text-teal-light">متكاملة</span> لثقتكم
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0">
                نهتم بصحتكم ونوفر لكم أجود الأصناف العالمية والمحلية. خدمة التوصيل متوفرة لجميع مناطق صنعاء لضمان راحتكم وسلامتكم.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link 
                  href="/products" 
                  className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-1"
                >
                  اطلب الآن
                </Link>
                <Link 
                  href="/upload-prescription" 
                  className="bg-white dark:bg-slate-900 text-primary dark:text-primary-light border-2 border-primary/10 dark:border-slate-800 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all transform hover:-translate-y-1"
                >
                  إرسال وصفة طبية
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center gap-3 justify-center lg:justify-end text-slate-600 dark:text-slate-400">
                  <div className="w-10 h-10 bg-white dark:bg-slate-900 shadow-md rounded-lg flex items-center justify-center text-teal dark:text-teal-light">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm">توصيل لجميع مناطق صنعاء</span>
                </div>
                <div className="flex items-center gap-3 justify-center lg:justify-end text-slate-600 dark:text-slate-400">
                  <div className="w-10 h-10 bg-white dark:bg-slate-900 shadow-md rounded-lg flex items-center justify-center text-teal dark:text-teal-light">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm">أدوية مضمونة 100%</span>
                </div>
                <div className="flex items-center gap-3 justify-center lg:justify-end text-slate-600 dark:text-slate-400">
                  <div className="w-10 h-10 bg-white dark:bg-slate-900 shadow-md rounded-lg flex items-center justify-center text-teal dark:text-teal-light">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm">خدمة عملاء ممتازة</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              {/* Note: In a real app, I'd use an image here. Using a placeholder-style div with premium look for now. */}
              <div className="aspect-[4/3] bg-slate-200 medical-gradient opacity-90 flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm p-2">
                    <Image 
                      src="/logo.jpg" 
                      alt="صيدلية القدس" 
                      width={80} 
                      height={80} 
                      className="w-full h-full rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">ثقتكم هي أولويتنا</h3>
                  <p className="opacity-80">صيدلية القدس - رعاية طبية شاملة</p>
                </div>
              </div>
            </div>
            {/* Floating stats */}
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl z-20 hidden md:block border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="text-primary dark:text-primary-light text-3xl font-black">20+</div>
              <div className="text-slate-500 dark:text-slate-400 font-bold text-sm">قسم طبي متكامل</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
