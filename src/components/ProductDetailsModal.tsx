"use client";

import { Product } from "@/constants";
import { X, ShoppingCart, Heart, ShieldCheck, Truck, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface ModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, onClose }: ModalProps) {
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();

  if (!product) return null;

  const cartItem = cartItems.find((item) => item.id === product.id.toString());

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6" dir="rtl">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-10 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full transition-all shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Image Section */}
            <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-800 relative min-h-[300px] md:min-h-full">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="medical-gradient w-48 h-48 rounded-full blur-3xl opacity-20" />
                  <span className="text-8xl font-black text-primary/10">ق</span>
                </div>
              )}
              
              {/* Floating Badges */}
              <div className="absolute bottom-6 right-6 flex flex-wrap flex-col gap-2 items-end">
                {product.categories.map((cat, index) => (
                  <span key={index} className="bg-teal text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-teal/20">
                    {cat}
                  </span>
                ))}
                {product.brand && (
                  <span className="bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                    {product.brand}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Info Section */}
            <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto flex flex-col">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-600 dark:text-green-400 text-xs font-bold">متوفر حالياً</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                  {product.name}
                </h2>

                <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-8">
                  {product.description || "هذا المنتج تم اختياره بعناية من قبل صيدلية القدس لضمان أفضل جودة ونتائج. يرجى استشارة الصيدلي قبل الاستخدام."}
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="text-[10px] md:text-xs font-bold text-slate-700 dark:text-slate-300">منتج أصلي 100%</div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div className="text-[10px] md:text-xs font-bold text-slate-700 dark:text-slate-300">توصيل سريع</div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    {cartItem ? (
                      <div className="flex items-center justify-between bg-primary/5 dark:bg-primary/20 p-1.5 rounded-2xl border border-primary/10">
                        <button
                          onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                          className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-transform"
                        >
                          <span className="text-xl font-bold">+</span>
                        </button>
                        <span className="text-lg font-black text-primary dark:text-white px-4">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => {
                            if (cartItem.quantity > 1) {
                              updateQuantity(cartItem.id, cartItem.quantity - 1);
                            } else {
                              removeFromCart(cartItem.id);
                            }
                          }}
                          className="w-10 h-10 bg-white dark:bg-slate-800 text-primary dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
                        >
                          <span className="text-xl font-bold">-</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart({ id: product.id.toString(), name: product.name, price: product.price, image: product.image || "" })}
                        className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        أضف إلى السلة
                      </button>
                    )}
                  </div>
                  <button className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-2xl flex items-center justify-center transition-all">
                    <Heart className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
