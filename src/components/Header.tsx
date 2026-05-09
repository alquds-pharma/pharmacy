"use client";

import Link from "next/link";
import Image from "next/image";
import { Sun, Moon, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { cartItems, setIsCartOpen } = useCart();
  
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (theme === "dark" || (!theme && prefersDark)) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      if (isDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [isDark, mounted]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.jpg" 
            alt="صيدلية القدس" 
            width={40} 
            height={40} 
            className="w-10 h-10 rounded-full object-cover shadow-lg border-2 border-white dark:border-slate-800"
          />
          <span className="text-xl font-black text-primary dark:text-white tracking-tight">
            صيدلية <span className="text-teal dark:text-teal-light">القدس</span>
          </span>
        </Link>

        {/* Actions (Dark Mode & Cart) */}
        <div className="flex items-center gap-2">
          {/* Cart Toggle */}
          <motion.div layoutId="main-cart" className="relative">
            <button
              onClick={() => setIsCartOpen(true)}
              className={`p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors ${cartItemsCount > 0 ? 'invisible' : 'visible'}`}
              aria-label="فتح سلة الطلبات"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {!mounted ? (
              <div className="w-5 h-5" />
            ) : isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
