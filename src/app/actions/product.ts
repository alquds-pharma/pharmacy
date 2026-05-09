"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/lib/upload";

async function generateProductId(): Promise<string> {
  const date = new Date();
  const dd = date.getDate().toString().padStart(2, '0');
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const yy = date.getFullYear().toString().slice(-2);
  const prefix = `PRD-${dd}${mm}${yy}`;

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const todayCount = await prisma.product.count({
    where: { createdAt: { gte: startOfDay, lte: endOfDay } },
  });

  const seq = (todayCount + 1).toString().padStart(4, '0');
  return `${prefix}-${seq}`;
}

async function generateCategoryId(): Promise<string> {
  const count = await prisma.category.count();
  const seq = (count + 1).toString().padStart(3, '0');
  return `CAT-${seq}`;
}

export async function addProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageFile = formData.get("image") as File;
  const categoryIds = formData.getAll("categoryIds") as string[];
  const newCategoryName = formData.get("newCategoryName") as string;
  const isNew = formData.get("isNew") === "true";

  let imageUrl = "/products/default.jpg";
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile, "pharmacy/products");
  }

  if (!name || (categoryIds.length === 0 && !newCategoryName)) {
    throw new Error("Missing required fields");
  }

  const connectIds = categoryIds.map(id => ({ id }));

  if (newCategoryName) {
    const existing = await prisma.category.findUnique({ where: { name: newCategoryName } });
    if (existing) {
      connectIds.push({ id: existing.id });
    } else {
      const categoryId = await generateCategoryId();
      const category = await prisma.category.create({
        data: { id: categoryId, name: newCategoryName }
      });
      connectIds.push({ id: category.id });
    }
  }

  const productId = await generateProductId();
  const product = await prisma.product.create({
    data: {
      id: productId,
      name,
      description,
      image: imageUrl,
      isNew,
      categories: {
        connect: connectIds
      }
    },
  });

  revalidatePath("/adcpanforpharmacyquds/products");
  revalidatePath("/products");

  return { success: true, product };
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/adcpanforpharmacyquds/products");
    revalidatePath("/products");

    return { success: true };
  } catch (error: any) {
    console.error("Delete product error:", error);
    return { 
      success: false, 
      error: "حدث خطأ أثناء حذف الدواء من قاعدة البيانات" 
    };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryIds = formData.getAll("categoryIds") as string[];
  const imageFile = formData.get("image") as File;
  const isNew = formData.get("isNew") === "true";

  const updateData: any = {
    name,
    description,
    isNew,
    categories: {
      set: categoryIds.map(id => ({ id }))
    }
  };

  if (imageFile && imageFile.size > 0) {
    updateData.image = await uploadImage(imageFile, "pharmacy/products");
  }

  await prisma.product.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/adcpanforpharmacyquds/products");
  revalidatePath("/products");

  return { success: true };
}

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function deleteCategory(id: string) {
  try {
    const productsCount = await prisma.product.count({
      where: { categories: { some: { id } } },
    });

    if (productsCount > 0) {
      return { 
        success: false, 
        error: "لا يمكن حذف الصنف لأنه يحتوي على أدوية. قم بحذف الأدوية أو نقلها أولاً." 
      };
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/adcpanforpharmacyquds/categories");
    return { success: true };
  } catch (error) {
    console.error("Delete category error:", error);
    return { 
      success: false, 
      error: "حدث خطأ أثناء حذف الصنف" 
    };
  }
}

export async function addCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const imageFile = formData.get("image") as File;

  if (!name) throw new Error("Name is required");

  let imageUrl = null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile, "pharmacy/categories");
  }

  // Custom ID generation
  const count = await prisma.category.count();
  const categoryId = `CAT-${(count + 1).toString().padStart(3, '0')}`;

  await prisma.category.create({ 
    data: { 
      id: categoryId,
      name,
      image: imageUrl 
    } as any
  });

  revalidatePath("/adcpanforpharmacyquds/categories");
  revalidatePath("/products");
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const imageFile = formData.get("image") as File;

  if (!name) throw new Error("Name is required");

  const updateData: any = { name };

  if (imageFile && imageFile.size > 0) {
    updateData.image = await uploadImage(imageFile, "pharmacy/categories");
  }

  await prisma.category.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/adcpanforpharmacyquds/categories");
  revalidatePath("/products");
  return { success: true };
}
