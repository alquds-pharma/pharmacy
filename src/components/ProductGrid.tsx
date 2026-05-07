"use client";

import { Product } from "@/constants";
import { ShoppingCart, Heart, Plus, Minus, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useState } from "react";
import ProductDetailsModal from "./ProductDetailsModal";

interface GridProps {
  products: Product[];
}

export default function ProductGrid({ products }: GridProps) {
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 transition-colors">
          <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">
          عذراً، لم نجد أي أصناف
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
          حاول تغيير خيارات البحث أو التصفية
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
        {products.map((product, index) => {
          const cartItem = cartItems.find((item) => item.id === product.id.toString());
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              onClick={() => setSelectedProduct(product)}
              className="group bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden flex flex-col"
            >
              {/* Badge */}
              {product.isNew && (
                <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10 bg-teal text-white text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-md">
                  جديد
                </div>
              )}

              {/* Wishlist button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  // Wishlist logic here
                }}
                className="absolute top-2 left-2 md:top-4 md:left-4 z-10 w-7 h-7 md:w-8 md:h-8 bg-white/90 dark:bg-slate-800/90 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm"
              >
                <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>

              {/* Image Container */}
              <div className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-xl md:rounded-2xl mb-3 md:mb-4 overflow-hidden relative transition-colors">
                {product.image ? (
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-primary/20 dark:text-teal-light/10 font-black text-5xl md:text-6xl select-none">
                    ق
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 gap-1.5 md:gap-2">
                {/* Brand + Category */}
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[9px] md:text-[10px] font-bold text-teal bg-teal/5 px-1.5 py-0.5 rounded-md truncate max-w-[80px] md:max-w-none">
                    {product.brand || "القدس"}
                  </span>
                  <span className="text-[9px] md:text-[10px] font-medium text-slate-400 truncate">
                    {product.categories.join(", ")}
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-teal-light transition-colors line-clamp-2 leading-snug">
                  {product.name}
                </h3>

                {/* CTA Button / Quantity Controls */}
                <div className="mt-auto pt-2" onClick={(e) => e.stopPropagation()}>
                  {cartItem ? (
                    <div className="flex items-center justify-between bg-primary/5 dark:bg-primary/20 p-1 rounded-xl border border-primary/10">
                      <button
                        onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                        className="w-8 h-8 md:w-9 md:h-9 bg-primary text-white rounded-lg flex items-center justify-center shadow-md shadow-primary/20 active:scale-90 transition-transform"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="text-xs md:text-sm font-black text-primary dark:text-white px-2">
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
                        className="w-8 h-8 md:w-9 md:h-9 bg-white dark:bg-slate-800 text-primary dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center active:scale-90 transition-transform"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart({ id: product.id.toString(), name: product.name, price: product.price, image: product.image || "" })}
                      className="w-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-teal-light text-center py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold hover:bg-primary hover:text-white dark:hover:bg-teal dark:hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      أضف للسلة
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </>
  );
}
