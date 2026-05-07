"use client";

import { updateProduct } from "@/app/actions/product";
import { useState, useRef, useEffect } from "react";
import { X, Upload, Save } from "lucide-react";
import Image from "next/image";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isNew: boolean;
  categories: { id: string; name: string }[];
};

export default function EditProductModal({ 
  product, 
  categories, 
  onClose 
}: { 
  product: Product; 
  categories: Category[]; 
  onClose: () => void 
}) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(product.image);
  const [isNew, setIsNew] = useState(product.isNew);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(product.categories.map(c => c.id));
  const formRef = useRef<HTMLFormElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("isNew", isNew.toString());
    selectedCategories.forEach(id => formData.append("categoryIds", id));
    try {
      await updateProduct(product.id, formData);
      onClose();
    } catch (error) {
      alert("فشل في تحديث الدواء");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-slate-800 dark:text-white">تعديل الدواء</h2>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsNew(true)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${isNew ? 'bg-teal text-white shadow-md shadow-teal/20' : 'text-slate-400'}`}
              >
                جديد
              </button>
              <button
                type="button"
                onClick={() => setIsNew(false)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${!isNew ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'text-slate-400'}`}
              >
                عادي
              </button>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 dark:text-slate-300">اسم الدواء / المنتج</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  defaultValue={product.name}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white" 
                />
              </div>
                <input type="hidden" name="price" value="0" />
              <div>
                <label className="block text-sm font-bold mb-3 dark:text-slate-300">الأقسام</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(cat.id)}
                        onChange={(e) => {
                          if(e.target.checked) setSelectedCategories([...selectedCategories, cat.id])
                          else setSelectedCategories(selectedCategories.filter(id => id !== cat.id))
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 dark:text-slate-300">تغيير الصورة</label>
              <div className="relative group aspect-square">
                <input 
                  type="file" 
                  name="image" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                <div className="w-full h-full rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden relative">
                  {preview ? (
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <Upload className="w-8 h-8 text-slate-400" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold">تغيير الصورة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 dark:text-slate-300">الوصف</label>
            <textarea 
              name="description" 
              rows={3} 
              defaultValue={product.description || ""}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white"
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  حفظ التعديلات
                </>
              )}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
