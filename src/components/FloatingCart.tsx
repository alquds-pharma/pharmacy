"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingCart() {
  const { cartItems, setIsCartOpen } = useCart();
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-28 right-6 z-50 p-4 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center border-4 border-white dark:border-slate-900 group"
          aria-label="سلة المشتريات"
        >
          <div className="relative">
            <ShoppingCart className="w-7 h-7 group-hover:animate-bounce" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={itemCount}
              className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-lg"
            >
              {itemCount}
            </motion.span>
          </div>
          
          {/* Tooltip on hover for desktop */}
          <span className="absolute right-full mr-4 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
            عرض السلة
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
